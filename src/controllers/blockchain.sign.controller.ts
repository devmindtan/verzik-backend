import { Request, Response } from "express";
import { ethers } from "ethers";
import { asyncHandler } from "../middlewares/errorHandler";
import { ApiErrors } from "../utils/errors";
import { successResponse } from "../utils/response";
import {
  BlockchainSignService,
  type RegisterPayload,
} from "../services/blockchain.sign.service";
import type { TenantConfig } from "@verzik/sdk";

const signService = new BlockchainSignService();

function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw ApiErrors.badRequest(`${field} is required`);
  }
  return value.trim();
}

function requireTenantId(value: unknown, field = "tenantId"): string {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  const defaultTenantId = process.env.DEFAULT_TENANT_ID?.trim();
  if (defaultTenantId) {
    return defaultTenantId;
  }

  throw ApiErrors.badRequest(
    `${field} is required (or set DEFAULT_TENANT_ID in env)`,
  );
}

function resolveTenantId(
  req: Request,
  value: unknown,
  field = "tenantId",
): string {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  const sessionTenant = req.walletSession?.tenantId?.trim();
  if (sessionTenant) {
    return sessionTenant;
  }

  return requireTenantId(value, field);
}

function requireSessionWallet(req: Request): string {
  const address = req.walletSession?.address?.trim();
  if (!address) {
    throw ApiErrors.unauthorized("Missing authenticated wallet session");
  }
  return address;
}

function requireAmountString(value: unknown, field: string): string {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return String(value);
  }
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  throw ApiErrors.badRequest(
    `${field} is required and must be a positive number/string`,
  );
}

function requireBoolean(value: unknown, field: string): boolean {
  if (typeof value !== "boolean") {
    throw ApiErrors.badRequest(`${field} must be boolean`);
  }
  return value;
}

function requireNumber(value: unknown, field: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw ApiErrors.badRequest(`${field} must be a valid number`);
  }
  return parsed;
}

function requireInt(value: unknown, field: string, min = 0): number {
  const parsed = requireNumber(value, field);
  if (!Number.isInteger(parsed) || parsed < min) {
    throw ApiErrors.badRequest(`${field} must be an integer >= ${min}`);
  }
  return parsed;
}

function requireBigInt(value: unknown, field: string): bigint {
  try {
    if (typeof value === "bigint") return value;
    if (typeof value === "number" && Number.isInteger(value))
      return BigInt(value);
    if (typeof value === "string" && value.trim().length > 0)
      return BigInt(value.trim());
  } catch {
    // noop
  }
  throw ApiErrors.badRequest(`${field} must be bigint-compatible`);
}

function ensureTxHash(txHash: string, action: string): string {
  if (!txHash) {
    throw ApiErrors.internalError(`${action} failed to return tx hash`);
  }
  return txHash;
}

function requireSignature(value: unknown, field = "signature"): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw ApiErrors.badRequest(`${field} is required`);
  }
  return value.trim();
}

function requireWalletDirectExecution(action: string): never {
  throw ApiErrors.badRequest(
    `${action} must be sent directly by the logged-in wallet (user pays gas). Backend relayer is disabled for this action.`,
  );
}

function protocolAddressFromEnv(): string {
  const address = process.env.PROTOCOL_ADDRESS?.trim();
  if (!address || !ethers.isAddress(address)) {
    throw ApiErrors.internalError(
      "PROTOCOL_ADDRESS is missing/invalid for signature verification",
    );
  }
  return address;
}

function chainIdFromEnv(): bigint {
  const raw = process.env.CHAIN_ID?.trim() || "31337";
  try {
    return BigInt(raw);
  } catch {
    throw ApiErrors.internalError(
      "CHAIN_ID is invalid for signature verification",
    );
  }
}

