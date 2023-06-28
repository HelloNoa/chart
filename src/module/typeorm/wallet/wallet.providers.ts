import { DataSource } from 'typeorm';
import { wallet } from './wallet.entity.js';
import { MYSQL_DATASOURCE_KEY } from '../../../constants/index.js'

export const walletProviders = [
  {
    provide: 'WALLET_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(wallet),
    inject: [MYSQL_DATASOURCE_KEY],
  },
];
