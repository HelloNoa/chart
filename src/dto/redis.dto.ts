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

export const OrderSocketEvent = {
  sub: {
    //ping pong
    ping: 0,
    //uuid
    uuid: 1,
    //지정가 주문 등록 요청
    LimitOrder: 2,
    //시장가 주문 등록 요청
    MarketOrder: 3,
    //주문 등록 취소 요쳥
    CancelOrder: 4,
  },
  pub: {
    //ping pong
    pong: 0,
    //uuid
    uuid: 1,
    //주문 등록 실패
    OrderPlacementFailed: 2,
    //주문 등록 요청 성공
    OrderPlacement: 3,
    //주문 취소 실패
    OrderCancellationFailed: 4,
    //주문 실패 요청 성공
    OrderCancellation: 5,
  },
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

//주문 등록 실패
export enum E_OrderPlacementFailed {
  UserUUID = 0,
  OrderUUID = 1,
  Msg = 2,
}

//publish OrderPlacementFailed '{"UserID":"aaa","OrderUUID":"bbbb","Reason":"idk","Status":"helathy","Timestamp":"123"}'
export type OrderPlacementFailed = {
  UserUUID: string;
  OrderUUID: string;
  Msg: Reason;
};

//주문 등록 요청 성공
export enum E_OrderPlacement {
  UserUUID = 0,
  OrderUUID = 1,
  Quantity = 2,
  UnitPrice = 3,
  Symbol = 4,
  OrderType = 5,
  MakeTime = 6,
}

// //publish OrderPlacement '{"quantity":"0","price":"1","user_id":"aaa","order_uuid":"3","is_market":"4","timestamp":"5","side":"6","symbol":"7"}'
// export type OrderPlacement = {
//   UserUUID: string;
//   OrderUUID: string;
//   Quantity: number;
//   UnitPrice: number;
//   Symbol: Symbol;
//   OrderType: Side;
//   MakeTime: Date;
// };

//주문 취소 실패
export enum E_OrderCancellationFailed {
  UserUUID = 0,
  OrderUUID = 1,
  Msg = 2,
}

//publish OrderCancellationFailed '{"user_id":"aaa","order_uuid":"1","reason":"2","status":"3","timestamp":"4"}'
export type OrderCancellationFailed = {
  UserUUID: string;
  OrderUUID: string;
  Msg: Reason;
};

//주문 취소 요청 성공
export enum E_OrderCancellation {
  UserUUID = 0,
  OrderUUID = 1,
}

//publish OrderCancellation '{"user_id":"aaa","order_uuid":"1","timestamp":"2"}'
export type OrderCancellation = {
  UserUUID: string;
  OrderUUID: string;
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
  // ETH: 1,
  // ETC: 1,
  // MATIC: 1,
  LPT: 1_000_000_000_000_000_000,
  // MANA: 1,
  // AXS: 1,
  // AUDIO: 1,
  // SAND: 1,
  COMP: 1_000_000_000_000_000_000,
  LINK: 1_000_000_000_000_000_000,
  DYDX: 1_000_000_000_000_000_000,
  BNB: 1_000_000_000_000_000_000,
  OP: 1_000_000_000_000_000_000,
  // AVAX: 1,
  // ARB: 1,
  // BTC: 1,
};
