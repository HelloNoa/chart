import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module.js';
import { coin_transferProviders } from './coin_transferProviders.js';
import { coin_transferService } from './coin_transfer.service.js';

@Module({
  imports: [DatabaseModule],
  providers: [...coin_transferProviders, coin_transferService],
  exports: [...coin_transferProviders, coin_transferService],
})
export class coin_transferModule {}
