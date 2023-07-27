import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { order_symbol } from '../order_symbol/order_symbol.entity.js';

@Entity('order_matching_history')
export class order_matching_history {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'bigint' })
  user_id: number;

  @Column({ name: 'order_symbol_id', type: 'bigint' })
  order_symbol_id: number;

  @Column({ name: 'order_uuid', type: 'varchar' })
  order_uuid: string;

  @Column({ name: 'filled_quantity', type: 'decimal' })
  filled_quantity: string;

  @Column({ name: 'unit_price', type: 'decimal' })
  unit_price: string;

  @Column({ name: 'fee', type: 'decimal' })
  fee: string;

  @Column({ name: 'order_type', type: 'text' })
  order_type: 'BID' | 'ASK';

  @Column('timestamp')
  created_at: string;

  @Column('timestamp')
  updated_at: string;

  @ManyToOne(
    () => order_symbol,
    (order_symbol) => order_symbol.order_matching_history,
  )
  @JoinColumn({ name: 'order_symbol_id' })
  order_symbol: Relation<order_symbol>;
}
