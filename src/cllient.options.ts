import * as process from 'process';
import { RedisClusterModuleOptions } from 'nestjs-redis-cluster/dist/cluster.interface.js';

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
      ? {
          'coin-market-memorydb-dev-0001-001.coin-market-memorydb-dev.ya93dq.memorydb.ap-northeast-2.amazonaws.com:9736':
            {
              host: '127.0.0.1',
              port: 6661,
            },
          'coin-market-memorydb-dev-0001-002.coin-market-memorydb-dev.ya93dq.memorydb.ap-northeast-2.amazonaws.com:9736':
            {
              host: '127.0.0.1',
              port: 6662,
            },
          'coin-market-memorydb-dev-0001-003.coin-market-memorydb-dev.ya93dq.memorydb.ap-northeast-2.amazonaws.com:9736':
            {
              host: '127.0.0.1',
              port: 6663,
            },
          'coin-market-memorydb-dev-0001-004.coin-market-memorydb-dev.ya93dq.memorydb.ap-northeast-2.amazonaws.com:9736':
            {
              host: '127.0.0.1',
              port: 6664,
            },
          'coin-market-memorydb-dev-0002-001.coin-market-memorydb-dev.ya93dq.memorydb.ap-northeast-2.amazonaws.com:9736':
            {
              host: '127.0.0.1',
              port: 6665,
            },
          'coin-market-memorydb-dev-0002-002.coin-market-memorydb-dev.ya93dq.memorydb.ap-northeast-2.amazonaws.com:9736':
            {
              host: '127.0.0.1',
              port: 6666,
            },
          'coin-market-memorydb-dev-0002-003.coin-market-memorydb-dev.ya93dq.memorydb.ap-northeast-2.amazonaws.com:9736':
            {
              host: '127.0.0.1',
              port: 6667,
            },
          'coin-market-memorydb-dev-0002-004.coin-market-memorydb-dev.ya93dq.memorydb.ap-northeast-2.amazonaws.com:9736':
            {
              host: '127.0.0.1',
              port: 6668,
            },
          'clustercfg.coin-market-memorydb-dev.ya93dq.memorydb.ap-northeast-2.amazonaws.com:9736':
            {
              host: '127.0.0.1',
              port: 9736,
            },
        }
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
