import { Inject, Injectable } from '@nestjs/common';
import { order_symbolService } from '../../typeorm/order_symbol/order_symbol.service.js';
import { ChartGateway } from '../../socket/gateway/chart.gateway.js';
import { chartService } from '../../typeorm/chart/chart.service.js';
import { order_intervalService } from '../../typeorm/order_interval/order_interval.service.js';
import { duration } from '../../typeorm/order_interval/order_interval.entity.js';

interface ticker {
  openPrice: number;
  lowPrice: number;
  highPrice: number;
  currentPrice: number;
  volume: number;
  updown: number;
}

@Injectable()
export class TickerService {
  public queue: { symbol: string; volume: number; unitPrice: number }[] = [];
  public ticker: { [key: string]: ticker } = {};
  private intervarId = 0;
  private outputUpdate: { [key: string]: number } = {};
  private incomeUpdata: { [key: string]: number } = {};

  constructor(
    private readonly orderSymbolService: order_symbolService,
    @Inject(ChartGateway) private readonly chartSocketService: ChartGateway,
    private readonly chartService: chartService,
    private readonly orderIntervalService: order_intervalService,
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
        const _updown = Number(el.closePrice) - Number(el.openPrice);
        this.ticker[el.order_symbol.name] = {
          openPrice: Number(el.openPrice),
          lowPrice: el.lowPrice,
          highPrice: el.highPrice,
          currentPrice: el.closePrice,
          volume: Number(el.tradingValue),
          updown: (_updown / Number(el.openPrice)) * 100,
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

    this.intervarId =
      (await this.orderIntervalService.getLastOrderIntervalId(
        duration.ONE_DAY,
      )) ?? 0;
    setInterval(async () => {
      const intervarId =
        (await this.orderIntervalService.getLastOrderIntervalId(
          duration.ONE_DAY,
        )) ?? 0;
      if (intervarId !== this.intervarId) {
        const _chart = await this.chartService.getDailyTick();
        if (_chart === null) {
          console.error('_chart is null');
          return null;
        }
        const time = new Date().getTime();
        _chart.forEach((el) => {
          this.incomeUpdata[el.order_symbol.name] = time;
          this.outputUpdate[el.order_symbol.name] = time;
          const _updown = Number(el.closePrice) - Number(el.openPrice);
          this.ticker[el.order_symbol.name] = {
            openPrice: Number(el.openPrice),
            lowPrice: el.lowPrice,
            highPrice: el.highPrice,
            currentPrice: el.closePrice,
            volume: Number(el.tradingValue),
            updown: (_updown / Number(el.openPrice)) * 100,
          };
        });
      }
    }, 60 * 1000);
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

    // TODO: null check
    // FIXME: Decorator 혹은 Parsing용 함수 제작해서 validation
    if (this.ticker[req.symbol] === undefined) {
      //...
    }

    // FIXME: Safe math 도입해야함.
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
    const _updown =
      Number(req.unitPrice) - Number(this.ticker[req.symbol].openPrice);

    // FIXME: `* 100` 같은 구문은 Constant값 적용하던지 변수로 따로 선언
    this.ticker[req.symbol].updown =
      (_updown / Number(this.ticker[req.symbol].openPrice)) * 100;

    this.incomeUpdata[req.symbol] = new Date().getTime();
    console.log('after Ticker', this.ticker[req.symbol]);

    return true;
  }

  getTicker(symbol: string) {
    return {
      symbol: symbol,
      ticker: this.ticker[symbol],
    };
  }

  pubTicker(symbol: string) {
    this.chartSocketService.Ticker(symbol, this.ticker[symbol]);
  }
}
