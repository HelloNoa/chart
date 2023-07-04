import { DataSource } from 'typeorm';
import { withdrawal_request } from './withdrawal_request.entity.js';
import {
  MYSQL_DATASOURCE_KEY,
  MYSQL_WRITE_DATASOURCE_KEY,
} from '../../../constants/index.js';

export const withdrawal_requestProviders = [
  {
    provide: 'WITHDRAWAL_REQUEST_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(withdrawal_request),
    inject: [MYSQL_DATASOURCE_KEY],
  },
  {
    provide: 'WITHDRAWAL_REQUEST_WRITE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(withdrawal_request),
    inject: [MYSQL_WRITE_DATASOURCE_KEY],
  },
];
