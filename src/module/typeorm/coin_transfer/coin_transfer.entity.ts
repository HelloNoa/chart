import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class coin_transfer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint')
  wallet_id: number;
  @Column('decimal')
  amount: string;
  @Column('decimal')
  transfer_type: 'DEPOSIT' | 'WITHDRAWAL' | 'MAKE' | 'TAKE' | 'ADVANCE_PAYMENT';

  @Column('timestamp')
  created_at: string;

  @Column('timestamp')
  updated_at: string;
}
