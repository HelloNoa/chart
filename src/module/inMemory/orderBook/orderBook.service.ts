import { Inject, Injectable } from '@nestjs/common';
import { order_bookService } from '../../typeorm/order_book/order_book.service.js';
import { order_symbolService } from '../../typeorm/order_symbol/order_symbol.service.js';
import { ChartGateway } from '../../socket/gateway/chart.gateway.js';
import { DECIMAL } from '../../../dto/redis.dto.js';
import { OrderClientService } from '../../grpc/client/order.client.service.js';

export interface OrderBookDto {
  price: number;
  volume: number;
}

export interface BidAskDto {
  ask: OrderBookDto[];
  bid: OrderBookDto[];
}

const MAXROW = 20;
type bidask = {
  Price: number;
  Volume: number;
};
type T_QUEUE = {
  symbol: string;
  type: number;
  quantity?: number;
  unitPrice?: number;
  orderType?: string;
  bidask?: {
    bids?: bidask[];
    asks?: bidask[];
  };
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

  private refreshOrderBookIdx: number;

  constructor(
    private readonly orderSymbolService: order_symbolService,
    private readonly orderBookService: order_bookService,
    private readonly OrderClientService: OrderClientService,
    @Inject(ChartGateway) private readonly chartSocketService: ChartGateway,
  ) {
    this.queue = [];
    this.initialize = false;
    // this.init();
  }

  getStatus() {
    return this.initialize;
  }

  async getRefreshObrderBook(symbolName: string) {
    try {
      await new Promise(async (res) => {
        const [ob] = await this.OrderClientService.enguineOrderBook(symbolName);
        if (ob === null) {
          return null;
        } else {
          ob.subscribe({
            next: (aa) => {
              this.queue.push({
                symbol: symbolName,
                type: 3,
                bidask: aa,
              });
              res(aa);
            },
            error: (error) => {
              console.log(error);
              res(null);
            },
          });
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  async onModuleInit() {
    const list = await this.orderSymbolService.findActiveSymbols();
    // const list = [{ id: 4, name: 'BTCADA' }];
    await Promise.all(
      list.map(async (e) => {
        const bidask = await this.orderBookService.getAllBidAsk(e.name);
        // console.log(e.name);
        // console.log(bidask)
        if (bidask === null) {
          console.error('get bidask null!');
          this.orderBook[e.name] = {
            ask: [],
            bid: [],
          };
        } else {
          this.orderBook[e.name] = bidask;
        }
        const time = new Date().getTime();
        this.incomeUpdata[e.name] = time;
        this.outputUpdate[e.name] = time;
      }),
    );

    this.initialize = true;
    this.refreshOrderBookIdx = 0;
    const cycle = async () => {
      const length = this.queue.length;
      for (let i = 0; i < length; i++) {
        await this.RooopUpdate(this.queue[0]);
        this.queue.shift();
      }
      setTimeout(cycle, 200);
    };
    cycle();
    setInterval(async () => {
      //0.2초 마다 socket으로 서빙
      list.map(async (e) => {
        if (this.incomeUpdata[e.name] > this.outputUpdate[e.name]) {
          this.puborderBook(e.name);
          this.outputUpdate[e.name] = new Date().getTime();
        }
      });
    }, 200);
    setInterval(async () => {
      if (++this.refreshOrderBookIdx >= list.length) {
        this.refreshOrderBookIdx = 0;
      }
      try {
        await this.getRefreshObrderBook(list[this.refreshOrderBookIdx].name);
      } catch (e) {
        console.log(e);
      }
    }, 5000 / list.length);
  }

  async RooopUpdate(q: T_QUEUE) {
    await new Promise((res) => {
      res(this.updateOrderBook(q));
    });
  }

  updateOrderBook(req: T_QUEUE) {
    if (!req.quantity || !req.unitPrice || !req.orderType) {
      if (req.type === 3 && req.bidask) {
        //refreshOrderBook
        if (Object.keys(req.bidask).length === 0) {
          // console.log('//bidask가 텅 비어있을때');
          //bidask가 텅 비어있을때
          this.orderBook[req.symbol].ask = [];
          this.orderBook[req.symbol].bid = [];
        } else {
          // console.log('//bidask가 있을때');
          //bidask가 있을때
          if (req.bidask?.asks === undefined) {
            this.orderBook[req.symbol].ask = [];
          } else {
            this.orderBook[req.symbol].ask = req.bidask.asks
              .map((e) => {
                return {
                  price: e.Price,
                  volume: e.Volume,
                };
              })
              .sort((a, b) => b.price - a.price);
          }
          if (req.bidask?.bids === undefined) {
            this.orderBook[req.symbol].bid = [];
          } else {
            this.orderBook[req.symbol].bid = req.bidask.bids
              .map((e) => {
                return {
                  price: e.Price,
                  volume: e.Volume,
                };
              })
              .sort((a, b) => b.price - a.price);
          }
        }
        this.incomeUpdata[req.symbol] = new Date().getTime();
      }

      return;
    }

    // console.log('before', this.orderBook[req.symbol]);
    switch (req.type) {
      case 0:
        // OrderMatchingChannel;
        if (req.orderType === 'BID') {
          const index = this.orderBook[req.symbol].ask.findIndex(
            (e) => e.price === Number(req.unitPrice),
          );
          if (index === -1) {
            // TODO
            // 여기 왜 터짐??
          } else {
            this.orderBook[req.symbol].ask[index].volume -= req.quantity;
            if (
              this.orderBook[req.symbol].ask[index].volume <
              100_000 / DECIMAL.BTC
            ) {
              this.orderBook[req.symbol].ask.splice(index, 1);
            }
          }
        } else if (req.orderType === 'ASK') {
          const index = this.orderBook[req.symbol].bid.findIndex(
            (e) => e.price === Number(req.unitPrice),
          );
          if (index === -1) {
            // TODO
            // 여기 왜 터짐??
          } else {
            this.orderBook[req.symbol].bid[index].volume -= req.quantity;
            if (
              this.orderBook[req.symbol].bid[index].volume <
              100_000 / DECIMAL.BTC
            ) {
              this.orderBook[req.symbol].bid.splice(index, 1);
            }
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
          if (index === -1) {
            // TODO
            // 여기 왜 터짐??
          } else {
            this.orderBook[req.symbol].bid[index].volume -= req.quantity;
            if (
              this.orderBook[req.symbol].bid[index].volume <
              100_000 / DECIMAL.BTC
            ) {
              this.orderBook[req.symbol].bid.splice(index, 1);
            }
          }
        } else if (req.orderType === 'ASK') {
          const index = this.orderBook[req.symbol].ask.findIndex(
            (e) => e.price === Number(req.unitPrice),
          );
          if (index === -1) {
            // TODO
            // 여기 왜 터짐??
          } else {
            this.orderBook[req.symbol].ask[index].volume -= req.quantity;
            if (
              this.orderBook[req.symbol].ask[index].volume <
              100_000 / DECIMAL.BTC
            ) {
              this.orderBook[req.symbol].ask.splice(index, 1);
            }
          }
        }
        break;
      default:
        break;
    }
    this.incomeUpdata[req.symbol] = new Date().getTime();
    // console.log('after', this.orderBook[req.symbol]);
    return true;
  }

  puborderBook(symbol: string) {
    // const askLength = this.orderBook[symbol].ask.length;
    this.orderBook[symbol].ask = this.orderBook[symbol].ask.filter(
      (e) => !isNaN(e.volume),
    );
    this.orderBook[symbol].bid = this.orderBook[symbol].bid.filter(
      (e) => !isNaN(e.volume),
    );
    const ask = this.orderBook[symbol].ask.slice(-MAXROW);
    const bid = this.orderBook[symbol].bid.slice(0, MAXROW);
    this.chartSocketService.OrderBook(symbol, {
      ask: ask,
      bid: bid,
    } as BidAskDto);
  }
}
