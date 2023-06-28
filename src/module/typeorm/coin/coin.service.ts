import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { coin } from './coin.entity.js';

@Injectable()
export class coinService {
  constructor(
    @Inject('COIN_REPOSITORY')
    private coinRepository: Repository<coin>,
    @Inject('COIN_WRITE_REPOSITORY')
    private coinWriteRepository: Repository<coin>,
  ) {}

  async findAll(): Promise<coin[]> {
    return this.coinRepository.find();
  }

  async getCoinByName(name: string): Promise<coin | null> {
    return this.coinRepository.findOne({
      where: {
        name: name,
      },
    });
  }
}