function assertRegisterSignatureBelongsToSession(
  req: Request,
  payload: RegisterPayload,
  signature: string,
): void {
  const signer = ethers.verifyTypedData(
    {
      name: "VoucherProtocol",
      version: "1",
      chainId: chainIdFromEnv(),
      verifyingContract: protocolAddressFromEnv(),
    },
    {
      Register: [
        { name: "tenantId", type: "bytes32" },
        { name: "fileHash", type: "bytes32" },
        { name: "owner", type: "address" },
        { name: "cid", type: "string" },
        { name: "ciphertextHash", type: "bytes32" },
        { name: "encryptionMetaHash", type: "bytes32" },
        { name: "docType", type: "uint32" },
        { name: "version", type: "uint32" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
    payload,
    signature,
  );

  const sessionWallet = requireSessionWallet(req).toLowerCase();
  if (signer.toLowerCase() !== sessionWallet) {
    throw ApiErrors.unauthorized(
      "Register signature must be signed by the logged-in wallet",
    );
  }
}

function assertCoSignSignatureBelongsToSession(
  req: Request,
  payload: {
    tenantId: string;
    fileHash: string;
    nonce: bigint;
    deadline: bigint;
  },
  signature: string,
): void {
  const signer = ethers.verifyTypedData(
    {
      name: "VoucherProtocol",
      version: "1",
      chainId: chainIdFromEnv(),
      verifyingContract: protocolAddressFromEnv(),
    },
    {
      CoSign: [
        { name: "tenantId", type: "bytes32" },
        { name: "fileHash", type: "bytes32" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
    payload,
    signature,
  );

  const sessionWallet = requireSessionWallet(req).toLowerCase();
  if (signer.toLowerCase() !== sessionWallet) {
    throw ApiErrors.unauthorized(
      "CoSign signature must be signed by the logged-in wallet",
    );
  }
}

export const createTenant = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantName = requireString(req.body.tenantName, "tenantName");
    const treasuryAddress = requireString(
      req.body.treasuryAddress,
      "treasuryAddress",
    );

    const config: TenantConfig = {
      admin: requireString(req.body.config?.admin, "config.admin"),
      operatorManager: requireString(
        req.body.config?.operatorManager,
        "config.operatorManager",
      ),
      minStake: requireString(req.body.config?.minStake, "config.minStake"),
      unstakeCooldown: requireBigInt(
        req.body.config?.unstakeCooldown,
        "config.unstakeCooldown",
      ),
    };

    const txHash = await signService.createTenant(
      tenantName,
      treasuryAddress,
      config,
    );
    return res
      .status(200)
      .json(successResponse({ txHash: ensureTxHash(txHash, "createTenant") }));
  },
);

export const setTenantStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = resolveTenantId(req, req.body.tenantId);
    const isActive = requireBoolean(req.body.isActive, "isActive");

    const txHash = await signService.setTenantStatus(tenantId, isActive);
    return res
      .status(200)
      .json(
        successResponse({ txHash: ensureTxHash(txHash, "setTenantStatus") }),
      );
  },
);

export const joinAsOperator = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = resolveTenantId(req, req.body.tenantId);
    const metadataURI = requireString(req.body.metadataURI, "metadataURI");
    const stakeAmount = requireAmountString(
      req.body.stakeAmount,
      "stakeAmount",
    );

    // This action relies on msg.sender in contract and must be sent directly by user wallet.
    void tenantId;
    void metadataURI;
    void stakeAmount;
    return requireWalletDirectExecution("joinAsOperator");
  },
);

export const topUpStake = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = resolveTenantId(req, req.body.tenantId);
  const stakeAmount = requireAmountString(req.body.stakeAmount, "stakeAmount");

  void tenantId;
  void stakeAmount;
  return requireWalletDirectExecution("topUpStake");
});

export const updateOperatorMetadata = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = resolveTenantId(req, req.body.tenantId);
    const metadataURI = requireString(req.body.metadataURI, "metadataURI");

    void tenantId;
    void metadataURI;
    return requireWalletDirectExecution("updateOperatorMetadata");
  },
);

export const requestUnstake = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = resolveTenantId(req, req.body.tenantId);
    void tenantId;
    return requireWalletDirectExecution("requestUnstake");
  },
);

export const executeUnstake = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = resolveTenantId(req, req.body.tenantId);
    void tenantId;
    return requireWalletDirectExecution("executeUnstake");
  },
);

