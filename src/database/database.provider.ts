import { DataSource } from 'typeorm';
import {
  DB_WRITER_CONFIG_KEY,
  MYSQL_DATASOURCE_KEY,
} from '../constants/index.js';
import { ConfigType } from '@nestjs/config';
import { dbConfig, dbWriterConfig } from '../config/db.config.js';

export const databaseProviders = [
  {
    provide: MYSQL_DATASOURCE_KEY,
    inject: [dbConfig.KEY],
    useFactory: (config: ConfigType<typeof dbConfig>) => {
      return new DataSource(config).initialize();
    },
  },
  {
    provide: DB_WRITER_CONFIG_KEY,
    inject: [dbWriterConfig.KEY],
    useFactory: (config: ConfigType<typeof dbWriterConfig>) => {
      return new DataSource(config).initialize();
    },
  },
];
