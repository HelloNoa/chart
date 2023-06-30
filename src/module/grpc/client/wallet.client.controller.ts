import {
  Controller,
  Get,
  Inject,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Currency } from '../interface/message.js';
import { WalletClientService } from './wallet.client.service.js';
import { JWTGuard, User } from '../../../decorators/jwt-guard.service.js';
import { walletService } from '../../typeorm/wallet/wallet.service.js';
import { coinService } from '../../typeorm/coin/coin.service.js';
import { userService } from '../../typeorm/user/user.service.js';
import { CreateWalletResponse } from '../interface/proxy/proxy.bitcoin.js';
import { CreateWalletOutput } from '../interface/proxy/proxy.polygon.js';

@Controller('wallet')
@ApiBearerAuth()
@UseGuards(JWTGuard)
@ApiTags('wallet')
export class WalletClientController {
  constructor(
    private readonly walletClientService: WalletClientService,
    @Inject(walletService) private readonly walletService: walletService,
    @Inject(userService) private readonly userService: userService,
    @Inject(coinService) private readonly coinService: coinService,
  ) {}

  @Get('/wallet')
  @ApiQuery({ name: 'symbol', example: 'BTC' })
  @ApiOperation({ summary: '지갑 정보' })
  async GetWallet(
    @User() user: any,
    @Query('symbol') symbol: string,
  ): Promise<any> {
    if (Currency[symbol as any] === undefined) {
      return 'wrong Currency';
    }
    const userId = await this.userService.getUserId(user.uuid);
    if (userId === null) return 'User not found';
    const coin = await this.coinService.getCoinByName(symbol);
    if (coin === null) return 'Coin Name not found';
    return await this.walletService.getWalletByUserId(userId, coin.id);
  }

  @Get('/newBTCWallet')
  @ApiQuery({ name: 'symbol', example: 'BTC' })
  @ApiOperation({ summary: '지갑 정보' })
  async GetNewAddress(): Promise<any> {
    return this.walletClientService.GetNewBTCAddress();
  }

  @Patch('/wallet')
  @ApiQuery({ name: 'symbol', example: 'BTC' })
  @ApiOperation({ summary: '지갑 생성' })
  async MakeWallet(
    @User() user: any,
    @Query('symbol') symbol: string,
  ): Promise<any> {
    if (Currency[symbol as any] === undefined) {
      return 'wrong Currency';
    }
    const userId = await this.userService.getUserId(user.uuid);
    if (userId === null) return 'User not found';
    const coin = await this.coinService.getCoinByName(symbol);
    if (coin === null) return 'Coin Name not found';
    const wallet = await this.walletService.getWalletByUserId(userId, coin.id);
    if (wallet === null) return 'not found wallet';
    const observable = await this.walletClientService.CreateWallet(
      symbol,
      userId,
    );
    if (observable === null) {
      return 'fail';
    }
    return new Promise((res, rej) => {
      observable.subscribe({
        next: async (e: CreateWalletResponse | CreateWalletOutput) => {
          wallet.address = e.Address;
          const isComplete = await this.walletService.upsertWalletInfo(wallet);
          if (isComplete) {
            res(e);
          } else {
            rej('wallet address update fail');
          }
        },
        error: (error) => {
          console.error(error);
          rej(error);
        },
      });
    });
  }
}
