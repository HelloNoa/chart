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

  async getWalletByUsrId(
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
      let walletResult = await this.getWalletByUsrId(
        walletDto.user_id,
        walletDto.coin_id,
      );
      if (walletResult) {
        walletDto.id = walletResult.id;
        await this.walletRepository.save(walletDto).then(() => {
          updateResult = true;
        });
      }
    } catch (e) {
      updateResult = false;
    }
    return updateResult;
  }
}
