import { forwardRef, Module } from '@nestjs/common';
import { OrderBookService } from './orderBook.service.js';
import { order_bookModule } from '../../typeorm/order_book/order_book.module.js';
import { order_symbolModule } from '../../typeorm/order_symbol/order_symbol.module.js';
import { SocketModule } from '../../socket/socket.module.js';
import { chartModule } from '../../typeorm/chart/chart.module.js';
import { OrderClientModule } from '../../grpc/client/order.client.module.js';

@Module({
  imports: [
    OrderClientModule,
    order_bookModule,
    chartModule,
    order_symbolModule,
    forwardRef(() => SocketModule),
  ],
  providers: [OrderBookService],
  exports: [OrderBookService],
})
export class OrderBookModule {}
