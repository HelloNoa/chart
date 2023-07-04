import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

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

export enum status {
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  CANCELED = 'CANCELED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export class GetWithdrawListInputDto {
  @ApiProperty({
    example: Object.values(status),
    type: 'array',
    items: {
      type: typeof status,
    },
  })
  @IsEnum(status)
  status: string[];
}

export class GetWithdrawListOutputDto {
  @ApiProperty({
    example: 'COIN_ADDRESS',
    type: 'string',
  })
  to_address: string;

  @ApiProperty({
    example: '100',
    type: 'string',
  })
  amount: string;

  @ApiProperty({
    example: '0',
    type: 'string',
  })
  fee: string;

  @ApiProperty({
    example: 'SUBMITTED',
    type: 'string',
  })
  status: string;

  @ApiProperty({
    example: '2023-07-04T12:57:44.000Z',
    type: 'string',
  })
  created_at: string;

  @ApiProperty({
    example: '2023-07-04T12:57:44.000Z',
    type: 'string',
  })
  updated_at: string;

  @ApiProperty({
    example: 'WITHDRAWAL',
    type: 'string',
  })
  transfer_type: string;
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
