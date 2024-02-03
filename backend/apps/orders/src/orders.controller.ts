import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '@app/common';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // create Order: Post request, it only takes the product id as a body, and extracts the user token from headers using guards
  @UseGuards(JwtAuthGuard)
  @Post('')
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() request: Request,
  ) {
    return this.ordersService.createOrder(createOrderDto, request);
  }
}
