import { Timestamp } from './google.protobuf.timestamp.js';

export enum OrderType {
  ORDER_NIL = 0,
  BID = 1, // 구매 매수
  ASK = 2, // 판매 매도
}

export enum SymbolType {
  SYMBOL_NIL = 0,
  BTCETH = 1,
  BTCETC = 2,
  BTCMATIC = 3,
  BTCLPT = 4,
  BTCMANA = 5,
  BTCAXS = 6,
  BTCAUDIO = 7,
  BTCSAND = 8,
  BTCCOMP = 9,
  BTCLINK = 10,
  BTCDYDX = 11,
  BTCBNB = 12,
  BTCOP = 13,
  BTCAVAX = 14,
  BTCARB = 15,
}

export const SymbolLength = Object.keys(SymbolType).length / 2 - 1;

export enum Currency {
  CURRENCY_NIL = 0,
  ETH = 1,
  ETC = 2,
  MATIC = 3,
  LPT = 4,
  MANA = 5,
  AXS = 6,
  AUDIO = 7,
  SAND = 8,
  COMP = 9,
  LINK = 10,
  DYDX = 11,
  BNB = 12,
  OP = 13,
  AVAX = 14,
  ARB = 15,
  BTC = 16,
}

export const CurrencyLength = Object.keys(Currency).length / 2 - 1;

export interface Fee {
  Amount: number;
}

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

export interface OrderCancelled {
  UserUUID: string;
  OrderUUID: string;
  Quantity: number;
  UnitPrice: number;
  OrderType: keyof typeof OrderType;
  Symbol: keyof typeof SymbolType;
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
  Symbol: SymbolType;
  OrderType: OrderType;
  MakeTime: Timestamp;
  TakeTime: Timestamp;
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
  Symbol: SymbolType;
  OrderType: OrderType;
  MakeTime: Timestamp;
  TakeTime: Timestamp;
  Fee: Fee;
}

export interface OrderPlacement {
  UserUUID: string;
  OrderUUID: string;
  Quantity: number;
  UnitPrice: number;
  Symbol: keyof typeof SymbolType;
  OrderType: keyof typeof OrderType;
  MakeTime: Timestamp;
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
  MakeTime: Timestamp;
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
  MakeTime: Timestamp;
}

export interface LimitOrderOutput {
  Success: boolean;
}

export interface OrderMatchingEvent {
  UnitPrice: number;
  Quantity: number;
  Timestamp: Timestamp;
  OrderType: OrderType;
  Symbol: SymbolType;
}

export enum Reason {
  ADVANCE_PAYMENT = 0,
  DEPOSIT = 1,
  WITHDRAWAL = 2,
  MAKE = 3,
  TAKE = 4,
  REFUND = 5,
}

export interface BalanceUpdate {
  UserUUID: string;
  Diff: number;
  Currency: Currency;
  Reason: Reason;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StopEngineInput {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StopEngineOutput {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StartEngineInput {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StartEngineOutput {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetOrderBookInput {}

export interface BidAsk {
  bid: Order;
  ask: Order;
}

export interface OrderBookData {
  Price: number;
  Volume: number;
}

export interface GetOrderBookOutput {
  bids: OrderBookData[];
  asks: OrderBookData[];
}

export interface PushOrderBookInput {
  symbol: SymbolType;
}
