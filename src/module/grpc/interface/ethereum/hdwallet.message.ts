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
