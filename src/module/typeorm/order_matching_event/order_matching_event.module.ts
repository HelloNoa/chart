import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module.js';
import { order_matching_eventProviders } from './order_matching_event.providers.js';
import { order_matching_eventService } from './order_matching_event.service.js';

@Module({
  imports: [DatabaseModule],
  providers: [...order_matching_eventProviders, order_matching_eventService],
  exports: [...order_matching_eventProviders, order_matching_eventService],
})
export class order_matching_eventModule {}
