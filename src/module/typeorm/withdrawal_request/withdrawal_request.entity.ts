import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { coin_transfer } from '../coin_transfer/coin_transfer.entity.js';

@Entity('withdrawal_request')
export class withdrawal_request {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'coin_transfer_id', type: 'bigint' })
  coin_transfer_id: number;

  @Column({ name: 'to_address', type: 'longtext' })
  to_address: string;

  @Column('longtext')
  amount: string;

  @Column({ name: 'fee', type: 'longtext' })
  fee: string;

  @Column({ name: 'status', type: 'longtext' })
  status:
    | 'SUBMITTED'
    | 'APPROVED'
    | 'CANCELED'
    | 'REJECTED'
    | 'PENDING'
    | 'COMPLETED'
    | 'FAILED';

  @Column('timestamp')
  created_at: string;

  @Column('timestamp')
  updated_at: string;

  @ManyToOne(() => coin_transfer)
  @JoinColumn({ name: 'coin_transfer_id' })
  coin_transfer: Relation<coin_transfer>;
}
