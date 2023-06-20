import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { grpcEndPoint, PACKAGE } from '../../../cllient.options.js';
import { OrderBook } from '../interface/service.js';
import { GetOrderBookOutput } from '../interface/message.js';

@Injectable()
export class OrderClientService implements OnModuleInit {
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
            this.EnguineOrderBookService[e] =
              this.clientBTCADA.getService<OrderBook>('OrderBook');
            break;
          case 'BTCSXP':
            this.EnguineOrderBookService[e] =
              this.clientBTCSXP.getService<OrderBook>('OrderBook');
            break;
          case 'BTCSTX':
            this.EnguineOrderBookService[e] =
              this.clientBTCSTX.getService<OrderBook>('OrderBook');
            break;
          case 'BTCSTEEM':
            this.EnguineOrderBookService[e] =
              this.clientBTCSTEEM.getService<OrderBook>('OrderBook');
            break;
          case 'BTCSOL':
            this.EnguineOrderBookService[e] =
              this.clientBTCSOL.getService<OrderBook>('OrderBook');
            break;
          case 'BTCSAND':
            this.EnguineOrderBookService[e] =
              this.clientBTCSAND.getService<OrderBook>('OrderBook');
            break;
          case 'BTCMANA':
            this.EnguineOrderBookService[e] =
              this.clientBTCMANA.getService<OrderBook>('OrderBook');
            break;
          case 'BTCETH':
            this.EnguineOrderBookService[e] =
              this.clientBTCETH.getService<OrderBook>('OrderBook');
            break;
          case 'BTCETC':
            this.EnguineOrderBookService[e] =
              this.clientBTCETC.getService<OrderBook>('OrderBook');
            break;
          case 'BTCDOGE':
            this.EnguineOrderBookService[e] =
              this.clientBTCDOGE.getService<OrderBook>('OrderBook');
            break;
          case 'BTCAXS':
            this.EnguineOrderBookService[e] =
              this.clientBTCAXS.getService<OrderBook>('OrderBook');
            break;
          case 'BTCAVAX':
            this.EnguineOrderBookService[e] =
              this.clientBTCAVAX.getService<OrderBook>('OrderBook');
            break;
          case 'BTCAUDIO':
            this.EnguineOrderBookService[e] =
              this.clientBTCAUDIO.getService<OrderBook>('OrderBook');
            break;
          case 'BTCARB':
            this.EnguineOrderBookService[e] =
              this.clientBTCARB.getService<OrderBook>('OrderBook');
            break;
          case 'BTCAPT':
            this.EnguineOrderBookService[e] =
              this.clientBTCAPT.getService<OrderBook>('OrderBook');
            break;
          case 'BTCXRP':
            this.EnguineOrderBookService[e] =
              this.clientBTCXRP.getService<OrderBook>('OrderBook');
            break;
          case 'BTCSBD':
            this.EnguineOrderBookService[e] =
              this.clientBTCSBD.getService<OrderBook>('OrderBook');
            break;
          case 'BTCMLK':
            this.EnguineOrderBookService[e] =
              this.clientBTCMLK.getService<OrderBook>('OrderBook');
            break;
          case 'BTCMATIC':
            this.EnguineOrderBookService[e] =
              this.clientBTCMATIC.getService<OrderBook>('OrderBook');
            break;
          case 'BTCHIVE':
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
}
