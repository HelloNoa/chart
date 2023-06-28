import { DataSource } from 'typeorm';
import { coin } from './coin.entity.js';
import {
  MYSQL_DATASOURCE_KEY,
  MYSQL_WRITE_DATASOURCE_KEY,
} from '../../../constants/index.js';

export const coinProviders = [
  {
    provide: 'COIN_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(coin),
    inject: [MYSQL_DATASOURCE_KEY],
  },
  {
    provide: 'COIN_WRITE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(coin),
    inject: [MYSQL_WRITE_DATASOURCE_KEY],
  },
];
