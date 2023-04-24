import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class user {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  nice_di: string;

  @Column('varchar')
  uuid: string;

  @Column('varchar')
  user_type: string;

  @Column('tinyint')
  is_block: number;

  @Column('timestamp')
  created_at: string;

  @Column('timestamp')
  updated_at: string;

  @Column('timestamp')
  deleted_at: string;

  @Column('tinyint')
  is_email_user: number;

  @Column('varchar')
  nice_ci: string;
}
