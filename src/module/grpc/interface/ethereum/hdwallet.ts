import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import {
  CreateWalletInput,
  CreateWalletOutput,
  GetBalanceInput,
  GetBalanceOutput,
} from './hdwallet.message.js';

export interface HDWallet {
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
