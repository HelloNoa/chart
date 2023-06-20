import { forwardRef, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChartGateway } from './gateway/chart.gateway.js';
import { BalanceGateway } from './gateway/balance.gateway.js';
import { RedisPubSubModule } from '../redis/redis.pubsub.module.js';
import { OrderFillGateway } from './gateway/orderFill.gateway.js';

@Module({
  imports: [forwardRef(() => RedisPubSubModule)],
  // controllers: [SocketController],
  providers: [ChartGateway, BalanceGateway, OrderFillGateway, JwtService],
  exports: [ChartGateway, BalanceGateway, OrderFillGateway, JwtService],
})
export class SocketModule {}
