import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { chart } from './chart.entity.js';
import { ChartReqDto } from '../../chart/chart.dto.js';
import { MYSQL_DATASOURCE_KEY } from '../../../constants/index.js';
import { order_symbolService } from '../order_symbol/order_symbol.service.js';

@Injectable()
export class chartService {
  constructor(
    @Inject('CHART_REPOSITORY')
    private chartRepository: Repository<chart>,
    @Inject(MYSQL_DATASOURCE_KEY)
    private dataSource: DataSource,
    private readonly orderSymbolService: order_symbolService,
  ) {}

  async findAll(): Promise<chart[]> {
    return this.chartRepository.find();
  }

  async getChart({
    order_symbol_id,
    interval,
    length,
    created_at,
  }: ChartReqDto) {
    try {
      const id = await this.orderSymbolService.getSymbolId(order_symbol_id);
      const queryBuilder = this.chartRepository.createQueryBuilder('chart');
      queryBuilder
        .select('chart.open_price', 'o')
        .addSelect('chart.low_price', 'l')
        .addSelect('chart.high_price', 'h')
        .addSelect('chart.close_price', 'c')
        .addSelect('chart.volume', 'v')
        .addSelect('chart.created_at', 't')
        .where('chart.order_symbol_id = :order_symbol_id', { id })
        .andWhere('chart.interval = :interval', { interval })
        .andWhere('chart.created_at < :created_at', { created_at })
        .orderBy('chart.created_at', 'ASC')
        .take(length);
      const data = await queryBuilder.getRawMany();
      if (data.length === 0) {
        console.error('chart data not found');
        return null;
      }
      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}