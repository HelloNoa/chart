import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
// import ws from 'ws';
import * as WebSocket from 'ws';
import { regex } from '../../../main.js';

@WebSocketGateway({
  path: '/depth',
  cors: {
    origin: '*',
  },
  // namespace: 'chat',
})
export class DepthGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: WebSocket.WebSocketServer;
  @SubscribeMessage('ping')
  handleMessage(client: any, payload: any): void {
    const data = JSON.stringify(payload).replace(regex, '');
    client.uuid = payload;
    client.send(data, { binary: true });
  }
  handleDisconnect(client: any) {
    console.log(client.uuid);
    console.log(`Depth Client disconnected: ${client.id}`);
  }

  handleConnection(client: any) {
    client.id = client._socket._handle.fd;
    console.log(`Depth Client connected: ${client.id}`);
  }
  afterInit(server: WebSocket.WebSocketServer) {
    console.log(server.options.path);
    console.log('Depth WebSocket server initialized');
    // setInterval(() => {
    //   const bid = [
    //     {
    //       price: 100,
    //       amount: Math.floor(Math.random() * 1000),
    //     },
    //     {
    //       price: 99,
    //       amount: Math.floor(Math.random() * 1000),
    //     },
    //     {
    //       price: 98,
    //       amount: Math.floor(Math.random() * 1000),
    //     },
    //     {
    //       price: 97,
    //       amount: Math.floor(Math.random() * 1000),
    //     },
    //   ];
    //   const ask = [
    //     {
    //       price: 96,
    //       amount: Math.floor(Math.random() * 1000),
    //     },
    //     {
    //       price: 95,
    //       amount: Math.floor(Math.random() * 1000),
    //     },
    //     {
    //       price: 94,
    //       amount: Math.floor(Math.random() * 1000),
    //     },
    //     {
    //       price: 93,
    //       amount: Math.floor(Math.random() * 1000),
    //     },
    //   ];
    //   const json = {
    //     action: 'publish',
    //     channel: 'depth',
    //     pair: 'btc-usdt',
    //     bid,
    //     ask,
    //   };
    //   const str = JSON.stringify(json).replace(regex, '');
    //   const binaryData = str2ab(str);
    //   this.sendAllClients(binaryData);
    // }, 100);
  }
}
