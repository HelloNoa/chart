import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module.js';
import { order_intervalProviders } from './order_interval.providers.js';
import { order_intervalService } from './order_interval.service.js';

@Module({
  imports: [DatabaseModule],
  providers: [...order_intervalProviders, order_intervalService],
  exports: [...order_intervalProviders, order_intervalService],
})
export class order_intervalModule {}