export const registerWithSignature = asyncHandler(
  async (req: Request, res: Response) => {
    const ownerFromSession = req.walletSession?.address;

    const payload: RegisterPayload = {
      tenantId: resolveTenantId(
        req,
        req.body.payload?.tenantId,
        "payload.tenantId",
      ),
      fileHash: requireString(req.body.payload?.fileHash, "payload.fileHash"),
      owner:
        typeof req.body.payload?.owner === "string" &&
        req.body.payload.owner.trim().length > 0
          ? req.body.payload.owner.trim()
          : ownerFromSession || requireSessionWallet(req),
      cid: requireString(req.body.payload?.cid, "payload.cid"),
      ciphertextHash: requireString(
        req.body.payload?.ciphertextHash,
        "payload.ciphertextHash",
      ),
      encryptionMetaHash: requireString(
        req.body.payload?.encryptionMetaHash,
        "payload.encryptionMetaHash",
      ),
      docType: requireInt(req.body.payload?.docType, "payload.docType", 0),
      version: requireInt(req.body.payload?.version, "payload.version", 0),
      nonce: requireBigInt(req.body.payload?.nonce, "payload.nonce"),
      deadline: requireBigInt(req.body.payload?.deadline, "payload.deadline"),
    };

    const signature = requireSignature(req.body.signature);
    assertRegisterSignatureBelongsToSession(req, payload, signature);

    const txHash = await signService.registerWithSignature(payload, signature);
    return res.status(200).json(
      successResponse({
        txHash: ensureTxHash(txHash, "registerWithSignature"),
      }),
    );
  },
);

export const coSignDocumentWithSignature = asyncHandler(
  async (req: Request, res: Response) => {
    const payload = {
      tenantId: resolveTenantId(
        req,
        req.body.payload?.tenantId,
        "payload.tenantId",
      ),
      fileHash: requireString(req.body.payload?.fileHash, "payload.fileHash"),
      nonce: requireBigInt(req.body.payload?.nonce, "payload.nonce"),
      deadline: requireBigInt(req.body.payload?.deadline, "payload.deadline"),
    };

    const signature = requireSignature(req.body.signature);
    assertCoSignSignatureBelongsToSession(req, payload, signature);

    const txHash = await signService.coSignDocumentWithSignature(
      payload,
      signature,
    );
    return res.status(200).json(
      successResponse({
        txHash: ensureTxHash(txHash, "coSignDocumentWithSignature"),
      }),
    );
  },
);

export const setRecoveryDelegate = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = resolveTenantId(req, req.body.tenantId);
    const delegate = requireString(req.body.delegate, "delegate");

    void tenantId;
    void delegate;
    return requireWalletDirectExecution("setRecoveryDelegate");
  },
);

export const recoverOperatorByDelegate = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = resolveTenantId(req, req.body.tenantId);
    const lostOperator = requireString(req.body.lostOperator, "lostOperator");
    const reason = requireString(req.body.reason, "reason");

    void tenantId;
    void lostOperator;
    void reason;
    return requireWalletDirectExecution("recoverOperatorByDelegate");
  },
);

export const setTreasury = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = resolveTenantId(req, req.body.tenantId);
  const newTreasury = requireString(req.body.newTreasury, "newTreasury");

  const txHash = await signService.setTreasury(tenantId, newTreasury);
  return res
    .status(200)
    .json(successResponse({ txHash: ensureTxHash(txHash, "setTreasury") }));
});

export const revokeDocument = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = resolveTenantId(req, req.body.tenantId);
    const fileHash = requireString(req.body.fileHash, "fileHash");
    const reason = requireString(req.body.reason, "reason");

    const txHash = await signService.revokeDocument(tenantId, fileHash, reason);
    return res
      .status(200)
      .json(
        successResponse({ txHash: ensureTxHash(txHash, "revokeDocument") }),
      );
  },
);

export const slashOperator = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = resolveTenantId(req, req.body.tenantId);
    const operator = requireString(req.body.operator, "operator");
    const reason = requireString(req.body.reason, "reason");

    const txHash = await signService.slashOperator(tenantId, operator, reason);
    return res
      .status(200)
      .json(successResponse({ txHash: ensureTxHash(txHash, "slashOperator") }));
  },
);

export const softSlashOperator = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = resolveTenantId(req, req.body.tenantId);
    const operator = requireString(req.body.operator, "operator");
    const violationCode = requireString(
      req.body.violationCode,
      "violationCode",
    );
    const reason = requireString(req.body.reason, "reason");

    const txHash = await signService.softSlashOperator(
      tenantId,
      operator,
      violationCode,
      reason,
    );
    return res
      .status(200)
      .json(
        successResponse({ txHash: ensureTxHash(txHash, "softSlashOperator") }),
      );
  },
);

