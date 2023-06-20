import { ApiProperty } from '@nestjs/swagger';

export class SendNotificationRequestDto {
  @ApiProperty({
    example: 'registrationToken',
    description: 'registrationToken',
    required: true,
  })
  public registrationToken: string;
  @ApiProperty({
    example:
      '{"notification":{"title":"테스트 발송","body":"앱 확인해보세요!"},"data":{"key1":"value1","key2":"value2"}}',
    description: 'payload',
    required: true,
  })
  public payload: string;
}

export class SendNotificationResponseDto {
  @ApiProperty({
    example: true,
    description: 'success',
    required: true,
  })
  success: boolean;
}
