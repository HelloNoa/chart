import { ClientsModule } from '@nestjs/microservices';
import { Module } from '@nestjs/common';
import { WalletClientService } from './wallet.client.service.js';
import { WalletClientController } from './wallet.client.controller.js';
import { proxyGrpcClients } from '../../../proxy.clients.options.js';
import { JwtService } from '@nestjs/jwt';
import { walletModule } from '../../typeorm/wallet/wallet.module.js';
import { userModule } from '../../typeorm/user/user.module.js';
import { coinModule } from '../../typeorm/coin/coin.module.js';
import { blockchainModule } from '../../typeorm/blockchain/blockchain.module.js';
import { coin_transferModule } from '../../typeorm/coin_transfer/coin_transfer.module.js';
import { withdrawal_requestModule } from '../../typeorm/withdrawal_request/withdrawal_request.module.js';
import { BalanceModule } from '../../balance/balance.module.js';
import { DatabaseModule } from '../../../database/database.module.js';
import { RedisPubSubModule } from '../../redis/redis.pubsub.module.js';

@Module({
  imports: [
    ClientsModule.registerAsync([...proxyGrpcClients()]),
    BalanceModule,
    walletModule,
    userModule,
    coinModule,
    blockchainModule,
    coin_transferModule,
    withdrawal_requestModule,
    DatabaseModule,
    RedisPubSubModule,
  ],
  providers: [WalletClientService, JwtService],
  controllers: [WalletClientController],
  exports: [WalletClientService, JwtService],
})
export class WalletClientModule {}
