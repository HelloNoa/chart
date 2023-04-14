import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class chart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint')
  order_symbol_id: number;

  @Column('bigint')
  order_interval_id: number;

  @Column('decimal')
  open_price: number;

  @Column('decimal')
  low_price: number;

  @Column('decimal')
  high_price: number;

  @Column('decimal')
  close_price: number;

  @Column('decimal')
  volume: number;

  @Column('datetime')
  created_at: string;

  @Column('datetime')
  updated_at: string;

  @Column('decimal')
  trading_value: number;
}
