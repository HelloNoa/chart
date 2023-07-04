import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class withdrawal_request {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint')
  coin_transfer_id: number;

  @Column('longtext')
  to_address: string;

  @Column('longtext')
  amount: string;

  @Column('longtext')
  fee: string;

  @Column('longtext')
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
}
