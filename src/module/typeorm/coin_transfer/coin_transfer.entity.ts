import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { withdrawal_request } from '../withdrawal_request/withdrawal_request.entity.js';
import { wallet } from '../wallet/wallet.entity.js';

@Entity('coin_transfer')
export class coin_transfer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'wallet_id', type: 'bigint' })
  wallet_id: number;
  @Column('decimal')
  amount: string;
  @Column({ name: 'transfer_type', type: 'text' })
  transfer_type: 'DEPOSIT' | 'WITHDRAWAL' | 'MAKE' | 'TAKE' | 'ADVANCE_PAYMENT';

  @Column('timestamp')
  created_at: string;

  @Column('timestamp')
  updated_at: string;

  @OneToMany(
    () => withdrawal_request,
    (withdrawal_request) => withdrawal_request.coin_transfer,
  )
  @JoinColumn({ name: 'withdrawal_request' })
  withdrawal_request: Relation<withdrawal_request>[];

  @ManyToOne(() => wallet)
  @JoinColumn({ name: 'wallet_id' })
  wallet: Relation<wallet>;
}
