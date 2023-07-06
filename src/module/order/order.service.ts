import { Injectable } from '@nestjs/common';
import { order_bookService } from '../typeorm/order_book/order_book.service.js';
import { order_matching_eventService } from '../typeorm/order_matching_event/order_matching_event.service.js';
import { order_symbolService } from '../typeorm/order_symbol/order_symbol.service.js';
import { order_matching_historyService } from '../typeorm/order_matching_history/order_matching_history.service.js';
import { userService } from '../typeorm/user/user.service.js';

@Injectable()
export class OrderService {
  constructor(
    private readonly userService: userService,
    private readonly orderBookService: order_bookService,
    private readonly orderSymbolService: order_symbolService,
    private readonly orderMatchingEventService: order_matching_eventService,
    private readonly orderMatchingHistoryService: order_matching_historyService,
  ) {}

  //내 주문 목록
  async orderList(
    userUUID: string,
    isPending: boolean,
    orderSymbolId?: string,
  ) {
    const userId = await this.userService.getUserId(userUUID);
    if (userId === null) {
      console.log('User uuid is null');
      return null;
    }
    if (!isPending) {
      return await this.orderMatchingHistoryService.getOrderMatchingHistory(
        userId,
        orderSymbolId,
      );
    } else {
      return await this.orderBookService.getOrderList(
        userUUID,
        isPending,
        orderSymbolId,
      );
    }
  }

  async history(orderSymbolName: string, limit: number) {
    const orderSymbolId = await this.orderSymbolService.getSymbolId(
      orderSymbolName,
    );
    if (orderSymbolId === null) {
      console.log('orderSymbolId is null');
      return null;
    }
    return await this.orderMatchingEventService.history(orderSymbolId, limit);
  }
}
