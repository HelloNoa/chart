import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FinexblockServer } from '../../database/entities/finexblock-server.entity.js';
import { FinexblockServerIp } from '../../database/entities/finexblock-server-ip.entity.js';

@Injectable()
export class FinexblockService {
  constructor(
    @Inject('FINEXBLOCK_SERVER_REPOSITORY')
    private readonly finexblockServerRepository: Repository<FinexblockServer>,
    @Inject('FINEXBLOCK_SERVER_IP_REPOSITORY')
    private readonly finexblockServerIpRepository: Repository<FinexblockServerIp>,
  ) {}

  async isValidServerIP(ip: string): Promise<boolean> {
    const serverIp = await this.finexblockServerIpRepository.findOne({
      where: {
        ip: ip,
      },
    });
    return !!serverIp; // If serverIp is found, it returns true. Otherwise, it returns false.
  }

  async findAll(): Promise<FinexblockServerIp[]> {
    return this.finexblockServerIpRepository.find();
  }
}
