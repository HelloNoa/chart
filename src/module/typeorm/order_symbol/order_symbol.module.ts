import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module.js';
import { order_symbolProviders } from './order_symbol.providers.js';
import { order_symbolService } from './order_symbol.service.js';
import { order_matching_eventModule } from '../order_matching_event/order_matching_event.module.js';

@Module({
  imports: [DatabaseModule, forwardRef(() => order_matching_eventModule)],
  providers: [...order_symbolProviders, order_symbolService],
  exports: [...order_symbolProviders, order_symbolService],
})
export class order_symbolModule {}
