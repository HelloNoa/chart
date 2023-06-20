import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { OrderService } from './order.service.js';
import { JWTGuard, User } from '../../decorators/jwt-guard.service.js';

@Controller('order')
@ApiTags('Trading')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  //내 주문 목록
  @ApiBearerAuth()
  @UseGuards(JWTGuard)
  @Get('list')
  @ApiOperation({ summary: '내 주문 목록' })
  @ApiQuery({ name: 'userId', example: 'userUUID' })
  @ApiQuery({
    name: 'isPending',
    type: Boolean,
    description: 'true 이면 미체결 false 이면 체결 default 는 false',
    example: false,
    required: false,
  })
  @ApiQuery({ name: 'orderSymbolId', example: 'BTCETH', required: false })
  async orderList(
    @User() user: any,
    @Query('userId') userId: string,
    @Query('isPending') isPending = false,
    @Query('orderSymbolId') orderSymbolId?: string,
  ) {
    if (user.uuid !== userId) {
      return 'wrong user jwt auth verified';
    }
    return await this.orderService.orderList(
      userId,
      isPending + '' === 'true',
      orderSymbolId,
    );
  }

  @Get('history')
  @ApiOperation({ summary: '전체 체결 리스트' })
  @ApiQuery({ name: 'orderSymbolId', example: 'BTCADA', required: false })
  @ApiQuery({ name: 'limit', example: 10, required: false })
  async tradeHistory(
    @Query('orderSymbolId') orderSymbolId: string,
    @Query('limit') limit = 10,
  ) {
    if (Number(limit) === 0) {
      limit = 1;
    }
    return await this.orderService.history(orderSymbolId, Number(limit));
  }
}
