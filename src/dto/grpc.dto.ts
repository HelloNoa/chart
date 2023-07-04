import { ApiProperty } from '@nestjs/swagger';
import { OrderType, SymbolType } from '../module/grpc/interface/message.js';

export class LimitOrderInputDto {
  @ApiProperty({
    example: 'uuid',
    description: 'userUUID',
    required: true,
  })
  public UserUUID: string;
  // @ApiProperty({
  //   example: 'orderUUID',
  //   description: 'orderUUID',
  //   required: false,
  // })
  // public OrderUUID: string;
  @ApiProperty({
    example: 1,
    description:
      'btceth => bid인 경우 btc : btc 소모해서 eth 구매, ask인 경우 eth : eth 소모해서 btc 구매',
    required: true,
  })
  public Quantity: number; // btceth => bid인 경우 btc : btc 소모해서 eth 구매, ask인 경우 eth : eth 소모해서 btc 구매
  @ApiProperty({
    example: 0.5,
    description:
      'btceth => bid인 경우 price(eth 가격), quantity(eth 수량) : eth를 price 가격에 quantity만큼 사겠다.',
    required: true,
  })
  public UnitPrice: number; // btceth => bid인 경우 price(eth 가격), quantity(eth 수량) : eth를 price 가격에 quantity만큼 사겠다.
  @ApiProperty({
    example: 'BID',
    description: 'BID , ASK',
    required: true,
  })
  public OrderType: keyof typeof OrderType; // bid or ask
  @ApiProperty({
    example: 'BTCADA',
    description: 'BTCADA',
    required: true,
  })
  public Symbol: keyof typeof SymbolType; // btceth
  // @ApiProperty({
  //   example: 'timestamp',
  //   description: 'timestamp',
  //   required: false,
  // })
  // public MakeTime: Timestamp;
}

export class LimitOrderOutputDto {
  @ApiProperty({
    example: true,
    description: 'success',
    required: true,
  })
  success: boolean;
}

export class MarketOrderInputDto {
  @ApiProperty({
    example: 'uuid',
    description: 'userUUID',
    required: true,
  })
  public UserUUID: string;
  // @ApiProperty({
  //   example: 'orderUUID',
  //   description: 'orderUUID',
  //   required: false,
  // })
  // public OrderUUID: string;
  @ApiProperty({
    example: 1,
    description:
      'btceth => bid인 경우 btc : btc 소모해서 eth 구매, ask인 경우 eth : eth 소모해서 btc 구매',
    required: true,
  })
  public Quantity: number; // btceth => bid인 경우 btc : btc 소모해서 eth 구매, ask인 경우 eth : eth 소모해서 btc 구매
  @ApiProperty({
    example: 'BID',
    description: 'BID = 0 or ASK = 1',
    required: true,
  })
  public OrderType: keyof typeof OrderType; // bid or ask
  @ApiProperty({
    example: 'BTCADA',
    description: 'BTCADA',
    required: true,
  })
  public Symbol: keyof typeof SymbolType; // btceth
  // @ApiProperty({
  //   example: 'timestamp',
  //   description: 'timestamp',
  //   required: false,
  // })
  // public MakeTime: Timestamp;
}

export class MarketOrderOutputDto {
  @ApiProperty({
    example: true,
    description: 'success',
    required: true,
  })
  success: boolean;
}

export class OrderCancellationInputDto {
  @ApiProperty({
    example: 'UserUUID',
    description: 'UserUUID',
    required: false,
  })
  public UserUUID: string;

  @ApiProperty({
    example: 'orderUUID',
    description: 'orderUUID',
    required: false,
  })
  public OrderUUID: string;
  @ApiProperty({
    example: 'BTCADA',
    description: 'Symbol',
    required: false,
  })
  public Symbol: keyof typeof SymbolType;
  // @ApiProperty({
  //   example: 'timestamp',
  //   description: 'timestamp',
  //   required: false,
  // })
  // public timestamp: Timestamp;
}

export class OrderCancellationOutputDto {
  @ApiProperty({
    example: true,
    description: 'success',
    required: true,
  })
  success: boolean;
}
