import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { order_symbol } from './order_symbol.entity.js';

@Injectable()
export class order_symbolService {
  constructor(
    @Inject('ORDER_SYMBOL_REPOSITORY')
    private order_bookRepository: Repository<order_symbol>,
  ) {}

  async findAll(): Promise<order_symbol[]> {
    return this.order_bookRepository.find();
  }

  async getSymbolId(name: string) {
    try {
      const symbol = await this.order_bookRepository.findOne({
        where: {
          name,
        },
      });
      if (symbol === null) {
        console.error('SymbolId not found');
        return null;
      }
      return symbol.id;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
