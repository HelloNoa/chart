import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { wallet } from './wallet.entity.js';

@Injectable()
export class walletService {
  constructor(
    @Inject('WALLET_REPOSITORY')
    private walletRepository: Repository<wallet>,
    @Inject('WALLET_WRITE_REPOSITORY')
    private walletWriteRepository: Repository<wallet>,
  ) {}

  async findAll(): Promise<wallet[]> {
    return this.walletRepository.find();
  }

  async getWalletByUserId(
    user_id: number,
    coin_id: number,
  ): Promise<wallet | null> {
    return this.walletRepository.findOne({
      where: {
        user_id: user_id,
        coin_id: coin_id,
      },
    });
  }

  async upsertWalletInfo(walletDto: wallet): Promise<boolean> {
    let updateResult = false;
    try {
      const walletResult = await this.getWalletByUserId(
        walletDto.user_id,
        walletDto.coin_id,
      );
      if (walletResult) {
        walletDto.id = walletResult.id;
        await this.walletWriteRepository.save(walletDto).then(() => {
          updateResult = true;
        });
      }
    } catch (e) {
      updateResult = false;
    }
    return updateResult;
  }
}
