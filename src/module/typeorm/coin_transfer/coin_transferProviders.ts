import { DataSource } from 'typeorm';
import { coin_transfer } from './coin_transfer.entity.js';
import {
  MYSQL_DATASOURCE_KEY,
  MYSQL_WRITE_DATASOURCE_KEY,
} from '../../../constants/index.js';

export const coin_transferProviders = [
  {
    provide: 'COIN_TRANSFER_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(coin_transfer),
    inject: [MYSQL_DATASOURCE_KEY],
  },
  {
    provide: 'COIN_TRANSFER_WRITE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(coin_transfer),
    inject: [MYSQL_WRITE_DATASOURCE_KEY],
  },
];
