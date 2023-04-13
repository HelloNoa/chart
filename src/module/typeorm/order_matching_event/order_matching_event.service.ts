import { Inject, Injectable } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { order_matching_event } from './order_matching_event.entity.js';

@Injectable()
export class order_matching_eventService {
  constructor(
    @Inject('ORDER_MATCHING_EVENT_REPOSITORY')
    private orderMatchingEventRepository: Repository<order_matching_event>,
  ) {}

  async findAll(): Promise<order_matching_event[]> {
    return this.orderMatchingEventRepository.find();
  }

  async lastPrice(symbolID: number) {
    const option: FindOneOptions<order_matching_event> = {
      select: ['unit_price'],
      where: {
        order_symbol_id: symbolID,
      },
      order: { updated_at: 'desc' },
    };
    const r = this.orderMatchingEventRepository.findOne(option);
    if (r === null) {
      console.error('last price is null');
      return null;
    }
    return r;
  }
}
