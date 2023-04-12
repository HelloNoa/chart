import { Module } from '@nestjs/common';
import { OrderBookService } from './orderBook.service.js';
import { order_bookModule } from '../typeorm/order_book/order_book.module.js';
import { order_symbolModule } from '../typeorm/order_symbol/order_symbol.module.js';
import { SocketModule } from '../socket/socket.module.js';

@Module({
  imports: [order_bookModule, order_symbolModule, SocketModule],
  providers: [OrderBookService],
  exports: [OrderBookService],
})
export class OrderBookModule {}
