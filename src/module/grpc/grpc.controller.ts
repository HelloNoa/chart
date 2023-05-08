import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { Observable } from 'rxjs';
import { ChartGateway } from '../socket/gateway/chart.gateway.js';
import { OrderBookService } from '../orderBook/orderBook.service.js';
import { OrderType, SymbolType } from './interface/message.js';

@Controller()
export class GrpcController {
  constructor(
    @Inject(ChartGateway) private readonly chartSocketService: ChartGateway,
    private readonly orderBookService: OrderBookService,
  ) {
    //   setTimeout(() => {
    //     setInterval(() => {
    //       const req = {
    //         UserUUID: 'aaa',
    //         OrderUUID: 'aaa',
    //         Quantity: Math.floor(Math.random() * 100000000),
    //         UnitPrice: Math.floor(Math.random() * 100000000),
    //         Symbol: 0,
    //         OrderType: Math.random() > 0.5 ? 0 : 1,
    //       };
    //       this.OrderPlacementEvent(req);
    //     }, 10);
    //   }, 5000);
    //
    //   setTimeout(() => {
    //     setInterval(() => {
    //       const req = {
    //         UserUUID: 'aaa',
    //         OrderUUID: 'aaa',
    //         Quantity: Math.floor(Math.random() * 100000000),
    //         UnitPrice: Math.floor(Math.random() * 100000000),
    //         Symbol: 0,
    //         OrderType: Math.random() > 0.5 ? 0 : 1,
    //       };
    //       this.OrderCancellationEvent(req);
    //     }, 10);
    //   }, 5000);
    //   setTimeout(() => {
    //     setInterval(() => {
    //       const req = {
    //         UserUUID: 'aaa',
    //         OrderUUID: 'aaa',
    //         Quantity: Math.floor(Math.random() * 100000000),
    //         UnitPrice: Math.floor(Math.random() * 100000000),
    //         Symbol: 0,
    //         OrderType: Math.random() > 0.5 ? 0 : 1,
    //       };
    //       this.OrderMatchingEvent(req);
    //     }, 10);
    //   }, 5000);
  }

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
  async OrderPlacementEvent(messages: any) {
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
    this.orderBookService.queue.push(req);
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
    console.log('111');
    console.log(this.chartSocketService.OrderMatching);
    this.chartSocketService.OrderMatching(messages);
    this.orderBookService.queue.push(req);
    // this.orderBookService.updateOrderBook(req);
    return { Success: true };
  }
}
