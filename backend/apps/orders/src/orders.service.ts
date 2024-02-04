import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request } from 'express';
import { OrdersRepository } from './orders.repository';
import { Queues, User } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import Stripe from 'stripe';
import { ClientSession, Types } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(
    private ordersRepository: OrdersRepository,
    @Inject(Queues.COURSES) private coursesClient: ClientProxy,
    @Inject(Queues.PAYMENT) private paymentsClient: ClientProxy,
  ) {}

  // we need to emit to courses to get the course data, we should be getting the userId from the token
  // and emit to payment service with the current data to create the transaction
  // and lastly emit to the notification<mailing> service to send email to the user
  async createOrder(createOrderDto: CreateOrderDto, request: Request) {
    const session = await this.ordersRepository.startTransaction();
    let payment: Stripe.PaymentIntent;
    try {
      const course = await this.getCourse(createOrderDto.courseId);

      if (course.price === 0) {
        return this.createFreeOrder(course, request, session);
      }
      payment = await this.initiatePayment(createOrderDto, course, request);

      const orderDetails = await this.ordersRepository.create(
        {
          buyer: (request.user as any)._id,
          seller: course.seller || '',
          course: course._id,
          price: course.price,
          transactionId: payment.id,
          additionalInfo: payment,
        },
        { session },
      );

      await session.commitTransaction();
      return orderDetails;
    } catch (error) {
      // this.paymentsClient.emit('abort_payment', {
      //   paymentId: payment.id,
      //   Authentication: request.cookies?.Authentication,
      // });
      await session.abortTransaction();
      throw error;
    }
  }
  private async getCourse(courseId: Types.ObjectId) {
    // Send request to courses service to get course details
    const course = await lastValueFrom(
      this.coursesClient.send('get_course', {
        _id: courseId,
      }),
    );

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  private async initiatePayment(
    createOrderDto: CreateOrderDto,
    course: any,
    request: Request,
  ) {
    // Initiate payment by sending request to payment service
    return lastValueFrom(
      this.paymentsClient.send('initiate_payment', {
        card: createOrderDto.card,
        amount: +course.price,
        Authentication: request.cookies?.Authentication,
      }),
    );
  }

  private async createFreeOrder(
    course: any,
    request: Request,
    session: ClientSession,
  ) {
    const order = await this.ordersRepository.create(
      {
        buyer: (request.user as User)._id,
        seller: course.seller || '',
        course: course._id,
        price: course.price,
        transactionId: null,
        additionalInfo: null,
      },
      { session },
    );
    await session.commitTransaction();

    return order;
  }
}
