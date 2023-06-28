import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { wallet } from './wallet.entity.js';

@Injectable()
export class walletService {
  constructor(
    @Inject('WALLET_REPOSITORY')
    private walletRepository: Repository<wallet>,
  ) {}

  async findAll(): Promise<wallet[]> {
    return this.walletRepository.find();
  }

}