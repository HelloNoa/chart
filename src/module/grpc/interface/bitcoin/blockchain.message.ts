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
  PreviousOutpoint: BlockOutPoint;
  SignatureScript: string;
  Sequence: number;
}

export interface BlockTransactionOutput {
  Value: number;
  ScriptPubKey: string;
}

export interface BlockTransaction {
  TxHash: string;
  TxInputs: BlockTransactionInput[];
  TxOuts: BlockTransactionOutput[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetBlockCountRequest {}

export interface GetBlockCountResponse {
  Count: number;
}

export interface GetBlockHashRequest {
  Height: number;
}

export interface GetBlockHashResponse {
  BlockHash: string;
}

export interface GetBlockRequest {
  BlockHash: string;
}

export interface GetBlockResponse {
  header: BlockHeader;
  tx: BlockTransaction[];
}
