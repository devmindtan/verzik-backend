/**
 * Refactored Blockchain Query Routes with API Versioning
 * Based on api-design skill - resource-based URLs, versioning
 */

import { Router } from "express";
import * as queryController from "../controllers/blockchain.query.controller";

const router = Router();

/**
 * List endpoints
 * GET /api/v1/blockchain/documents
 * GET /api/v1/blockchain/operators
 * etc.
 */
router.get("/documents", queryController.getDocuments);
router.get("/documents/cosigneds", queryController.getDocumentCoSigneds);
router.get("/documents/revokeds", queryController.getDocumentRevokeds);
router.get("/operators", queryController.getOperators);
router.get(
  "/operators/metadata-updateds",
  queryController.getOperatorMetadataUpdateds,
);
router.get(
  "/operators/status-updateds",
  queryController.getOperatorStatusUpdateds,
);
router.get(
  "/operators/stake-topped-ups",
  queryController.getOperatorStakeToppedUps,
);
router.get(
  "/operators/recovery-delegate-updateds",
  queryController.getOperatorRecoveryDelegateUpdateds,
);
router.get("/operators/recovereds", queryController.getOperatorRecovereds);
router.get(
  "/operators/recovery-alias-updateds",
  queryController.getOperatorRecoveryAliasUpdateds,
);
router.get("/tenants", queryController.getTenants);
router.get("/tenants/status-updateds", queryController.getTenantStatusUpdateds);
router.get(
  "/tenants/min-operator-stake-updateds",
  queryController.getMinOperatorStakeUpdateds,
);
router.get(
  "/tenants/unstake-cooldown-updateds",
  queryController.getUnstakeCooldownUpdateds,
);
router.get("/tenants/treasury-updateds", queryController.getTreasuryUpdateds);
router.get("/penalties", queryController.getPenalties);
router.get("/nonces", queryController.getNonces);
router.get("/protocol-initializeds", queryController.getProtocolInitializeds);
router.get("/documents/qualifieds", queryController.getDocumentQualifieds);
router.get("/cosign-operators", queryController.getCoSignOperators);
router.get("/cosign-policies", queryController.getCoSignPolicies);
router.get("/operators/hard-slashed", queryController.getOperatorHardSlasheds);
router.get("/operators/soft-slashed", queryController.getOperatorSoftSlasheds);
router.get(
  "/operators/unstake-requested",
  queryController.getOperatorUnstakeRequesteds,
);
router.get("/operators/unstaked", queryController.getOperatorUnstakeds);

/**
 * Count endpoints
 * GET /api/v1/blockchain/tenant-count
 */
router.get("/tenant-count", queryController.getTenantCount);

/**
 * Detail endpoints (with query parameters)
 * GET /api/v1/blockchain/transaction?txHash=...
 * GET /api/v1/blockchain/nonce?tenantId=...&signer=...
 * etc.
 */
router.get("/transaction", queryController.getTransactionByHash);
router.get("/nonce", queryController.getNonceById);
router.get("/nonce-count", queryController.getNonceCountById);
router.get("/penalty", queryController.getPenaltyById);
router.get("/violation-penalty", queryController.getCurrentViolationPenalty);
router.get("/tenant", queryController.getTenantById);
router.get("/tenant-info", queryController.getTenantInfo);
router.get("/tenant-config", queryController.getTenantRuntimeConfig);
router.get("/document", queryController.getDocumentById);
router.get("/document-status", queryController.getDocumentStatus);
router.get("/document-verify", queryController.verifyDocumentStatus);
router.get("/document-signed", queryController.getHasSignedDocument);
router.get(
  "/document-cosign-qualified",
  queryController.getIsDocumentCoSignQualified,
);
router.get("/cosign-status", queryController.getCoSignStatus);
router.get("/cosign-policy", queryController.getCoSignPolicyCurrent);
router.get(
  "/cosign-operator-config",
  queryController.getCoSignOperatorConfigCurrent,
);
router.get("/operator", queryController.getOperatorById);
router.get("/operator-status", queryController.getOperatorStatus);
router.get("/recovery-alias-status", queryController.getRecoveryAliasStatus);

export default router;
