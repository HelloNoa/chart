import { Module } from '@nestjs/common';
import { GrpcController } from './grpc.controller.js';

@Module({
  imports: [],
  controllers: [GrpcController],
})
export class GrpcModule {}
