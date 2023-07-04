import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  Relation,
  ManyToOne,
} from 'typeorm';
import { coin_transfer } from '../coin_transfer/coin_transfer.entity.js';
import { coin } from '../coin/coin.entity.js';

@Entity('wallet')
export class wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint')
  user_id: number;

  @Column({ name: 'coin_id', type: 'bigint' })
  coin_id: number;

  @Column('longtext')
  address: string;

  @Column('timestamp')
  created_at: string;

  @Column('timestamp')
  updated_at: string;

  @OneToMany(() => coin_transfer, (coin_transfer) => coin_transfer.wallet_id)
  @JoinColumn({ name: 'coin_transfer' })
  coin_transfer: Relation<coin_transfer>[];

  @ManyToOne(() => coin)
  @JoinColumn({ name: 'coin_id' })
  coin: Relation<coin>;
}
