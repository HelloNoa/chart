import * as process from 'process';
import { Transport } from '@nestjs/microservices';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { ClientsProviderAsyncOptions } from '@nestjs/microservices/module/interfaces/clients-module.interface.js';
import { generateDynamicPort, sshTunnel } from './utils/index.js';
import { GrpcOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const proxyClients = {
  bitcoin: {
    clientName: 'BITCOIN_PROXY_PACKAGE',
    protoPath: [
      join(__dirname, '/module/grpc/proto/proxy/proxy.bitcoin.proto'),
    ],
    packageName: 'bitcoin_proxy',
  },
  ethereum: {
    clientName: 'ETHEREUM_PROXY_PACKAGE',
    protoPath: [
      join(__dirname, '/module/grpc/proto/proxy/proxy.ethereum.proto'),
    ],
    packageName: 'ethereum_proxy',
  },
  polygon: {
    clientName: 'POLYGON_PROXY_PACKAGE',
    protoPath: [
      join(__dirname, '/module/grpc/proto/proxy/proxy.polygon.proto'),
    ],
    packageName: 'polygon_proxy',
  },
};
export const proxyGrpcClients = (): ClientsProviderAsyncOptions[] => {
  return [
    {
      name: proxyClients.bitcoin.clientName,
      useFactory: async () => {
        return await proxyGrpcClientOptions(
          proxyClients.bitcoin.packageName,
          proxyClients.bitcoin.protoPath,
        );
      },
    },
    {
      name: proxyClients.ethereum.clientName,
      useFactory: async () => {
        return await proxyGrpcClientOptions(
          proxyClients.ethereum.packageName,
          proxyClients.ethereum.protoPath,
        );
      },
    },
    {
      name: proxyClients.polygon.clientName,
      useFactory: async () => {
        return await proxyGrpcClientOptions(
          proxyClients.polygon.packageName,
          proxyClients.polygon.protoPath,
        );
      },
    },
  ];
};

const proxyGrpcClientOptions = async (
  packageName: string,
  protoPath: string[],
): Promise<GrpcOptions> => {
  let host = process.env.PROXY_GRPC_HOST;
  let port = Number(process.env.TRADING_GRPC_PORT);
  const localPort = generateDynamicPort();
  if (process.env.USE_SSH_TUNNEL === 'true') {
    await sshTunnel(
      host + '',
      Number(process.env.TRADING_GRPC_PORT),
      localPort,
      async () => {
        console.log(`${packageName} proxy tunneling complete`);
      },
    );
    host = '127.0.0.1';
    port = localPort;
  }
  return {
    transport: Transport.GRPC,
    options: {
      credentials: false,
      package: packageName,
      url: `${host}:${port}`,
      protoPath: protoPath,
    },
  };
};
