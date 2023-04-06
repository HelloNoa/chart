import { DataSource } from 'typeorm';
import { order_symbol } from './order_symbol.entity.js';
import { MYSQL_DATASOURCE_KEY } from '../../../constants/index.js';

export const order_symbolProviders = [
  {
    provide: 'ORDER_SYMBOL_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(order_symbol),
    inject: [MYSQL_DATASOURCE_KEY],
  },
];
