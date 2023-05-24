import { DataSource } from 'typeorm';
import { FinexblockServer } from '../../database/entities/finexblock-server.entity.js';
import { MYSQL_DATASOURCE_KEY } from '../../constants/index.js';
import { FinexblockServerIp } from '../../database/entities/finexblock-server-ip.entity.js';

export const FinexblockProvider = [
  {
    provide: 'FINEXBLOCK_SERVER_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(FinexblockServer),
    inject: [MYSQL_DATASOURCE_KEY],
  },
  {
    provide: 'FINEXBLOCK_SERVER_IP_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(FinexblockServerIp),
    inject: [MYSQL_DATASOURCE_KEY],
  },
];
