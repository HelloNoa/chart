import { AppMode } from '../../constants/index.js';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestjsSwagger } from '@anatine/zod-nestjs';
import {
  SlackTransport,
  TransformableInfo,
} from 'winston-slack-webhook-transport-ts';

export const createCustomLogger = (WEBHOOK_URL: string) => {
  const transports: any[] = [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike('Server', {
          prettyPrint: AppMode !== 'prod',
          colors: AppMode !== 'prod',
        }),
      ),
    }),
  ];
  if (AppMode === 'prod') {
    transports.push(
      new SlackTransport({
        level: 'error',
        webhookUrl: WEBHOOK_URL,
        formatter: (data: TransformableInfo) => {
          return {
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text:
                    '```' +
                    `[${AppMode.toUpperCase()}][${data.level.toUpperCase()}] ${
                      data.message
                    }` +
                    '```',
                },
              },
            ],
          };
        },
      }),
    );
  }
  return WinstonModule.createLogger({
    transports: transports,
  });
};

export const initSwaggerDocs = (app: INestApplication) => {
  patchNestjsSwagger();

  const swaggerCfg = new DocumentBuilder()
    .setTitle('Coin-Market Socket OPEN-API Document')
    .setDescription('API Specification for functions provided by this server')
    .setVersion('0.0.1')
    .addBasicAuth()
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerCfg);
  SwaggerModule.setup('api-docs', app, document);

  return true;
};

export async function CreateSlackWebHook(url: string, data = {}) {
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
