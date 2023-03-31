import { Module } from '@nestjs/common';
import { RedisPubSubService } from './redis.pubsub.service.js';
import { RedisPubSubController } from './redis.pubsub.controller.js';
import { SocketModule } from '../socket/socket.module.js';

@Module({
  imports: [SocketModule],
  controllers: [RedisPubSubController],
  providers: [RedisPubSubService],
  exports: [RedisPubSubService],
})
export class RedisPubSubModule {}
