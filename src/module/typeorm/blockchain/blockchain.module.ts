import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module.js';
import { blockchainProviders } from './blockchainProviders.js';
import { blockchainService } from './blockchain.service.js';

@Module({
  imports: [DatabaseModule],
  providers: [...blockchainProviders, blockchainService],
  exports: [...blockchainProviders, blockchainService],
})
export class blockchainModule {}
