import { Controller, Inject, UseGuards } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { Observable } from 'rxjs';
import { ChartGateway } from '../socket/gateway/chart.gateway.js';
import { OrderBookService } from '../inMemory/orderBook/orderBook.service.js';
import {
  BalanceUpdate,
  OrderPartialFill,
  OrderPlacement,
  OrderType,
  SymbolType,
} from './interface/message.js';
import { TickerService } from '../inMemory/ticker/ticker.service.js';
import { GrpcGuard } from './grpc.guard.js';
import { BalanceGateway } from '../socket/gateway/balance.gateway.js';
import { OrderFillGateway } from '../socket/gateway/orderFill.gateway.js';
import { OrderGateway } from '../socket/gateway/order.gateway.js';

@Controller()
@UseGuards(GrpcGuard)
export class GrpcController {
  constructor(
    @Inject(ChartGateway) private readonly chartSocketService: ChartGateway,
    @Inject(BalanceGateway) private readonly balanceGateway: BalanceGateway,
    @Inject(OrderFillGateway)
    private readonly orderFillGateway: OrderFillGateway,
    @Inject(OrderGateway)
    private readonly tradeSocketService: OrderGateway,
    private readonly orderBookService: OrderBookService,
    private readonly tickerService: TickerService,
  ) {}

  @GrpcMethod('Health', 'Check')
  async Check(
    messages: any,
    // metadata?: Metadata,
    // call?: ServerDuplexStream<any, any>,
  ) {
    console.log('GRPC HealthCheck');
    console.log(messages);
    return { status: 'SERVING' };
  }

  @GrpcMethod('LimitOrder', 'LimitOrderInit')
  async LimitOrderInit(
    messages: Observable<any>,
    // metadata?: Metadata,
    // call?: ServerDuplexStream<any, any>,
  ) {
    console.log('LimitOrderInit');
    console.log(messages);
    return { Success: true };
  }

  // @GrpcStreamMethod('LimitOrder', 'LimitOrderInit')
  // async LimitOrderInit(
  //   messages: Subject<any>,
  //   metadata?: Metadata,
  //   call?: ServerDuplexStream<any, any>,
  // ) {
  //   console.log('LimitOrderInit');
  //   console.log(messages);
  //   return messages;
  //   return { Success: true };
  // }

  @GrpcMethod('Event', 'OrderPlacementEvent')
  async OrderPlacementEvent(messages: OrderPlacement) {
    console.log('OrderPlacementEvent');
    console.log(messages);
    console.log(messages.OrderType);
    console.log(messages.Symbol);
    console.log(OrderType[messages.OrderType]);
    console.log(SymbolType[messages.Symbol]);
    const req = {
      symbol: SymbolType[messages.Symbol],
      type: 1,
      quantity: messages.Quantity,
      unitPrice: messages.UnitPrice,
      orderType: OrderType[messages.OrderType],
    };
    this.orderBookService.queue.push(req as any);
    // this.orderBookService.updateOrderBook(req);
    return { Success: true };
  }

  @GrpcMethod('Event', 'OrderCancellationEvent')
  async OrderCancellationEvent(messages: any) {
    console.log('OrderCancellationEvent');
    console.log(messages);
    console.log(messages.OrderType);
    console.log(messages.Symbol);
    console.log(OrderType[messages.OrderType]);
    console.log(SymbolType[messages.Symbol]);
    const req = {
      symbol: SymbolType[messages.Symbol],
      type: 2,
      quantity: messages.Quantity,
      unitPrice: messages.UnitPrice,
      orderType: OrderType[messages.OrderType],
    };
    this.orderBookService.queue.push(req);
    this.tradeSocketService.OrderCancellation(messages);
    // this.orderBookService.updateOrderBook(req);
    return { Success: true };
  }

  @GrpcMethod('Event', 'OrderMatchingEvent')
  async OrderMatchingEvent(messages: any) {
    console.log('OrderMatchingEvent');
    console.log(messages);
    console.log(messages.OrderType);
    console.log(messages.Symbol);
    console.log(OrderType[messages.OrderType]);
    console.log(SymbolType[messages.Symbol]);
    const req = {
      symbol: SymbolType[messages.Symbol],
      type: 0,
      quantity: messages.Quantity,
      unitPrice: messages.UnitPrice,
      orderType: OrderType[messages.OrderType],
    };

    const tickerReq = {
      symbol: SymbolType[messages.Symbol],
      volume: messages.UnitPrice * messages.Quantity,
      unitPrice: messages.UnitPrice,
    };
    this.chartSocketService.OrderMatching(messages);
    this.orderBookService.queue.push(req);
    this.tickerService.queue.push(tickerReq);
    // this.orderBookService.updateOrderBook(req);
    return { Success: true };
  }

  // START ACCOUNT
  @GrpcMethod('Event', 'BalanceUpdateEvent')
  async BalanceUpdateEventmessages(messages: BalanceUpdate) {
    console.log('BalanceUpdateEvent');
    console.log(messages);
    const request = {
      UserUUID: messages.UserUUID,
      Currency: messages.Currency,
    };
    this.balanceGateway.BalanceUpdate(request);
    return { Success: true };
  }

  // END ACCOUNT
  // START ORDERFILL
  @GrpcMethod('Event', 'OrderMatchingFailedEvent')
  async OrderMatchingFailedEvent(messages: any) {
    console.log('OrderMatchingFailedEvent');
    console.log(messages);
    // TODO
    return { Success: true };
  }

  @GrpcMethod('Event', 'OrderPartialFillEvent')
  async OrderPartialFillEvent(messages: OrderPartialFill) {
    console.log('OrderPartialFillEvent');
    console.log(messages);
    this.orderFillGateway.OrderPartialFill(messages);
    return { Success: true };
  }

  @GrpcMethod('Event', 'OrderFulfillmentEvent')
  async OrderFulfillmentEvent(messages: any) {
    console.log('OrderFulfillmentEvent');
    console.log(messages);
    this.orderFillGateway.OrderFulfillment(messages);
    return { Success: true };
  }

  // END ORDERFILL
  // START ORDER

  @GrpcMethod('Event', 'OrderPlacementFailedEvent')
  async OrderPlacementFailedEvent(messages: any) {
    console.log('OrderPlacementFailedEvent');
    console.log(messages);
    this.tradeSocketService.OrderPlacementFailed(messages);
    return { Success: true };
  }

  @GrpcMethod('Event', 'OrderCancellationFailedEvent')
  async OrderCancellationFailedEvent(messages: any) {
    console.log('OrderCancellationFailedEvent');
    console.log(messages);
    this.tradeSocketService.OrderCancellationFailed(messages);
    return { Success: true };
  }

  // END ORDER
}
