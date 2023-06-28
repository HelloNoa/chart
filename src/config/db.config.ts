import { registerAs } from '@nestjs/config';
import {
  DB_CONFIG_KEY,
  DB_WRITER_CONFIG_KEY,
  EnvMode,
} from '../constants/index.js';
import { DataSourceOptions } from 'typeorm';
import { DbConfigSchema } from './config.zod.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { useSSHTunnel } from '../utils/index.js';
import process from 'process';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const dbWriterConfig = registerAs(
  DB_WRITER_CONFIG_KEY,
  async (): Promise<DataSourceOptions> => {
    const env = await DbConfigSchema.parseAsync({
      DATABASE_HOST: process.env.DATABASE_WRITE_HOST,
      DATABASE_PORT: Number(process.env.DATABASE_PORT),
      DATABASE_USERNAME: process.env.DATABASE_USERNAME,
      DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
      DATABASE_SCHEMA: process.env.DATABASE_SCHEMA,
    });

    let dbConfig: DataSourceOptions;
    if (process.env.NODE_ENV === EnvMode.Test) {
      const localPort = 6034;
      await useSSHTunnel(
        process.env.DATABASE_HOST + '',
        Number(process.env.DATABASE_PORT),
        localPort,
        async () => {
          console.log('mysql tunneling complete');
        },
      );
      dbConfig = {
        type: 'mysql',
        host: '127.0.0.1',
        port: localPort,
        username: env['DATABASE_USERNAME'],
        password: env['DATABASE_PASSWORD'],
        database: env['DATABASE_SCHEMA'],
        timezone: '+00:00',
        entities: [__dirname + '/../**/*.entity.{ts,js}'],
        namingStrategy: new SnakeNamingStrategy(),
      };
    } else {
      dbConfig = {
        type: 'mysql',
        host: env['DATABASE_HOST'],
        port: env['DATABASE_PORT'],
        username: env['DATABASE_USERNAME'],
        password: env['DATABASE_PASSWORD'],
        database: env['DATABASE_SCHEMA'],
        timezone: '+00:00',
        entities: [__dirname + '/../**/*.entity.{ts,js}'],
        namingStrategy: new SnakeNamingStrategy(),
      };
    }

    return dbConfig;
  },
);
export const dbConfig = registerAs(
  DB_CONFIG_KEY,
  async (): Promise<DataSourceOptions> => {
    const env = await DbConfigSchema.parseAsync({
      DATABASE_HOST: process.env.DATABASE_HOST,
      DATABASE_PORT: Number(process.env.DATABASE_PORT),
      DATABASE_USERNAME: process.env.DATABASE_USERNAME,
      DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
      DATABASE_SCHEMA: process.env.DATABASE_SCHEMA,
    });

    let dbConfig: DataSourceOptions;
    // if (AppMode === EnvMode.Test) {
    if (process.env.NODE_ENV === EnvMode.Test) {
      await useSSHTunnel(
        process.env.DATABASE_HOST + '',
        Number(process.env.DATABASE_PORT),
        Number(process.env.DATABASE_PORT),
        async () => {
          console.log('mysql tunneling complete');
        },
      );
      // dbConfig = {
      //   type: 'sqlite',
      //   database: ':memory:',
      //   logging: true,
      //   entities: [__dirname + '/../**/*.entity.{ts,js}'],
      //   synchronize: true,
      //   dropSchema: true,
      //   namingStrategy: new SnakeNamingStrategy(),
      // };
      dbConfig = {
        type: 'mysql',
        host: '127.0.0.1',
        port: env['DATABASE_PORT'],
        username: env['DATABASE_USERNAME'],
        password: env['DATABASE_PASSWORD'],
        database: env['DATABASE_SCHEMA'],
        timezone: '+00:00',
        entities: [__dirname + '/../**/*.entity.{ts,js}'],
        namingStrategy: new SnakeNamingStrategy(),
      };
    } else {
      dbConfig = {
        type: 'mysql',
        host: env['DATABASE_HOST'],
        port: env['DATABASE_PORT'],
        username: env['DATABASE_USERNAME'],
        password: env['DATABASE_PASSWORD'],
        database: env['DATABASE_SCHEMA'],
        timezone: '+00:00',
        entities: [__dirname + '/../**/*.entity.{ts,js}'],
        namingStrategy: new SnakeNamingStrategy(),
      };
    }

    return dbConfig;
  },
);
