import { DepthGateway } from './gateway/depth.gateway.js';
import { Module } from '@nestjs/common';
import { ChartGateway } from './gateway/chart.gateway.js';

@Module({
  imports: [],
  // controllers: [SocketController],
  providers: [DepthGateway, ChartGateway],
  exports: [DepthGateway, ChartGateway],
})
export class SocketModule {}
