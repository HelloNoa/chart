import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module.js';
import { chartProviders } from './chart.providers.js';
import { chartService } from './chart.service.js';
import { order_symbolModule } from '../order_symbol/order_symbol.module.js';
import { order_intervalModule } from '../order_interval/order_interval.module.js';

@Module({
  imports: [DatabaseModule, order_symbolModule, order_intervalModule],
  providers: [...chartProviders, chartService],
  exports: [...chartProviders, chartService],
})
export class chartModule {}
