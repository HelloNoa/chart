import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { order_symbol } from './order_symbol.entity.js';
import { order_matching_eventService } from '../order_matching_event/order_matching_event.service.js';

@Injectable()
export class order_symbolService {
  constructor(
    @Inject('ORDER_SYMBOL_REPOSITORY')
    private order_bookRepository: Repository<order_symbol>,
    private orderMatchingEventService: order_matching_eventService,
  ) {}

  async findAll(): Promise<order_symbol[]> {
    return this.order_bookRepository.find();
  }

  async marketList() {
    const symvolList = await this.findAll();
    return await Promise.all(
      symvolList.map(
        async (
          e: order_symbol & {
            price?: number;
            volume?: number;
            updown?: number;
          },
        ) => {
          const price = await this.orderMatchingEventService.lastPrice(e.id);
          //TODO volume이랑 updown 구현
          const volume = 1;
          const updown = Math.random() * 10;
          if (price === null) {
            e.price = 0;
          } else {
            e.price = Number(price.unit_price);
          }
          if (volume === null) {
            e.volume = 0;
          } else {
            e.volume = Number(volume);
          }
          if (updown === null) {
            e.updown = 0;
          } else {
            if (Math.random() > 0.5) {
              e.updown = -Number(updown);
            } else {
              e.updown = -Number(updown);
            }
          }

          return e;
        },
      ),
    );
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
