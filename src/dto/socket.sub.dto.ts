import { OrderType, SymbolType } from '../module/grpc/interface/message.js';

export enum LimitOrder {
  UserUUID = 0,
  OrderUUID = 1,
  Quantity = 2,
  UnitPrice = 3,
  OrderType = 4,
  Symbol = 5,
  MakeTime = 6,
}
export enum MarketOrder {
  UserUUID = 0,
  OrderUUID = 1,
  Quantity = 2,
  OrderType = 3,
  Symbol = 4,
  MakeTime = 5,
}
export enum CancelOrder {
  UserUUID = 0,
  OrderUUID = 1,
  Symbol = 2,
  // timestamp= 1,
}

export interface LimitOrderReq {
  [LimitOrder.UserUUID]: string;
  // [LimitOrder.orderUUID]: string;
  [LimitOrder.Quantity]: number;
  [LimitOrder.UnitPrice]: number;
  [LimitOrder.OrderType]: keyof typeof OrderType;
  [LimitOrder.Symbol]: keyof typeof SymbolType;
  // [LimitOrder.timestamp]: Timestamp;
}

export interface MarketOrderReq {
  [MarketOrder.UserUUID]: string;
  // [MarketOrder.orderUUID]: string;
  [MarketOrder.Quantity]: number;
  [MarketOrder.OrderType]: keyof typeof OrderType;
  [MarketOrder.Symbol]: keyof typeof SymbolType;
  // [MarketOrder.timestamp]: Timestamp;
}
export interface CancelOrderReq {
  [CancelOrder.UserUUID]: string;
  [CancelOrder.OrderUUID]: string;
  [CancelOrder.Symbol]: keyof typeof SymbolType;
  // [CancelOrder.timestamp]: Timestamp;
}
