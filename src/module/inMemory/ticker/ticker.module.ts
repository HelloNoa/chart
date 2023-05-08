import { Module } from '@nestjs/common';
import { order_symbolModule } from '../../typeorm/order_symbol/order_symbol.module.js';
import { SocketModule } from '../../socket/socket.module.js';
import { chartModule } from '../../typeorm/chart/chart.module.js';
import { TickerService } from './ticker.service.js';

@Module({
  imports: [SocketModule, chartModule, order_symbolModule],
  providers: [TickerService],
  exports: [TickerService],
})
export class TickerModule {}
