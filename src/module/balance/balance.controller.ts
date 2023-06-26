import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BalanceService } from './balance.service.js';
import { JWTGuard, User } from '../../decorators/jwt-guard.service.js';

@Controller('balance')
@ApiTags('Balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  //내 자산 목록
  @ApiBearerAuth()
  @UseGuards(JWTGuard)
  @Get('')
  @ApiOperation({ summary: '내 자산 목록' })
  @ApiQuery({ name: 'userUUID', example: 'userUUID' })
  @ApiQuery({ name: 'symbol', example: 'BTC', required: false })
  async balance(
    @User() user: any,
    @Query('userUUID') uuid: string,
    @Query('symbol') symbol?: string,
  ) {
    console.log(user);
    console.log(user.uuid);
    if (user.uuid !== uuid) {
      return 'wrong user jwt auth verified';
    }
    return await this.balanceService.balance(uuid, symbol);
  }
}
