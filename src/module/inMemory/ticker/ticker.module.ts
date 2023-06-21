import { forwardRef, Module } from '@nestjs/common';
import { order_symbolModule } from '../../typeorm/order_symbol/order_symbol.module.js';
import { SocketModule } from '../../socket/socket.module.js';
import { chartModule } from '../../typeorm/chart/chart.module.js';
import { TickerService } from './ticker.service.js';
import { order_intervalModule } from '../../typeorm/order_interval/order_interval.module.js';

@Module({
  imports: [
    forwardRef(() => SocketModule),
    chartModule,
    order_symbolModule,
    order_intervalModule,
  ],
  providers: [TickerService],
  exports: [TickerService],
})
export class TickerModule {}
