import { Module } from '@nestjs/common';
import { ChartController } from './chartController.js';
import { ChartService } from './chart.service.js';
import { RedisPubSubModule } from '../redis/redis.pubsub.module.js';

@Module({
  imports: [RedisPubSubModule],
  controllers: [ChartController],
  providers: [ChartService],
})
export class ChartModule {}
