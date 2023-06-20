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
import {
  E_OrderFulfillment,
  E_OrderPartialFill,
  OrderFillSocketEvent,
} from '../../../dto/redis.dto.js';
import { JwtService } from '@nestjs/jwt';
import {
  OrderFulfillment,
  OrderPartialFill,
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
  path: '/orderFill',
  cors: {
    origin: '*',
  },
})
export class OrderFillGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: ws.Server;

  constructor(private readonly jwtService: JwtService) {}

  @SubscribeMessage(OrderFillSocketEvent.sub.ping)
  handleMessage(client: any, payload: any): void {
    const json = {
      [OrderFillSocketEvent.pub.pong]: payload,
    };
    const data = JSON.stringify(json).replace(regex, '');
    client.send(data, { binary: true });
  }

  @SubscribeMessage(OrderFillSocketEvent.sub.uuid)
  async uuidHandleMessage(client: any, payload: any): Promise<void> {
    try {
      const jwtPayload: jwt = await this.jwtService.verifyAsync(payload, {
        secret: process.env.JWT_SECRET,
      });
      client.uuid = jwtPayload.uuid;
      const json = {
        [OrderFillSocketEvent.pub.uuid]: jwtPayload.uuid,
      };
      const data = JSON.stringify(json).replace(regex, '');
      client.send(data, { binary: true });
    } catch (e) {
      console.error(e);
      const json = {
        [OrderFillSocketEvent.pub.uuid]: e,
      };
      const data = JSON.stringify(json).replace(regex, '');
      client.send(data, { binary: true });
    }
  }
  OrderPartialFill(req: OrderPartialFill) {
    this.server.clients.forEach((client: any) => {
      if (
        client.readyState === ws.WebSocket.OPEN &&
        client.uuid === req.UserUUID
      ) {
        const makeTimeStamp = new Date(
          req.MakeTime.seconds.low * 1000,
        ).getTime();
        const takeTimeStamp = new Date(
          req.TakeTime.seconds.low * 1000 + req.TakeTime.nanos / 1000000,
        ).getTime();
        const json = {
          [OrderFillSocketEvent.pub.OrderPartialFill]: {
            [E_OrderPartialFill.UserUUID]: req.UserUUID,
            [E_OrderPartialFill.OrderUUID]: req.OrderUUID,
            [E_OrderPartialFill.TotalQuantity]: req.TotalQuantity,
            [E_OrderPartialFill.FilledQuantity]: req.FilledQuantity,
            [E_OrderPartialFill.UnitPrice]: req.UnitPrice,
            [E_OrderPartialFill.Symbol]: SymbolType[req.Symbol],
            [E_OrderPartialFill.OrderType]: OrderType[req.OrderType],
            [E_OrderPartialFill.MakeTime]: makeTimeStamp,
            [E_OrderPartialFill.TakeTime]: takeTimeStamp,
            [E_OrderPartialFill.Fee]: req.Fee,
          },
        };
        const data = str2ab(JSON.stringify(json));
        client.send(data, { binary: true });
      }
    });
  }

  OrderFulfillment(req: OrderFulfillment) {
    this.server.clients.forEach((client: any) => {
      if (
        client.readyState === ws.WebSocket.OPEN &&
        client.uuid === req.UserUUID
      ) {
        const makeTimeStamp = new Date(
          req.MakeTime.seconds.low * 1000,
        ).getTime();
        const takeTimeStamp = new Date(
          req.TakeTime.seconds.low * 1000 + req.TakeTime.nanos / 1000000,
        ).getTime();
        const json = {
          [OrderFillSocketEvent.pub.OrderFulfillment]: {
            [E_OrderFulfillment.UserUUID]: req.UserUUID,
            [E_OrderFulfillment.OrderUUID]: req.OrderUUID,
            [E_OrderFulfillment.FilledQuantity]: req.FilledQuantity,
            [E_OrderFulfillment.UnitPrice]: req.UnitPrice,
            [E_OrderFulfillment.Symbol]: SymbolType[req.Symbol],
            [E_OrderFulfillment.OrderType]: OrderType[req.OrderType],
            [E_OrderFulfillment.MakeTime]: makeTimeStamp,
            [E_OrderFulfillment.TakeTime]: takeTimeStamp,
            [E_OrderFulfillment.Fee]: req.Fee,
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

  handleConnection(client: any) {
    client.id = client._socket._handle.fd;
    console.log(`Trade Client connected: ${client.id}`);
  }

  afterInit(server: ws.Server) {
    console.log(server.options.path);
    console.log('Trade WebSocket server initialized');
  }
}
