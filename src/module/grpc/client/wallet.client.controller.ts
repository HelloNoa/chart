import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Currency } from '../interface/message.js';
import {
  WalletClientService,
  WithdrawRequest,
} from './wallet.client.service.js';
import { JWTGuard, User } from '../../../decorators/jwt-guard.service.js';
import { walletService } from '../../typeorm/wallet/wallet.service.js';
import { coinService } from '../../typeorm/coin/coin.service.js';
import { userService } from '../../typeorm/user/user.service.js';
import { CreateWalletResponse } from '../interface/proxy/proxy.bitcoin.js';
import { CreateWalletOutput } from '../interface/proxy/proxy.polygon.js';
import {
  E_CoinId,
  GetWithdrawListInputDto,
  GetWithdrawListOutputDto,
  status,
  WithdrawInputDto,
  WithdrawOutputDto,
} from '../../../dto/wallet.client.dro.js';
import { BalanceService } from '../../balance/balance.service.js';
import { coin_transferService } from '../../typeorm/coin_transfer/coin_transfer.service.js';
import { coin_transfer } from '../../typeorm/coin_transfer/coin_transfer.entity.js';
import { withdrawal_requestService } from '../../typeorm/withdrawal_request/withdrawal_request.service.js';
import { withdrawal_request } from '../../typeorm/withdrawal_request/withdrawal_request.entity.js';
import { wallet } from '../../typeorm/wallet/wallet.entity.js';

@Controller('wallet')
@ApiBearerAuth()
@UseGuards(JWTGuard)
@ApiTags('wallet')
export class WalletClientController {
  constructor(
    private readonly coinTransferService: coin_transferService,
    private readonly withdrawalRequestService: withdrawal_requestService,
    private readonly balanceService: BalanceService,
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

  @Get('/withdraw')
  @ApiQuery({
    name: 'status',
    type: GetWithdrawListInputDto,
  })
  @ApiResponse({
    type: GetWithdrawListOutputDto,
    isArray: true,
    description: '요청 완료',
    status: 200,
  })
  @ApiOperation({ summary: '출금 현황' })
  async GetWithdrawList(
    @User() user: any,
    @Query('status') status: status[],
  ): Promise<any> {
    console.log(status);
    const userId = await this.userService.getUserId(user.uuid);
    if (userId === null) return new BadRequestException('User not found');
    return this.withdrawalRequestService.GetWithdrawalRequestListByUserId(
      userId,
      status,
    );
  }

  @Post('/withdraw')
  @ApiBody({ type: WithdrawInputDto })
  @ApiResponse({
    type: WithdrawOutputDto,
    description: '요청 완료',
    status: 200,
  })
  @ApiOperation({ summary: '코인 출금 요창' })
  async Withdraw(
    @User() user: any,
    @Body() req: WithdrawInputDto,
  ): Promise<any> {
    const userId = await this.userService.getUserId(user.uuid);
    if (userId === null) return new BadRequestException('User not found');
    const wallet = await this.walletService.getWalletByUserId(
      userId,
      req.coinId,
    );
    if (!wallet) return new BadRequestException('not exist wallet');
    if (wallet.address === '')
      return new BadRequestException('not exist wallet address');
    const balance = await this.balanceService.balance(
      user.uuid,
      E_CoinId[req.coinId],
    );
    if (isNaN(balance)) {
      return new BadRequestException('not enough balance');
    }
    if (!balance || Number(balance) < Number(req.amount))
      return new BadRequestException('not enough balance');
    if (!isFinite(Number(req.amount))) {
      return new BadRequestException('type is Infinity');
    }
    if (isNaN(Number(req.amount))) {
      return new BadRequestException('type is NaN');
    }
    if (Number(req.amount) < 0) {
      return new BadRequestException('not allow minus balance');
    }
    const coinTransfer = new coin_transfer();
    coinTransfer.wallet_id = wallet.id;
    coinTransfer.amount = req.amount;
    coinTransfer.transfer_type = 'WITHDRAWAL';
    const withdrawalRequest = new withdrawal_request();
    withdrawalRequest.amount = req.amount;
    withdrawalRequest.to_address = req.to;
    withdrawalRequest.fee = '0';
    withdrawalRequest.status = 'SUBMITTED';

    const request = {
      userUuid: user.uuid,
      userId: userId,
      wallet: wallet,
      coinTransfer: coinTransfer,
      withdrawalRequest: withdrawalRequest,
    };
    return await this.walletClientService.Withdraw(request as WithdrawRequest);
  }
}
