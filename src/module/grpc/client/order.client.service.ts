import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { grpcEndPoint, PACKAGE } from '../../../cllient.options.js';
import {
  CancelOrder,
  LifeCycle,
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
  StartEngineInput,
  StartEngineOutput,
  StopEngineInput,
  StopEngineOutput,
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
  private LifecycleService: { [key: string]: LifeCycle } = {};
  private EnguineOrderBookService: { [key: string]: any } = {};

  constructor(
    @Inject(PACKAGE[0]) private clientBTCADA: ClientGrpc,
    @Inject(PACKAGE[1]) private clientBTCSXP: ClientGrpc,
    @Inject(PACKAGE[2]) private clientBTCSTX: ClientGrpc,
    @Inject(PACKAGE[3]) private clientBTCSTEEM: ClientGrpc,
    @Inject(PACKAGE[4]) private clientBTCSOL: ClientGrpc,
    @Inject(PACKAGE[5]) private clientBTCSAND: ClientGrpc,
    @Inject(PACKAGE[6]) private clientBTCMANA: ClientGrpc,
    @Inject(PACKAGE[7]) private clientBTCETH: ClientGrpc,
    @Inject(PACKAGE[8]) private clientBTCETC: ClientGrpc,
    @Inject(PACKAGE[9]) private clientBTCDOGE: ClientGrpc,
    @Inject(PACKAGE[10]) private clientBTCAXS: ClientGrpc,
    @Inject(PACKAGE[11]) private clientBTCAVAX: ClientGrpc,
    @Inject(PACKAGE[12]) private clientBTCAUDIO: ClientGrpc,
    @Inject(PACKAGE[13]) private clientBTCARB: ClientGrpc,
    @Inject(PACKAGE[14]) private clientBTCAPT: ClientGrpc,
    @Inject(PACKAGE[15]) private clientBTCXRP: ClientGrpc,
    @Inject(PACKAGE[16]) private clientBTCSBD: ClientGrpc,
    @Inject(PACKAGE[17]) private clientBTCMLK: ClientGrpc,
    @Inject(PACKAGE[18]) private clientBTCMATIC: ClientGrpc,
    @Inject(PACKAGE[19]) private clientBTCHIVE: ClientGrpc,
  ) {
    // Object.values(grpcEndPoint).map((e) => e.market + '_PACKAGE');
  }

  onModuleInit() {
    grpcEndPoint
      .map((e) => e.market)
      .forEach((e) => {
        switch (e) {
          case 'BTCADA':
            this.LimitOrderService[e] =
              this.clientBTCADA.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCADA.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCADA.getService<CancelOrder>('CancelOrder');
            this.LifecycleService[e] =
              this.clientBTCADA.getService<LifeCycle>('LifeCycle');
            this.EnguineOrderBookService[e] =
              this.clientBTCADA.getService<OrderBook>('OrderBook');
            break;
          case 'BTCSXP':
            this.LimitOrderService[e] =
              this.clientBTCSXP.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCSXP.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCSXP.getService<CancelOrder>('CancelOrder');
            this.LifecycleService[e] =
              this.clientBTCSXP.getService<LifeCycle>('LifeCycle');
            this.EnguineOrderBookService[e] =
              this.clientBTCSXP.getService<OrderBook>('OrderBook');
            break;
          case 'BTCSTX':
            this.LimitOrderService[e] =
              this.clientBTCSTX.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCSTX.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCSTX.getService<CancelOrder>('CancelOrder');
            this.LifecycleService[e] =
              this.clientBTCSTX.getService<LifeCycle>('LifeCycle');
            this.EnguineOrderBookService[e] =
              this.clientBTCSTX.getService<OrderBook>('OrderBook');
            break;
          case 'BTCSTEEM':
            this.LimitOrderService[e] =
              this.clientBTCSTEEM.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCSTEEM.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCSTEEM.getService<CancelOrder>('CancelOrder');
            this.LifecycleService[e] =
              this.clientBTCSTEEM.getService<LifeCycle>('LifeCycle');
            this.EnguineOrderBookService[e] =
              this.clientBTCSTEEM.getService<OrderBook>('OrderBook');
            break;
          case 'BTCSOL':
            this.LimitOrderService[e] =
              this.clientBTCSOL.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCSOL.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCSOL.getService<CancelOrder>('CancelOrder');
            this.LifecycleService[e] =
              this.clientBTCSOL.getService<LifeCycle>('LifeCycle');
            this.EnguineOrderBookService[e] =
              this.clientBTCSOL.getService<OrderBook>('OrderBook');
            break;
          case 'BTCSAND':
            this.LimitOrderService[e] =
              this.clientBTCSAND.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCSAND.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCSAND.getService<CancelOrder>('CancelOrder');
            this.LifecycleService[e] =
              this.clientBTCSAND.getService<LifeCycle>('LifeCycle');
            this.EnguineOrderBookService[e] =
              this.clientBTCSAND.getService<OrderBook>('OrderBook');
            break;
          case 'BTCMANA':
            this.LimitOrderService[e] =
              this.clientBTCMANA.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCMANA.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCMANA.getService<CancelOrder>('CancelOrder');
            this.LifecycleService[e] =
              this.clientBTCMANA.getService<LifeCycle>('LifeCycle');
            this.EnguineOrderBookService[e] =
              this.clientBTCMANA.getService<OrderBook>('OrderBook');
            break;
          case 'BTCETH':
            this.LimitOrderService[e] =
              this.clientBTCETH.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCETH.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCETH.getService<CancelOrder>('CancelOrder');
            this.LifecycleService[e] =
              this.clientBTCETH.getService<LifeCycle>('LifeCycle');
            this.EnguineOrderBookService[e] =
              this.clientBTCETH.getService<OrderBook>('OrderBook');
            break;
          case 'BTCETC':
            this.LimitOrderService[e] =
              this.clientBTCETC.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCETC.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCETC.getService<CancelOrder>('CancelOrder');
            this.LifecycleService[e] =
              this.clientBTCETC.getService<LifeCycle>('LifeCycle');
            this.EnguineOrderBookService[e] =
              this.clientBTCETC.getService<OrderBook>('OrderBook');
            break;
          case 'BTCDOGE':
            this.LimitOrderService[e] =
              this.clientBTCDOGE.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCDOGE.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCDOGE.getService<CancelOrder>('CancelOrder');
            this.LifecycleService[e] =
              this.clientBTCDOGE.getService<LifeCycle>('LifeCycle');
            this.EnguineOrderBookService[e] =
              this.clientBTCDOGE.getService<OrderBook>('OrderBook');
            break;
          case 'BTCAXS':
            this.LimitOrderService[e] =
              this.clientBTCAXS.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCAXS.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCAXS.getService<CancelOrder>('CancelOrder');
            this.LifecycleService[e] =
              this.clientBTCAXS.getService<LifeCycle>('LifeCycle');
            this.EnguineOrderBookService[e] =
              this.clientBTCAXS.getService<OrderBook>('OrderBook');
            break;
          case 'BTCAVAX':
            this.LimitOrderService[e] =
              this.clientBTCAVAX.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCAVAX.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCAVAX.getService<CancelOrder>('CancelOrder');
            this.LifecycleService[e] =
              this.clientBTCAVAX.getService<LifeCycle>('LifeCycle');
            this.EnguineOrderBookService[e] =
              this.clientBTCAVAX.getService<OrderBook>('OrderBook');
            break;
          case 'BTCAUDIO':
            this.LimitOrderService[e] =
              this.clientBTCAUDIO.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCAUDIO.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCAUDIO.getService<CancelOrder>('CancelOrder');
            this.LifecycleService[e] =
              this.clientBTCAUDIO.getService<LifeCycle>('LifeCycle');
            this.EnguineOrderBookService[e] =
              this.clientBTCAUDIO.getService<OrderBook>('OrderBook');
            break;
          case 'BTCARB':
            this.LimitOrderService[e] =
              this.clientBTCARB.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCARB.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCARB.getService<CancelOrder>('CancelOrder');
            this.LifecycleService[e] =
              this.clientBTCARB.getService<LifeCycle>('LifeCycle');
            this.EnguineOrderBookService[e] =
              this.clientBTCARB.getService<OrderBook>('OrderBook');
            break;
          case 'BTCAPT':
            this.LimitOrderService[e] =
              this.clientBTCAPT.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCAPT.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCAPT.getService<CancelOrder>('CancelOrder');
            this.LifecycleService[e] =
              this.clientBTCAPT.getService<LifeCycle>('LifeCycle');
            this.EnguineOrderBookService[e] =
              this.clientBTCAPT.getService<OrderBook>('OrderBook');
            break;
          case 'BTCXRP':
            this.LimitOrderService[e] =
              this.clientBTCXRP.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCXRP.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCXRP.getService<CancelOrder>('CancelOrder');
            this.LifecycleService[e] =
              this.clientBTCXRP.getService<LifeCycle>('LifeCycle');
            this.EnguineOrderBookService[e] =
              this.clientBTCXRP.getService<OrderBook>('OrderBook');
            break;
          case 'BTCSBD':
            this.LimitOrderService[e] =
              this.clientBTCSBD.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCSBD.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCSBD.getService<CancelOrder>('CancelOrder');
            this.LifecycleService[e] =
              this.clientBTCSBD.getService<LifeCycle>('LifeCycle');
            this.EnguineOrderBookService[e] =
              this.clientBTCSBD.getService<OrderBook>('OrderBook');
            break;
          case 'BTCMLK':
            this.LimitOrderService[e] =
              this.clientBTCMLK.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCMLK.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCMLK.getService<CancelOrder>('CancelOrder');
            this.LifecycleService[e] =
              this.clientBTCMLK.getService<LifeCycle>('LifeCycle');
            this.EnguineOrderBookService[e] =
              this.clientBTCMLK.getService<OrderBook>('OrderBook');
            break;
          case 'BTCMATIC':
            this.LimitOrderService[e] =
              this.clientBTCMATIC.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCMATIC.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCMATIC.getService<CancelOrder>('CancelOrder');
            this.LifecycleService[e] =
              this.clientBTCMATIC.getService<LifeCycle>('LifeCycle');
            this.EnguineOrderBookService[e] =
              this.clientBTCMATIC.getService<OrderBook>('OrderBook');
            break;
          case 'BTCHIVE':
            this.LimitOrderService[e] =
              this.clientBTCHIVE.getService<LimitOrder>('LimitOrder');
            this.MarketOrderService[e] =
              this.clientBTCHIVE.getService<MarketOrder>('MarketOrder');
            this.CancelOrderService[e] =
              this.clientBTCHIVE.getService<CancelOrder>('CancelOrder');
            this.LifecycleService[e] =
              this.clientBTCHIVE.getService<LifeCycle>('LifeCycle');
            this.EnguineOrderBookService[e] =
              this.clientBTCHIVE.getService<OrderBook>('OrderBook');
            break;
          default:
            break;
        }
      });
  }

  async enguineOrderBook(
    symbol: string,
  ): Promise<[Observable<GetOrderBookOutput>, any]> {
    const request = {};
    console.log('EnguineOrderBook', request, symbol);
    return [
      await this.EnguineOrderBookService[symbol].GetOrderBook(request),
      request,
    ];
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

  async _test() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return await this.test.getService('Health').Check({});
    // return await this.test.getService('Health').Check;
  }

  async CancelOrder(req: OrderCancellationInputDto): Promise<Observable<Ack>> {
    const request: OrderCancellation = {
      UserUUID: req.UserUUID,
      OrderUUID: req.OrderUUID,
    };
    console.log('CancelOrder', request);
    return await this.CancelOrderService[req.Symbol].CancelOrder(request);
  }

  async StartEngine(req: StartEngineInput): Promise<StartEngineOutput> {
    return await this.LifecycleService['BTCADA'].StartEngine(req);
  }

  async StopEngine(req: StopEngineInput): Promise<StopEngineOutput> {
    return await this.LifecycleService['BTCADA'].StopEngine(req);
  }
}
