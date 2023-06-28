import { forwardRef, Module } from '@nestjs/common';
import { GrpcController } from './grpc.controller.js';
import { SocketModule } from '../socket/socket.module.js';
import { OrderBookModule } from '../inMemory/orderBook/orderBook.module.js';
import { TickerModule } from '../inMemory/ticker/ticker.module.js';
import { FinexblockModule } from '../finexblock/finexblock.module.js';
import { OrderClientModule } from './client/order.client.module.js';
import { WalletClientModule } from './client/wallet.client.module.js';

@Module({
  imports: [
    OrderBookModule,
    TickerModule,
    FinexblockModule,
    OrderClientModule,
    WalletClientModule,
    forwardRef(() => SocketModule),
  ],
  controllers: [GrpcController],
})
export class GrpcModule {}
