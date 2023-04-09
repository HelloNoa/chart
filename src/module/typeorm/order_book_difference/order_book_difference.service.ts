import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { order_book_difference } from './order_book_difference.entity.js';

@Injectable()
export class order_book_differenceService {
  constructor(
    @Inject('ORDER_SYMBOL_REPOSITORY')
    private order_bookRepository: Repository<order_book_difference>,
  ) {}

  async findAll(): Promise<order_book_difference[]> {
    return this.order_bookRepository.find();
  }

}
