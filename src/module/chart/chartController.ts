import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChartService } from './chart.service.js';
import { ChartReqDto } from './chart.dto.js';

@Controller('chart')
@ApiTags('chart')
export class ChartController {
  constructor(private readonly tradingService: ChartService) {}
  //과거 차트 데이터
  @Get()
  @ApiOperation({ summary: '최근 차트 데이터' })
  @ApiQuery({ name: 'symbol', example: 'btceth' })
  @ApiQuery({ name: 'interval', example: '1m' })
  @ApiQuery({ name: 'length', example: '100' })
  @ApiQuery({ name: 'date', example: '2023-04-04' })
  async chart(
    @Param('symbol') symbol: string,
    @Param('interval') interval: string,
    @Param('length') length: number,
    @Param('date') date: string,
  ) {
    const req: ChartReqDto = {
      order_symbol_id: symbol,
      interval: interval,
      length: length,
      created_at: date,
    };
    return await this.tradingService.getChart(req);
  }
  //과거 호가 데이터
  @Get('bidask')
  @ApiQuery({ name: 'symbol', example: 'btceth' })
  @ApiOperation({ summary: '최근 호가 데이터' })
  async bidask(@Param('symbol') symbol: string) {
    return await this.tradingService.bidask(symbol);
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
