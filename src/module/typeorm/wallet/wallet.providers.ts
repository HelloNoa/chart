import { DataSource } from 'typeorm';
import { wallet } from './wallet.entity.js';
import {
  MYSQL_DATASOURCE_KEY,
  MYSQL_WRITE_DATASOURCE_KEY,
} from '../../../constants/index.js';

export const walletProviders = [
  {
    provide: 'WALLET_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(wallet),
    inject: [MYSQL_DATASOURCE_KEY],
  },
  {
    provide: 'WALLET_WRITE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(wallet),
    inject: [MYSQL_WRITE_DATASOURCE_KEY],
  },
];
