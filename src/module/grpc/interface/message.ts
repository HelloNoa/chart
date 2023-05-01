import { Timestamp } from './google.protobuf.timestamp.js';

export enum OrderType {
  BID = 0, // 구매 매수
  ASK = 1, // 판매 매도
}

export enum SymbolType {
  BTCADA = 0,
  BTCAPT = 1,
  BTCARB = 2,
  BTCAUDIO = 3,
  BTCAVAX = 4,
  BTCAXS = 5,
  BTCETH = 6,
  BTCETC = 7,
  BTCDOGE = 8,
  BTCHIVE = 9,
  BTCMANA = 10,
  BTCMATIC = 11,
  BTCMLK = 12,
  BTCSAND = 13,
  BTCSBD = 14,
  BTCSOL = 15,
  BTCSTX = 16,
  BTCSXP = 17,
  BTCXRP = 18,
  BTCSTEEM = 19,
}

export enum Currency {
  BTC = 0,
  ADA = 1,
  APT = 2,
  ARB = 3,
  AUDIO = 4,
  AVAX = 5,
  AXS = 6,
  ETH = 7,
  ETC = 8,
  DOGE = 9,
  HIVE = 10,
  MANA = 11,
  MATIC = 12,
  MLK = 13,
  SAND = 14,
  SBD = 15,
  SOL = 16,
  STX = 17,
  SXP = 18,
  XRP = 19,
  STEEM = 20,
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

export interface OrderMatchingEvent {
  UnitPrice: number;
  Quantity: number;
  Timestamp?: Timestamp;
  OrderType: keyof typeof OrderType;
  Symbol: keyof typeof SymbolType;
}

export interface BalanceUpdate {
  UserUUID: string;
  Diff: number;
  Currency: keyof typeof Currency;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StopEngineInput {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StopEngineOutput {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StartEngineInput {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StartEngineOutput {}
