import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FinexblockServerIp } from './finexblock-server-ip.entity.js';

@Entity('finexblock_server')
export class FinexblockServer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @OneToMany(() => FinexblockServerIp, (ip) => ip.server)
  ip: FinexblockServerIp[];
}
