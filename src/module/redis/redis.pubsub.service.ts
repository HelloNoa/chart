import { Injectable } from '@nestjs/common';
import { channel, OrderMatching } from '../../dto/redis.dto.js';
import * as IORedis from 'ioredis';
import { ChartGateway } from '../socket/gateway/chart.gateway.js';
import { RedisClusterService } from 'nestjs-redis-cluster';
import { OrderBookService } from '../orderBook/orderBook.service.js';

@Injectable()
export class RedisPubSubService {
  private client: IORedis.Cluster;

  constructor(
    private readonly redisService: RedisClusterService,
    private readonly chartSocketService: ChartGateway,
    private readonly orderBookService: OrderBookService,
  ) {
    this.client = this.redisService.getCluster('REDIS_SERVICE');
    // console.log(this.client);
    // console.log(redisService.clientName);
  }

  onModuleInit() {
    console.log(`Created a redis service for ${this.client.status}`);

    Object.keys(channel).forEach(async (ch) => {
      console.log(`subscribe channel : ${ch}`);
      await this.subscribe(ch, (msg) => {
        console.log('-----------------');
        console.log(ch);
        console.log(msg);
        const req = {
          symbol: msg.Symbol,
          type: -1,
          quantity: msg.Quantity,
          unitPrice: msg.UnitPrice,
          orderType: msg.OrderType,
        };
        switch (ch) {
          //tradeEvent for chartdraw 차트 구독
          case 'OrderMatchingChannel':
            this.OrderMatching(msg);
            req.type = 0;
            this.OrderBook(req);
            break;
          case 'OrderPlacementChannel':
            req.type = 1;
            this.OrderBook(req);
            break;
          case 'OrderCancellationChannel':
            req.type = 2;
            this.OrderBook(req);
            break;
          default:
            break;
        }
        console.log('-----------------');
      });
    });
  }

  OrderBook(req: {
    symbol: string;
    type: number;
    quantity: number;
    unitPrice: number;
    orderType: string;
  }) {
    switch (req.type) {
      case 0:
        //OrderMatchingChannel
        this.orderBookService.updateOrderBook(req);
        break;
      case 1:
        //OrderPlacementChannel
        this.orderBookService.updateOrderBook(req);
        break;
      case 2:
        //OrderCancellationChannel
        this.orderBookService.updateOrderBook(req);
        break;
      default:
        break;
    }
  }

  //tradeEvent for chartdraw 차트 구독
  OrderMatching(req: OrderMatching) {
    this.chartSocketService.OrderMatching(req);
  }

  async publish(channel: string, message: any) {
    await this.client.publish(channel, JSON.stringify(message));
  }

  async subscribe(channel: string, callback: (message: any) => void) {
    this.client.subscribe(channel);
    this.client.on('message', (ch, message) => {
      if (ch === channel) {
        try {
          callback(JSON.parse(message));
        } catch (e) {
          callback(message);
        }
      }
    });
  }

  async setValue(key: string, value: any) {
    await this.client.set(key, JSON.stringify(value));
  }

  async getValue(key: string) {
    const value = await this.client.get(key);
    try {
      return JSON.parse(value as string);
    } catch (e) {
      return value;
    }
  }

  async deleteValue(key: string) {
    await this.client.del(key);
  }
}
