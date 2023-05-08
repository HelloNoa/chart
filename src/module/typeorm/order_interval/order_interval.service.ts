import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { duration, order_interval } from './order_interval.entity.js';

@Injectable()
export class order_intervalService {
  constructor(
    @Inject('ORDER_INTERVAL_REPOSITORY')
    private orderIntervalRepository: Repository<order_interval>,
  ) {}

  async findAll(): Promise<order_interval[]> {
    return this.orderIntervalRepository.find();
  }

  async getLastOrderIntervalId(interval: keyof typeof duration) {
    const orderInterval = await this.orderIntervalRepository.findOne({
      select: ['id'],
      where: {
        duration: interval,
      },
      order: { id: 'DESC' },
    });
    if (orderInterval === null) {
      console.log('orderInterval ID is null');
      return null;
    } else {
      return orderInterval.id;
    }
  }
}
