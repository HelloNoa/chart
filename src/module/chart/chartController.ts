import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChartService } from './chart.service.js';

@Controller('chart')
@ApiTags('chart')
export class ChartController {
  constructor(private readonly tradingService: ChartService) {}
  //과거 차트 데이터
  @Get()
  @ApiOperation({ summary: '최근 차트 데이터' })
  @ApiQuery({ name: 'symbol', example: 'btceth' })
  @ApiQuery({ name: 'time', example: '1m' })
  @ApiQuery({ name: 'page', example: '1' })
  async chart(
    @Param('symbol') symbol: string,
    @Param('time') time: string,
    @Param('page') page: number,
  ) {
    return await this.tradingService.chart();
  }
  //과거 호가 데이터
  @Get('bidask')
  @ApiQuery({ name: 'symbol', example: 'btceth' })
  @ApiOperation({ summary: '최근 호가 데이터' })
  async bidask(@Param('symbol') symbol: string) {
    return await this.tradingService.bidask();
  }
  //마켓 리스트
  @Get('marketList')
  @ApiOperation({ summary: '마켓 리스트' })
  async marketList() {
    return await this.tradingService.marketList();
  }

  //업비트 코인 원화 가격
  @Get('upbit/price')
  @ApiOperation({ summary: '업비트 코인 원화 가격' })
  @ApiQuery({ name: 'symbol', example: 'KRW-BTC' })
  async upbitPrice(@Res() res: any, @Query('symbol') symbol: string) {
    const data = await this.tradingService.upbitPrice(symbol);
    res.send(JSON.stringify(data[0].trade_price));
  }
}
