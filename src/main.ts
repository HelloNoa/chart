import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app/app.module.js';

import { Logger, RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppMode } from './constants/index.js';
import { initSwaggerDocs } from './module/app/app.logger.js';
import { WsAdapter } from '@nestjs/platform-ws';
import { useSSHTunnel } from './utils/index.js';
import * as process from 'process';
import { getsetSecretString } from './config/secretsManager.js';
import { dirname, join } from 'path';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const regex = new RegExp(/\s+/g);

async function bootstrap() {
  console.log(process.env.NODE_ENV);
  await getsetSecretString();
  if (process.env.USE_SSH_TUNNEL === 'true') {
    await useSSHTunnel(
      process.env.REDIS_TUNNELING_HOST + '',
      Number(process.env.REDIS_PORT),
      Number(process.env.REDIS_PORT),
      async () => {
        console.log('redis tunneling complete');
      },
    );
    const startPort = 6660;
    let Cnt = 1;
    const clusterList = [];
    for (let i = 0; i < 1; i++) {
      for (let j = 0; j < 2; j++) {
        await useSSHTunnel(
          `${process.env.REDIS_NDOE_HOST1}-000${i + 1}-00${j + 1}.${
            process.env.REDIS_NDOE_HOST2
          }`,
          Number(9736),
          Number(startPort + Cnt),
          async () => {
            //
          },
        );
        clusterList.push({
          port: startPort + Cnt++,
          host: '127.0.0.1',
        });
      }
    }
  }
  const app = await NestFactory.create(AppModule);
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.GRPC,
  //   options: {
  //     package: ['finexblock'],
  //     url: `localhost:50051`,
  //     protoPath: [
  //       join(__dirname, '/module/grpc/proto/order_cancellation.proto'),
  //       join(__dirname, '/module/grpc/proto/order_placement.proto'),
  //     ],
  //   },
  // });
  const configService = app.get<ConfigService>(ConfigService);

  const version = configService.getOrThrow('APP_VERSION');
  app.enableCors({
    allowedHeaders: [
      'Pragma',
      'Cache-Control',
      'Content-Type',
      'Access-Control-Allow-Headers',
      'Authorization',
      'X-Requested-With',
    ],
    exposedHeaders: [],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    origin: '*',
    maxAge: 600,
    optionsSuccessStatus: 204,
    credentials: false,
    preflightContinue: false,
  });

  app.setGlobalPrefix(`api/v${version}`, {
    exclude: [{ path: '', method: RequestMethod.GET }],
  });
  // // app.use(helmet());
  // console.log('dsad');
  //
  initSwaggerDocs(app);

  app.useWebSocketAdapter(new WsAdapter(app));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: ['finexblock'],
      url:
        process.env.USE_SSH_TUNNEL === 'true'
          ? '127.0.0.1:50051'
          : '0.0.0.0:50051',
      protoPath: [
        join(__dirname, '/module/grpc/proto/message.proto'),
        join(__dirname, '/module/grpc/proto/service.proto'),
      ],
    },
  });

  await app.startAllMicroservices();
  await app.listen(configService.get('PORT', 80));
  // await app.listen(80);
  Logger.log(`Server starts with ${AppMode} mode ...`);
}

bootstrap();
