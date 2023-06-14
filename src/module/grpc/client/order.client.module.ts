import { ClientsModule, Transport } from '@nestjs/microservices';
import { Module } from '@nestjs/common';
import { OrderClientService } from './order.client.service.js';
import { OrderClientController } from './order.client.controller.js';
import { grpcClients } from '../../../cllient.options.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'HERO_PACKAGE',
        transport: Transport.GRPC,
        options: {
          credentials: false,
          package: 'finexblock',
          url: `127.0.0.1:50051`,
          protoPath: [
            join(__dirname, '/../../../module/grpc/proto/message.proto'),
            join(__dirname, '/../../../module/grpc/proto/service.proto'),
          ],
        },
      },
    ]),
    ClientsModule.registerAsync([...grpcClients()]),
  ],
  providers: [OrderClientService],
  controllers: [OrderClientController],
  exports: [OrderClientService],
})
export class OrderClientModule {}
