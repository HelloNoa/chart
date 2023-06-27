export interface MyEnum {
  Coin: Coin;
}

export enum Coin {
  ETH = 0,
  MATIC = 1,
}

export interface SendTransactionInput {
  Coin: Coin;
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
  coin: Coin;
}

export interface TransferOutput {
  Success: boolean;
  TxHash: string;
}

export interface GetReceiptInput {
  TxHash: string;
  coin: Coin;
}

export interface GetReceiptOutput {
  TxHash: string;
  Status: number;
  BlockHash: string;
  BlockNumber: string;
  gas_used: number;
  transaction_index: number;
}

export interface GetBlockNumberInput {
  coin: Coin;
}

export interface GetBlockNumberOutput {
  BlockNumber: number;
}

export interface GetBlocksInput {
  Start: number;
  End: number;
  coin: Coin;
}

export interface GetBlocksOutput {
  Result: string[];
}

export interface CreateWalletInput {
  UserID: number;
  coin: Coin;
}

export interface CreateWalletOutput {
  Address: string;
}

export interface GetBalanceInput {
  Address: string;
  coin: Coin;
}

export interface GetBalanceOutput {
  Balance: string;
}

export interface GetWalletInput {
  UserID: number;
  coin: Coin;
}

export interface GetWalletOutput {
  PublicKey: string;
  Address: string;
}
