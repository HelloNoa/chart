import { Inject, Injectable } from '@nestjs/common';
import _ from 'lodash';
import { order_bookService } from '../typeorm/order_book/order_book.service.js';
import { order_symbolService } from '../typeorm/order_symbol/order_symbol.service.js';
import { ChartGateway } from '../socket/gateway/chart.gateway.js';
import { chartService } from '../typeorm/chart/chart.service.js';

export interface OrderBookDto {
  price: number;
  volume: number;
}

export interface BidAskDto {
  ask: OrderBookDto[];
  bid: OrderBookDto[];
}

const MAXROW = 20;

@Injectable()
export class OrderBookService {
  private initialize: boolean;
  private outputUpdate: { [key: string]: number } = {};
  private incomeUpdata: { [key: string]: number } = {};
  private orderBook: {
    [key: string]: BidAskDto;
  } = {};

  private dailyLastTick: { [key: string]: { [key: string]: any } } = {};

  constructor(
    private readonly orderSymbolService: order_symbolService,
    private readonly orderBookService: order_bookService,
    @Inject(ChartGateway) private readonly chartSocketService: ChartGateway,
    private readonly chartService: chartService,
  ) {
    this.initialize = false;
    // this.init();
  }

  getStatus() {
    return this.initialize;
  }

  async onModuleInit() {
    const list = await this.orderSymbolService.findAll();
    // const list = [{ id: 4, name: 'BTCADA' }];

    const chart = await this.chartService.getDailyTick();
    if (chart === null) {
      console.error('chart is null');
    } else {
      chart.forEach((el) => {
        this.dailyLastTick[el.order_symbol.name] = el;
      });
    }
    await Promise.all(
      list.map(async (e) => {
        const bidask = await this.orderBookService.getAllBidAsk(e.name);
        if (bidask === null) {
          console.error('get bidask null!');
          console.log(e.name);
          if (!this.orderBook.hasOwnProperty(e.name)) {
            this.orderBook[e.name] = {
              ask: [],
              bid: [],
            };
          }
        } else {
          this.orderBook[e.name] = bidask;
        }
        const time = new Date().getTime();
        this.incomeUpdata[e.name] = time;
        this.outputUpdate[e.name] = time;
      }),
    );

    this.initialize = true;
    setInterval(() => {
      list.map((e) => {
        if (this.incomeUpdata[e.name] > this.outputUpdate[e.name]) {
          console.log('hello');

          _.remove(this.orderBook[e.name].bid, (n) => {
            return n.volume === 0;
          });
          _.remove(this.orderBook[e.name].ask, (n) => {
            return n.volume === 0;
          });
          this.puborderBook(e.name);
          this.outputUpdate[e.name] = new Date().getTime();
        }
      });
    }, 200);
  }

  updateOrderBook(req: {
    symbol: string;
    type: number;
    quantity: number;
    unitPrice: number;
    orderType: string;
  }) {
    console.log('before', this.orderBook[req.symbol]);
    switch (req.type) {
      case 0:
        // OrderMatchingChannel;
        if (req.orderType === 'BID') {
          const index = this.orderBook[req.symbol].ask.findIndex(
            (e) => e.price === Number(req.unitPrice),
          );
          this.orderBook[req.symbol].ask[index].volume -= req.quantity;
        } else if (req.orderType === 'ASK') {
          const index = this.orderBook[req.symbol].bid.findIndex(
            (e) => e.price === Number(req.unitPrice),
          );
          this.orderBook[req.symbol].bid[index].volume -= req.quantity;
        }
        break;
      case 1:
        //OrderPlacementChannel
        if (req.orderType === 'BID') {
          const index = this.orderBook[req.symbol].bid.findIndex(
            (e) => e.price === Number(req.unitPrice),
          );
          if (index === -1) {
            this.orderBook[req.symbol].bid.push({
              price: req.unitPrice,
              volume: req.quantity,
            });
          } else {
            this.orderBook[req.symbol].bid[index].volume += req.quantity;
          }
        } else if (req.orderType === 'ASK') {
          const index = this.orderBook[req.symbol].ask.findIndex(
            (e) => e.price === Number(req.unitPrice),
          );
          if (index === -1) {
            this.orderBook[req.symbol].ask.push({
              price: req.unitPrice,
              volume: req.quantity,
            });
          } else {
            this.orderBook[req.symbol].ask[index].volume += req.quantity;
          }
        }
        break;
      case 2:
        //OrderCancellationChannel
        if (req.orderType === 'BID') {
          const index = this.orderBook[req.symbol].bid.findIndex(
            (e) => e.price === Number(req.unitPrice),
          );
          this.orderBook[req.symbol].bid[index].volume -= req.quantity;
        } else if (req.orderType === 'ASK') {
          const index = this.orderBook[req.symbol].ask.findIndex(
            (e) => e.price === Number(req.unitPrice),
          );
          this.orderBook[req.symbol].ask[index].volume -= req.quantity;
        }
        break;
      default:
        break;
    }
    this.incomeUpdata[req.symbol] = new Date().getTime();
    console.log('after', this.orderBook[req.symbol]);
  }

  puborderBook(symbol: string) {
    const ask = this.orderBook[symbol].ask
      .sort((a, b) => b.price - a.price)
      .slice(-MAXROW, -1);
    const bid = this.orderBook[symbol].bid
      .sort((a, b) => b.price - a.price)
      .slice(0, MAXROW - 1);
    this.chartSocketService.OrderBook(symbol, {
      ask: ask,
      bid: bid,
    } as BidAskDto);
  }

  getDailyLastTick() {
    return this.dailyLastTick;
  }
}
