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
  BalanceUpdate,
  E_BalanceUpdate,
  BalanceSocketEvent,
} from '../../../dto/redis.dto.js';
import { JwtService } from '@nestjs/jwt';
import { RedisPubSubService } from '../../redis/redis.pubsub.service.js';
import { forwardRef, Inject } from '@nestjs/common';
import { Currency } from '../../grpc/interface/message.js';

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
  path: '/balance',
  cors: {
    origin: '*',
  },
})
export class BalanceGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: ws.Server;

  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => RedisPubSubService))
    private readonly redisPubSubService: RedisPubSubService,
  ) {}

  @SubscribeMessage(BalanceSocketEvent.sub.ping)
  handleMessage(client: any, payload: any): void {
    const json = {
      [BalanceSocketEvent.pub.pong]: payload,
    };
    const data = JSON.stringify(json).replace(regex, '');
    client.send(data, { binary: true });
  }

  @SubscribeMessage(BalanceSocketEvent.sub.uuid)
  async uuidHandleMessage(client: any, payload: any): Promise<void> {
    try {
      const jwtPayload: jwt = await this.jwtService.verifyAsync(payload, {
        secret: process.env.JWT_SECRET,
      });
      client.uuid = jwtPayload.uuid;
      const json = {
        [BalanceSocketEvent.pub.uuid]: jwtPayload.uuid,
      };
      const data = JSON.stringify(json).replace(regex, '');
      client.send(data, { binary: true });
    } catch (e) {
      console.error(e);
      const json = {
        [BalanceSocketEvent.pub.uuid]: e,
      };
      const data = JSON.stringify(json).replace(regex, '');
      client.send(data, { binary: true });
    }
  }

  async BalanceUpdate(req: BalanceUpdate) {
    this.server.clients.forEach((client: any) => {
      if (
        client.readyState === ws.WebSocket.OPEN &&
        client.uuid === req.UserUUID
      ) {
        (async () => {
          const currency = Currency[req.Currency];
          const balance = await this.redisPubSubService.getBalance(
            req.UserUUID,
            currency,
          );
          const json = {
            [BalanceSocketEvent.pub.BalanceUpdate]: {
              [E_BalanceUpdate.UserUUID]: req.UserUUID,
              [E_BalanceUpdate.Diff]: balance,
              [E_BalanceUpdate.Currency]: currency,
            },
          };
          const data = str2ab(JSON.stringify(json));
          client.send(data, { binary: true });
        })();
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
