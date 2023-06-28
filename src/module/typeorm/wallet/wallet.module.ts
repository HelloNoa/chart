import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module.js';
import { walletProviders } from './wallet.providers.js';
import { walletService } from './wallet.service.js'

@Module({
  imports: [DatabaseModule],
  providers: [...walletProviders, walletService],
  exports: [...walletProviders, walletService],
})
export class walletModule {}
