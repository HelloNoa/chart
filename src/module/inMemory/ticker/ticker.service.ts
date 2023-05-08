import { Inject, Injectable } from '@nestjs/common';
import { order_symbolService } from '../../typeorm/order_symbol/order_symbol.service.js';
import { ChartGateway } from '../../socket/gateway/chart.gateway.js';
import { chartService } from '../../typeorm/chart/chart.service.js';

interface ticker {
  openPrice: number;
  lowPrice: number;
  highPrice: number;
  currentPrice: number;
  volume: number;
}

@Injectable()
export class TickerService {
  public queue: { symbol: string; volume: number; unitPrice: number }[] = [];
  public ticker: { [key: string]: ticker } = {};

  private outputUpdate: { [key: string]: number } = {};
  private incomeUpdata: { [key: string]: number } = {};

  constructor(
    private readonly orderSymbolService: order_symbolService,
    @Inject(ChartGateway) private readonly chartSocketService: ChartGateway,
    private readonly chartService: chartService,
  ) {
    this.queue = [];
  }

  async onModuleInit() {
    const list = await this.orderSymbolService.findAll();

    const chart = await this.chartService.getDailyTick();
    if (chart === null) {
      console.error('chart is null');
    } else {
      const time = new Date().getTime();
      chart.forEach((el) => {
        this.incomeUpdata[el.order_symbol.name] = time;
        this.outputUpdate[el.order_symbol.name] = time;
        this.ticker[el.order_symbol.name] = {
          openPrice: el.openPrice,
          lowPrice: el.lowPrice,
          highPrice: el.highPrice,
          currentPrice: el.closePrice,
          volume: Number(el.tradingValue),
        };
      });
    }

    const cycle = async () => {
      const length = this.queue.length;
      for (let i = 0; i < length; i++) {
        await this.RooopUpdate(this.queue[0]);
        this.queue.shift();
      }

      setTimeout(cycle, 200);
    };
    cycle();
    setInterval(() => {
      list.map((e) => {
        if (this.incomeUpdata[e.name] > this.outputUpdate[e.name]) {
          console.log('hello ticker');
          this.pubTicker(e.name);
          this.outputUpdate[e.name] = new Date().getTime();
        }
      });
    }, 200);
  }

  async RooopUpdate(q: any) {
    await new Promise((res) => {
      res(this.updateTicker(q));
    });
  }

  updateTicker(req: { symbol: string; volume: number; unitPrice: number }) {
    console.log('before Ticker', this.ticker[req.symbol]);
    this.ticker[req.symbol].currentPrice = req.unitPrice;
    this.ticker[req.symbol].lowPrice = Math.min(
      this.ticker[req.symbol].lowPrice,
      req.unitPrice,
    );
    this.ticker[req.symbol].highPrice = Math.max(
      this.ticker[req.symbol].highPrice,
      req.unitPrice,
    );
    this.ticker[req.symbol].volume += req.volume;
    this.incomeUpdata[req.symbol] = new Date().getTime();
    console.log('after Ticker', this.ticker[req.symbol]);
    return true;
  }

  pubTicker(symbol: string) {
    this.chartSocketService.Ticker(symbol, this.ticker[symbol]);
  }
}
