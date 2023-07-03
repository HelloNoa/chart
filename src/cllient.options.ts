import { ClientOptions, Transport } from '@nestjs/microservices';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import * as process from 'process';
import { RedisClusterModuleOptions } from 'nestjs-redis-cluster/dist/cluster.interface.js';
import { sshTunnel } from './utils/index.js';
import { ClientsProviderAsyncOptions } from '@nestjs/microservices/module/interfaces/clients-module.interface.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const grpcEndPoint = [
  {
    id: 0,
    kor: 'BTCETH',
    market: 'BTCETH',
    host: '',
    port: 8880,
  },
  {
    id: 1,
    kor: 'BTCETC',
    market: 'BTCETC',
    host: '',
    port: 8880,
  },
  {
    id: 2,
    kor: 'BTCMATIC',
    market: 'BTCMATIC',
    host: '',
    port: 8880,
  },
  {
    id: 3,
    kor: 'BTCLPT',
    market: 'BTCLPT',
    host: '',
    port: 8880,
  },
  {
    id: 4,
    kor: 'BTCMANA',
    market: 'BTCMANA',
    host: '',
    port: 8880,
  },
  {
    id: 5,
    kor: 'BTCAXS',
    market: 'BTCAXS',
    host: '',
    port: 8880,
  },
  {
    id: 6,
    kor: 'BTCAUDIO',
    market: 'BTCAUDIO',
    host: '',
    port: 8880,
  },
  {
    id: 7,
    kor: 'BTCSAND',
    market: 'BTCSAND',
    host: '',
    port: 8880,
  },
  {
    id: 8,
    kor: 'BTCCOMP',
    market: 'BTCCOMP',
    host: '',
    port: 8880,
  },
  {
    id: 9,
    kor: 'BTCLINK',
    market: 'BTCLINK',
    host: '',
    port: 8880,
  },
  {
    id: 10,
    kor: 'BTCDYDX',
    market: 'BTCDYDX',
    host: '',
    port: 8880,
  },
  {
    id: 11,
    kor: 'BTCBNB',
    market: 'BTCBNB',
    host: '',
    port: 8880,
  },
  {
    id: 12,
    kor: 'BTCOP',
    market: 'BTCOP',
    host: '',
    port: 8880,
  },
  {
    id: 13,
    kor: 'BTCAVAX',
    market: 'BTCAVAX',
    host: '',
    port: 8880,
  },
  {
    id: 14,
    kor: 'BTCARB',
    market: 'BTCARB',
    host: '',
    port: 8880,
  },
];
export const PACKAGE = Object.values(grpcEndPoint).map(
  (e) => e.market + '_PACKAGE',
);
export const grpcClients = () => {
  return grpcEndPoint.map((e, i) => {
    return {
      name: `${e.market}_PACKAGE`,
      useFactory: async () => {
        return await grpcClientOptions(
          e.market,
          process.env.USE_SSH_TUNNEL === 'true'
            ? e.port + i
            : Number(process.env.TRADING_GRPC_PORT),
        );
      },
    } as ClientsProviderAsyncOptions;
  });
};
export const grpcClientOptions = async (
  market = 'BTCARB',
  PORT = 50051,
): Promise<ClientOptions> => {
  let host = process.env[`TRADING_GRPC_${market}_HOST`] + '';
  if (host.length === 0) {
    host = process.env.TRADING_GRPC_HOST + '';
  }
  const port = PORT;
  if (process.env.USE_SSH_TUNNEL === 'true') {
    await sshTunnel(
      process.env[`TRADING_GRPC_${market}_HOST`] + '',
      Number(process.env.TRADING_GRPC_PORT),
      // Number(process.env.TRADING_GRPC_PORT),
      port,
      async () => {
        console.log('grpc tunneling complete');
      },
    );
    host = '127.0.0.1';
  }
  return {
    transport: Transport.GRPC,
    options: {
      credentials: false,
      package: 'finexblock',
      url: `${host}:${port}`,
      protoPath: [
        join(__dirname, '/module/grpc/proto/message.proto'),
        join(__dirname, '/module/grpc/proto/service.proto'),
      ],
    },
  };
};

const redisclusterNodeEndPoint = () => {
  const natMap: any = {};
  const startPort = 6660;
  let cnt = 1;
  for (let i = 0; i < 1; i++) {
    for (let j = 0; j < 2; j++) {
      natMap[
        `${process.env.REDIS_NDOE_HOST1}-000${i + 1}-00${j + 1}.${
          process.env.REDIS_NDOE_HOST2
        }:9736`
      ] = {
        host: '127.0.0.1',
        port: startPort + cnt++,
      };
    }
  }
  return natMap;
};
export const redisClusterOptions = (): RedisClusterModuleOptions => ({
  name: 'REDIS_SERVICE',
  nodes: [
    {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    },
  ],
  dnsLookup: (address, callback) => {
    return callback(null, address);
  },
  natMap:
    process.env.USE_SSH_TUNNEL === 'true'
      ? redisclusterNodeEndPoint()
      : undefined,
  enableAutoPipelining: true,
  scaleReads: 'all',
  lazyConnect: true,
  clusterRetryStrategy: (times) => {
    // Optional retry strategy to handle connection errors
    if (times > 3) {
      throw new Error('Unable to connect to Redis cluster');
    }
    return Math.min(times * 1000, 3000);
  },
  redisOptions: {
    disconnectTimeout: 5000,
    tls: {
      rejectUnauthorized: process.env.USE_SSH_TUNNEL !== 'true',
    },
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
  },
});
