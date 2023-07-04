import { ApiProperty } from '@nestjs/swagger';

export class WithdrawInputDto {
  @ApiProperty({
    example: 1,
    description: 'ETH',
    required: true,
  })
  coinId: E_CoinId;
  @ApiProperty({
    example: 'COIN_ADDRESS',
    description: 'to',
    required: true,
  })
  to: string;
  @ApiProperty({
    example: 100,
    description: 'amount',
    required: true,
  })
  amount: string;
}

export class WithdrawOutputDto {
  @ApiProperty({
    example: true,
    description: 'success',
    required: true,
  })
  success: boolean;
}

export enum E_CoinId {
  ETH = 1,
  ETC = 2,
  MATIC = 3,
  XRP = 4,
  SOL = 5,
  APT = 6,
  MLK = 7,
  STX = 8,
  DOGE = 10,
  MANA = 11,
  SXP = 12,
  AXS = 13,
  AVAX = 14,
  AUDIO = 15,
  ARB = 16,
  HIVE = 17,
  ADA = 18,
  SBD = 19,
  STEEM = 20,
  SAND = 21,
  BTC = 22,
  OP = 23,
  BNB = 24,
  LPT = 25,
  COMP = 26,
  DYDX = 27,
  LINK = 28,
}
