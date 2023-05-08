import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { chart } from './chart.entity.js';
import { ChartReqDto } from '../../chart/chart.dto.js';
import { MYSQL_DATASOURCE_KEY } from '../../../constants/index.js';
import { order_symbolService } from '../order_symbol/order_symbol.service.js';
import { order_intervalService } from '../order_interval/order_interval.service.js';
import { duration } from '../order_interval/order_interval.entity.js';

@Injectable()
export class chartService {
  constructor(
    @Inject('CHART_REPOSITORY')
    private chartRepository: Repository<chart>,
    @Inject(MYSQL_DATASOURCE_KEY)
    private dataSource: DataSource,
    private readonly orderSymbolService: order_symbolService,
    private readonly orderIntervalService: order_intervalService,
  ) {}

  async findAll(): Promise<chart[]> {
    return this.chartRepository.find();
  }

  async getDailyTick() {
    const intervarId = await this.orderIntervalService.getLastOrderIntervalId(
      duration.ONE_DAY,
    );
    if (intervarId === null) {
      console.log('intervarId length is 0');
      return null;
    } else {
      const data = await this.chartRepository.find({
        where: {
          orderIntervalId: intervarId,
        },
        relations: ['order_interval', 'order_symbol'],
      });
      if (data.length === 0) {
        console.error('chart data not found');
        return null;
      }
      return data;
    }
  }

  async getChart({
    order_symbol_name,
    interval,
    length,
    created_at,
  }: ChartReqDto) {
    // SELECT *
    // FROM (
    //   SELECT open_price,low_price,high_price,close_price,volume, created_at
    //   FROM chart
    //   JOIN order_interval oi ON oi.id = chart.order_interval_id
    //   WHERE order_symbol_id = 4
    //     AND duration = 'ONE_MINUTE'
    //   ORDER BY created_at DESC
    //   LIMIT 100
    // ) sub
    // ORDER BY created_at ASC
    try {
      const data = await this.chartRepository
        .createQueryBuilder('chart')
        .leftJoinAndSelect('chart.order_interval', 'order_interval')
        .leftJoinAndSelect('chart.order_symbol', 'order_symbol')
        .select('chart.open_price', 'o')
        .addSelect('chart.low_price', 'l')
        .addSelect('chart.high_price', 'h')
        .addSelect('chart.close_price', 'c')
        .addSelect('chart.trading_value', 'v')
        .addSelect('chart.created_at', 't')
        .addSelect('order_symbol.name', 'name')
        .where('order_symbol.name = :order_symbol_name', { order_symbol_name })
        .andWhere('order_interval.duration = :duration', {
          duration: interval,
        })
        .andWhere('chart.created_at <= :created_at', { created_at })
        .orderBy('chart.created_at', 'DESC')
        .limit(length)
        .getRawMany();

      data.sort((a, b) => a.t.getTime() - b.t.getTime());
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
