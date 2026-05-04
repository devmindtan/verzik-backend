import { Router } from "express";
import {
  getWalletMe,
  logoutWallet,
  requestWalletNonce,
  verifyWalletSignature,
} from "../controllers/wallet.auth.controller";

const router = Router();

router.post("/auth/wallet/nonce", requestWalletNonce);
router.post("/auth/wallet/verify", verifyWalletSignature);
router.get("/auth/wallet/me", getWalletMe);
router.post("/auth/wallet/logout", logoutWallet);

export default router;
