import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import {
  Ack,
  BalanceUpdate,
  GetOrderBookInput,
  GetOrderBookOutput,
  LimitOrderInput,
  MarketOrderInput,
  MarketOrderMatching,
  OrderCancellation,
  OrderCancellationFailed,
  OrderCancelled,
  OrderFulfillment,
  OrderInitialize,
  OrderMatching,
  OrderMatchingFailed,
  OrderPartialFill,
  OrderPlacement,
  OrderPlacementFailed,
} from './message.js';

export interface MarketOrder {
  MarketOrderInit(
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
    data: OrderCancelled,
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

  BalanceUpdateEvent(
    data: BalanceUpdate,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<Ack>;

  MarketOrderMatchingEvent(
    data: MarketOrderMatching,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<Ack>;
}

export interface OrderBook {
  GetOrderBook(
    data: GetOrderBookInput,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<GetOrderBookOutput>;
}
