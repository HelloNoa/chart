import { ClientsModule } from '@nestjs/microservices';
import { Module } from '@nestjs/common';
import { OrderClientService } from './order.client.service.js';
import { OrderClientController } from './order.client.controller.js';
import { grpcClients } from '../../../cllient.options.js';

@Module({
  imports: [ClientsModule.registerAsync([...grpcClients()])],
  providers: [OrderClientService],
  controllers: [OrderClientController],
  exports: [OrderClientService],
})
export class OrderClientModule {}
