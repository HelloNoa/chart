import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import {
  CreateWalletInput,
  CreateWalletOutput,
  GetBalanceInput,
  GetBalanceOutput,
} from './wallet.message.js';

export interface HDWallet {
  CreateWallet(
    data: CreateWalletInput,
    metadata?: Metadata,
  ): Observable<CreateWalletOutput>;

  GetBalance(
    data: GetBalanceInput,
    metadata?: Metadata,
  ): Observable<GetBalanceOutput>;
}
