import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { grpcEndPoint, PACKAGE } from '../../../cllient.options.js';
import {
  CancelOrder,
  LimitOrder,
  MarketOrder,
  OrderBook,
} from '../interface/service.js';
import {
  Ack,
  Currency,
  GetOrderBookOutput,
  LimitOrderInput,
  MarketOrderInput,
  OrderCancellation,
} from '../interface/message.js';
import { randomUUID } from 'crypto';
import {
  LimitOrderInputDto,
  MarketOrderInputDto,
  OrderCancellationInputDto,
} from '../../../dto/grpc.dto.js';
import { DECIMAL } from '../../../dto/redis.dto.js';

@Injectable()
export class OrderClientService implements OnModuleInit {
  private LimitOrderService: { [key: string]: LimitOrder } = {};
  private MarketOrderService: { [key: string]: MarketOrder } = {};
  private CancelOrderService: { [key: string]: CancelOrder } = {};
  private EngineOrderBookService: { [key: string]: any } = {};

  constructor(
    @Inject(PACKAGE[0]) private clientBTCETH: ClientGrpc,
    @Inject(PACKAGE[1]) private clientBTCETC: ClientGrpc,
    @Inject(PACKAGE[2]) private clientBTCMATIC: ClientGrpc,
    @Inject(PACKAGE[3]) private clientBTCLPT: ClientGrpc,
    @Inject(PACKAGE[4]) private clientBTCMANA: ClientGrpc,
    @Inject(PACKAGE[5]) private clientBTCAXS: ClientGrpc,
    @Inject(PACKAGE[6]) private clientBTCAUDIO: ClientGrpc,
    @Inject(PACKAGE[7]) private clientBTCSAND: ClientGrpc,
    @Inject(PACKAGE[8]) private clientBTCCOMP: ClientGrpc,
    @Inject(PACKAGE[9]) private clientBTCLINK: ClientGrpc,
    @Inject(PACKAGE[10]) private clientBTCDYDX: ClientGrpc,
    @Inject(PACKAGE[11]) private clientBTCBNB: ClientGrpc,
    @Inject(PACKAGE[12]) private clientBTCOP: ClientGrpc,
    @Inject(PACKAGE[13]) private clientBTCAVAX: ClientGrpc,
    @Inject(PACKAGE[14]) private clientBTCARB: ClientGrpc,
  ) {
    // Object.values(grpcEndPoint).map((e) => e.market + '_PACKAGE');
  }

  onModuleInit() {
    grpcEndPoint
      .map((e) => e.market)
      .forEach((e) => {
        switch (e) {
          case 'BTCETH':
            this.LimitOrderService[e] =
              this.clientBTCETH.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCETH.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCETH.getService<CancelOrder>('CancelOrder');
            this.EngineOrderBookService[e] =
              this.clientBTCETH.getService<OrderBook>('OrderBook');
            break;
          case 'BTCETC':
            this.LimitOrderService[e] =
              this.clientBTCETC.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCETC.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCETC.getService<CancelOrder>('CancelOrder');
            this.EngineOrderBookService[e] =
              this.clientBTCETC.getService<OrderBook>('OrderBook');
            break;
          case 'BTCMATIC':
            this.LimitOrderService[e] =
              this.clientBTCMATIC.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCMATIC.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCMATIC.getService<CancelOrder>('CancelOrder');
            this.EngineOrderBookService[e] =
              this.clientBTCMATIC.getService<OrderBook>('OrderBook');
            break;
          case 'BTCLPT':
            this.LimitOrderService[e] =
              this.clientBTCLPT.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCLPT.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCLPT.getService<CancelOrder>('CancelOrder');
            this.EngineOrderBookService[e] =
              this.clientBTCLPT.getService<OrderBook>('OrderBook');
            break;
          case 'BTCMANA':
            this.LimitOrderService[e] =
              this.clientBTCMANA.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCMANA.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCMANA.getService<CancelOrder>('CancelOrder');
            this.EngineOrderBookService[e] =
              this.clientBTCMANA.getService<OrderBook>('OrderBook');
            break;
          case 'BTCAXS':
            this.LimitOrderService[e] =
              this.clientBTCAXS.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCAXS.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCAXS.getService<CancelOrder>('CancelOrder');
            this.EngineOrderBookService[e] =
              this.clientBTCAXS.getService<OrderBook>('OrderBook');
            break;
          case 'BTCAUDIO':
            this.LimitOrderService[e] =
              this.clientBTCAUDIO.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCAUDIO.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCAUDIO.getService<CancelOrder>('CancelOrder');
            this.EngineOrderBookService[e] =
              this.clientBTCAUDIO.getService<OrderBook>('OrderBook');
            break;
          case 'BTCSAND':
            this.LimitOrderService[e] =
              this.clientBTCSAND.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCSAND.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCSAND.getService<CancelOrder>('CancelOrder');
            this.EngineOrderBookService[e] =
              this.clientBTCSAND.getService<OrderBook>('OrderBook');
            break;
          case 'BTCCOMP':
            this.LimitOrderService[e] =
              this.clientBTCCOMP.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCCOMP.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCCOMP.getService<CancelOrder>('CancelOrder');
            this.EngineOrderBookService[e] =
              this.clientBTCCOMP.getService<OrderBook>('OrderBook');
            break;
          case 'BTCLINK':
            this.LimitOrderService[e] =
              this.clientBTCLINK.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCLINK.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCLINK.getService<CancelOrder>('CancelOrder');
            this.EngineOrderBookService[e] =
              this.clientBTCLINK.getService<OrderBook>('OrderBook');
            break;
          case 'BTCDYDX':
            this.LimitOrderService[e] =
              this.clientBTCDYDX.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCDYDX.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCDYDX.getService<CancelOrder>('CancelOrder');
            this.EngineOrderBookService[e] =
              this.clientBTCDYDX.getService<OrderBook>('OrderBook');
            break;
          case 'BTCBNB':
            this.LimitOrderService[e] =
              this.clientBTCBNB.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCBNB.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCBNB.getService<CancelOrder>('CancelOrder');
            this.EngineOrderBookService[e] =
              this.clientBTCBNB.getService<OrderBook>('OrderBook');
            break;
          case 'BTCOP':
            this.LimitOrderService[e] =
              this.clientBTCOP.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCOP.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCOP.getService<CancelOrder>('CancelOrder');
            this.EngineOrderBookService[e] =
              this.clientBTCOP.getService<OrderBook>('OrderBook');
            break;
          case 'BTCAVAX':
            this.LimitOrderService[e] =
              this.clientBTCAVAX.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCAVAX.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCAVAX.getService<CancelOrder>('CancelOrder');
            this.EngineOrderBookService[e] =
              this.clientBTCAVAX.getService<OrderBook>('OrderBook');
            break;
          case 'BTCARB':
            this.LimitOrderService[e] =
              this.clientBTCARB.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCARB.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCARB.getService<CancelOrder>('CancelOrder');
            this.EngineOrderBookService[e] =
              this.clientBTCARB.getService<OrderBook>('OrderBook');
            break;
        }
      });
  }

