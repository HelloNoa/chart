import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chart')
export class chart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_symbol_id' })
  orderSymbolId: number;

  @Column({ name: 'order_interval_id' })
  orderIntervalId: number;

  @Column({ name: 'open_price', type: 'decimal', precision: 30, scale: 4 })
  openPrice: number;

  @Column({ name: 'low_price', type: 'decimal', precision: 30, scale: 4 })
  lowPrice: number;

  @Column({ name: 'high_price', type: 'decimal', precision: 30, scale: 4 })
  highPrice: number;

  @Column({ name: 'close_price', type: 'decimal', precision: 30, scale: 4 })
  closePrice: number;

  @Column('text')
  volume: string;

  @Column('text')
  tradingValue: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
