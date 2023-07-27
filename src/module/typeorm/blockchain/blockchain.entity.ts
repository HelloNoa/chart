import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  Relation,
} from 'typeorm';
import { coin } from '../coin/coin.entity.js';

@Entity('blockchain')
export class blockchain {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('longtext')
  name: string;

  @Column('timestamp')
  created_at: string;

  @Column('timestamp')
  updated_at: string;

  @OneToMany(() => coin, (coin) => coin.blockchain)
  @JoinColumn({ name: 'coin' })
  coin: Relation<coin>[];
}
