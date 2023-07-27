import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  Relation,
  ManyToOne,
} from 'typeorm';
import { wallet } from '../wallet/wallet.entity.js';
import { blockchain } from '../blockchain/blockchain.entity.js';

@Entity('coin')
export class coin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'blockchain_id', type: 'bigint' })
  blockchain_id: number;

  @Column('longtext')
  name: string;

  @Column('timestamp')
  created_at: string;

  @Column('timestamp')
  updated_at: string;

  @OneToMany(() => wallet, (wallet) => wallet.coin)
  @JoinColumn({ name: 'wallet' })
  wallet: Relation<wallet>[];

  @ManyToOne(() => blockchain)
  @JoinColumn({ name: 'blockchain_id' })
  blockchain: Relation<blockchain>;
}
