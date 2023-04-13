import { DataSource } from 'typeorm';
import { order_matching_event } from './order_matching_event.entity.js';
import { MYSQL_DATASOURCE_KEY } from '../../../constants/index.js';

export const order_matching_eventProviders = [
  {
    provide: 'ORDER_MATCHING_EVENT_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(order_matching_event),
    inject: [MYSQL_DATASOURCE_KEY],
  },
];
