import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export type reason = 'CANCEL' | 'PLACE' | 'FILL';
@Entity()
export class order_book_difference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint')
  order_book_id: number;

  @Column('decimal')
  diff: string;

  @Column('varchar')
  reason: reason;

  @Column('timestamp')
  created_at: string;

  @Column('timestamp')
  updated_at: string;
}
