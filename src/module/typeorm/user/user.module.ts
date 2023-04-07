import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module.js';
import { userProviders } from './user.providers.js';
import { userService } from './user.service.js';

@Module({
  imports: [DatabaseModule],
  providers: [...userProviders, userService],
  exports: [...userProviders, userService],
})
export class userModule {}
