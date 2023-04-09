import { DataSource } from 'typeorm';
import { order_book_difference } from './order_book_difference.entity.js';
import { MYSQL_DATASOURCE_KEY } from '../../../constants/index.js';

export const order_book_differenceProviders = [
  {
    provide: 'ORDER_BOOK_DIFFERENCE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(order_book_difference),
    inject: [MYSQL_DATASOURCE_KEY],
  },
];
