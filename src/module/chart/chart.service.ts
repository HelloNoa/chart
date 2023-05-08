import { Injectable } from '@nestjs/common';
import { RedisPubSubService } from '../redis/redis.pubsub.service.js';
import { chartService } from '../typeorm/chart/chart.service.js';
import { order_bookService } from '../typeorm/order_book/order_book.service.js';
import { order_symbolService } from '../typeorm/order_symbol/order_symbol.service.js';
import { ChartReqDto } from './chart.dto.js';
import { OrderBookService } from '../inMemory/orderBook/orderBook.service.js';
import { order_symbol } from '../typeorm/order_symbol/order_symbol.entity.js';
import { order_matching_eventService } from '../typeorm/order_matching_event/order_matching_event.service.js';

@Injectable()
export class ChartService {
  constructor(
    private readonly redisPubSubService: RedisPubSubService,
    private readonly chartService: chartService,
    private readonly orderBookService: order_bookService,
    private readonly orderSymbolService: order_symbolService,
    private readonly orderMatchingEventService: order_matching_eventService,
    private readonly OrderBookService: OrderBookService,
  ) {}

  //과거 차트 데이터
  async getChart({
    order_symbol_name,
    interval,
    length,
    created_at,
  }: ChartReqDto) {
    return await this.chartService.getChart({
      order_symbol_name,
      interval,
      length,
      created_at,
    });
  }

  //과거 호가 데이터
  async bidask(symbol: string) {
    return await this.orderBookService.getBidAsk(symbol);
  }

  //마켓리스트
  async marketList() {
    const symvolList = await this.orderSymbolService.findAll();
    const lastTick = this.OrderBookService.getDailyLastTick();

    return await Promise.all(
      symvolList.map(
        async (
          e: order_symbol & {
            price?: number;
            volume?: number;
            updown?: number;
            mark?: boolean;
          },
        ) => {
          const price = await this.orderMatchingEventService.lastPrice(e.id);
          //TODO mark 구현
          e.mark = false;
          const volume = (() => {
            if (lastTick[e.name] === undefined) {
              console.log('lastTick is null');
              return 0;
            } else {
              return Number(lastTick[e.name].volume);
            }
          })();
          if (price === null) {
            e.price = 0;
            e.updown = 0;
          } else {
            e.price = Number(price.unit_price);
            if (lastTick[e.name] !== undefined) {
              if (Number(lastTick[e.name].openPrice) === 0) {
                e.updown = 0;
              } else {
                const updown =
                  Number(price.unit_price) - Number(lastTick[e.name].openPrice);
                e.updown = (updown / Number(lastTick[e.name].openPrice)) * 100;
              }
            } else {
              e.updown = 0;
            }
          }
          if (volume === null || volume === undefined) {
            e.volume = 0;
          } else {
            e.volume = Number(volume);
          }
          return e;
        },
      ),
    );
  }

  async upbitPrice(symbol: string) {
    return await fetch(`https://api.upbit.com/v1/ticker?markets=${symbol}`)
      .then((res) => res.json())
      .then((res) => res);
  }
}
