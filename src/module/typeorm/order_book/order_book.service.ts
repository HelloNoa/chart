import { Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { order_book, status } from './order_book.entity.js';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere.js';
import { userService } from '../user/user.service.js';
import { order_symbolService } from '../order_symbol/order_symbol.service.js';
import { order_book_differenceService } from '../order_book_difference/order_book_difference.service.js';

@Injectable()
export class order_bookService {
  constructor(
    @Inject('ORDER_BOOK_REPOSITORY')
    private order_bookRepository: Repository<order_book>,
    private readonly userService: userService,
    private readonly orderSymbolService: order_symbolService,
    private readonly orderBookDifferenceService: order_book_differenceService,
  ) {}

  async findAll(): Promise<order_book[]> {
    return this.order_bookRepository.find();
  }

  async getOrderList(uuid: string, status: status[], orderSymbolName?: string) {
    if (!Array.isArray(status)) status = [status];
    const userId = await this.userService.getUserId(uuid);
    if (userId === null) {
      console.log('User uuid is null');
      return null;
    }
    const option: FindOptionsWhere<order_book> = {
      user_id: userId,
      status: In(status),
    };
    if (orderSymbolName) {
      const orderSymbolId = await this.orderSymbolService.getSymbolId(
        orderSymbolName,
      );
      if (orderSymbolId === null) {
        console.error('orderSymbolId is null');
        return null;
      }
      option.order_symbol_id = orderSymbolId;
    }
    return this.order_bookRepository.findBy(option);
  }

  async getBidAsk(orderSymbolName: string) {
    const MAXROW = 20;
    const orderSymbolId = await this.orderSymbolService.getSymbolId(
      orderSymbolName,
    );
    if (orderSymbolId === null) {
      console.log('orderSymbolName is null');
      return null;
    }
    try {
      const values: status[] = ['PLACED', 'PARTIAL_FILLED'];
      const orderBookIdList = await this.order_bookRepository.find({
        select: ['id', 'unit_price', 'order_type', 'quantity'],
        where: {
          order_symbol_id: orderSymbolId,
          status: In(values),
        },
        order: { unit_price: 'desc' },
      });
      if (orderBookIdList.length === 0) {
        return null;
      }
      const _askIdList = orderBookIdList.filter((e) => e.order_type === 'ASK');
      let askIdList: number[] = [];
      _askIdList.map(
        (e) =>
          !askIdList.includes(Number(e.unit_price)) &&
          askIdList.push(Number(e.unit_price)),
      );
      askIdList = askIdList.slice(-MAXROW, -1);
      const _bidIdList = orderBookIdList.filter((e) => e.order_type === 'BID');
      let bidIdList: number[] = [];
      _bidIdList.map(
        (e) =>
          !bidIdList.includes(Number(e.unit_price)) &&
          bidIdList.push(Number(e.unit_price)),
      );
      bidIdList = bidIdList.slice(0, MAXROW - 1);
      const askList: { [key: number]: number } = {};
      const bidList: { [key: number]: number } = {};

      askIdList.map(async (e) => {
        askList[Number(e)] = 0;
      });
      _askIdList.map(async (e) => {
        const diff =
          await this.orderBookDifferenceService.getDifferBiOrderBookId(e.id);
        if (diff === null) {
          console.error('diff is null');
          return null;
        }
        if (askList[Number(e.unit_price)] === undefined)
          askList[Number(e.unit_price)] = 0;
        askList[Number(e.unit_price)] += Number(diff);
      });
      bidIdList.map(async (e) => {
        bidList[Number(e)] = 0;
      });
      _bidIdList.map(async (e) => {
        const diff =
          await this.orderBookDifferenceService.getDifferBiOrderBookId(e.id);
        if (diff === null) {
          console.error('diff is null');
          return null;
        }
        if (bidList[Number(e.unit_price)] === undefined)
          bidList[Number(e.unit_price)] = 0;
        bidList[Number(e.unit_price)] += Number(diff);
      });
      return { ask: askList, bid: bidList };
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
