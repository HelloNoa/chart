import { Inject, Injectable } from '@nestjs/common';
import _ from 'lodash';
import { order_bookService } from '../typeorm/order_book/order_book.service.js';
import { order_symbolService } from '../typeorm/order_symbol/order_symbol.service.js';
import { ChartGateway } from '../socket/gateway/chart.gateway.js';

export interface OrderBookDto {
  satoshi: number;
  price: number;
  volume: number;
}

export interface BidAskDto {
  ask: OrderBookDto[];
  bid: OrderBookDto[];
}

const SATOSHI = 100_000_000;
const MAXROW = 20;

@Injectable()
export class OrderBookService {
  private initialize: boolean;
  private outputUpdate: { [key: string]: number } = {};
  private incomeUpdata: { [key: string]: number } = {};
  private orderBook: {
    [key: string]: BidAskDto;
  } = {};

  constructor(
    private readonly orderBookService: order_bookService,
    private readonly orderSymbolService: order_symbolService,
    @Inject(ChartGateway) private readonly chartSocketService: ChartGateway,
  ) {
    this.initialize = false;
    // this.init();
  }

  getStatus() {
    return this.initialize;
  }

  async onModuleInit() {
    const list = await this.orderSymbolService.findAll();
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
        if (this.incomeUpdata > this.outputUpdate) {
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
    switch (req.type) {
      case 0:
        // OrderMatchingChannel;
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
      case 1:
        //OrderPlacementChannel
        if (req.orderType === 'BID') {
          const index = this.orderBook[req.symbol].bid.findIndex(
            (e) => e.price === Number(req.unitPrice),
          );
          if (index === -1) {
            this.orderBook[req.symbol].bid.push({
              satoshi: req.unitPrice * SATOSHI,
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
              satoshi: req.unitPrice * SATOSHI,
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
  }

  puborderBook(symbol: string) {
    const ask = this.orderBook[symbol].ask
      .sort((a, b) => b.satoshi - a.satoshi)
      .slice(-MAXROW, -1);
    const bid = this.orderBook[symbol].bid
      .sort((a, b) => b.satoshi - a.satoshi)
      .slice(0, MAXROW - 1);
    this.chartSocketService.OrderBook(symbol, {
      ask: ask,
      bid: bid,
    } as BidAskDto);
  }
}