  async enguineOrderBook(
    symbol: string,
  ): Promise<[Observable<GetOrderBookOutput> | null, any]> {
    const request = {};
    // console.log('EngineOrderBook', request, symbol);
    try {
      const ob = this.EngineOrderBookService[symbol].GetOrderBook(request);
      return [ob, request];
    } catch (e) {
      console.error(e);
      return [null, request];
    }
  }

  async LimitOrder(
    req: LimitOrderInputDto,
  ): Promise<[Observable<Ack>, LimitOrderInput]> {
    const time = new Date().getTime();
    const seconds = Math.floor(time * 0.001);
    const nano = (time - seconds * 1000) * 100000;
    const request: LimitOrderInput = {
      UserUUID: req.UserUUID,
      OrderUUID: randomUUID(),
      Quantity: Number(req.Quantity),
      UnitPrice: Math.floor(Number(req.UnitPrice)),
      OrderType: req.OrderType,
      Symbol: req.Symbol,
      MakeTime: {
        seconds: {
          low: seconds,
          high: 0,
          unsigned: false,
        },
        nanos: nano,
      },
    };
    console.log('LimitOrder', request);
    return [
      await this.LimitOrderService[req.Symbol].LimitOrderInit(request),
      request,
    ];
    // return await this.LimitOrderService[req.Symbol].LimitOrderInit(request);
    // return 'LimitOrderOk';
  }

  async MarketOrder(
    req: MarketOrderInputDto,
  ): Promise<[Observable<Ack>, MarketOrderInput]> {
    const Quantity = (() => {
      if (req.OrderType === 'BID') {
        return Number(req.Quantity) * DECIMAL.BTC;
      } else {
        const symbol = req.Symbol.split('BTC')[1] as keyof typeof Currency;
        if (symbol === 'CURRENCY_NIL') {
          return Number(req.Quantity);
        } else {
          return Number(req.Quantity) * DECIMAL[symbol];
        }
      }
    })();
    const time = new Date().getTime();
    const seconds = Math.floor(time * 0.001);
    const nano = (time - seconds * 1000) * 100000;
    const request: MarketOrderInput = {
      UserUUID: req.UserUUID,
      OrderUUID: randomUUID(),
      Quantity: Number(Quantity),
      OrderType: req.OrderType,
      Symbol: req.Symbol,
      MakeTime: {
        seconds: {
          low: seconds,
          high: 0,
          unsigned: false,
        },
        nanos: nano,
      },
    };
    console.log('MarketOrder', request);
    return [
      await this.MarketOrderService[req.Symbol].MarketOrderInit(request),
      request,
    ];
  }

  async CancelOrder(req: OrderCancellationInputDto): Promise<Observable<Ack>> {
    const request: OrderCancellation = {
      UserUUID: req.UserUUID,
      OrderUUID: req.OrderUUID,
    };
    console.log('CancelOrder', request);
    return await this.CancelOrderService[req.Symbol].CancelOrder(request);
  }
}
