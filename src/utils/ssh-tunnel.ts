import tunnel from 'tunnel-ssh';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __dirname = dirname(fileURLToPath(import.meta.url));

const LocalHost = '127.0.0.1';
const LocalPort = 4444;
const GrpcPort = 50051;
const SSHPort = 22;
const RedisPort = 9736;

export async function sshTunnel(
  host: string,
  port: number,
  localPort: number,
  connectFunction: () => Promise<any>,
) {
  const key = fs.readFileSync(
    `${__dirname}/../config/coin-market-engine-dev.pem`,
    // `${__dirname}/../config/coin-market-engine-prod.pem`,
  );
  const sshConfig = {
    username: process.env.SSH_USERNAME,
    host: process.env.SSH_HOST,
    port: SSHPort,
    privateKey: key,
    // password: process.env.SSH_PASSWORD,
    dstHost: host,
    dstPort: port,
    keepAlive: true,
    localHost: LocalHost,
    localPort,
  };

  return new Promise((resolve, reject) => {
    tunnel(sshConfig, (error, server) => {
      if (error != null) {
        reject(error);
      } else if (server == null) {
        throw reject(new Error('server not found'));
      } else {
        console.log(`${LocalHost}:${localPort} ${host}:${port} SSH Connected`);

        connectFunction().then((data) => {
          resolve(data);
        });
      }
    });
  });
}

export async function tunnelWithRedisCluster() {
  await sshTunnel(
    // process.env.TRADING_GRPC_BTCADA_HOST + '',
    // '15.164.150.105',
    // '3.37.49.150',
    '52.79.69.87',
    // '10.0.128.254',
    GrpcPort,
    LocalPort,
    async () => {
      console.log('test tunneling complete');
    },
  );
  await sshTunnel(
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
      await sshTunnel(
        `${process.env.REDIS_NDOE_HOST1}-000${i + 1}-00${j + 1}.${
          process.env.REDIS_NDOE_HOST2
        }`,
        Number(RedisPort),
        Number(startPort + Cnt),
        async () => {
          //
        },
      );
      clusterList.push({
        port: startPort + Cnt++,
        host: LocalHost,
      });
    }
  }
}
