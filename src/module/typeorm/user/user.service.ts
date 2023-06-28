import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { user } from './user.entity.js';

@Injectable()
export class userService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<user>,
  ) {}

  async findAll(): Promise<user[]> {
    return this.userRepository.find();
  }

  async getUserId(uuid: string): Promise<number | null> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          uuid, 
        },
      });
      if (user === null) {
        console.error('User not found');
        return null;
      }
      return user.id;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}