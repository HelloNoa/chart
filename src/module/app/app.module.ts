import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

// import { commonConfig } from '../../config/index.js';

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
// import { cacheConfig } from '../../config/cache.config.js';
import { SocketModule } from '../socket/socket.module.js';
import { ChartModule } from '../chart/chart.module.js';
import { RedisPubSubModule } from '../redis/redis.pubsub.module.js';
import { RedisClusterModule } from 'nestjs-redis-cluster';
import { redisClusterOptions } from '../../cllient.options.js';
import { UpbitSocketModule } from '../upbit/upbit.socket.module.js';
import { order_bookModule } from '../typeorm/order_book/order_book.module.js';
import { order_symbolModule } from '../typeorm/order_symbol/order_symbol.module.js';
import { chartModule } from '../typeorm/chart/chart.module.js';
import { userModule } from '../typeorm/user/user.module.js';
import { order_book_differenceModule } from '../typeorm/order_book_difference/order_book_difference.module.js';
import { OrderBookModule } from '../inMemory/orderBook/orderBook.module.js';
import { order_matching_eventModule } from '../typeorm/order_matching_event/order_matching_event.module.js';
import { order_intervalModule } from '../typeorm/order_interval/order_interval.module.js';
import { GrpcModule } from '../grpc/grpc.module.js';
import { TickerModule } from '../inMemory/ticker/ticker.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [dbConfig],
      envFilePath: [
        `${dirname(
          fileURLToPath(import.meta.url),
        )}/../../config/env/.${AppMode}.env`,
      ],
      isGlobal: true,
      cache: true,
    }),
    RedisClusterModule.forRootAsync({
      useFactory: () => {
        return redisClusterOptions();
      },
    }),
    RedisPubSubModule,
    SocketModule,
    ChartModule,
    UpbitSocketModule,
    OrderBookModule,
    TickerModule,
    chartModule,
    order_bookModule,
    order_book_differenceModule,
    order_intervalModule,
    order_matching_eventModule,
    order_symbolModule,
    userModule,
    GrpcModule,
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
