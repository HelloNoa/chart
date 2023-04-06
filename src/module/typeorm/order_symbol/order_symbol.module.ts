import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module.js';
import { order_symbolProviders } from './order_symbol.providers.js';
import { order_symbolService } from './order_symbol.service.js';

@Module({
  imports: [DatabaseModule],
  providers: [...order_symbolProviders, order_symbolService],
  exports: [...order_symbolProviders, order_symbolService],
})
export class order_symbolModule {}
