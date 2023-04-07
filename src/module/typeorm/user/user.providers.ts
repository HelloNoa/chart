import { DataSource } from 'typeorm';
import { user } from './user.entity.js';
import { MYSQL_DATASOURCE_KEY } from '../../../constants/index.js';

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(user),
    inject: [MYSQL_DATASOURCE_KEY],
  },
];
