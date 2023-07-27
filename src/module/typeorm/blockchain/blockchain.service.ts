import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { blockchain } from './blockchain.entity.js';

@Injectable()
export class blockchainService {
  constructor(
    @Inject('BLOCKCHAIN_REPOSITORY')
    private blockchainRepository: Repository<blockchain>,
    @Inject('BLOCKCHAIN_WRITE_REPOSITORY')
    private blockchainWriteRepository: Repository<blockchain>,
  ) {}

  async findAll(): Promise<blockchain[]> {
    return this.blockchainRepository.find();
  }

  async getBlockchainIdByName(name: string): Promise<blockchain | null> {
    return this.blockchainRepository.findOne({
      where: {
        name: name,
      },
    });
  }
}
