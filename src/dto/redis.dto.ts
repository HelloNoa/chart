// eslint-disable @typescript-eslint/ban-types
import { ApiProperty } from '@nestjs/swagger';
import { Currency } from '../module/grpc/interface/message.js';

export class CreateCatDto {
  @ApiProperty({
    example: 'foo',
    description: 'key',
    required: true,
  })
  key: string;
  @ApiProperty({
    example: 'bar',
    description: 'value',
    required: true,
  })
  value: string;
}

export const channel = {
  //tradeEvent for chartdraw 차트 구독
  OrderMatchingChannel: 'OrderMatchingChannel',
  //주문 등록 요청 성공
  OrderPlacementChannel: 'OrderPlacementChannel',
  //주문 취소 요청 성공
  OrderCancellationChannel: 'OrderCancellationChannel',
};

export const OrderFillSocketEvent = {
  sub: {
    //ping pong
    ping: 0,
    //uuid
    uuid: 1,
  },
  pub: {
    //ping pong
    pong: 0,
    //uuid
    uuid: 1,
    //부분 체결 이벤트
    OrderPartialFill: 2,
    //전체 체결 이벤트
    OrderFulfillment: 3,
  },
};
export const BalanceSocketEvent = {
  sub: {
    //ping pong
    ping: 0,
    //uuid
    uuid: 1,
  },
  pub: {
    //ping pong
    pong: 0,
    //uuid
    uuid: 1,
    //유저 잔고 변경 이벤트
    BalanceUpdate: 2,
  },
};

export const socketEvent = {
  sub: {
    //ping pong
    ping: 0,
    //uuid
    uuid: 1,
    //차트 구독
    ChartSubscriber: 2,
    //호가창 구독
    OrderBookSubscriber: 3,
  },
  pub: {
    //ping pong
    pong: 0,
    //uuid
    uuid: 1,
    //tradeEvent for chartdraw 차트 구독
    OrderMatching: 2,
    //업비트 BTC 원화 가격 Subscribe
    UpbitBTCPrice: 3,
    //차트 구독
    ChartSubscriber: 4,
    //호가창 구독
    OrderBookSubscriber: 5,
    //호가창 front에 pub
    OrderBook: 6,
    Ticker: 7,
  },
};

export enum RedisDB {
  RefreshToken = 0,
  PubSub = 1,
  Account = 2,
  AccountLock = 3,
  Order = 4,
  OrderLock = 5,
}

export enum E_OrderMatching {
  UnitPrice = 0,
  Quantity = 1,
  Timestamp = 2,
  OrderType = 3,
  Symbol = 4,
}

export type OrderMatching = {
  UnitPrice: number;
  Quantity: number;
  Timestamp: Date;
  OrderType: Side;
  Symbol: Symbol;
};

export enum E_BalanceUpdate {
  UserUUID = 0,
  Diff = 1,
  Currency = 2,
}

export type BalanceUpdate = {
  UserUUID: string;
  Currency: Currency;
};
//부분 체결 이벤트
export enum E_OrderPartialFill {
  UserUUID = 0,
  OrderUUID = 1,
  TotalQuantity = 2,
  FilledQuantity = 3,
  UnitPrice = 4,
  Symbol = 5,
  OrderType = 6,
  MakeTime = 7,
  TakeTime = 8,
  Fee = 9,
}

//publish OrderPartialFill '{"quantity":"0","price":"1","filled_quantity":"2","filled_price":"3","user_id":"aaa","order_uuid":"5","side":"6","symbol":"7","timestamp":"8","fee":"9"}'
export type OrderPartialFill = {
  UserUUID: string;
  OrderUUID: string;
  TotalQuantity: number;
  FilledQuantity: number;
  UnitPrice: number;
  Symbol: Symbol;
  OrderType: Side;
  MakeTime: Date;
  TakeTime: Date;
  Fee: Fee;
};

//체결 이벤트
export enum E_OrderFulfillment {
  UserUUID = 0,
  OrderUUID = 1,
  FilledQuantity = 3,
  UnitPrice = 4,
  Symbol = 5,
  OrderType = 6,
  MakeTime = 7,
  TakeTime = 8,
  Fee = 9,
}

//publish OrderFulfillment '{"quantity":"0","price":"1","filled_quantity":"2","filled_price":"3","user_id":"aaa","order_uuid":"5","side":"6","symbol":"7","timestamp":"8","fee":"9"}'
export type OrderFulfillment = {
  UserUUID: string;
  OrderUUID: string;
  FilledQuantity: number;
  UnitPrice: number;
  Symbol: Symbol;
  OrderType: Side;
  MakeTime: Date;
  TakeTime: Date;
  Fee: Fee;
};

type Side = string;
type Symbol = string;
type Reason = string;
type Status = string;
// type Interval = string;
type Fee = {
  Amount: number;
  Currency: Currency;
};

//rlawodnjs ssg dlaudrl gksghk

export const DECIMAL: { [key: string]: number } = {
  BTC: 100_000_000,
  ADA: 1_000_000,
  SXP: 1_000_000_000_000_000_000,
  STX: 1_000_000_000_000_000_000,
  STEEM: 1_000,
  SOL: 1_000_000_000,
  SAND: 1_000_000_000_000_000_000,
  MANA: 1_000_000_000_000_000_000,
  ETH: 1_000_000_000_000_000_000,
  ETC: 1_000_000_000_000_000_000,
  DOGE: 100_000_000,
  AXS: 1_000_000_000_000_000_000,
  AVAX: 1_000_000_000_000_000_000,
  AUDIO: 1_000_000_000_000_000_000,
  ARB: 1_000_000_000_000_000_000,
  APT: 100_000_000,
  XRP: 1_000_000,
  SBD: 1_000,
  MLK: 1_000_000_000_000_000_000,
  MATIC: 1_000_000_000_000_000_000,
  HIVE: 1_000,
};