export const setOperatorStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = resolveTenantId(req, req.body.tenantId);
    const operator = requireString(req.body.operator, "operator");
    const isActive = requireBoolean(req.body.isActive, "isActive");
    const reason = requireString(req.body.reason, "reason");

    const txHash = await signService.setOperatorStatus(
      tenantId,
      operator,
      isActive,
      reason,
    );
    return res
      .status(200)
      .json(
        successResponse({ txHash: ensureTxHash(txHash, "setOperatorStatus") }),
      );
  },
);

export const recoverOperatorByAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = resolveTenantId(req, req.body.tenantId);
    const lostOperator = requireString(req.body.lostOperator, "lostOperator");
    const newOperator = requireString(req.body.newOperator, "newOperator");
    const reason = requireString(req.body.reason, "reason");

    const txHash = await signService.recoverOperatorByAdmin(
      tenantId,
      lostOperator,
      newOperator,
      reason,
    );
    return res.status(200).json(
      successResponse({
        txHash: ensureTxHash(txHash, "recoverOperatorByAdmin"),
      }),
    );
  },
);

export const setCoSignPolicy = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = resolveTenantId(req, req.body.tenantId);
    const docType = requireInt(req.body.docType, "docType", 0);
    const enabled = requireBoolean(req.body.enabled, "enabled");
    const minStake = requireString(req.body.minStake, "minStake");
    const minSigners = requireBigInt(req.body.minSigners, "minSigners");
    const requiredRoleMask = requireBigInt(
      req.body.requiredRoleMask,
      "requiredRoleMask",
    );

    const txHash = await signService.setCoSignPolicy(
      tenantId,
      docType,
      enabled,
      minStake,
      minSigners,
      requiredRoleMask,
    );
    return res
      .status(200)
      .json(
        successResponse({ txHash: ensureTxHash(txHash, "setCoSignPolicy") }),
      );
  },
);

export const setCoSignOperator = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = resolveTenantId(req, req.body.tenantId);
    const docType = requireInt(req.body.docType, "docType", 0);
    const operator = requireString(req.body.operator, "operator");
    const whitelisted = requireBoolean(req.body.whitelisted, "whitelisted");
    const roleId = requireInt(req.body.roleId, "roleId", 0);

    const txHash = await signService.setCoSignOperator(
      tenantId,
      docType,
      operator,
      whitelisted,
      roleId,
    );
    return res
      .status(200)
      .json(
        successResponse({ txHash: ensureTxHash(txHash, "setCoSignOperator") }),
      );
  },
);

export const setMinOperatorStake = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = resolveTenantId(req, req.body.tenantId);
    const newMinOperatorStake = requireString(
      req.body.newMinOperatorStake,
      "newMinOperatorStake",
    );

    const txHash = await signService.setMinOperatorStake(
      tenantId,
      newMinOperatorStake,
    );
    return res.status(200).json(
      successResponse({
        txHash: ensureTxHash(txHash, "setMinOperatorStake"),
      }),
    );
  },
);

export const setUnstakeCooldown = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = resolveTenantId(req, req.body.tenantId);
    const newUnstakeCooldown = requireBigInt(
      req.body.newUnstakeCooldown,
      "newUnstakeCooldown",
    );

    const txHash = await signService.setUnstakeCooldown(
      tenantId,
      newUnstakeCooldown,
    );
    return res
      .status(200)
      .json(
        successResponse({ txHash: ensureTxHash(txHash, "setUnstakeCooldown") }),
      );
  },
);

export const setViolationPenalty = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = resolveTenantId(req, req.body.tenantId);
    const violationCode = requireString(
      req.body.violationCode,
      "violationCode",
    );
    const penaltyBps = requireInt(req.body.penaltyBps, "penaltyBps", 0);

    const txHash = await signService.setViolationPenalty(
      tenantId,
      violationCode,
      penaltyBps,
    );
    return res.status(200).json(
      successResponse({
        txHash: ensureTxHash(txHash, "setViolationPenalty"),
      }),
    );
  },
);
