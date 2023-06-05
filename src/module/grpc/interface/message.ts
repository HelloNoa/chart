import { Timestamp } from './google.protobuf.timestamp.js';

export enum OrderType {
  ORDER_NIL = 0,
  BID = 1, // 구매 매수
  ASK = 2, // 판매 매도
}

export enum SymbolType {
  SYMBOL_NIL = 0,
  BTCADA = 1,
  BTCAPT = 2,
  BTCARB = 3,
  BTCAUDIO = 4,
  BTCAVAX = 5,
  BTCAXS = 6,
  BTCETH = 7,
  BTCETC = 8,
  BTCDOGE = 9,
  BTCHIVE = 10,
  BTCMANA = 11,
  BTCMATIC = 12,
  BTCMLK = 13,
  BTCSAND = 14,
  BTCSBD = 15,
  BTCSOL = 16,
  BTCSTX = 17,
  BTCSXP = 18,
  BTCXRP = 19,
  BTCSTEEM = 20,
}

export const SymbolLength = Object.keys(SymbolType).length / 2 - 2;

export const CurrencyLength = 21;

export enum Currency {
  CURRENCY_NIL = 0,
  BTC = 1,
  ADA = 2,
  APT = 3,
  ARB = 4,
  AUDIO = 5,
  AVAX = 6,
  AXS = 7,
  ETH = 8,
  ETC = 9,
  DOGE = 10,
  HIVE = 11,
  MANA = 12,
  MATIC = 13,
  MLK = 14,
  SAND = 15,
  SBD = 16,
  SOL = 17,
  STX = 18,
  SXP = 19,
  XRP = 20,
  STEEM = 21,
}

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

export interface GetOrderBookOutput {
  bids: Order[];
  asks: Order[];
}
