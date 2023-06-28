import * as process from 'process';
import { Transport } from '@nestjs/microservices';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { ClientsProviderAsyncOptions } from '@nestjs/microservices/module/interfaces/clients-module.interface.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const proxyClientsName = {
  bitcoin: 'BITCOIN_PROXY_PACKAGE',
  ethereum: 'ETHEREUM_PROXY_PACKAGE',
  polygon: 'POLYGON_PROXY_PACKAGE',
};
export const proxyGrpcClients = (): ClientsProviderAsyncOptions[] => {
  const host = process.env.grpc ?? 'localhost';
  const port = process.env.TRADING_GRPC_PORT;

  return [
    {
      name: proxyClientsName.bitcoin,
      useFactory: async () => {
        return {
          transport: Transport.GRPC,
          options: {
            credentials: false,
            package: 'bitcoin_proxy',
            url: `${host}:${port}`,
            protoPath: [
              join(__dirname, '/module/grpc/proto/proxy/proxy.bitcoin.proto'),
            ],
          },
        };
      },
    },
    {
      name: proxyClientsName.ethereum,
      useFactory: async () => {
        return {
          transport: Transport.GRPC,
          options: {
            credentials: false,
            package: 'ethereum_proxy',
            url: `${host}:${port}`,
            protoPath: [
              join(__dirname, '/module/grpc/proto/proxy/proxy.ethereum.proto'),
            ],
          },
        };
      },
    },
    {
      name: proxyClientsName.polygon,
      useFactory: async () => {
        return {
          transport: Transport.GRPC,
          options: {
            credentials: false,
            package: 'polygon_proxy',
            url: `${host}:${port}`,
            protoPath: [
              join(__dirname, '/module/grpc/proto/proxy/proxy.polygon.proto'),
            ],
          },
        };
      },
    },
  ];
};
