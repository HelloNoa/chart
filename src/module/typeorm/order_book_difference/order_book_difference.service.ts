import { Inject, Injectable } from '@nestjs/common';
import { FindManyOptions, In, Repository } from 'typeorm';
import { order_book_difference } from './order_book_difference.entity.js';

@Injectable()
export class order_book_differenceService {
  constructor(
    @Inject('ORDER_BOOK_DIFFERENCE_REPOSITORY')
    private orderBookDifferenceRepository: Repository<order_book_difference>,
  ) {}

  async findAll(): Promise<order_book_difference[]> {
    return this.orderBookDifferenceRepository.find();
  }

  async getDifferBiOrderBookId(oderBookId: number | number[]) {
    if (!Array.isArray(oderBookId)) oderBookId = [oderBookId];
    try {
      const option: FindManyOptions<order_book_difference> = {
        select: ['diff'],
        where: {
          order_book_id: In([...oderBookId]),
        },
      };
      const diff = await this.orderBookDifferenceRepository.find(option);
      if (diff.length === 0) {
        console.error('orderBookDifference is null');
        return null;
      }
      let sumDiffAll = 0;
      diff.forEach((e) => {
        sumDiffAll += Number(e.diff);
      });
      return sumDiffAll;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
