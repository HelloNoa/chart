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
    data: OrderPlacement,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<Ack>;

  OrderPlacementFailedEvent(
    data: OrderPlacementFailed,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<Ack>;

  OrderCancellationEvent(
    data: OrderCancellation,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<Ack>;

  OrderCancellationFailedEvent(
    data: OrderCancellationFailed,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<Ack>;

  OrderMatchingEvent(
    data: OrderMatching,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<Ack>;

  OrderMatchingFailedEvent(
    data: OrderMatchingFailed,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<Ack>;

  OrderPartialFillEvent(
    data: OrderPartialFill,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<Ack>;

  OrderFulfillmentEvent(
    data: OrderFulfillment,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<Ack>;

  OrderInitializeEvent(
    data: OrderInitialize,
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
