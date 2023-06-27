import 'bitcoin/transaction.message.proto';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import {
  CreateRawTransactionRequest,
  CreateRawTransactionResponse,
  GetRawTransactionRequest,
  GetRawTransactionResponse,
  SendRawTransactionRequest,
  SendRawTransactionResponse,
  SignRawTransactionRequest,
  SignRawTransactionResponse,
} from './transaction.message.js';

export interface Transaction {
  GetRawTransaction(
    data: GetRawTransactionRequest,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<GetRawTransactionResponse>;

  CreateRawTransaction(
    data: CreateRawTransactionRequest,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<CreateRawTransactionResponse>;

  SignRawTransaction(
    data: SignRawTransactionRequest,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<SignRawTransactionResponse>;

  SendRawTransaction(
    data: SendRawTransactionRequest,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<SendRawTransactionResponse>;
}
