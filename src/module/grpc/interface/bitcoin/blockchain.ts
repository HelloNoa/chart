import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import {
  GetBlockCountRequest,
  GetBlockCountResponse,
  GetBlockHashRequest,
  GetBlockHashResponse,
  GetBlockRequest,
  GetBlockResponse,
} from './blockchain.message.js';

export interface Blockchain {
  GetBlockCount(
    data: GetBlockCountRequest,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<GetBlockCountResponse>;

  GetBlockHash(
    data: GetBlockHashRequest,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<GetBlockHashResponse>;

  GetBlock(
    data: GetBlockRequest,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<GetBlockResponse>;
}
