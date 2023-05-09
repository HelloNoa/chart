import { Module } from '@nestjs/common';
import { ChartController } from './chartController.js';
import { ChartService } from './chart.service.js';
import { RedisPubSubModule } from '../redis/redis.pubsub.module.js';
import { order_bookModule } from '../typeorm/order_book/order_book.module.js';
import { order_symbolModule } from '../typeorm/order_symbol/order_symbol.module.js';
import { chartModule } from '../typeorm/chart/chart.module.js';
import { OrderBookModule } from '../inMemory/orderBook/orderBook.module.js';
import { order_matching_eventModule } from '../typeorm/order_matching_event/order_matching_event.module.js';
import { TickerModule } from '../inMemory/ticker/ticker.module.js';

@Module({
  imports: [
    RedisPubSubModule,
    order_bookModule,
    order_symbolModule,
    chartModule,
    OrderBookModule,
    TickerModule,
    order_matching_eventModule,
  ],
  controllers: [ChartController],
  providers: [ChartService],
  exports: [ChartService],
})
export class ChartModule {}
