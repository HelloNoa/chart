export interface SendRawTransactionInput {
  To: string;
  Amount: string;
}

export interface SendRawTransactionOutput {
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
  gas_used: number;
  transaction_index: number;
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
