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
  PreviousOutPoint: OutPoint;
  SignatureScript: string;
  Sequence: number;
}

export interface TxOut {
  Value: number;
  ScriptPubKey: string;
}

export interface GetRawTransactionRequest {
  TxId: string;
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

export interface SendRawTransactionRequest {
  SignedTx: string;
}

export interface SendRawTransactionResponse {
  TxHash: string;
}

export interface SignRawTransactionRequest {
  RawTx: string;
  PrivateKeys: string[];
  RedeemScript: string;
}

export interface SignRawTransactionResponse {
  SignedTx: string;
  Complete: boolean;
}
