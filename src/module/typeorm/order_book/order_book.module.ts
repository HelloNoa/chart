import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module.js';
import { order_bookProviders } from './order_book.providers.js';
import { order_bookService } from './order_book.service.js';
import { userModule } from '../user/user.module.js';
import { order_symbolModule } from '../order_symbol/order_symbol.module.js';
import { order_book_differenceModule } from '../order_book_difference/order_book_difference.module.js';

@Module({
  imports: [
    DatabaseModule,
    userModule,
    order_symbolModule,
    order_book_differenceModule,
  ],
  providers: [...order_bookProviders, order_bookService],
  exports: [...order_bookProviders, order_bookService],
})
export class order_bookModule {}
