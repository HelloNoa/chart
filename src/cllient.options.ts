import * as process from 'process';
import { RedisClusterModuleOptions } from 'nestjs-redis-cluster/dist/cluster.interface.js';

const redisclusterNodeEndPoint = () => {
  console.log(
    'SSH TUNNEL!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
  );

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
