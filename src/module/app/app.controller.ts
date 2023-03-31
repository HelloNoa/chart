import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service.js';

@Controller('')
@ApiTags('APP')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get([''])
  @ApiOperation({ summary: 'Health Check' })
  getHealth(): string {
    return this.appService.getHealth();
  }
}
