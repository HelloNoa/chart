import { DataSource } from 'typeorm';
import { order_matching_history } from './order_matching_history.entity.js';
import {
  MYSQL_DATASOURCE_KEY,
  MYSQL_WRITE_DATASOURCE_KEY,
} from '../../../constants/index.js';

export const order_matching_historyProviders = [
  {
    provide: 'ORDER_MATCHING_HISTORY_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(order_matching_history),
    inject: [MYSQL_DATASOURCE_KEY],
  },
  {
    provide: 'ORDER_MATCHING_HISTORY_WRITE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(order_matching_history),
    inject: [MYSQL_WRITE_DATASOURCE_KEY],
  },
];
