import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { order_matching_history } from '../order_matching_history/order_matching_history.entity.js';

@Entity('order_symbol')
export class order_symbol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64 })
  name: string;

  @OneToMany(
    () => order_matching_history,
    (order_matching_history) => order_matching_history.order_symbol,
  )
  @JoinColumn({ name: 'order_matching_history' })
  order_matching_history: Relation<order_matching_history>[];
}
