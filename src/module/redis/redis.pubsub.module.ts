import { forwardRef, Module } from '@nestjs/common';
import { RedisPubSubService } from './redis.pubsub.service.js';
import { SocketModule } from '../socket/socket.module.js';
import { RedisPubSubController } from './redis.pubsub.controller.js';

@Module({
  imports: [forwardRef(() => SocketModule)],
  controllers: [RedisPubSubController],
  providers: [RedisPubSubService],
  exports: [RedisPubSubService],
})
export class RedisPubSubModule {}
