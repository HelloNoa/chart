import { Injectable } from '@nestjs/common';
import { RedisPubSubService } from '../redis/redis.pubsub.service.js';
import { Currency, CurrencyLength } from '../grpc/interface/message.js';

type T_balance = {
  symbol: keyof typeof Currency;
  balance: number;
};

@Injectable()
export class BalanceService {
  constructor(private readonly redisPubSubService: RedisPubSubService) {}

  //내 자산 목록
  async balance(uuid: string, symbol?: string) {
    if (symbol === undefined) {
      const data: T_balance[] = [];
      await Promise.all(
        new Array(CurrencyLength).fill('o').map(async (e, i) => {
          const Symbol = Currency[i + 1];
          const balance =
            (await this.redisPubSubService.getValue(
              `${uuid}:${Symbol}:balance`,
            )) ?? 0;
          data.push({
            symbol: Symbol as keyof typeof Currency,
            balance: balance,
          });
        }),
      );
      return data;
    } else {
      return await this.redisPubSubService.getValue(
        `${uuid}:${symbol}:balance`,
      );
    }
  }
}
