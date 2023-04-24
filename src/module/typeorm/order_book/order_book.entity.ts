import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export type status = 'CANCELLED' | 'PLACED' | 'FULFILLED' | 'PARTIAL_FILLED';
export type OrderType = 'BID' | 'ASK';

@Entity()
export class order_book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint')
  order_symbol_id: number;

  @Column('varchar')
  user_id: number;

  @Column('varchar')
  order_uuid: string;

  @Column('varchar')
  status: status;

  @Column('decimal')
  quantity: string;

  @Column('decimal')
  unit_price: string;

  @Column('varchar')
  order_type: OrderType;

  @Column('timestamp')
  created_at: string;

  @Column('timestamp')
  updated_at: string;
}
