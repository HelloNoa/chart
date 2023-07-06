import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { order_matching_history } from './order_matching_history.entity.js';

@Injectable()
export class order_matching_historyService {
  constructor(
    @Inject('ORDER_MATCHING_HISTORY_REPOSITORY')
    private orderMatchingHistoryRepository: Repository<order_matching_history>,
    @Inject('ORDER_MATCHING_HISTORY_WRITE_REPOSITORY')
    private orderMatchingHistoryWriteRepository: Repository<order_matching_history>,
  ) {}

  async findAll(): Promise<order_matching_history[]> {
    return this.orderMatchingHistoryRepository.find();
  }

  async getOrderMatchingHistory(
    userId: number,
    orderSymbolName?: string,
  ): Promise<any[]> {
    const query = this.orderMatchingHistoryRepository
      .createQueryBuilder('omh')
      .leftJoin('omh.order_symbol', 'order_symbol')
      .select('omh.order_uuid', 'order_uuid')
      .addSelect('omh.order_symbol', 'order_symbol')
      .addSelect('omh.order_type', 'order_type')
      .addSelect('omh.unit_price', 'unit_price')
      .addSelect('omh.fee', 'fee')
      .addSelect('omh.filled_quantity', 'quantity')
      .addSelect('omh.created_at', 'created_at')
      .addSelect('omh.updated_at', 'updated_at')
      .where('omh.user_id = :userId', { userId });

    if (orderSymbolName !== undefined) {
      query.andWhere('order_symbol.name = :orderSymbolName', {
        orderSymbolName,
      });
    }
    return await query.getRawMany();
  }
}
