import { Module } from '@nestjs/common';
import { BalanceController } from './balance.controller.js';
import { BalanceService } from './balance.service.js';
import { RedisPubSubModule } from '../redis/redis.pubsub.module.js';
import { JWTGuard } from '../../decorators/jwt-guard.service.js';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [BalanceController],
  imports: [RedisPubSubModule],
  providers: [BalanceService, JWTGuard, JwtService],
})
export class BalanceModule {}
