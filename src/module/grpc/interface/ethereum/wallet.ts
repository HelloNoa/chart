import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import {
  CreateWalletInput,
  CreateWalletOutput,
  GetBalanceInput,
  GetBalanceOutput,
} from './wallet.message.js';

export interface EthereumWallet {
  CreateWallet(
    data: CreateWalletInput,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<CreateWalletOutput>;

  GetBalance(
    data: GetBalanceInput,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<GetBalanceOutput>;
}
