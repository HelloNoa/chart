import ws from 'ws';
import { ChartGateway } from '../socket/gateway/chart.gateway.js';
import { Inject } from '@nestjs/common';

export class UpbitSocketService {
  private socket: ws;
  private ping: any;

  constructor(
    @Inject(ChartGateway) private readonly chartSocketService: ChartGateway,
  ) {}
  onModuleInit() {
    this.socket = new ws('wss://api.upbit.com/websocket/v1');
    this.socket.binaryType = 'arraybuffer';
    this.socket.onopen = async () => {
      const marketName = 'KRW-BTC';
      if (this.socket == undefined) {
        console.error('no connect exists');
        return;
      }
      // const filter = `[{"ticket":"UNIQUE_TICKET"},{"type":"ticker","codes":[${marketName}]},	{"type":"orderbook","codes":[${marketName}]},{"type":"trade","codes":[${marketName}]}]`;
      const filter = `[{"ticket":"UNIQUE_TICKET"},{"type":"ticker","codes":[${marketName}]}]`;
      this.socket.send(filter);
      this.ping = setInterval(() => {
        console.log('UPBIT SOCKET PING');
        this.socket.ping();
      }, 1000 * 60);
    };
    this.socket.onclose = (e) => {
      console.log('socket server close');
      console.log(e);
      clearInterval(this.ping);
    };
    this.socket.onmessage = (e) => {
      const enc = new TextDecoder('utf-8');
      const arr = new Uint8Array(e.data as Uint8Array);
      const str_d = enc.decode(arr);
      const d = JSON.parse(str_d);
      console.log(d.code, d.trade_price);
      this.chartSocketService.UpbitBTCPrice(d.trade_price as number);
      // this.tradeSocketService.upbitBTCPrice(d.trade_price as number);
    };
  }
}
