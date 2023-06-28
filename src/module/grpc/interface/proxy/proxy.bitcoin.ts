import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';

export interface BitcoinProxy {
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
}

export interface BlockHeader {
  Version: number;
  PrevBlock: string;
  MerkleRoot: string;
  Timestamp: number;
  Bits: number;
  Nonce: number;
}

export interface BlockOutPoint {
  Hash: string;
  Index: number;
}

export interface BlockTransactionInput {
  PreviousOutPoint: BlockOutPoint;
  SignatureScript: string;
  Sequence: number;
}

export interface BlockTransactionOutput {
  Value: number;
  ScriptPubKey: string;
}

export interface BlockTransaction {
  txHash: string;
  TxInputs: BlockTransactionInput[];
  TxOuts: BlockTransactionOutput[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetBlockCountRequest {}

export interface GetBlockCountResponse {
  Count: number;
}

export interface GetBlockRequest {
  Height: number;
}

export interface GetBlockResponse {
  Header: BlockHeader;
  Tx: BlockTransaction[];
}

export interface Unspent {
  TxId: string;
  Vout: number;
  ScriptPubKey: string;
  Desc: string;
  Amount: number;
  Height: number;
}

export interface UnspentOutput {
  txHash: string;
  Vout: number;
  Address: string;
  Account: string;
  ScriptPubKey: string;
  RedeemScript: string;
  Amount: number;
  Confirmations: number;
  Spendable: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetNewAddressRequest {}

export interface GetNewAddressResponse {
  Address: string;
}

export interface CreateWalletRequest {
  UserId: number;
}

export interface CreateWalletResponse {
  Address: string;
}

export interface ListUnspentRequest {
  Minconf: number;
  Maxconf: number;
  Address: string;
}

export interface ListUnspentResponse {
  UnspentOutputs: UnspentOutput[];
}

export interface GetRawTransactionRequest {
  TxId: string;
}

export interface Vout {
  Value: number;
  N: number;
  ScriptPubKeyAms: string;
  ScriptPubKeyHex: string;
  ScriptPubKeyReqSigs: number;
  ScriptPubKeyType: string;
  Address: string[];
}

export interface Vin {
  Coinbase: string;
  TxId: string;
  Vout: number;
  ScriptSigAms: string;
  ScriptSigHex: string;
  Sequence: number;
  Witness: string[];
}

export interface GetRawTransactionResponse {
  Hex: string;
  TxId: string;
  Hash: string;
  Size: number;
  Vsize: number;
  Weight: number;
  Version: number;
  LockTime: number;
  Vin: Vin[];
  Vout: Vout[];
  BlockHash: string;
  Confirmations: number;
  Time: number;
  BlockTime: number;
}

export interface TransactionInput {
  TxId: string;
  Vout: number;
}

export interface TransactionOutput {
  Address: string;
  Value: number;
}

export interface OutPoint {
  Hash: string;
  Index: number;
}

export interface TxIn {
  PreviousOutpoint: OutPoint;
  SignatureScript: string;
  Sequence: number;
}

export interface TxOut {
  Value: number;
  ScriptPubKey: string;
}

export interface CreateRawTransactionRequest {
  Inputs: TransactionInput[];
  Outputs: TransactionOutput[];
}

export interface CreateRawTransactionResponse {
  RawHex: string;
}

//export interface CreateRawTransactionResponse {
//  repeated TxIn TxIn
//  repeated TxOut TxOut
//   Version:number
//   LockTime:number
//}
export interface SignRawTransactionRequest {
  RawTx: string;
  PrivateKeys: string[];
  RedeemScript: string;
}

export interface SignRawTransactionResponse {
  SignedTx: string;
  Complete: boolean;
}

export interface SendRawTransactionRequest {
  SignedTx: string;
}

export interface SendRawTransactionResponse {
  TxId: string;
}

export interface SendToAddressRequest {
  ToAddress: string;
  Amount: number;
}

export interface SendToAddressResponse {
  TxHash: string;
}

export interface GetPrivateKeyRequest {
  UserId: number;
}

export interface GetPrivateKeyResponse {
  PrivateKey: string;
}

export interface GetAddressUTXORequest {
  Address: string;
}

export interface GetAddressUTXOResponse {
  Success: boolean;
  Txouts: number;
  Height: number;
  BestBlock: string;
  Unspents: Unspent[];
  TotalAmount: number;
}
