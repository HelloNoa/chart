import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { Observable } from 'rxjs';
import { ChartGateway } from '../socket/gateway/chart.gateway.js';

@Controller()
export class GrpcController {
  constructor(private readonly chartGateway: ChartGateway) {}

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
  async OrderPlacementEventmessages(messages: any) {
    console.log('OrderPlacementEvent');
    console.log(messages);
    this.chartGateway.OrderMatching(messages);
    return { Success: true };
  }

  @GrpcMethod('Event', 'OrderCancellationEvent')
  async OrderCancellationEvent(messages: any) {
    console.log('OrderCancellationEvent');
    console.log(messages);
    this.chartGateway.OrderMatching(messages);
    return { Success: true };
  }

  @GrpcMethod('Event', 'OrderMatchingEvent')
  async OrderMatchingEvent(messages: any) {
    console.log('OrderMatchingEvent');
    console.log(messages);
    this.chartGateway.OrderMatching(messages);
    return { Success: true };
  }
}
