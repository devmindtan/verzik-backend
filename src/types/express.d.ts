import type { WalletSession } from "./auth.types";

declare global {
  namespace Express {
    interface Request {
      walletSession?: WalletSession;
    }
  }
}

export {};
