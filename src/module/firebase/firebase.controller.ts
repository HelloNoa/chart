import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FirebaseService } from './firebase.service.js';
import {
  SendNotificationRequestDto,
  SendNotificationResponseDto,
} from '../../dto/firebase.dto.js';

@Controller('firebase')
@ApiTags('FIREBASE')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('notify')
  @ApiBody({ type: SendNotificationRequestDto })
  @ApiResponse({
    type: SendNotificationResponseDto,
    description: '요청 완료',
    status: 200,
  })
  async sendNotification(
    @Body('registrationToken') registrationToken: string,
    @Body('payload') payload: any,
    @Res() res: any,
  ): Promise<void> {
    payload = JSON.parse(payload);
    const response = await this.firebaseService.sendNotification(
      registrationToken,
      payload,
    );
    res.send(response);
  }
  @Post('notifyAll')
  @ApiBody({ type: SendNotificationRequestDto })
  @ApiResponse({
    type: SendNotificationResponseDto,
    description: '요청 완료',
    status: 200,
  })
  async sendNotificationAll(
    @Body('registrationToken') registrationToken: string,
    @Body('payload') payload: any,
    @Res() res: any,
  ): Promise<void> {
    payload = JSON.parse(payload);
    const response = await this.firebaseService.sendNotification(
      registrationToken,
      payload,
    );
    res.send(response);
  }
}
