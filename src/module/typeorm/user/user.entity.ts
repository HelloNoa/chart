import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class user {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  uuid: string;

  @Column('varchar')
  nice_di: string;

  @Column('longtext')
  google_sso_id: string;

  @Column('longtext')
  apple_sso_id: string;

  @Column('longtext')
  metaverse_sso_id: string;

  @Column('tinyint')
  is_email_user: number;

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
}
