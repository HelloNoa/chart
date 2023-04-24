import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class order_matching_event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint')
  order_symbol_id: number;

  @Column('bigint')
  order_interval_id: number;

  @Column('decimal')
  unit_price: number;

  @Column('varchar')
  order_type: string;

  @Column('decimal')
  quantity: number;

  @Column('timestamp')
  created_at: string;

  @Column('timestamp')
  updated_at: string;
}
