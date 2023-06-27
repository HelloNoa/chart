import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import {
  CreateWalletRequest,
  CreateWalletResponse,
  GetAddressUTXORequest,
  GetAddressUTXOResponse,
  GetNewAddressRequest,
  GetNewAddressResponse,
  GetPrivateKeyRequest,
  GetPrivateKeyResponse,
  GetPubKeyHashRequest,
  GetPubKeyHashResponse,
  ListUnspentRequest,
  ListUnspentResponse,
  SendToAddressRequest,
  SendToAddressResponse,
} from './hdwallet.message.js';

export interface HDWallet {
  CreateWalletAddress(
    data: CreateWalletRequest,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<CreateWalletResponse>;

  GetNewAddress(
    data: GetNewAddressRequest,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<GetNewAddressResponse>;

  GetPrivateKey(
    data: GetPrivateKeyRequest,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<GetPrivateKeyResponse>;

  GetPubKeyHash(
    data: GetPubKeyHashRequest,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<GetPubKeyHashResponse>;

  GetAddressUTXO(
    data: GetAddressUTXORequest,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<GetAddressUTXOResponse>;

  ListUnspent(
    data: ListUnspentRequest,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<ListUnspentResponse>;

  SendToAddress(
    data: SendToAddressRequest,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<SendToAddressResponse>;
}
