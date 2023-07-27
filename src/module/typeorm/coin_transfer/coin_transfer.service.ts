import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { coin_transfer } from './coin_transfer.entity.js';

@Injectable()
export class coin_transferService {
  constructor(
    @Inject('COIN_TRANSFER_REPOSITORY')
    private coinTransferRepository: Repository<coin_transfer>,
    @Inject('COIN_TRANSFER_WRITE_REPOSITORY')
    private blockchainWriteRepository: Repository<coin_transfer>,
  ) {}

  async findAll(): Promise<coin_transfer[]> {
    return this.coinTransferRepository.find();
  }

  async insertCoinTransferInfo(coinTransfer: coin_transfer): Promise<boolean> {
    let updateResult = false;
    try {
      await this.blockchainWriteRepository
        .insert(coinTransfer)
        .then(() => {
          updateResult = true;
        })
        .catch((e) => {
          console.error(e);
        });
    } catch (e) {
      updateResult = false;
    }
    return updateResult;
  }
}
