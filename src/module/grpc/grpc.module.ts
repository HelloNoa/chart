import { forwardRef, Module } from '@nestjs/common';
import { GrpcController } from './grpc.controller.js';
import { SocketModule } from '../socket/socket.module.js';

@Module({
  imports: [forwardRef(() => SocketModule)],
  controllers: [GrpcController],
})
export class GrpcModule {}
