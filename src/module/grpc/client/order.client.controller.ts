import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { OrderClientService } from './order.client.service.js';
import { SymbolType } from '../interface/message.js';

@Controller('grpc')
@ApiTags('GRPC')
export class OrderClientController {
  constructor(private readonly userClientService: OrderClientService) {}

  //체결엔진 OrderBook
  @Get('orderBook')
  @ApiQuery({ name: 'symbol', example: 'BTCETH' })
  @ApiOperation({ summary: '체결엔진 OrderBook' })
  async enguineOrderBook(@Query('symbol') symbol: string): Promise<any> {
    if (SymbolType[symbol as any] === undefined) {
      return 'wrong SymbolType';
    }
    const [ob] = await this.userClientService.enguineOrderBook(symbol);
    return ob;
  }
}
