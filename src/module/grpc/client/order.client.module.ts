import { ClientsModule } from '@nestjs/microservices';
import { forwardRef, Module } from '@nestjs/common';
import { OrderClientService } from './order.client.service.js';
import { OrderClientController } from './order.client.controller.js';
import { grpcClients } from '../../../cllient.options.js';
import { SocketModule } from '../../socket/socket.module.js';

@Module({
  imports: [
    ClientsModule.registerAsync([...grpcClients()]),
    forwardRef(() => SocketModule),
  ],
  providers: [OrderClientService],
  controllers: [OrderClientController],
  exports: [OrderClientService],
})
export class OrderClientModule {}
