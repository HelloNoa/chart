import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

const allowIps = ['121.134.226.223', '::1', '61.78.96.41', '218.145.191.242'];
@Injectable()
export class IpGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    console.log(request.ip);
    const clientIpv4 =
      request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    console.log('clientIpv4');
    console.log(clientIpv4);
    return allowIps.includes(clientIpv4);
  }
}
