import { Module } from '@nestjs/common';
import { ChartController } from './chartController.js';
import { ChartService } from './chart.service.js';
import { RedisPubSubModule } from '../redis/redis.pubsub.module.js';
import { order_bookModule } from '../typeorm/order_book/order_book.module.js';
import { order_symbolModule } from '../typeorm/order_symbol/order_symbol.module.js';
import { chartModule } from '../typeorm/chart/chart.module.js';

@Module({
  imports: [
    RedisPubSubModule,
    order_bookModule,
    order_symbolModule,
    chartModule,
  ],
  controllers: [ChartController],
  providers: [ChartService],
})
export class ChartModule {}
