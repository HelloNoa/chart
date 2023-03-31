import { Module } from '@nestjs/common';
import { UpbitSocketService } from './upbit.socket.service.js';
import { SocketModule } from '../socket/socket.module.js';

@Module({
  imports: [SocketModule],
  // controllers: [SocketController],
  providers: [UpbitSocketService],
  exports: [UpbitSocketService],
})
export class UpbitSocketModule {}
