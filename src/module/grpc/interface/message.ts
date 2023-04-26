import { Timestamp } from './google.protobuf.timestamp.js';

export enum OrderType {
  BID = 0, // 구매 매수
  ASK = 1, // 판매 매도
}

export enum SymbolType {
  // BTCARB = 0,
  // BTCDOGE = 0,
  // BTCSOL = 0,
  // BTCSXP = 0,
  // BTCMANA = 0,
  // BTCETH = 0,
  // BTCSAND = 0,
  // BTCMLK = 0,
  // BTCETC = 0,
  // BTCAVAX = 0,
  // BTCSTX = 0,
  // BTCAPT = 0,
  // BTCHIVE = 0,
  // BTCAXS = 0,
  BTCADA = 0,
  // BTCMATIC = 0,
  // BTCSTEEM = 0,
  // BTCXRP = 0,
  // BTCSBD = 0,
  // BTCNEO = 0,
}

export enum Currency {
  BTC = 0,
  ADA = 1,
}

export interface Fee {
  Amount: number;
}

export interface AskCancellation {
  UserUUID: string;
  OrderUUID: string;
  RefundAmount: number;
  RefundCurrency: keyof typeof Currency;
  OrderType: keyof typeof OrderType;
  TotalQuantity: number;
  UnitPrice: number;
  Symbol: keyof typeof SymbolType;
  timestamp?: Timestamp;
}

export interface BidCancellation {
  UserUUID: string;
  OrderUUID: string;
  RefundAmount: number;
  RefundCurrency: keyof typeof Currency;
  OrderType: keyof typeof OrderType;
  TotalQuantity: number;
  UnitPrice: number;
  Symbol: keyof typeof SymbolType;
  timestamp?: Timestamp;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StopEngineInput {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StopEngineOutput {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StartEngineInput {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StartEngineOutput {}

export interface Ack {
  Success: boolean;
}

export interface Order {
  UserUUID: string;
  OrderUUID: string;
  Quantity: number;
  UnitPrice: number;
  OrderType: keyof typeof OrderType;
  Symbol: keyof typeof SymbolType;
  MakeTime?: Timestamp;
}

export interface LimitOrderBid {
  UserUUID: string;
  OrderUUID: string;
  Quantity: number;
  UnitPrice: number;
  OrderType: keyof typeof OrderType;
  Symbol: keyof typeof SymbolType;
  MakeTime?: Timestamp;
}

export interface LimitOrderAsk {
  UserUUID: string;
  OrderUUID: string;
  Quantity: number;
  UnitPrice: number;
  OrderType: keyof typeof OrderType;
  Symbol: keyof typeof SymbolType;
  MakeTime?: Timestamp;
}

export interface MarketOrderBid {
  UserUUID: string;
  OrderUUID: string;
  Quantity: number;
  OrderType: keyof typeof OrderType;
  Symbol: keyof typeof SymbolType;
  MakeTime?: Timestamp;
}

export interface MarketOrderAsk {
  UserUUID: string;
  OrderUUID: string;
  Quantity: number;
  OrderType: keyof typeof OrderType;
  Symbol: keyof typeof SymbolType;
  MakeTime?: Timestamp;
}

export interface OrderCancellation {
  UserUUID: string;
  OrderUUID: string;
}

export interface OrderCancellationFailed {
  UserUUID: string;
  OrderUUID: string;
  Msg: string;
}

export interface OrderFulfillment {
  UserUUID: string;
  OrderUUID: string;
  FilledQuantity: number;
  UnitPrice: number;
  Symbol: keyof typeof SymbolType;
  OrderType: keyof typeof OrderType;
  MakeTime?: Timestamp;
  TakeTime?: Timestamp;
  Fee: Fee;
}

export interface OrderInitialize {
  UserUUID: string;
  OrderUUID: string;
  Quantity: number;
  UnitPrice: number;
  Symbol: keyof typeof SymbolType;
  OrderType: keyof typeof OrderType;
  MakeTime?: Timestamp;
}

export interface OrderMatching {
  UnitPrice: number;
  Quantity: number;
  Timestamp?: Timestamp;
  OrderType: keyof typeof OrderType;
  Symbol: keyof typeof SymbolType;
}

export interface OrderMatchingFailed {
  UserUUID: string;
  OrderUUID: string;
  Quantity: number; // btceth => bid인 경우 btc : btc 소모해서 eth 구매, ask인 경우 eth : eth 소모해서 btc 구매
  OrderType: keyof typeof OrderType;
  Symbol: keyof typeof SymbolType;
  MakeTime?: Timestamp;
  Msg: string;
}

export interface OrderPartialFill {
  UserUUID: string;
  OrderUUID: string;
  TotalQuantity: number;
  FilledQuantity: number;
  UnitPrice: number;
  Symbol: keyof typeof SymbolType;
  OrderType: keyof typeof OrderType;
  MakeTime?: Timestamp;
  TakeTime?: Timestamp;
  Fee: Fee;
}

export interface OrderPlacement {
  UserUUID: string;
  OrderUUID: string;
  Quantity: number;
  UnitPrice: number;
  Symbol: keyof typeof SymbolType;
  OrderType: keyof typeof OrderType;
  MakeTime?: Timestamp;
}

export interface OrderPlacementFailed {
  UserUUID: string;
  OrderUUID: string;
  Msg: string;
}

export interface MarketOrderInput {
  UserUUID: string;
  OrderUUID: string;
  Quantity: number;
  OrderType: keyof typeof OrderType;
  Symbol: keyof typeof SymbolType;
  MakeTime?: Timestamp;
}

export interface MarketOrderOutput {
  Success: boolean;
}

export interface LimitOrderInput {
  UserUUID: string;
  OrderUUID: string;
  Quantity: number;
  UnitPrice: number;
  OrderType: keyof typeof OrderType;
  Symbol: keyof typeof SymbolType;
  MakeTime?: Timestamp;
}

export interface LimitOrderOutput {
  Success: boolean;
}
