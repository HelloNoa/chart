import { Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { order_symbol } from './order_symbol.entity.js';

@Injectable()
export class order_symbolService {
  constructor(
    @Inject('ORDER_SYMBOL_REPOSITORY')
    private orderSymbolRepository: Repository<order_symbol>,
  ) {}

  async findAll(): Promise<order_symbol[]> {
    return this.orderSymbolRepository.find();
  }

  async findSymbols(names: string[]): Promise<order_symbol[]> {
    return this.orderSymbolRepository.find({
      where: {
        name: In(names),
      },
    });
  }

  async findActiveSymbols() {
    const ACTIVE_ORDER_SYMBOL = [
      'BTCARB',
      'BTCCOMP',
      'BTCETC',
      'BTCETH',
      'BTCMATIC',
      'BTCSAND',
    ];
    return this.findSymbols(ACTIVE_ORDER_SYMBOL);
  } 

  async getSymbolId(name: string) {
    try {
      const symbol = await this.orderSymbolRepository.findOne({
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
