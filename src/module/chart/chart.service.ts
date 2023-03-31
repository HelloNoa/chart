import { Injectable } from '@nestjs/common';
import { RedisPubSubService } from '../redis/redis.pubsub.service.js';

@Injectable()
export class ChartService {
  constructor(private readonly redisPubSubService: RedisPubSubService) {}
  //과거 차트 데이터
  async chart() {
    return await this.redisPubSubService.getValue('foo');
  }
  //과거 호가 데이터
  async bidask() {
    return await this.redisPubSubService.getValue('foo');
  }
  //마켓리스트
  async marketList() {
    return 'btceth';
  }

  async upbitPrice(symbol: string) {
    return await fetch(`https://api.upbit.com/v1/ticker?markets=${symbol}`)
      .then((res) => res.json())
      .then((res) => res);
  }
}
