import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { INTERVAL, order_interval } from './order_interval.entity.js';

@Injectable()
export class order_intervalService {
  constructor(
    @Inject('ORDER_INTERVAL_REPOSITORY')
    private orderIntervalRepository: Repository<order_interval>,
  ) {}

  async findAll(): Promise<order_interval[]> {
    return this.orderIntervalRepository.find();
  }

  async getOrderIntervalId(duration: keyof typeof INTERVAL) {
    const orderInterval = await this.orderIntervalRepository.find({
      select: ['id'],
      where: {
        duration,
      },
    });
    return orderInterval.map((e) => e.id);
  }
}
