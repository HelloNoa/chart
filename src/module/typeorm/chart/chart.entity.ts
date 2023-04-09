import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class chart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  order_symbol_id: number;

  @Column('decimal')
  interval: string;

  @Column('decimal')
  open_price: string;

  @Column('decimal')
  low_price: string;

  @Column('decimal')
  high_price: string;

  @Column('decimal')
  close_price: string;

  @Column('decimal')
  volume: string;

  @Column('datetime')
  created_at: string;

  @Column('datetime')
  updated_at: string;
}
