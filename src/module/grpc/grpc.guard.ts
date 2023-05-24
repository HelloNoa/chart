import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { FinexblockService } from '../finexblock/finexblock.service.js';

@Injectable()
export class GrpcGuard implements CanActivate {
  whiteList: string[] = [];

  constructor(private readonly finexblockService: FinexblockService) {
    finexblockService.findAll().then((result) => {
      for (const val of result) {
        this.whiteList.push(val.ip);
      }

      console.log(this.whiteList);
    });
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> | any {
    const [, , implement] = context.getArgs();
    const clientIp = implement.call.getPeer().split(':')[0];
    console.log('clientIp : ', clientIp);
    console.log(this.whiteList);
    if (this.whiteList.includes(clientIp)) {
      return true;
    } else {
      throw new RpcException('ip not allow');
    }
  }
}
