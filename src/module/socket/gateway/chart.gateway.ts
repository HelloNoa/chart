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
import { str2ab } from '../../../utils/index.js';
import { E_OrderMatching, socketEvent } from '../../../dto/redis.dto.js';
import { JwtService } from '@nestjs/jwt';
import {
  OrderMatchingEvent,
  OrderType,
  SymbolType,
} from '../../grpc/interface/message.js';

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
  path: '/chart',
  cors: {
    origin: '*',
  },
})
export class ChartGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: ws.Server;

  constructor(private readonly jwtService: JwtService) {
    // this.test();
  }

  @SubscribeMessage(socketEvent.sub.ping)
  handleMessage(client: any, payload: any): void {
    const json = {
      [socketEvent.pub.pong]: payload,
    };
    const data = JSON.stringify(json).replace(regex, '');
    client.send(data, { binary: true });
  }

  @SubscribeMessage(socketEvent.sub.uuid)
  async uuidHandleMessage(client: any, payload: any): Promise<void> {
    try {
      const jwtPayload: jwt = await this.jwtService.verifyAsync(payload, {
        secret: process.env.JWT_SECRET,
      });
      client.uuid = jwtPayload.uuid;
      const json = {
        [socketEvent.pub.uuid]: jwtPayload.uuid,
      };
      const data = JSON.stringify(json).replace(regex, '');
      client.send(data, { binary: true });
    } catch (e) {
      console.error(e);
      const json = {
        [socketEvent.pub.uuid]: e,
      };
      const data = JSON.stringify(json).replace(regex, '');
      client.send(data, { binary: true });
    }
  }

  @SubscribeMessage(socketEvent.sub.ChartSubscriber)
  ChartSubscriberHandleMessage(client: any, payload: any): void {
    const json = {
      [socketEvent.pub.ChartSubscriber]: payload,
    };
    const data = JSON.stringify(json).replace(regex, '');
    if (client.chart === undefined) {
      client.chart = [];
      client.chart.push(payload);
    } else if (!client.chart.includes(payload)) {
      client.chart.push(payload);
    }
    client.send(data, { binary: true });
  }

  @SubscribeMessage(socketEvent.sub.OrderBookSubscriber)
  OrderBookSubscriberHandleMessage(client: any, payload: any): void {
    const json = {
      [socketEvent.pub.OrderBookSubscriber]: payload,
    };
    const data = JSON.stringify(json).replace(regex, '');
    if (client.orderBook === undefined) {
      client.orderBook = [];
      client.orderBook.push(payload);
    } else if (!client.orderBook.includes(payload)) {
      client.orderBook.push(payload);
    }
    client.send(data, { binary: true });
  }

  OrderBook(marketType: string, orderBook: any) {
    this.server.clients.forEach((client: any) => {
      if (
        client.readyState === ws.WebSocket.OPEN &&
        client.orderBook &&
        client.orderBook.includes(marketType)
      ) {
        const json = {
          [socketEvent.pub.OrderBook]: orderBook,
        };
        const data = str2ab(JSON.stringify(json));
        client.send(data, { binary: true });
      }
    });
  }

  OrderMatching(req: OrderMatchingEvent) {
    this.server.clients.forEach((client: any) => {
      if (
        client.readyState === ws.WebSocket.OPEN &&
        client.chart &&
        client.chart.includes(SymbolType[req.Symbol])
      ) {
        const json = {
          [socketEvent.pub.OrderMatching]: {
            [E_OrderMatching.UnitPrice]: req.UnitPrice,
            [E_OrderMatching.Quantity]: req.Quantity,
            [E_OrderMatching.Timestamp]: new Date(
              req.Timestamp.seconds.low * 1000,
            ).getTime(),
            [E_OrderMatching.OrderType]: OrderType[req.OrderType],
            [E_OrderMatching.Symbol]: SymbolType[req.Symbol],
          },
        };
        const data = str2ab(JSON.stringify(json));
        client.send(data, { binary: true });
      }
    });
  }

  UpbitBTCPrice(price: number) {
    this.server.clients.forEach((client: any) => {
      const json = {
        [socketEvent.pub.UpbitBTCPrice]: price,
      };
      const data = str2ab(JSON.stringify(json));
      client.send(data, { binary: true });
    });
  }

  handleDisconnect(client: any) {
    console.log(client.uuid);
    console.log(`Trade Client disconnected: ${client.id}`);
  }

  handleConnection(client: any) {
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
