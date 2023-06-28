import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  user_id: number;

  @Column('varchar')
  coin_id: number;

  @Column('longtext')
  address: string;

  @Column('timestamp')
  created_at: string;

  @Column('timestamp')
  updated_at: string
}
