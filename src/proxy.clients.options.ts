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
      join(__dirname, '/module/grpc/proto/bitcoin/bitcoin.proxy.proto'),
      join(__dirname, '/module/grpc/proto/bitcoin/hdwallet.message.proto'),
      join(__dirname, '/module/grpc/proto/bitcoin/hdwallet.proto'),
      join(__dirname, '/module/grpc/proto/bitcoin/transaction.message.proto'),
      join(__dirname, '/module/grpc/proto/bitcoin/transaction.proto'),
    ],
    packageName: 'bitcoin',
  },
  ethereum: {
    clientName: 'ETHEREUM_PROXY_PACKAGE',
    protoPath: [
      join(__dirname, '/module/grpc/proto/ethereum/ethereum.proxy.proto'),
      join(__dirname, '/module/grpc/proto/ethereum/hdwallet.message.proto'),
      join(__dirname, '/module/grpc/proto/ethereum/hdwallet.proto'),
      join(__dirname, '/module/grpc/proto/ethereum/transaction.message.proto'),
      join(__dirname, '/module/grpc/proto/ethereum/transaction.proto'),
    ],
    packageName: 'ethereum',
  },
  polygon: {
    clientName: 'POLYGON_PROXY_PACKAGE',
    protoPath: [
      join(__dirname, '/module/grpc/proto/polygon/polygon.proxy.proto'),
      join(__dirname, '/module/grpc/proto/polygon/hdwallet.message.proto'),
      join(__dirname, '/module/grpc/proto/polygon/hdwallet.proto'),
      join(__dirname, '/module/grpc/proto/polygon/transaction.message.proto'),
      join(__dirname, '/module/grpc/proto/polygon/transaction.proto'),
    ],
    packageName: 'polygon',
  },
  erc20: {
    clientName: 'ERC20_PROXY_PACKAGE',
    protoPath: [
      join(__dirname, '/module/grpc/proto/erc20/blockchain.message.proto'),
      join(__dirname, '/module/grpc/proto/erc20/blockchain.proto'),
      join(__dirname, '/module/grpc/proto/erc20/hdwallet.message.proto'),
      join(__dirname, '/module/grpc/proto/erc20/hdwallet.proto'),
      join(__dirname, '/module/grpc/proto/erc20/transaction.message.proto'),
      join(__dirname, '/module/grpc/proto/erc20/transaction.proto'),
    ],
    packageName: 'erc20',
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
