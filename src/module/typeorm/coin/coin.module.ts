import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module.js';
import { coinProviders } from './coin.providers.js';
import { coinService } from './coin.service.js';

@Module({
  imports: [DatabaseModule],
  providers: [...coinProviders, coinService],
  exports: [...coinProviders, coinService],
})
export class coinModule {}
