import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { withdrawal_request } from './withdrawal_request.entity.js';
import { coin_transfer } from '../coin_transfer/coin_transfer.entity.js';
import { wallet } from '../wallet/wallet.entity.js';
import { coin } from '../coin/coin.entity.js';
import { status } from '../../../dto/wallet.client.dro.js';

@Injectable()
export class withdrawal_requestService {
  constructor(
    @Inject('WITHDRAWAL_REQUEST_REPOSITORY')
    private withdrawalRequestRepository: Repository<withdrawal_request>,
    @Inject('WITHDRAWAL_REQUEST_WRITE_REPOSITORY')
    private withdrawalRequestWriteRepository: Repository<withdrawal_request>,
  ) {}

  async findAll(): Promise<withdrawal_request[]> {
    return this.withdrawalRequestRepository.find();
  }

  async GetWithdrawalRequestListByUserId(
    userId: number,
    status: status[],
  ): Promise<any[]> {
    if (!Array.isArray(status)) status = [status];
    return this.withdrawalRequestRepository
      .createQueryBuilder('withdrawal_request')
      .select('withdrawal_request.to_address', 'to_address')
      .addSelect('withdrawal_request.amount', 'amount')
      .addSelect('withdrawal_request.fee', 'fee')
      .addSelect('withdrawal_request.status', 'status')
      .addSelect('ct.transfer_type', 'transfer_type')
      .addSelect('withdrawal_request.created_at', 'created_at')
      .addSelect('withdrawal_request.updated_at', 'updated_at')
      .leftJoin(
        coin_transfer,
        'ct',
        'ct.id = withdrawal_request.coin_transfer_id',
      )
      .leftJoin(wallet, 'w', 'w.id = ct.wallet_id')
      .leftJoin(coin, 'c', 'w.coin_id = c.id')
      .where('w.user_id = :userId', { userId })
      .andWhere('ct.transfer_type = :transferType', {
        transferType: 'WITHDRAWAL',
      })
      .andWhere('withdrawal_request.status in (:...status)', {
        status: [...status],
      })
      .getRawMany();
  }
}
