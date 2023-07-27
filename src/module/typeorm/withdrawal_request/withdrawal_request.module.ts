import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module.js';
import { withdrawal_requestProviders } from './withdrawal_requestProviders.js';
import { withdrawal_requestService } from './withdrawal_request.service.js';

@Module({
  imports: [DatabaseModule],
  providers: [...withdrawal_requestProviders, withdrawal_requestService],
  exports: [...withdrawal_requestProviders, withdrawal_requestService],
})
export class withdrawal_requestModule {}
