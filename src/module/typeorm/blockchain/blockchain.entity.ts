import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class blockchain {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('longtext')
  name: string;

  @Column('timestamp')
  created_at: string;

  @Column('timestamp')
  updated_at: string;
}
