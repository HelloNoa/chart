import { ClientsModule } from '@nestjs/microservices';
import { Module } from '@nestjs/common';
import { WalletClientService } from './wallet.client.service.js';
import { WalletClientController } from './wallet.client.controller.js';
import { proxyGrpcClients } from '../../../proxy.clients.options.js';
import { JwtService } from '@nestjs/jwt';
import { walletModule } from '../../typeorm/wallet/wallet.module.js';
import { userModule } from '../../typeorm/user/user.module.js';
import { coinModule } from '../../typeorm/coin/coin.module.js';

@Module({
  imports: [
    ClientsModule.registerAsync([...proxyGrpcClients()]),
    walletModule,
    userModule,
    coinModule,
  ],
  providers: [WalletClientService, JwtService],
  controllers: [WalletClientController],
  exports: [WalletClientService, JwtService],
})
export class WalletClientModule {}
