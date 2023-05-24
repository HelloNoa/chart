import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { FinexblockServer } from './finexblock-server.entity.js';

@Entity('finexblock_server_ip')
export class FinexblockServerIp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  ip: string;

  @Column()
  server_id: number;

  @ManyToOne(() => FinexblockServer, (server) => server.ip)
  @JoinColumn({ name: 'server_id' })
  server: Relation<FinexblockServer>;
}
