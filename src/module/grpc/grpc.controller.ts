import { Controller } from '@nestjs/common';
import {
  GrpcMethod,
  GrpcStreamCall,
  GrpcStreamMethod,
} from '@nestjs/microservices';

import { Observable } from 'rxjs';

@Controller()
export class GrpcController {
  @GrpcStreamCall('LimitOrder', 'LimitOrderInit')
  async LimitOrderInit(
    stream: any,
    // metadata?: Metadata,
    // call?: ServerDuplexStream<any, any>,
  ) {
    console.log('LimitOrderInit');
    // console.log(stream);
    stream.on('data', (msg: any) => {
      console.log(msg);
      // Answer here or anywhere else using stream reference
      stream.write({
        Success: true,
      });
    });
  }

  // @GrpcStreamMethod('LimitOrder', 'LimitOrderInit')
  // async LimitOrderInit(
  //   messages: Subject<any>,
  //   metadata?: Metadata,
  //   call?: ServerDuplexStream<any, any>,
  // ) {
  //   console.log('LimitOrderInit');
  //   console.log(messages);
  //   return messages;
  //   return { Success: true };
  // }

  @GrpcStreamMethod('Event', 'OrderPlacementEvent')
  async OrderPlacementEventmessages(messages: Observable<any>) {
    console.log('OrderPlacementEvent');
    console.log(messages);
    return new Promise(async (res, rej) => {
      messages.subscribe((message) => {
        console.log('aaa');
        console.log(message);
        res({
          Success: true,
        });
      });
    });
  }

  @GrpcStreamMethod('Event', 'OrderPlacementFailedEvent')
  async OrderPlacementFailedEvent(messages: Observable<any>) {
    console.log('OrderPlacementFailedEvent');
    console.log(messages);
    return new Promise(async (res, rej) => {
      messages.subscribe((message) => {
        console.log('aaa');
        console.log(message);
        res({
          Success: true,
        });
      });
    });
  }

  @GrpcStreamMethod('Event', 'OrderCancellationEvent')
  async OrderCancellationEvent(messages: Observable<any>) {
    console.log('OrderCancellationEvent');
    console.log(messages);
    return new Promise(async (res, rej) => {
      messages.subscribe((message) => {
        console.log('aaa');
        console.log(message);
        res({
          Success: true,
        });
      });
    });
  }

  @GrpcStreamMethod('Event', 'OrderCancellationFailedEvent')
  async OrderCancellationFailedEvent(messages: Observable<any>) {
    console.log('OrderCancellationFailedEvent');
    console.log(messages);
    return new Promise(async (res, rej) => {
      messages.subscribe((message) => {
        console.log('aaa');
        console.log(message);
        res({
          Success: true,
        });
      });
    });
  }

  @GrpcStreamMethod('Event', 'OrderMatchingEvent')
  async OrderMatchingEvent(messages: Observable<any>) {
    console.log('OrderMatchingEvent');
    console.log(messages);
    return new Promise(async (res, rej) => {
      messages.subscribe((message) => {
        console.log('aaa');
        console.log(message);
        res({
          Success: true,
        });
      });
    });
  }

  @GrpcStreamMethod('Event', 'OrderMatchingFailedEvent')
  async OrderMatchingFailedEvent(messages: Observable<any>) {
    console.log('OrderMatchingFailedEvent');
    console.log(messages);
    return new Promise(async (res, rej) => {
      messages.subscribe((message) => {
        console.log('aaa');
        console.log(message);
        res({
          Success: true,
        });
      });
    });
  }

  @GrpcStreamMethod('Event', 'OrderPartialFillEvent')
  async OrderPartialFillEvent(messages: Observable<any>) {
    console.log('OrderPartialFillEvent');
    console.log(messages);
    return new Promise(async (res, rej) => {
      messages.subscribe((message) => {
        console.log('aaa');
        console.log(message);
        res({
          Success: true,
        });
      });
    });
  }

  @GrpcStreamMethod('Event', 'OrderFulfillmentEvent')
  async OrderFulfillmentEvent(messages: Observable<any>) {
    console.log('OrderFulfillmentEvent');
    console.log(messages);
    return new Promise(async (res, rej) => {
      messages.subscribe((message) => {
        console.log('aaa');
        console.log(message);
        res({
          Success: true,
        });
      });
    });
  }

