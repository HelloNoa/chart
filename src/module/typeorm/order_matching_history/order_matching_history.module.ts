import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module.js';
import { order_matching_historyProviders } from './order_matching_history.providers.js';
import { order_matching_historyService } from './order_matching_history.service.js';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...order_matching_historyProviders,
    order_matching_historyService,
  ],
  exports: [...order_matching_historyProviders, order_matching_historyService],
})
export class order_matching_historyModule {}
