import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import ws from 'ws';
import { regex } from '../../../main.js';
import { OrderClientService } from '../../grpc/client/order.client.service.js';
import { str2ab } from '../../../utils/index.js';
import {
  DECIMAL,
  E_OrderCancellation,
  E_OrderCancellationFailed,
  E_OrderPlacement,
  E_OrderPlacementFailed,
  OrderCancellation,
  OrderCancellationFailed,
  OrderPlacementFailed,
  OrderSocketEvent,
} from '../../../dto/redis.dto.js';
import {
  LimitOrderInputDto,
  MarketOrderInputDto,
  OrderCancellationInputDto,
} from '../../../dto/grpc.dto.js';
import {
  CancelOrder,
  CancelOrderReq,
  LimitOrder,
  LimitOrderReq,
  MarketOrder,
  MarketOrderReq,
} from '../../../dto/socket.sub.dto.js';
import { JwtService } from '@nestjs/jwt';
import {
  OrderPlacement,
  OrderType,
  SymbolLength,
  SymbolType,
} from '../../grpc/interface/message.js';
import process from 'process';
import { ChartService } from '../../chart/chart.service.js';

type jwt = {
  //uuid
  uuid: string;
  //성인 여부
  isAdult: boolean;
  //otp 여부
  isOtpVerified: boolean;
  //발급일시
  iat: number;
  //만료일시
  exp: number;
  //발급 주최
  iss: string;
};

