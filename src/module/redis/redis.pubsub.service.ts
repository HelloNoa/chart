import { Injectable } from '@nestjs/common';
import * as IORedis from 'ioredis';
import { RedisClusterService } from 'nestjs-redis-cluster';

@Injectable()
export class RedisPubSubService {
  private client: IORedis.Cluster;

  constructor(private readonly redisService: RedisClusterService) {
    this.client = this.redisService.getCluster('REDIS_SERVICE');
  }

  get Client() {
    return this.client;
  }

  onModuleInit() {
    console.log(`Created a redis service for ${this.client.status}`);
  }

  async publish(channel: string, message: any) {
    await this.client.publish(channel, JSON.stringify(message));
  }

  async subscribe(channel: string, callback: (message: any) => void) {
    this.client.subscribe(channel);
    this.client.on('message', (ch, message) => {
      if (ch === channel) {
        try {
          callback(JSON.parse(message));
        } catch (e) {
          callback(message);
        }
      }
    });
  }

  async setValue(key: string, value: any) {
    await this.client.set(key, JSON.stringify(value));
  }

  async getValue(key: string) {
    const value = await this.client.get(key);
    try {
      return JSON.parse(value as string);
    } catch (e) {
      return value;
    }
  }

  async getBalance(uuid: string, symbol: string) {
    const key = `${uuid}:${symbol}:balance`;
    const value = await this.client.get(key);
    try {
      return JSON.parse(value as string);
    } catch (e) {
      return value;
    }
  }

  async deleteValue(key: string) {
    await this.client.del(key);
  }
}
