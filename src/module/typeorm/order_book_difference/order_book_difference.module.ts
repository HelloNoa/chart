import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module.js';
import { order_book_differenceProviders } from './order_book_difference.providers.js';
import { order_book_differenceService } from './order_book_difference.service.js';

@Module({
  imports: [DatabaseModule],
  providers: [...order_book_differenceProviders, order_book_differenceService],
  exports: [...order_book_differenceProviders, order_book_differenceService],
})
export class order_book_differenceModule {}
