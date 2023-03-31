import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { commonConfig } from '../../config/index.js';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { AppMode } from '../../constants/index.js';
import {
  AllExceptionFilter,
  LifecycleService,
  LoggerMiddleware,
  ResponseTransformerInterceptor,
} from '../../infra/index.js';
import { dbConfig } from '../../config/db.config.js';
import { cacheConfig } from '../../config/cache.config.js';
import { SocketModule } from '../socket/socket.module.js';
import { TradingtModule } from '../trading/trading.module.js';
import { RedisPubSubModule } from '../redis/redis.pubsub.module.js';
import { RedisClusterModule } from 'nestjs-redis-cluster';
import { redisClusterOptions } from '../../cllient.options.js';
import { UpbitSocketModule } from '../upbit/upbit.socket.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [commonConfig, dbConfig, cacheConfig],
      envFilePath: [
        `${dirname(
          fileURLToPath(import.meta.url),
        )}/../../config/env/.${AppMode}.env`,
      ],
      isGlobal: true,
      cache: true,
    }),
    RedisClusterModule.register(redisClusterOptions()),
    RedisPubSubModule,
    SocketModule,
    TradingtModule,
    UpbitSocketModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LifecycleService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformerInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
