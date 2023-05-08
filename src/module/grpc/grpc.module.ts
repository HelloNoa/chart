import { Module } from '@nestjs/common';
import { GrpcController } from './grpc.controller.js';
import { SocketModule } from '../socket/socket.module.js';
import { OrderBookModule } from '../inMemory/orderBook/orderBook.module.js';
import { TickerModule } from '../inMemory/ticker/ticker.module.js';

@Module({
  imports: [OrderBookModule, TickerModule, SocketModule],
  controllers: [GrpcController],
})
export class GrpcModule {}
