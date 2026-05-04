export interface WalletAuthNonce {
  address: string;
  nonce: string;
  message: string;
  expiresAt: number;
}

export interface WalletSession {
  token: string;
  address: string;
  role: string;
  issuedAt: number;
  expiresAt: number;
  tenantId?: string;
}
