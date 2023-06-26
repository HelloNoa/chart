import { Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { order_book, status } from './order_book.entity.js';
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

  async getOrderList(
    uuid: string,
    isPending: boolean,
    orderSymbolName?: string,
  ) {
    const userId = await this.userService.getUserId(uuid);
    if (userId === null) {
      console.log('User uuid is null');
      return null;
    }

    if (isPending) {
      const query = await this.order_bookRepository
        .createQueryBuilder('order_book')
        .leftJoin('order_book.order_symbol', 'order_symbol')
        .select('order_uuid', 'order_uuid')
        .addSelect('order_book.id', 'order_book_id')
        .addSelect('status', 'status')
        .addSelect('unit_price', 'unit_price')
        .addSelect('quantity', 'quantity')
        .addSelect('order_type', 'order_type')
        .addSelect('created_at', 'created_at')
        .addSelect('updated_at', 'updated_at')
        .addSelect('name', 'order_symbol')
        .where('order_book.user_id = :userId', { userId })
        .andWhere('order_book.status in (:...status)', {
          status: ['PLACED', 'PARTIAL_FILLED'],
        });

      if (orderSymbolName !== undefined) {
        query.andWhere('order_symbol.name = :orderSymbolName', {
          orderSymbolName,
        });
      }
      query.orderBy('order_book.updated_at', 'ASC');
      const data = await query.getRawMany();
      const arr: {
        status: string;
        order_uuid: any;
        created_at: any;
        order_symbol: any;
        order_type: any;
        unit_price: number;
        quantity: number;
      }[] = [];
      await Promise.all(
        data.map(async (e) => {
          const diff = await (async () => {
            if (e.status === 'PARTIAL_FILLED') {
              return (
                (await this.orderBookDifferenceService.getDifferBiOrderBookId(
                  e.order_book_id,
                )) ?? 0
              );
            } else {
              return 0;
            }
          })();
          arr.push({
            status: e.status,
            order_uuid: e.order_uuid,
            created_at: e.created_at,
            order_symbol: e.order_symbol,
            order_type: e.order_type,
            unit_price: Number(e.unit_price),
            quantity: Number(e.quantity) - diff,
          });
        }),
      );
      arr.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
      return arr;
    } else {
      const query = await this.order_bookRepository
        .createQueryBuilder('order_book')
        .leftJoin('order_book.order_symbol', 'order_symbol')
        .select('order_uuid', 'order_uuid')
        .addSelect('order_book.id', 'order_book_id')
        .addSelect('status', 'status')
        .addSelect('unit_price', 'unit_price')
        .addSelect('quantity', 'quantity')
        .addSelect('order_type', 'order_type')
        .addSelect('created_at', 'created_at')
        .addSelect('updated_at', 'updated_at')
        .addSelect('name', 'order_symbol')
        .where('order_book.user_id = :userId', { userId })
        .andWhere('order_book.status in (:...status)', {
          status: ['FULFILLED', 'PARTIAL_FILLED'],
        });

      if (orderSymbolName !== undefined) {
        query.andWhere('order_symbol.name = :orderSymbolName', {
          orderSymbolName,
        });
      }
      query.orderBy('order_book.updated_at', 'ASC');
      const data = await query.getRawMany();
      const arr: {
        status: string;
        order_uuid: any;
        created_at: any;
        order_symbol: any;
        order_type: any;
        unit_price: number;
        quantity: number;
      }[] = [];
      await Promise.all(
        data.map(async (e) => {
          const orders = await this.orderBookDifferenceService.getDifferOrders(
            e.order_book_id,
          );
          if (orders === null) {
            console.log('orders is null');
          } else {
            orders.map((el) => {
              arr.push({
                status: e.status,
                order_uuid: e.order_uuid,
                created_at: e.created_at,
                order_symbol: e.order_symbol,
                order_type: e.order_type,
                unit_price: Number(e.unit_price),
                quantity: Number(el.diff),
              });
            });
          }
        }),
      );
      arr.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
      return arr;
    }
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
        select: ['id', 'unit_price', 'order_type', 'quantity', 'status'],
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
          const diff = await (async () => {
            if (e.status === 'PLACED') {
              return 0;
            } else {
              return (
                (await this.orderBookDifferenceService.getDifferBiOrderBookId(
                  e.id,
                )) ?? 0
              );
            }
          })();
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
    console.log(orderSymbolName);
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
      askList = askList.slice(-MAXROW);
      bidList = bidList.slice(0, MAXROW);
      const filterOrderBookIdList = orderBookIdList.filter((e) => {
        const index = Number(e.unit_price);
        return askList.includes(index) || bidList.includes(index);
      });
      const ask: OrderBookDto[] = [];
      const bid: OrderBookDto[] = [];
      await Promise.all(
        filterOrderBookIdList.map(async (e) => {
          const diff = await (async () => {
            if (e.status === 'PLACED') {
              return 0;
            } else {
              return (
                (await this.orderBookDifferenceService.getDifferBiOrderBookId(
                  e.id,
                )) ?? 0
              );
            }
          })();
          if (
            e.order_type === 'ASK' &&
            askList.includes(Number(e.unit_price))
          ) {
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
          } else if (
            e.order_type === 'BID' &&
            bidList.includes(Number(e.unit_price))
          ) {
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
