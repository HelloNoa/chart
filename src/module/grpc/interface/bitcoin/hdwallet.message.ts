export interface UnspentOutput {
  TxHash: string;
  Vout: number;
  Address: string;
  Account: string;
  ScriptPubKey: string;
  RedeemScript: string;
  Amount: number;
  Confirmations: number;
  Spendable: boolean;
}

export interface Unspent {
  TxId: string;
  Vout: number;
  ScriptPubKey: string;
  Desc: string;
  Amount: number;
  Height: number;
}

export interface GetPrivateKeyRequest {
  Mode: string;
  UserId: number;
}

export interface GetPrivateKeyResponse {
  PrivateKey: string;
}

export interface GetPubKeyHashRequest {
  Mode: string;
  UserId: number;
}

export interface GetPubKeyHashResponse {
  PublicKey: string;
}

export interface CreateWalletRequest {
  Mode: string;
  UserId: number;
}

export interface CreateWalletResponse {
  Address: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetNewAddressRequest {}

export interface GetNewAddressResponse {
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

export interface SendToAddressRequest {
  Mode: string;
  ToAddress: string;
  Amount: number;
}

export interface SendToAddressResponse {
  TxHash: string;
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