  @GrpcStreamMethod('Event', 'OrderInitializeEvent')
  async OrderInitializeEvent(messages: Observable<any>) {
    console.log('OrderInitializeEvent');
    console.log(messages);
    return new Promise(async (res, rej) => {
      messages.subscribe((message) => {
        console.log('aaa');
        console.log(message);
        res({
          Success: true,
        });
      });
    });
  }

  // @GrpcStreamMethod('Event', 'OrderInitializeEvent')
  // async OrderInitializeEvent(messages: Observable<any>) {
  //   console.log('OrderInitializeEvent');
  //
  //   console.log(messages);
  //   const subject = new Subject();
  //   messages.subscribe((message) => {
  //     console.log(message);
  //     subject.next({
  //       shipmentType: {
  //         carrier: 'test-carrier',
  //       },
  //     });
  //   });
  //   return subject.asObservable();
  // }

  @GrpcMethod('LifeCycle', 'StartEngine')
  async StartEngine(messages: Observable<any>) {
    console.log('StartEngine');
    console.log(messages);
    return {};
  }

  // @GrpcMethod('LimitOrderService', 'LimitOrder')
  // async LimitOrder(
  //   data: any,
  //   metadata?: Metadata,
  //   call?: ServerUnaryCall<any, any>,
  // ) {
  //   console.log(data);
  //   console.log('welcome ' + data);
  //   console.log('welcome ' + data);
  //   console.log('welcome ' + data);
  //   console.log('welcome ' + data);
  //   return { greet: 'welcome ' + data };
  // }
  // @GrpcMethod('OrderCancellation', 'CancelOrder')
  // async OrderCancellationRequest(
  //   data: any,
  //   metadata?: Metadata,
  //   call?: ServerUnaryCall<any, any>,
  // ) {
  //   console.log(data);
  //   console.log('welcome ' + data);
  //   console.log('welcome ' + data);
  //   console.log('welcome ' + data);
  //   console.log('welcome ' + data);
  //   return { success: true };
  // }
  //
  // @GrpcMethod('HeroesService', 'FindOne')
  // async findOne(
  //   data: any,
  //   metadata?: Metadata,
  //   call?: ServerUnaryCall<any, any>,
  // ): Promise<any> {
  //   const items = [
  //     { id: 1, name: 'John' },
  //     { id: 2, name: 'Doe' },
  //   ];
  //   console.log('sdasds');
  //   return items.find(({ id }) => id === data.id);
  // }
  // @GrpcMethod('UserService', 'GreetUser')
  // GreetUser(
  //   data: any,
  //   metadata?: Metadata,
  //   call?: ServerUnaryCall<any, any>,
  // ) {
  //   console.log('welcome ' + data.name);
  //   console.log('welcome ' + data.name);
  //   console.log('welcome ' + data.name);
  //   console.log('welcome ' + data.name);
  //   return { greet: 'welcome ' + data.name };
  // }
  //
  // @GrpcMethod('UserService', 'Find')
  // async Find(
  //   data: Void,
  //   metadata?: Metadata,
  //   call?: ServerDuplexStream<any, any>,
  // ) {
  //   const items = [
  //     { id: 1, name: '민규' },
  //     { id: 2, name: '봉학' },
  //     { id: 3, name: '영우' },
  //     { id: 4, name: '예빈' },
  //     { id: 5, name: '준석' },
  //   ];
  //   return from(items);
  // }
  //
  // @GrpcStreamMethod('UserService', 'FindsUser')
  // async FindsUser(
  //   messages: Observable<any>,
  //   metadata?: Metadata,
  //   call?: ServerReadableStream<any, any>,
  // ) {
  //   return messages.pipe(
  //     last(),
  //     map((item) => {
  //       return {
  //         id: item.id,
  //         name: 'test',
  //       };
  //     }),
  //   );
  // }
  // @GrpcStreamMethod('UserService', 'StreamGreetUser')
  // StreamGreetUser(
  //   messages: Observable<
  //     ObservedValueOf<({ id: number } | { id: number } | { id: number })[]>
  //   >,
  //   metadata?: Metadata,
  //   call?: ServerDuplexStream<any, any>,
  // ) {
  //   const subject = new Subject<User>();
  //   const onNext = (message: any) => {
  //     subject.next({
  //       id: 1,
  //       name: message.name,
  //     });
  //   };
  //
  //   const onComplete = () => subject.complete();
  //   messages.subscribe({
  //     next: onNext,
  //     complete: onComplete,
  //   });
  //
  //   return subject.asObservable();
  // }
}
