import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import {
  Ack,
  LimitOrderInput,
  MarketOrderInput,
  OrderCancellation,
  OrderCancellationFailed,
  OrderFulfillment,
  OrderInitialize,
  OrderMatching,
  OrderMatchingFailed,
  OrderPartialFill,
  OrderPlacement,
  OrderPlacementFailed,
  StartEngineInput,
  StartEngineOutput,
  StopEngineInput,
  StopEngineOutput,
} from './message.js';

export interface MarketOrder {
  MarketBidInit(
    data: MarketOrderInput,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<Ack>;
}
export interface LimitOrder {
  LimitOrderInit(
    data: LimitOrderInput,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<Ack>;
}
export interface CancelOrder {
  CancelOrder(
    data: OrderCancellation,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<Ack>;
}
export interface Event {
  OrderPlacementEvent(
    data: Observable<OrderPlacement>,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<Ack>;
  OrderPlacementFailedEvent(
    data: Observable<OrderPlacementFailed>,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<Ack>;
  OrderCancellationEvent(
    data: Observable<OrderCancellation>,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<Ack>;
  OrderCancellationFailedEvent(
    data: Observable<OrderCancellationFailed>,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<Ack>;
  OrderMatchingEvent(
    data: Observable<OrderMatching>,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<Ack>;
  OrderMatchingFailedEvent(
    data: Observable<OrderMatchingFailed>,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<Ack>;
  OrderPartialFillEvent(
    data: Observable<OrderPartialFill>,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<Ack>;
  OrderFulfillmentEvent(
    data: Observable<OrderFulfillment>,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<Ack>;
  OrderInitializeEvent(
    data: Observable<OrderInitialize>,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<Ack>;
}

export interface LifeCycle {
  StartEngine(
    data: StartEngineInput,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<StartEngineOutput>;
  StopEngine(
    data: StopEngineInput,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<StopEngineOutput>;
}
