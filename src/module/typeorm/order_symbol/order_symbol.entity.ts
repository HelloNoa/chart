import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class order_symbol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;
}
