import { DataSource } from 'typeorm';
import { order_book } from './order_book.entity.js';
import { MYSQL_DATASOURCE_KEY } from '../../../constants/index.js';

export const order_bookProviders = [
  {
    provide: 'ORDER_BOOK_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(order_book),
    inject: [MYSQL_DATASOURCE_KEY],
  },
];
