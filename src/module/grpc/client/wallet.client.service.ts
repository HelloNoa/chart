import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { proxyClientsName } from '../../../proxy.clients.options.js';
import {
  BitcoinProxy,
  CreateWalletRequest,
  CreateWalletResponse,
} from '../interface/proxy/proxy.bitcoin.js';
import {
  CreateWalletInput as Ethereum_CreateWalletInput,
  CreateWalletOutput as Ethereum_CreateWalletOutput,
  EthereumProxy,
} from '../interface/proxy/proxy.ethereum.js';
import {
  CreateWalletInput as Polygon_CreateWalletInput,
  CreateWalletOutput as Polygon_CreateWalletOutput,
  PolygonProxy,
} from '../interface/proxy/proxy.polygon.js';
import { Observable } from 'rxjs';

@Injectable()
export class WalletClientService implements OnModuleInit {
  constructor(
    @Inject(proxyClientsName.bitcoin) private bitcoinProxy: ClientGrpc,
    @Inject(proxyClientsName.ethereum) private ethereumProxy: ClientGrpc,
    @Inject(proxyClientsName.polygon) private polygonProxy: ClientGrpc,
  ) {}

  onModuleInit() {
    //onModuleInit
  }

  async CreateWallet(
    symbol: string,
    userId: number,
  ): Promise<Observable<
    | CreateWalletResponse
    | Ethereum_CreateWalletOutput
    | Polygon_CreateWalletOutput
  > | null> {
    let res;
    switch (symbol.toUpperCase()) {
      case 'BTC': //BITCOIN
        {
          const request: CreateWalletRequest = {
            UserId: userId,
          };
          res = this.bitcoinProxy
            .getService<BitcoinProxy>('BitcoinProxy')
            .CreateWalletAddress(request);
        }
        break;
      case 'ETH': //ETHEREUM
        {
          const request: Ethereum_CreateWalletInput = {
            UserID: userId,
          };
          res = this.ethereumProxy
            .getService<EthereumProxy>('EthereumProxy')
            .CreateWallet(request);
        }
        break;
      case 'MATIC': //POLYGON
        {
          const request: Polygon_CreateWalletInput = {
            UserID: userId,
          };
          res = this.polygonProxy
            .getService<PolygonProxy>('PolygonProxy')
            .CreateWallet(request);
        }
        break;
      default:
        res = null;
        break;
    }
    return await res;
  }
}
