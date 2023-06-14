import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChartService } from './chart.service.js';
import { ChartReqDto } from './chart.dto.js';
import { duration } from '../typeorm/order_interval/order_interval.entity.js';

@Controller('chart')
@ApiTags('chart')
export class ChartController {
  constructor(private readonly tradingService: ChartService) {}

  //과거 차트 데이터
  @Get()
  @ApiOperation({ summary: '최근 차트 데이터' })
  @ApiQuery({ name: 'symbol', example: 'BTCETH' })
  @ApiQuery({ name: 'interval', example: 'ONE_MINUTE' })
  @ApiQuery({ name: 'length', example: '100' })
  @ApiQuery({ name: 'date', example: '2023-04-04' })
  async chart(
    @Query('symbol') symbol: string,
    @Query('interval') interval: keyof typeof duration,
    @Query('length') length: number,
    @Query('date') date: string,
  ) {
    const req: ChartReqDto = {
      order_symbol_name: symbol,
      interval: interval,
      length: length,
      created_at: date,
    };
    return await this.tradingService.getChart(req);
  }

  //과거 호가 데이터
  @Get('bidask')
  @ApiQuery({ name: 'symbol', example: 'BTCETH' })
  @ApiOperation({ summary: '최근 호가 데이터' })
  async bidask(@Query('symbol') symbol: string) {
    return await this.tradingService.bidask(symbol);
  }

  //마켓 리스트
  @Get('marketList')
  @ApiOperation({ summary: '마켓 리스트' })
  async marketList() {
    return await this.tradingService.marketList();
  }

  //Ticker
  @Get('ticker')
  @ApiOperation({ summary: 'ticker' })
  @ApiQuery({ name: 'symbol', example: 'BTCETH' })
  async ticker(@Query('symbol') symbol: string): Promise<any> {
    return await this.tradingService.ticker(symbol);
  }

  //금일 시작가
  @Get('todayOpenPrice')
  @ApiOperation({ summary: '금일 시작가' })
  async openPrice(): Promise<any> {
    return await this.tradingService.openPrice();
  }

  //업비트 코인 원화 가격
  @Get('upbit/price')
  @ApiOperation({ summary: '업비트 코인 원화 가격' })
  @ApiQuery({ name: 'symbol', example: 'KRW-BTC', required: false })
  async upbitPrice(@Res() res: any, @Query('symbol') symbol: string) {
    const data = await this.tradingService.upbitPrice(symbol);
    res.send(data);
  }
}
