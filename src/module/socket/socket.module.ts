import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChartGateway } from './gateway/chart.gateway.js';

@Module({
  imports: [],
  // controllers: [SocketController],
  providers: [ChartGateway, JwtService],
  exports: [ChartGateway, JwtService],
})
export class SocketModule {}
