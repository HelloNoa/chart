import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import {
  GetBlockNumberInput,
  GetBlockNumberOutput,
  GetBlocksInput,
  GetBlocksOutput,
  GetReceiptInput,
  GetReceiptOutput,
  SendRawTransactionInput,
  SendRawTransactionOutput,
  TransferInput,
  TransferOutput,
} from './transaction.message.js';

export interface PolygonTransaction {
  GetReceipt(
    data: GetReceiptInput,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<GetReceiptOutput>;

  SendRawTransaction(
    data: SendRawTransactionInput,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<SendRawTransactionOutput>;

  Transfer(
    data: TransferInput,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<TransferOutput>;

  GetBlockNumber(
    data: GetBlockNumberInput,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<GetBlockNumberOutput>;

  GetBlocks(
    data: GetBlocksInput,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<GetBlocksOutput>;
}
