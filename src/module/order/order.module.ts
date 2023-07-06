import { Module } from '@nestjs/common';
import { OrderController } from './order.controller.js';
import { OrderService } from './order.service.js';
import { order_bookModule } from '../typeorm/order_book/order_book.module.js';
import { order_matching_eventModule } from '../typeorm/order_matching_event/order_matching_event.module.js';
import { order_symbolModule } from '../typeorm/order_symbol/order_symbol.module.js';
import { JwtService } from '@nestjs/jwt';
import { JWTGuard } from '../../decorators/jwt-guard.service.js';
import { order_matching_historyModule } from '../typeorm/order_matching_history/order_matching_history.module.js';
import { userModule } from '../typeorm/user/user.module.js';

@Module({
  imports: [
    order_bookModule,
    order_matching_eventModule,
    order_matching_historyModule,
    userModule,
    order_symbolModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, JWTGuard, JwtService],
})
export class OrderModule {}
