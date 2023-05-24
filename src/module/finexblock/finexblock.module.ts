import { Module } from '@nestjs/common';
import { FinexblockService } from './finexblock.service.js';
import { DatabaseModule } from '../../database/database.module.js';
import { FinexblockProvider } from './finexblock.provider.js';

@Module({
  imports: [DatabaseModule],
  providers: [...FinexblockProvider, FinexblockService],
  exports: [...FinexblockProvider, FinexblockService],
})
export class FinexblockModule {}
