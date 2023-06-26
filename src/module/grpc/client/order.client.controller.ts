import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrderClientService } from './order.client.service.js';
import {
  LimitOrderInputDto,
  LimitOrderOutputDto,
  MarketOrderInputDto,
  MarketOrderOutputDto,
  OrderCancellationInputDto,
  OrderCancellationOutputDto,
} from '../../../dto/grpc.dto.js';
import { SymbolType } from '../interface/message.js';
import { JWTGuard, User } from '../../../decorators/jwt-guard.service.js';
import { OrderGateway } from '../../socket/gateway/order.gateway.js';
import { IpGuard } from '../../../decorators/ip-guard.service.js';

@Controller('grpc')
@UseGuards(IpGuard)
@ApiBearerAuth()
@UseGuards(JWTGuard)
@ApiTags('GRPC')
export class OrderClientController {
  constructor(
    private readonly userClientService: OrderClientService,
    private readonly tradeSocketService: OrderGateway,
  ) {}

  //체결엔진 OrderBook
  @Get('/orderBook')
  @ApiQuery({ name: 'symbol', example: 'BTCETH' })
  @ApiOperation({ summary: '체결엔진 OrderBook' })
  async enguineOrderBook(@Query('symbol') symbol: string): Promise<any> {
    if (SymbolType[symbol as any] === undefined) {
      return 'wrong SymbolType';
    }
    const [ob] = await this.userClientService.enguineOrderBook(symbol);
    return ob;
  }

  @Post('/LimitOrder')
  @ApiOperation({ summary: '지정가 주문 등록 요청' })
  @ApiBody({ type: LimitOrderInputDto })
  @ApiResponse({
    type: LimitOrderOutputDto,
    description: '요청 완료',
    status: 200,
  })
  async LimitOrder(
    @User() user: any,
    @Body() req: LimitOrderInputDto,
    // @Res() res: any,
  ): Promise<any> {
    if (user.uuid !== req.UserUUID) {
      return 'wrong user jwt auth verified';
    }
    if (SymbolType[req.Symbol] === undefined || req.Symbol === 'SYMBOL_NIL') {
      return 'wrong SymbolType';
    }
    if (!['BID', 'ASK'].includes(req.OrderType)) {
      //비정상 타입 주문
      return 'wrong OrderType';
    }
    if (!isFinite(Number(req.Quantity)) || !isFinite(Number(req.UnitPrice))) {
      return 'type is Infinity';
    }
    if (isNaN(req.Quantity) || isNaN(req.UnitPrice)) {
      return 'type is NaN';
    }
    if (Number(req.Quantity) < 0) {
      //비정상 마이너스 주문
      return 'less than 0 Quantity';
    }
    if (Number(req.UnitPrice) < 0) {
      //비정상 마이너스 주문
      return 'less than 0 satoshi';
    }
    // if (Number(req.UnitPrice) * Number(req.Quantity) < 0.0005 * DECIMAL.BTC) {
    //   return 'less than 50000 satoshi';
    // }

    const request: LimitOrderInputDto = {
      UserUUID: req.UserUUID,
      // orderUUID: '',
      Quantity: Number(req.Quantity),
      UnitPrice: Number(req.UnitPrice),
      OrderType: req.OrderType,
      Symbol: req.Symbol,
      // timestamp: '',
    };
    const [ob] = await this.userClientService.LimitOrder(request);
    return ob;
  }

  @Post('/MarketOrder')
  @ApiOperation({ summary: '시장가 주문 등록 요청' })
  @ApiBody({ type: MarketOrderInputDto })
  @ApiResponse({
    type: MarketOrderOutputDto,
    description: '요청 완료',
    status: 200,
  })
  async MarketOrder(
    @User() user: any,
    @Body() req: MarketOrderInputDto,
    // @Res() res: any,
  ): Promise<any> {
    if (user.uuid !== req.UserUUID) {
      return 'wrong user jwt auth verified';
    }
    if (SymbolType[req.Symbol] === undefined || req.Symbol === 'SYMBOL_NIL') {
      return 'wrong SymbolType';
    }
    if (!['BID', 'ASK'].includes(req.OrderType)) {
      //비정상 타입 주문
      return 'wrong OrderType';
    }
    if (!isFinite(Number(req.Quantity))) {
      return 'type is Infinity';
    }
    if (isNaN(req.Quantity)) {
      return 'type is NaN';
    }
    if (Number(req.Quantity) < 0) {
      //비정상 마이너스 주문
      return 'less than 0 Quantity';
    }
    // if (Number(req.Quantity) < 0.0005 && req.OrderType === 'BID') {
    //   return 'less than 50000 satoshi';
    // }

    const Idx = this.tradeSocketService.OpenPrice.findIndex(
      (e: any) => e.order_symbol.name === req.Symbol,
    );
    if (Idx === -1) {
      console.log('open Price is null');
      return;
    }
    // if (
    //   Number(req.Quantity) *
    //     Number(this.tradeSocketService.OpenPrice[Idx].openPrice) <
    //     0.0005 * DECIMAL.BTC &&
    //   req.OrderType === 'ASK'
    // ) {
    //   return 'less than 50000 decimal';
    // }

    const request: MarketOrderInputDto = {
      UserUUID: req.UserUUID,
      // orderUUID: '',
      Quantity: Number(req.Quantity),
      OrderType: req.OrderType,
      Symbol: req.Symbol,
      // timestamp: '',
    };
    const [ob] = await this.userClientService.MarketOrder(request);
    return ob;
  }

  @Delete('/CancelOrder')
  @ApiOperation({ summary: '주문 취소 요청' })
  @ApiBody({ type: OrderCancellationInputDto })
  @ApiResponse({
    type: OrderCancellationOutputDto,
    description: '요청 완료',
    status: 200,
  })
  async CancelOrder(
    @User() user: any,
    @Body() req: OrderCancellationInputDto,
    // @Res() res: any,
  ): Promise<any> {
    if (user.uuid !== req.UserUUID) {
      return 'wrong user jwt auth verified';
    }
    return await this.userClientService.CancelOrder(req);
    // res.send(data);
  }
}
