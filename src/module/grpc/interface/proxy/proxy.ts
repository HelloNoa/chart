import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import {
  CreateWalletInput,
  CreateWalletOutput,
  GetBalanceInput,
  GetBalanceOutput,
  GetBlockNumberInput,
  GetBlockNumberOutput,
  GetBlocksInput,
  GetBlocksOutput,
  GetReceiptInput,
  GetReceiptOutput,
  SendTransactionInput,
  SendTransactionOutput,
  TransferInput,
  TransferOutput,
} from './proxy.ethereum.failly.message.js';
import {
  CreateRawTransactionRequest,
  CreateRawTransactionResponse,
  CreateWalletRequest,
  CreateWalletResponse,
  GetAddressUTXORequest,
  GetAddressUTXOResponse,
  GetBlockCountRequest,
  GetBlockCountResponse,
  GetBlockRequest,
  GetBlockResponse,
  GetNewAddressRequest,
  GetNewAddressResponse,
  GetPrivateKeyRequest,
  GetPrivateKeyResponse,
  GetRawTransactionRequest,
  GetRawTransactionResponse,
  ListUnspentRequest,
  ListUnspentResponse,
  SendRawTransactionRequest,
  SendRawTransactionResponse,
  SendToAddressRequest,
  SendToAddressResponse,
  SignRawTransactionRequest,
  SignRawTransactionResponse,
} from './proxy.bitcoin.message.js';

export interface Proxy {
  GetBlockCount(
    data: GetBlockCountRequest,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<GetBlockCountResponse>;

  GetBlock(
    data: GetBlockRequest,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<GetBlockResponse>;

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

  ListUnspent(
    data: ListUnspentRequest,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<ListUnspentResponse>;

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

  SendToAddress(
    data: SendToAddressRequest,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<SendToAddressResponse>;

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

  GetAddressUTXO(
    data: GetAddressUTXORequest,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<GetAddressUTXOResponse>;

  GetReceipt(
    data: GetReceiptInput,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<GetReceiptOutput>;

  SendTransaction(
    data: SendTransactionInput,
    metadata?: Metadata,
    ...rest: any[]
  ): Observable<SendTransactionOutput>;

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
