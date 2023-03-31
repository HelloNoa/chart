import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RedisPubSubService } from './redis.pubsub.service.js';
import { MessagePattern } from '@nestjs/microservices';
import { CreateCatDto } from '../../dto/redis.dto.js';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('redis')
@ApiTags('REDIS')
export class RedisPubSubController {
  constructor(private readonly redisPubSubService: RedisPubSubService) {}

  @MessagePattern({ cmd: 'greeting' })
  getGreetingMessage(name: string): string {
    return `Hello ${name}`;
  }

  @Get('getValue/:key')
  @ApiOperation({ summary: 'Redis get key' })
  async getValue(@Param('key') key: string) {
    const data = await this.redisPubSubService.getValue(key);
    return data ? data.toString() : '';
  }

  @Post('setValue')
  @ApiOperation({ summary: 'Redis set key' })
  @ApiBody({
    type: CreateCatDto,
    description: 'key value',
  })
  async setValue(@Body() createCatDto: CreateCatDto) {
    await this.redisPubSubService.setValue(
      createCatDto.key,
      createCatDto.value,
    );
    return 'ok';
  }

  @Delete('deleteValue/:key')
  @ApiOperation({ summary: 'Redis del key' })
  async deleteValue(@Param('key') key: string) {
    await this.redisPubSubService.deleteValue(key);
    return 'ok';
  }

  @Get()
  @ApiOperation({ summary: 'Redis subscribe channel' })
  async getAllMessages() {
    const messages: any[] = [];
    await this.redisPubSubService.subscribe('messages', (message) => {
      messages.push(message);
    });
    return messages;
  }

  @Get('create')
  @ApiOperation({ summary: 'Redis publish channel' })
  async createMessage() {
    await this.redisPubSubService.publish('messages', {
      text: 'Hello, world!',
      createdAt: new Date(),
    });
    return 'Message created.';
  }
}
