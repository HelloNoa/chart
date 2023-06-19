import { forwardRef, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChartGateway } from './gateway/chart.gateway.js';
import { BalanceGateway } from './gateway/balance.gateway.js';
import { RedisPubSubModule } from '../redis/redis.pubsub.module.js';

@Module({
  imports: [forwardRef(() => RedisPubSubModule)],
  // controllers: [SocketController],
  providers: [ChartGateway, BalanceGateway, JwtService],
  exports: [ChartGateway, BalanceGateway, JwtService],
})
export class SocketModule {}
