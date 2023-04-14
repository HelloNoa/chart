import { DataSource } from 'typeorm';
import { order_interval } from './order_interval.entity.js';
import { MYSQL_DATASOURCE_KEY } from '../../../constants/index.js';

export const order_intervalProviders = [
  {
    provide: 'ORDER_INTERVAL_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(order_interval),
    inject: [MYSQL_DATASOURCE_KEY],
  },
];
