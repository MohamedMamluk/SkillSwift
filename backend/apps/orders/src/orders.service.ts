import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request } from 'express';
import { OrdersRepository } from './orders.repository';
import { Queues } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import Stripe from 'stripe';
// import { COURSES_SERVICE } from './constants/services';

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
    let payment: Stripe.Response<Stripe.PaymentIntent>;
    try {
      const course = await lastValueFrom(
        this.coursesClient.send('get_course', {
          _id: createOrderDto.courseId,
        }),
      );
      payment = await lastValueFrom(
        this.paymentsClient.send('initiate_payment', {
          card: createOrderDto.card,
          amount: +course.price,
          Authentication: request.cookies?.Authentication,
        }),
      );
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
      if (orderDetails) {
        throw new UnauthorizedException({ paymentId: payment.id });
      }
      await session.commitTransaction();
      return orderDetails;
    } catch (error) {
      // this.paymentsClient.emit('abort_payment', {
      //   paymentId: payment.id,
      //   Authentication: request.cookies?.Authentication,
      // });
      await session.abortTransaction();
      console.log(await this.ordersRepository.find({}));
      throw error;
    }
  }
}
