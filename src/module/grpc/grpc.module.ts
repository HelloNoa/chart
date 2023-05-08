import { Module } from '@nestjs/common';
import { GrpcController } from './grpc.controller.js';
import { SocketModule } from '../socket/socket.module.js';
import { OrderBookModule } from '../orderBook/orderBook.module.js';

@Module({
  imports: [OrderBookModule, SocketModule],
  controllers: [GrpcController],
})
export class GrpcModule {}
