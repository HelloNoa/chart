import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { withdrawal_request } from './withdrawal_request.entity.js';

@Injectable()
export class withdrawal_requestService {
  constructor(
    @Inject('WITHDRAWAL_REQUEST_REPOSITORY')
    private coinTransferRepository: Repository<withdrawal_request>,
    @Inject('WITHDRAWAL_REQUEST_WRITE_REPOSITORY')
    private blockchainWriteRepository: Repository<withdrawal_request>,
  ) {}

  async findAll(): Promise<withdrawal_request[]> {
    return this.coinTransferRepository.find();
  }

  // async getBlockchainIdByName(name: string): Promise<coin_transfer | null> {
  //   return this.blockchainRepository.findOne({
  //     where: {
  //       name: name,
  //     },
  //   });
  // }
}
