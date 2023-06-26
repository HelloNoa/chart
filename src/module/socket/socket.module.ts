import { forwardRef, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChartGateway } from './gateway/chart.gateway.js';
import { BalanceGateway } from './gateway/balance.gateway.js';
import { RedisPubSubModule } from '../redis/redis.pubsub.module.js';
import { OrderFillGateway } from './gateway/orderFill.gateway.js';
import { OrderGateway } from './gateway/order.gateway.js';
import { GrpcModule } from '../grpc/grpc.module.js';
import { OrderClientModule } from '../grpc/client/order.client.module.js';
import { ChartModule } from '../chart/chart.module.js';

@Module({
  imports: [
    forwardRef(() => RedisPubSubModule),
    OrderClientModule,
    forwardRef(() => GrpcModule),
    ChartModule,
  ],
  // controllers: [SocketController],
  providers: [
    ChartGateway,
    BalanceGateway,
    OrderFillGateway,
    OrderGateway,
    JwtService,
  ],
  exports: [
    ChartGateway,
    BalanceGateway,
    OrderFillGateway,
    OrderGateway,
    JwtService,
  ],
})
export class SocketModule {}
