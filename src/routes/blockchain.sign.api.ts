/**
 * Blockchain Sign Routes
 * API versioning: /api/v1/blockchain/*
 */

import { Router } from "express";
import * as signController from "../controllers/blockchain.sign.controller";
import { requireWalletSession } from "../middlewares/wallet-auth.middleware";

const router = Router();

router.use("/sign", requireWalletSession);

router.post("/sign/create-tenant", signController.createTenant);
router.post("/sign/tenant-status", signController.setTenantStatus);
router.post("/sign/join-operator", signController.joinAsOperator);
router.post("/sign/topup-stake", signController.topUpStake);
router.post("/sign/operator-metadata", signController.updateOperatorMetadata);
router.post("/sign/request-unstake", signController.requestUnstake);
router.post("/sign/execute-unstake", signController.executeUnstake);
router.post(
  "/sign/register-with-signature",
  signController.registerWithSignature,
);
router.post(
  "/sign/cosign-with-signature",
  signController.coSignDocumentWithSignature,
);
router.post("/sign/recovery-delegate", signController.setRecoveryDelegate);
router.post(
  "/sign/recover-by-delegate",
  signController.recoverOperatorByDelegate,
);
router.post("/sign/treasury", signController.setTreasury);
router.post("/sign/revoke-document", signController.revokeDocument);
router.post("/sign/slash-operator", signController.slashOperator);
router.post("/sign/soft-slash-operator", signController.softSlashOperator);
router.post("/sign/operator-status", signController.setOperatorStatus);
router.post("/sign/recover-by-admin", signController.recoverOperatorByAdmin);
router.post("/sign/cosign-policy", signController.setCoSignPolicy);
router.post("/sign/cosign-operator", signController.setCoSignOperator);
router.post("/sign/min-operator-stake", signController.setMinOperatorStake);
router.post("/sign/unstake-cooldown", signController.setUnstakeCooldown);
router.post("/sign/violation-penalty", signController.setViolationPenalty);

export default router;