@WebSocketGateway({
  path: '/order',
  cors: {
    origin: '*',
  },
})
export class OrderGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: ws.Server;
  public OpenPrice: any;
  public CurrentPrice: { [key: string]: number } = {};

  constructor(
    private readonly orderClientService: OrderClientService,
    private readonly jwtService: JwtService,
    private readonly chartService: ChartService,
  ) {
    // const isDev = (() => {
    //   return process.env.NODE_ENV?.toLowerCase() !== 'prod';
    // })();
    setInterval(async () => {
      await this.getCurrnetPrice();
    }, 60 * 1000);
    (async () => {
      await this.getCurrnetPrice();
      this.OpenPrice = await this.chartService
        .openPrice()
        .then((e) => {
          // console.log(e);
          return e;
        })
        .catch((e) => {
          console.error(e);
          console.log('todayOpenPrice rest 파싱에러');
          return [];
        });
      // this.OpenPrice = await fetch(
      //   `https://chart${
      //     isDev ? '-dev' : ''
      //   }.finexblock.com/api/v1/chart/todayOpenPrice`,
      // )
      //   .then((e) => {
      //     if (!e.ok) {
      //       throw new Error('todayOpenPrice 400 or 500 에러');
      //     }
      //     return e.json();
      //   })
      //   .then((e) => e.output)
      //   .catch(() => {
      //     console.log('todayOpenPrice rest 파싱에러');
      //     return [];
      //   });
    })();
    setInterval(async () => {
      this.OpenPrice = await this.chartService
        .openPrice()
        .then((e) => {
          // console.log(e);
          return e;
        })
        .catch((e) => {
          console.error(e);
          console.log('todayOpenPrice rest 파싱에러');
          return [];
        });
      // this.OpenPrice = await fetch(
      //   `https://chart${
      //     isDev ? '-dev' : ''
      //   }.finexblock.com/api/v1/chart/todayOpenPrice`,
      // )
      //   .then((e) => {
      //     if (!e.ok) {
      //       throw new Error('todayOpenPrice 400 or 500 에러');
      //     }
      //     return e.json();
      //   })
      //   .then((e) => e.output)
      //   .catch(() => {
      //     console.log('todayOpenPrice rest 파싱에러');
      //     return [];
      //   });
    }, 1000 * 60);
  }

  async getCurrnetPrice() {
    // const isDev = (() => {
    //   return process.env.NODE_ENV?.toLowerCase() !== 'prod';
    // })();
    await Promise.all(
      new Array(SymbolLength).fill('a').map(async (_, i) => {
        const symbol = SymbolType[i + 1];
        console.log('here');
        this.CurrentPrice[symbol] = await this.chartService
          .ticker(symbol)
          .then((e) => {
            return Number(e.ticker.currentPrice);
          })
          .catch((e) => {
            console.error(e);
            console.log('ticker rest 파싱에러');
            return 0;
          });
        // this.CurrentPrice[symbol] = await fetch(
        //   `https://chart${
        //     isDev ? '-dev' : ''
        //   }.finexblock.com/api/v1/chart/ticker?symbol=${symbol}`,
        // )
        //   .then((e) => {
        //     if (!e.ok) {
        //       throw new Error('ticker 400 or 500 에러');
        //     }
        //     return e.json();
        //   })
        //   .then((e) => e.output)
        //   .then((e) => {
        //     return Number(e.ticker?.currentPrice ?? 0);
        //   })
        //   .catch(() => {
        //     console.log('ticker rest 파싱에러');
        //     return 0;
        //   });
      }),
    );
  }

  @SubscribeMessage(OrderSocketEvent.sub.ping)
  handleMessage(client: any, payload: any): void {
    console.log('socket ping', payload);
    const json = {
      [OrderSocketEvent.pub.pong]: payload,
    };
    const data = JSON.stringify(json).replace(regex, '');
    client.send(data, { binary: true });
  }

  @SubscribeMessage(OrderSocketEvent.sub.uuid)
  async uuidHandleMessage(client: any, payload: any): Promise<void> {
    console.log('socket uuid', payload);
    try {
      const jwtPayload: jwt = await this.jwtService.verifyAsync(payload, {
        secret: process.env.JWT_SECRET,
      });
      client.uuid = jwtPayload.uuid;
      console.log(1);
      const json = {
        [OrderSocketEvent.pub.uuid]: jwtPayload.uuid,
      };
      const data = JSON.stringify(json).replace(regex, '');
      client.send(data, { binary: true });
    } catch (e) {
      console.error(e);
      const json = {
        [OrderSocketEvent.pub.uuid]: e,
      };
      console.log(2);
      const data = JSON.stringify(json).replace(regex, '');
      client.send(data, { binary: true });
    }
  }

  @SubscribeMessage(OrderSocketEvent.sub.LimitOrder)
  //지정가 주문 등록 요청
  async handleMessageLimitOrder(
    client: any,
    payload: LimitOrderReq,
  ): Promise<void> {
    console.log('socket LimitOrder', payload);
    if (client.uuid === undefined) {
      const json = {
        [OrderSocketEvent.pub.OrderPlacementFailed]: {
          [E_OrderPlacementFailed.UserUUID]: 'undefined',
          [E_OrderPlacementFailed.OrderUUID]: 'undefined',
          [E_OrderPlacementFailed.Msg]: 'auth fail',
        },
      };
      const data = str2ab(JSON.stringify(json));
      client.send(data, { binary: true });
      return;
    }
    if (
      SymbolType[payload[LimitOrder.Symbol]] === undefined ||
      payload[LimitOrder.Symbol] === 'SYMBOL_NIL'
    ) {
      //비정상 타입 주문
      const json = {
        [OrderSocketEvent.pub.OrderPlacementFailed]: {
          [E_OrderPlacementFailed.UserUUID]: 'undefined',
          [E_OrderPlacementFailed.OrderUUID]: 'undefined',
          [E_OrderPlacementFailed.Msg]: 'wrong SymbolType',
        },
      };
      const data = str2ab(JSON.stringify(json));
      client.send(data, { binary: true });
      return;
    }
    if (!['BID', 'ASK'].includes(payload[LimitOrder.OrderType])) {
      //비정상 타입 주문
      const json = {
        [OrderSocketEvent.pub.OrderPlacementFailed]: {
          [E_OrderPlacementFailed.UserUUID]: 'undefined',
          [E_OrderPlacementFailed.OrderUUID]: 'undefined',
          [E_OrderPlacementFailed.Msg]: 'wrong OrderType',
        },
      };
      const data = str2ab(JSON.stringify(json));
      client.send(data, { binary: true });
      return;
    }
    if (
      !isFinite(Number(payload[LimitOrder.Quantity])) ||
      !isFinite(Number(payload[LimitOrder.UnitPrice]))
    ) {
      //비정상 타입 주문
      const json = {
        [OrderSocketEvent.pub.OrderPlacementFailed]: {
          [E_OrderPlacementFailed.UserUUID]: 'undefined',
          [E_OrderPlacementFailed.OrderUUID]: 'undefined',
          [E_OrderPlacementFailed.Msg]: 'type is Infinity',
        },
      };
      const data = str2ab(JSON.stringify(json));
      client.send(data, { binary: true });
      return;
    }
    if (
      isNaN(Number(payload[LimitOrder.Quantity])) ||
      isNaN(Number(payload[LimitOrder.UnitPrice]))
    ) {
      //비정상 타입 주문
      const json = {
        [OrderSocketEvent.pub.OrderPlacementFailed]: {
          [E_OrderPlacementFailed.UserUUID]: 'undefined',
          [E_OrderPlacementFailed.OrderUUID]: 'undefined',
          [E_OrderPlacementFailed.Msg]: 'type is NaN',
        },
      };
      const data = str2ab(JSON.stringify(json));
      client.send(data, { binary: true });
      return;
    }
    if (Number(payload[LimitOrder.Quantity]) < 0) {
      //비정상 마이너스 주문
      const json = {
        [OrderSocketEvent.pub.OrderPlacementFailed]: {
          [E_OrderPlacementFailed.UserUUID]: 'undefined',
          [E_OrderPlacementFailed.OrderUUID]: 'undefined',
          [E_OrderPlacementFailed.Msg]: 'less than 0 Quantity',
        },
      };
      const data = str2ab(JSON.stringify(json));
      client.send(data, { binary: true });
      return;
    }
    if (Number(payload[LimitOrder.UnitPrice]) < 0) {
      //비정상 마이너스 주문
      const json = {
        [OrderSocketEvent.pub.OrderPlacementFailed]: {
          [E_OrderPlacementFailed.UserUUID]: 'undefined',
          [E_OrderPlacementFailed.OrderUUID]: 'undefined',
          [E_OrderPlacementFailed.Msg]: 'less than 0 satoshi',
        },
      };
      const data = str2ab(JSON.stringify(json));
      client.send(data, { binary: true });
      return;
    }
    if (
      Number(payload[LimitOrder.Quantity]) *
        Number(payload[LimitOrder.UnitPrice]) <
      0.0005 * DECIMAL.BTC
    ) {
      //최소 거래 수량 미달
      const json = {
        [OrderSocketEvent.pub.OrderPlacementFailed]: {
          [E_OrderPlacementFailed.UserUUID]: 'undefined',
          [E_OrderPlacementFailed.OrderUUID]: 'undefined',
          [E_OrderPlacementFailed.Msg]: 'less than 50000 satoshi',
        },
      };
      const data = str2ab(JSON.stringify(json));
      client.send(data, { binary: true });
      return;
    }
    const price = this.CurrentPrice[payload[LimitOrder.Symbol]];
    if (price) {
      if (
        (price / 10 > Number(payload[LimitOrder.UnitPrice]) &&
          payload[LimitOrder.OrderType] === 'BID') ||
        (price * 10 < Number(payload[LimitOrder.UnitPrice]) &&
          payload[LimitOrder.OrderType] === 'ASK')
      ) {
        //비정상 호가 범위 주문
        const json = {
          [OrderSocketEvent.pub.OrderPlacementFailed]: {
            [E_OrderPlacementFailed.UserUUID]: 'undefined',
            [E_OrderPlacementFailed.OrderUUID]: 'undefined',
            [E_OrderPlacementFailed.Msg]: 'too expensive or cheap',
          },
        };
        const data = str2ab(JSON.stringify(json));
        client.send(data, { binary: true });
        return;
      }
    }
    const request: LimitOrderInputDto = {
      UserUUID: client.uuid,
      // orderUUID: '',
      Quantity: Number(payload[LimitOrder.Quantity]),
      UnitPrice: Number(payload[LimitOrder.UnitPrice]),
      OrderType: payload[LimitOrder.OrderType],
      Symbol: payload[LimitOrder.Symbol],
      // timestamp: '',
    };
    const [observable, order] = await this.orderClientService.LimitOrder(
      request,
    );
    observable.subscribe({
      next: (e) => {
        console.log(e);
        const json = {
          [OrderSocketEvent.pub.OrderPlacement]: {
            [E_OrderPlacement.UserUUID]: order.UserUUID,
            [E_OrderPlacement.OrderUUID]: order.OrderUUID,
            [E_OrderPlacement.Quantity]: order.Quantity,
            [E_OrderPlacement.UnitPrice]: order.UnitPrice,
            [E_OrderPlacement.Symbol]: order.Symbol,
            [E_OrderPlacement.OrderType]: order.OrderType,
            [E_OrderPlacement.MakeTime]: new Date(
              order.MakeTime.seconds.low * 1000,
            ).getTime(),
          },
        };
        const data = str2ab(JSON.stringify(json));
        client.send(data, { binary: true });
      },
      error: (e) => {
        const json = {
          [OrderSocketEvent.pub.OrderPlacementFailed]: {
            [E_OrderPlacementFailed.UserUUID]: 'undefined',
            [E_OrderPlacementFailed.OrderUUID]: 'undefined',
            [E_OrderPlacementFailed.Msg]: e,
          },
        };
        const data = str2ab(JSON.stringify(json));
        client.send(data, { binary: true });
        return;
      },
    });
    console.log(observable);
  }

  @SubscribeMessage(OrderSocketEvent.sub.MarketOrder)
  //시장가 주문 등록 요청
  async handleMessageMarketOrder(
    client: any,
    payload: MarketOrderReq,
  ): Promise<void> {
    console.log('socket MarketOrder', payload);
    if (client.uuid === undefined) {
      const json = {
        [OrderSocketEvent.pub.OrderPlacementFailed]: {
          [E_OrderPlacementFailed.UserUUID]: 'undefined',
          [E_OrderPlacementFailed.OrderUUID]: 'undefined',
          [E_OrderPlacementFailed.Msg]: 'auth fail',
        },
      };
      const data = str2ab(JSON.stringify(json));
      client.send(data, { binary: true });
      return;
    }
    if (
      SymbolType[payload[MarketOrder.Symbol]] === undefined ||
      payload[MarketOrder.Symbol] === 'SYMBOL_NIL'
    ) {
      //비정상 타입 주문
      const json = {
        [OrderSocketEvent.pub.OrderPlacementFailed]: {
          [E_OrderPlacementFailed.UserUUID]: 'undefined',
          [E_OrderPlacementFailed.OrderUUID]: 'undefined',
          [E_OrderPlacementFailed.Msg]: 'wrong SymbolType',
        },
      };
      const data = str2ab(JSON.stringify(json));
      client.send(data, { binary: true });
      return;
    }
    if (!['BID', 'ASK'].includes(payload[MarketOrder.OrderType])) {
      //비정상 타입 주문
      const json = {
        [OrderSocketEvent.pub.OrderPlacementFailed]: {
          [E_OrderPlacementFailed.UserUUID]: 'undefined',
          [E_OrderPlacementFailed.OrderUUID]: 'undefined',
          [E_OrderPlacementFailed.Msg]: 'wrong OrderType',
        },
      };
      const data = str2ab(JSON.stringify(json));
      client.send(data, { binary: true });
      return;
    }
    if (!isFinite(Number(payload[MarketOrder.Quantity]))) {
      //비정상 타입 주문
      const json = {
        [OrderSocketEvent.pub.OrderPlacementFailed]: {
          [E_OrderPlacementFailed.UserUUID]: 'undefined',
          [E_OrderPlacementFailed.OrderUUID]: 'undefined',
          [E_OrderPlacementFailed.Msg]: 'type is Infinity',
        },
      };
      const data = str2ab(JSON.stringify(json));
      client.send(data, { binary: true });
      return;
    }
    if (isNaN(payload[MarketOrder.Quantity])) {
      //비정상 타입 주문
      const json = {
        [OrderSocketEvent.pub.OrderPlacementFailed]: {
          [E_OrderPlacementFailed.UserUUID]: 'undefined',
          [E_OrderPlacementFailed.OrderUUID]: 'undefined',
          [E_OrderPlacementFailed.Msg]: 'type is NaN',
        },
      };
      const data = str2ab(JSON.stringify(json));
      client.send(data, { binary: true });
      return;
    }
    if (Number(payload[MarketOrder.Quantity]) < 0) {
      //비정상 마이너스 주문
      const json = {
        [OrderSocketEvent.pub.OrderPlacementFailed]: {
          [E_OrderPlacementFailed.UserUUID]: 'undefined',
          [E_OrderPlacementFailed.OrderUUID]: 'undefined',
          [E_OrderPlacementFailed.Msg]: 'less than 0 Quantity',
        },
      };
      const data = str2ab(JSON.stringify(json));
      client.send(data, { binary: true });
      return;
    }
    if (
      Number(payload[MarketOrder.Quantity]) < 0.0005 &&
      payload[MarketOrder.OrderType] === 'BID'
    ) {
      //최소 거래 수량 미달
      const json = {
        [OrderSocketEvent.pub.OrderPlacementFailed]: {
          [E_OrderPlacementFailed.UserUUID]: 'undefined',
          [E_OrderPlacementFailed.OrderUUID]: 'undefined',
          [E_OrderPlacementFailed.Msg]: 'less than 50000 satoshi',
        },
      };
      const data = str2ab(JSON.stringify(json));
      client.send(data, { binary: true });
      return;
    }
    const Idx = this.OpenPrice.findIndex(
      (e: any) => e.order_symbol.name === payload[MarketOrder.Symbol],
    );
    if (Idx === -1) {
      console.log('open Price is null');
      return;
    }

    if (
      Number(payload[MarketOrder.Quantity]) *
        Number(this.OpenPrice[Idx].openPrice) <
        0.0005 * DECIMAL.BTC &&
      payload[MarketOrder.OrderType] === 'ASK'
    ) {
      //최소 거래 수량 미달
      const json = {
        [OrderSocketEvent.pub.OrderPlacementFailed]: {
          [E_OrderPlacementFailed.UserUUID]: 'undefined',
          [E_OrderPlacementFailed.OrderUUID]: 'undefined',
          [E_OrderPlacementFailed.Msg]: `less than 50000 decimal ${
            Number(payload[MarketOrder.Quantity]) *
            Number(this.OpenPrice[Idx].openPrice)
          }`,
        },
      };
      const data = str2ab(JSON.stringify(json));
      client.send(data, { binary: true });
      return;
    }
    const request: MarketOrderInputDto = {
      UserUUID: client.uuid,
      // orderUUID: '',
      Quantity: Number(payload[MarketOrder.Quantity]),
      OrderType: payload[MarketOrder.OrderType],
      Symbol: payload[MarketOrder.Symbol],
      // timestamp: '',
    };
    const [observable, order] = await this.orderClientService.MarketOrder(
      request,
    );
    observable.subscribe({
      next: (e) => {
        console.log(e);
        const json = {
          [OrderSocketEvent.pub.OrderPlacement]: {
            [E_OrderPlacement.UserUUID]: order.UserUUID,
            [E_OrderPlacement.OrderUUID]: order.OrderUUID,
            [E_OrderPlacement.Quantity]: order.Quantity,
            [E_OrderPlacement.UnitPrice]: 0,
            [E_OrderPlacement.Symbol]: order.Symbol,
            [E_OrderPlacement.OrderType]: order.OrderType,
            [E_OrderPlacement.MakeTime]: new Date(
              order.MakeTime.seconds.low * 1000,
            ).getTime(),
          },
        };
        const data = str2ab(JSON.stringify(json));
        client.send(data, { binary: true });
      },
      error: (e) => {
        const json = {
          [OrderSocketEvent.pub.OrderPlacementFailed]: {
            [E_OrderPlacementFailed.UserUUID]: 'undefined',
            [E_OrderPlacementFailed.OrderUUID]: 'undefined',
            [E_OrderPlacementFailed.Msg]: e,
          },
        };
        const data = str2ab(JSON.stringify(json));
        client.send(data, { binary: true });
        return;
      },
    });
    console.log(observable);
  }

  @SubscribeMessage(OrderSocketEvent.sub.CancelOrder)
  //주문 취소 요청
  async handleMessageCancelOrder(
    client: any,
    payload: CancelOrderReq,
  ): Promise<void> {
    console.log('Socket CancelOrder', payload);
    if (client.uuid === undefined) {
      const json = {
        [OrderSocketEvent.pub.OrderCancellationFailed]: {
          [E_OrderPlacementFailed.UserUUID]: 'undefined',
          [E_OrderPlacementFailed.OrderUUID]: 'undefined',
          [E_OrderPlacementFailed.Msg]: 'auth fail',
        },
      };
      const data = str2ab(JSON.stringify(json));
      client.send(data, { binary: true });
      return;
    }
    if (
      SymbolType[payload[CancelOrder.Symbol]] === undefined ||
      payload[CancelOrder.Symbol] === 'SYMBOL_NIL'
    ) {
      //비정상 타입 주문
      const json = {
        [OrderSocketEvent.pub.OrderCancellationFailed]: {
          [E_OrderPlacementFailed.UserUUID]: 'undefined',
          [E_OrderPlacementFailed.OrderUUID]: 'undefined',
          [E_OrderPlacementFailed.Msg]: 'wrong SymbolType',
        },
      };
      const data = str2ab(JSON.stringify(json));
      client.send(data, { binary: true });
      return;
    }
    const request: OrderCancellationInputDto = {
      UserUUID: client.uuid,
      OrderUUID: payload[CancelOrder.OrderUUID],
      Symbol: payload[CancelOrder.Symbol],
      // timestamp: '',
    };
    const observable = await this.orderClientService.CancelOrder(request);
    observable.subscribe({
      next: (e) => {
        console.log(e);
      },
      error: (e) => {
        const json = {
          [OrderSocketEvent.pub.OrderCancellationFailed]: {
            [E_OrderCancellationFailed.UserUUID]: 'undefined',
            [E_OrderCancellationFailed.OrderUUID]: 'undefined',
            [E_OrderCancellationFailed.Msg]: e,
          },
        };
        const data = str2ab(JSON.stringify(json));
        client.send(data, { binary: true });
        return;
      },
    });
    console.log(observable);
  }

  OrderPlacementFailed(req: OrderPlacementFailed) {
    console.log(req);
    this.server.clients.forEach((client: any) => {
      if (
        client.readyState === ws.WebSocket.OPEN &&
        client.uuid === req.UserUUID
      ) {
        const json = {
          [OrderSocketEvent.pub.OrderPlacementFailed]: {
            [E_OrderPlacementFailed.UserUUID]: req.UserUUID,
            [E_OrderPlacementFailed.OrderUUID]: req.OrderUUID,
            [E_OrderPlacementFailed.Msg]: req.Msg,
          },
        };
        const data = str2ab(JSON.stringify(json));
        client.send(data, { binary: true });
      }
    });
  }

  OrderPlacement(req: OrderPlacement) {
    this.server.clients.forEach((client: any) => {
      if (
        client.readyState === ws.WebSocket.OPEN &&
        client.uuid === req.UserUUID
      ) {
        const json = {
          [OrderSocketEvent.pub.OrderPlacement]: {
            [E_OrderPlacement.UserUUID]: req.UserUUID,
            [E_OrderPlacement.OrderUUID]: req.OrderUUID,
            [E_OrderPlacement.Quantity]: req.Quantity,
            [E_OrderPlacement.UnitPrice]: req.UnitPrice,
            [E_OrderPlacement.Symbol]: SymbolType[req.Symbol],
            [E_OrderPlacement.OrderType]: OrderType[req.OrderType],
            [E_OrderPlacement.MakeTime]: new Date(
              req.MakeTime.seconds.low * 1000,
            ).getTime(),
          },
        };
        const data = str2ab(JSON.stringify(json));
        client.send(data, { binary: true });
      }
    });
  }

  OrderCancellationFailed(req: OrderCancellationFailed) {
    this.server.clients.forEach((client: any) => {
      if (
        client.readyState === ws.WebSocket.OPEN &&
        client.uuid === req.UserUUID
      ) {
        const json = {
          [OrderSocketEvent.pub.OrderPlacement]: {
            [E_OrderCancellationFailed.UserUUID]: req.UserUUID,
            [E_OrderCancellationFailed.OrderUUID]: req.OrderUUID,
            [E_OrderCancellationFailed.Msg]: req.Msg,
          },
        };
        const data = str2ab(JSON.stringify(json));
        client.send(data, { binary: true });
      }
    });
  }

  OrderCancellation(req: OrderCancellation) {
    this.server.clients.forEach((client: any) => {
      if (
        client.readyState === ws.WebSocket.OPEN &&
        client.uuid === req.UserUUID
      ) {
        const json = {
          [OrderSocketEvent.pub.OrderPlacement]: {
            [E_OrderCancellation.UserUUID]: req.UserUUID,
            [E_OrderCancellation.OrderUUID]: req.OrderUUID,
          },
        };
        const data = str2ab(JSON.stringify(json));
        client.send(data, { binary: true });
      }
    });
  }

  handleDisconnect(client: any) {
    console.log(client.uuid);
    console.log(`Trade Client disconnected: ${client.id}`);
  }

  async handleConnection(client: any) {
    client.id = client._socket._handle.fd;
    console.log(`Trade Client connected: ${client.id}`);
  }

  afterInit(server: ws.Server) {
    console.log(server.options.path);
    console.log('Trade WebSocket server initialized');
    // setInterval(() => {
    //   const json = {
    //     action: 'publish',
    //     channel: 'trade',
    //     pair: 'btc-usdt',
    //     type: Math.random() > 0.5 ? 'bid' : 'ask',
    //     price: Math.random() * 100 + 1000 + '',
    //   };
    //   const str = JSON.stringify(json).replace(regex, '');
    //   const binaryData = str2ab(str);
    //   this.sendAllClients(binaryData);
    // }, 100);
  }
}
