import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { proxyClients } from '../../../proxy.clients.options.js';
import {
  BitcoinProxy,
  CreateWalletRequest,
  CreateWalletResponse,
} from '../interface/proxy/proxy.bitcoin.js';
import {
  CreateWalletInput as Ethereum_CreateWalletInput,
  CreateWalletOutput as Ethereum_CreateWalletOutput,
  EthereumProxy,
} from '../interface/proxy/proxy.ethereum.js';
import {
  CreateWalletInput as Polygon_CreateWalletInput,
  CreateWalletOutput as Polygon_CreateWalletOutput,
  PolygonProxy,
} from '../interface/proxy/proxy.polygon.js';
import { Observable } from 'rxjs';
import { wallet } from '../../typeorm/wallet/wallet.entity.js';
import { coin_transfer } from '../../typeorm/coin_transfer/coin_transfer.entity.js';
import { withdrawal_request } from '../../typeorm/withdrawal_request/withdrawal_request.entity.js';
import { DataSource } from 'typeorm';
import { MYSQL_WRITE_DATASOURCE_KEY } from '../../../constants/index.js';
import { RedisPubSubService } from '../../redis/redis.pubsub.service.js';
import { E_CoinId } from '../../../dto/wallet.client.dro.js';
import { CreateSlackWebHook } from '../../app/app.logger.js';

@Injectable()
export class WalletClientService implements OnModuleInit {
  constructor(
    private readonly redisService: RedisPubSubService,
    @Inject(MYSQL_WRITE_DATASOURCE_KEY)
    private dataSouce: DataSource,
    @Inject(proxyClients.bitcoin.clientName) private bitcoinProxy: ClientGrpc,
    @Inject(proxyClients.ethereum.clientName) private ethereumProxy: ClientGrpc,
    @Inject(proxyClients.polygon.clientName) private polygonProxy: ClientGrpc,
  ) {}

  onModuleInit() {
    //onModuleInit
  }

  // async GetNewBTCAddress() {
  //   return this.bitcoinProxy
  //     .getService<BitcoinProxy>('BitcoinProxy')
  //     .GetNewAddress({});
  // }

  async CreateWallet(
    symbol: string,
    userId: number,
  ): Promise<Observable<
    | CreateWalletResponse
    | Ethereum_CreateWalletOutput
    | Polygon_CreateWalletOutput
  > | null> {
    let res;
    switch (symbol.toUpperCase()) {
      case 'BTC': //BITCOIN
        {
          const request: CreateWalletRequest = {
            UserId: userId,
          };
          res = this.bitcoinProxy
            .getService<BitcoinProxy>('BitcoinProxy')
            .CreateWalletAddress(request);
        }
        break;
      case 'ETH': //ETHEREUM
        {
          const request: Ethereum_CreateWalletInput = {
            UserID: userId,
          };
          res = this.ethereumProxy
            .getService<EthereumProxy>('EthereumProxy')
            .CreateWallet(request);
        }
        break;
      case 'MATIC': //POLYGON
        {
          const request: Polygon_CreateWalletInput = {
            UserID: userId,
          };
          res = this.polygonProxy
            .getService<PolygonProxy>('PolygonProxy')
            .CreateWallet(request);
        }
        break;
      default:
        res = null;
        break;
    }
    return res;
  }

  async Withdraw(req: WithdrawRequest) {
    const balanceKey = `${req.userUuid}:${
      E_CoinId[req.wallet.coin_id]
    }:balance`;
    const key = `account-lock:${req.userUuid}:${E_CoinId[req.wallet.coin_id]}`;
    const getAccountLock = await this.redisService.Client.setnx(
      key,
      1,
      (cb) => {
        console.log('callback');
        console.log(cb);
      },
    );
    if (!getAccountLock) {
      return new BadRequestException('fail to get AccountLock');
    }
    const minusBalance =
      Number(req.withdrawalRequest.amount) + Number(req.withdrawalRequest.fee);
    const UserBalance = this.redisService.Client.get(balanceKey) ?? 0;
    if (Number(UserBalance) <= Number(minusBalance)) {
      return new BadRequestException(
        `not enough ${E_CoinId[req.wallet.coin_id]} balance`,
      );
    }
    const balanceSetIsComplete = this.redisService.Client.set(
      balanceKey,
      Number(UserBalance) - Number(minusBalance),
    );
    if (!balanceSetIsComplete) {
      return new BadRequestException(
        `fail to set ${E_CoinId[req.wallet.coin_id]} balance`,
      );
    }
    const queryRunner = this.dataSouce.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const coinTransferIsComplete = await queryRunner.manager
        .insert(coin_transfer, req.coinTransfer)
        .then((e) => {
          req.withdrawalRequest.coin_transfer_id = e.identifiers[0].id;
          return true;
        })
        .catch((e) => {
          console.error(e);
          return false;
        });
      const withdrawalRequsetIsComplete = await queryRunner.manager
        .insert(withdrawal_request, req.withdrawalRequest)
        .then(() => {
          return true;
        })
        .catch((e) => {
          console.error(e);
          return false;
        });
      if (!coinTransferIsComplete || !withdrawalRequsetIsComplete) {
        await queryRunner.rollbackTransaction();
        return new BadRequestException(`fail transaction`);
      } else {
        await queryRunner.commitTransaction();
        return 'ok';
      }
    } catch (e) {
      console.error(e);
      const restoreBalanceSetIsComplete = this.redisService.Client.set(
        balanceKey,
        Number(UserBalance),
      );

      if (!restoreBalanceSetIsComplete) {
        CreateSlackWebHook(
          'https://hooks.slack.com/services/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',
          {
            text: `
----------------------------------------------------\n
fail to restore ${E_CoinId[req.wallet.coin_id]} balances \n
currentAmount: ${Number(UserBalance) - Number(minusBalance)}\n
Withdrawamount: ${req.withdrawalRequest.amount},\n
fee: ${req.withdrawalRequest.fee}\n
----------------------------------------------------\n`,
          },
        ).then((data) => {
          console.log(data); // JSON data parsed by `data.json()` call
        });
        return new BadRequestException(
          `fail to restore ${E_CoinId[req.wallet.coin_id]} balances`,
        );
      }

      await queryRunner.rollbackTransaction();
    } finally {
      this.redisService.Client.del(key);
      await queryRunner.release();
      console.log('finally');
    }
  }
}

export interface WithdrawRequest {
  userUuid: string;
  userId: number;
  wallet: wallet;
  coinTransfer: coin_transfer;
  withdrawalRequest: withdrawal_request;
}
