import { Inject, Injectable } from '@nestjs/common';
import { order_bookService } from '../../typeorm/order_book/order_book.service.js';
import { order_symbolService } from '../../typeorm/order_symbol/order_symbol.service.js';
import { ChartGateway } from '../../socket/gateway/chart.gateway.js';

export interface OrderBookDto {
  price: number;
  volume: number;
}

export interface BidAskDto {
  ask: OrderBookDto[];
  bid: OrderBookDto[];
}

const MAXROW = 20;

type T_QUEUE = {
  symbol: string;
  type: number;
  quantity: number;
  unitPrice: number;
  orderType: string;
};

@Injectable()
export class OrderBookService {
  public queue: T_QUEUE[] = [];
  private initialize: boolean;
  private outputUpdate: { [key: string]: number } = {};
  private incomeUpdata: { [key: string]: number } = {};
  private orderBook: {
    [key: string]: BidAskDto;
  } = {};

  constructor(
    private readonly orderSymbolService: order_symbolService,
    private readonly orderBookService: order_bookService,
    @Inject(ChartGateway) private readonly chartSocketService: ChartGateway,
  ) {
    this.queue = [];
    this.initialize = false;
    // this.init();
  }

  getStatus() {
    return this.initialize;
  }

  async onModuleInit() {
    const list = await this.orderSymbolService.findAll();
    // const list = [{ id: 4, name: 'BTCADA' }];

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
    const cycle = async () => {
      const length = this.queue.length;
      for (let i = 0; i < length; i++) {
        await this.RooopUpdate(this.queue[0]);
        this.queue.shift();
      }

      setTimeout(cycle, 200);
    };
    cycle();
    setInterval(() => {
      list.map((e) => {
        if (this.incomeUpdata[e.name] > this.outputUpdate[e.name]) {
          console.log('hello');
          this.puborderBook(e.name);
          this.outputUpdate[e.name] = new Date().getTime();
        }
      });
    }, 200);
  }

  async RooopUpdate(q: any) {
    await new Promise((res) => {
      res(this.updateOrderBook(q));
    });
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
          if (this.orderBook[req.symbol].ask[index].volume <= 0) {
            this.orderBook[req.symbol].ask.splice(index, 1);
          }
        } else if (req.orderType === 'ASK') {
          const index = this.orderBook[req.symbol].bid.findIndex(
            (e) => e.price === Number(req.unitPrice),
          );
          this.orderBook[req.symbol].bid[index].volume -= req.quantity;
          if (this.orderBook[req.symbol].bid[index].volume <= 0) {
            this.orderBook[req.symbol].bid.splice(index, 1);
          }
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
            this.orderBook[req.symbol].bid.sort((a, b) => b.price - a.price);
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
            this.orderBook[req.symbol].ask.sort((a, b) => b.price - a.price);
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
          if (this.orderBook[req.symbol].bid[index].volume <= 0) {
            this.orderBook[req.symbol].bid.splice(index, 1);
          }
        } else if (req.orderType === 'ASK') {
          const index = this.orderBook[req.symbol].ask.findIndex(
            (e) => e.price === Number(req.unitPrice),
          );
          this.orderBook[req.symbol].ask[index].volume -= req.quantity;
          if (this.orderBook[req.symbol].ask[index].volume <= 0) {
            this.orderBook[req.symbol].ask.splice(index, 1);
          }
        }
        break;
      default:
        break;
    }
    this.incomeUpdata[req.symbol] = new Date().getTime();
    console.log('after', this.orderBook[req.symbol]);
    return true;
  }

  puborderBook(symbol: string) {
    const askLength = this.orderBook[symbol].ask.length;
    const ask = this.orderBook[symbol].ask.slice(askLength - MAXROW);
    const bid = this.orderBook[symbol].bid.slice(0, MAXROW);
    this.chartSocketService.OrderBook(symbol, {
      ask: ask,
      bid: bid,
    } as BidAskDto);
  }
}
