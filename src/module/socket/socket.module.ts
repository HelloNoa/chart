import { Module } from '@nestjs/common';
import { ChartGateway } from './gateway/chart.gateway.js';

@Module({
  imports: [],
  // controllers: [SocketController],
  providers: [ChartGateway],
  exports: [ChartGateway],
})
export class SocketModule {}
