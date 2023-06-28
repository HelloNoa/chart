import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';

export interface EthereumProxy {
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

export interface SendTransactionInput {
  To: string;
  Amount: string;
}

export interface SendTransactionOutput {
  Success: boolean;
  TxHash: string;
}

export interface TransferInput {
  UserID: string;
  From: string;
  Amount: string;
}

export interface TransferOutput {
  Success: boolean;
  TxHash: string;
}

export interface GetReceiptInput {
  TxHash: string;
}

export interface GetReceiptOutput {
  TxHash: string;
  Status: number;
  BlockHash: string;
  BlockNumber: string;
  GasUsed: number;
  TransactionIndex: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetBlockNumberInput {}

export interface GetBlockNumberOutput {
  BlockNumber: number;
}

export interface GetBlocksInput {
  Start: number;
  End: number;
}

export interface GetBlocksOutput {
  Result: string[];
}

export interface CreateWalletInput {
  UserID: number;
}

export interface CreateWalletOutput {
  Address: string;
}

export interface GetBalanceInput {
  Address: string;
}

export interface GetBalanceOutput {
  Balance: string;
}

export interface GetWalletInput {
  UserID: number;
}

export interface GetWalletOutput {
  PublicKey: string;
  Address: string;
}
