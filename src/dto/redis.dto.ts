// eslint-disable @typescript-eslint/ban-types
import { ApiProperty } from '@nestjs/swagger';

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
};
export const socketEvent = {
  sub: {
    //ping pong
    ping: 0,
    //차트 구독
    ChartSubscriber: 1,
  },
  pub: {
    //ping pong
    pong: 0,
    //tradeEvent for chartdraw 차트 구독
    OrderMatching: 1,
    //업비트 BTC 원화 가격 Subscribe
    UpbitBTCPrice: 2,
    //차트 구독
    ChartSubscriber: 3,
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

type Side = string;
type Symbol = string;
type Reason = string;
type Status = string;
type Currency = string;
// type Interval = string;
type Fee = {
  Amount: number;
  Currency: Currency;
};

//rlawodnjs ssg dlaudrl gksghk
