import { DataSource } from 'typeorm';
import { blockchain } from './blockchain.entity.js';
import {
  MYSQL_DATASOURCE_KEY,
  MYSQL_WRITE_DATASOURCE_KEY,
} from '../../../constants/index.js';

export const blockchainProviders = [
  {
    provide: 'BLOCKCHAIN_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(blockchain),
    inject: [MYSQL_DATASOURCE_KEY],
  },
  {
    provide: 'BLOCKCHAIN_WRITE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(blockchain),
    inject: [MYSQL_WRITE_DATASOURCE_KEY],
  },
];
