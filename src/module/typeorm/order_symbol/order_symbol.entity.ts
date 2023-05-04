import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('order_symbol')
export class order_symbol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64 })
  name: string;
}
