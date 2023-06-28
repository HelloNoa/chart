import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class coin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint')
  blockchain_id: number;

  @Column('longtext')
  name: string;

  @Column('timestamp')
  created_at: string;

  @Column('timestamp')
  updated_at: string;
}
