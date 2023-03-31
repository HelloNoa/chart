import { Module } from '@nestjs/common';
import { TradingController } from './trading.controller.js';
import { TradingService } from './trading.service.js';
import { RedisPubSubModule } from '../redis/redis.pubsub.module.js';

@Module({
  imports: [RedisPubSubModule],
  controllers: [TradingController],
  providers: [TradingService],
})
export class TradingtModule {}
