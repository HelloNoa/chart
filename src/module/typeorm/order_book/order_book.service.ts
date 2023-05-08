import { Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { order_book, status } from './order_book.entity.js';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere.js';
import { userService } from '../user/user.service.js';
import { order_symbolService } from '../order_symbol/order_symbol.service.js';
import { order_book_differenceService } from '../order_book_difference/order_book_difference.service.js';
import {
  BidAskDto,
  OrderBookDto,
} from '../../inMemory/orderBook/orderBook.service.js';

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

  async getAllBidAsk(orderSymbolName: string): Promise<BidAskDto | null> {
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
      const ask: OrderBookDto[] = [];
      const bid: OrderBookDto[] = [];
      await Promise.all(
        orderBookIdList.map(async (e) => {
          const diff =
            (await this.orderBookDifferenceService.getDifferBiOrderBookId(
              e.id,
            )) ?? 0;
          if (e.order_type === 'ASK') {
            if (
              ask.findIndex((el) => el.price === Number(e.unit_price)) === -1
            ) {
              ask.push({
                price: Number(e.unit_price),
                volume: Number(e.quantity) - Number(diff),
              } as OrderBookDto);
            } else {
              const index = ask.findIndex(
                (el) => el.price === Number(e.unit_price),
              );
              ask[index].volume += Number(e.quantity) - Number(diff);
            }
          } else if (e.order_type === 'BID') {
            if (
              bid.findIndex((el) => el.price === Number(e.unit_price)) === -1
            ) {
              bid.push({
                price: Number(e.unit_price),
                volume: Number(e.quantity) - Number(diff),
              } as OrderBookDto);
            } else {
              const index = bid.findIndex(
                (el) => el.price === Number(e.unit_price),
              );
              bid[index].volume += Number(e.quantity) - Number(diff);
            }
          }
        }),
      );

      return { ask: ask, bid: bid } as BidAskDto;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async getBidAsk(orderSymbolName: string): Promise<BidAskDto | null> {
    const MAXROW = 20;

    const orderSymbolId = await this.orderSymbolService.getSymbolId(
      orderSymbolName,
    );
    if (orderSymbolId === null) {
      console.log('orderSymbolName is null');
      return null;
    }

    const values: status[] = ['PLACED', 'PARTIAL_FILLED'];

    try {
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
      let askList: number[] = [];
      let bidList: number[] = [];

      orderBookIdList.map((e) => {
        const index = Number(e.unit_price);
        if (e.order_type === 'ASK') {
          if (!askList.includes(index)) {
            askList.push(index);
          }
        } else if (e.order_type === 'BID') {
          if (!bidList.includes(index)) {
            bidList.push(index);
          }
        }
      });
      askList = askList.slice(
        Math.min(askList.length, Math.max(askList.length - MAXROW, 0)),
      );
      bidList = bidList.slice(0, MAXROW);
      const filterOrderBookIdList = orderBookIdList.filter((e) => {
        const index = Number(e.unit_price);
        return askList.includes(index) || bidList.includes(index);
      });
      const ask: OrderBookDto[] = [];
      const bid: OrderBookDto[] = [];
      await Promise.all(
        filterOrderBookIdList.map(async (e) => {
          const diff =
            (await this.orderBookDifferenceService.getDifferBiOrderBookId(
              e.id,
            )) ?? 0;
          if (e.order_type === 'ASK') {
            if (
              ask.findIndex((el) => el.price === Number(e.unit_price)) === -1
            ) {
              ask.push({
                price: Number(e.unit_price),
                volume: Number(e.quantity) - Number(diff),
              } as OrderBookDto);
            } else {
              const index = ask.findIndex(
                (el) => el.price === Number(e.unit_price),
              );
              ask[index].volume += Number(e.quantity) - Number(diff);
            }
          } else if (e.order_type === 'BID') {
            if (
              bid.findIndex((el) => el.price === Number(e.unit_price)) === -1
            ) {
              bid.push({
                price: Number(e.unit_price),
                volume: Number(e.quantity) - Number(diff),
              } as OrderBookDto);
            } else {
              const index = bid.findIndex(
                (el) => el.price === Number(e.unit_price),
              );
              bid[index].volume += Number(e.quantity) - Number(diff);
            }
          }
        }),
      );
      return {
        ask: ask.sort((a, b) => b.price - a.price),
        bid: bid.sort((a, b) => b.price - a.price),
      } as BidAskDto;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
