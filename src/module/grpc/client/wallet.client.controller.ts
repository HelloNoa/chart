import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SymbolType } from '../interface/message.js';
import { WalletClientService } from './wallet.client.service.js';
import { IpGuard } from '../../../decorators/ip-guard.service.js';
import { JWTGuard, User } from '../../../decorators/jwt-guard.service.js';

@Controller('wallet')
@UseGuards(IpGuard)
@ApiBearerAuth()
@UseGuards(JWTGuard)
@ApiTags('GRPC')
export class WalletClientController {
  constructor(private readonly walletClientService: WalletClientService) {}

  //체결엔진 OrderBook
  @Get('/wallet')
  @ApiQuery({ name: 'symbol', example: 'BTC' })
  @ApiOperation({ summary: '지갑 생성' })
  async MakeWallet(
    @User() user: any,
    @Query('symbol') symbol: string,
  ): Promise<any> {
    if (SymbolType[symbol as any] === undefined) {
      return 'wrong SymbolType';
    }
    const observable = await this.walletClientService.CreateWallet(
      symbol,
      user.uuid,
    );
    if (observable === null) {
      return 'fail';
    }
    return new Promise((res, rej) => {
      observable.subscribe({
        next: (e) => {
          console.log(e);
          res(e);
        },
        error: (error) => {
          console.error(error);
          rej(error);
        },
      });
    });
  }
}
