/**
 * Refactored Blockchain Query Controller
 * Based on backend-patterns skill - improved error handling and response format
 */

import { Request, Response } from "express";
import { BlockchainQueryService } from "../services/blockchain.query.service";
import { asyncHandler } from "../middlewares/errorHandler";
import { ApiErrors } from "../utils/errors";
import { successResponse } from "../utils/response";
import {
  parseListQuery,
  parseIdQuery,
  parseTxHashQuery,
} from "../dtos/query.dto";

const queryService = new BlockchainQueryService();

// List endpoints with pagination
export const getDocuments = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit, offset } = parseListQuery(req.query);
    const result = await queryService.getDocumentAnchoreds(limit);
    return res.status(200).json(
      successResponse(result.data || [], {
        total: result.total || 0,
        limit,
        offset,
      }),
    );
  },
);

export const getOperators = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit, offset } = parseListQuery(req.query);
    const result = await queryService.getOperatorJoineds(limit);
    return res.status(200).json(
      successResponse(result || [], {
        limit,
        offset,
      }),
    );
  },
);

export const getTenants = asyncHandler(async (req: Request, res: Response) => {
  const { limit, offset } = parseListQuery(req.query);
  const result = await queryService.getTenantCreateds(limit);
  return res.status(200).json(
    successResponse(result || [], {
      limit,
      offset,
    }),
  );
});

export const getProtocolInitializeds = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit, offset } = parseListQuery(req.query);
    const result = await queryService.getProtocolInitializeds(limit);
    return res.status(200).json(
      successResponse(result || [], {
        limit,
        offset,
      }),
    );
  },
);

export const getTenantStatusUpdateds = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit, offset } = parseListQuery(req.query);
    const result = await queryService.getTenantStatusUpdateds(limit);
    return res.status(200).json(
      successResponse(result || [], {
        limit,
        offset,
      }),
    );
  },
);

export const getMinOperatorStakeUpdateds = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit, offset } = parseListQuery(req.query);
    const result = await queryService.getMinOperatorStakeUpdateds(limit);
    return res.status(200).json(
      successResponse(result || [], {
        limit,
        offset,
      }),
    );
  },
);

export const getUnstakeCooldownUpdateds = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit, offset } = parseListQuery(req.query);
    const result = await queryService.getUnstakeCooldownUpdateds(limit);
    return res.status(200).json(
      successResponse(result || [], {
        limit,
        offset,
      }),
    );
  },
);

export const getPenalties = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit, offset } = parseListQuery(req.query);
    const result = await queryService.getViolationPenaltyUpdateds(limit);
    return res.status(200).json(
      successResponse(result || [], {
        limit,
        offset,
      }),
    );
  },
);

export const getTenantCount = asyncHandler(
  async (req: Request, res: Response) => {
    const count = await queryService.getTenantCount();
    return res.status(200).json(
      successResponse({
        count,
      }),
    );
  },
);

export const getNonces = asyncHandler(async (req: Request, res: Response) => {
  const { limit, offset } = parseListQuery(req.query);
  const result = await queryService.getNonceConsumeds(limit);
  return res.status(200).json(
    successResponse(result || [], {
      limit,
      offset,
    }),
  );
});

export const getDocumentQualifieds = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit, offset } = parseListQuery(req.query);
    const result = await queryService.getDocumentCoSignQualifieds(limit);
    return res.status(200).json(
      successResponse(result || [], {
        limit,
        offset,
      }),
    );
  },
);

export const getDocumentCoSigneds = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit, offset } = parseListQuery(req.query);
    const result = await queryService.getDocumentCoSigneds(limit);
    return res.status(200).json(
      successResponse(result || [], {
        limit,
        offset,
      }),
    );
  },
);

export const getDocumentRevokeds = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit, offset } = parseListQuery(req.query);
    const result = await queryService.getDocumentRevokeds(limit);
    return res.status(200).json(
      successResponse(result || [], {
        limit,
        offset,
      }),
    );
  },
);

export const getCoSignOperators = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit, offset } = parseListQuery(req.query);
    const result = await queryService.getCoSignOperatorConfigureds(limit);
    return res.status(200).json(
      successResponse(result || [], {
        limit,
        offset,
      }),
    );
  },
);

export const getCoSignPolicies = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit, offset } = parseListQuery(req.query);
    const result = await queryService.getCoSignPolicyUpdateds(limit);
    return res.status(200).json(
      successResponse(result || [], {
        limit,
        offset,
      }),
    );
  },
);

export const getOperatorHardSlasheds = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit, offset } = parseListQuery(req.query);
    const result = await queryService.getOperatorHardSlasheds(limit);
    return res.status(200).json(
      successResponse(result || [], {
        limit,
        offset,
      }),
    );
  },
);

export const getOperatorSoftSlasheds = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit, offset } = parseListQuery(req.query);
    const result = await queryService.getOperatorSoftSlasheds(limit);
    return res.status(200).json(
      successResponse(result || [], {
        limit,
        offset,
      }),
    );
  },
);

export const getOperatorUnstakeRequesteds = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit, offset } = parseListQuery(req.query);
    const result = await queryService.getOperatorUnstakeRequesteds(limit);
    return res.status(200).json(
      successResponse(result || [], {
        limit,
        offset,
      }),
    );
  },
);

export const getOperatorUnstakeds = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit, offset } = parseListQuery(req.query);
    const result = await queryService.getOperatorUnstakeds(limit);
    return res.status(200).json(
      successResponse(result || [], {
        limit,
        offset,
      }),
    );
  },
);

export const getOperatorMetadataUpdateds = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit, offset } = parseListQuery(req.query);
    const result = await queryService.getOperatorMetadataUpdateds(limit);
    return res.status(200).json(
      successResponse(result || [], {
        limit,
        offset,
      }),
    );
  },
);

export const getOperatorStatusUpdateds = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit, offset } = parseListQuery(req.query);
    const result = await queryService.getOperatorStatusUpdateds(limit);
    return res.status(200).json(
      successResponse(result || [], {
        limit,
        offset,
      }),
    );
  },
);

export const getOperatorStakeToppedUps = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit, offset } = parseListQuery(req.query);
    const result = await queryService.getOperatorStakeToppedUps(limit);
    return res.status(200).json(
      successResponse(result || [], {
        limit,
        offset,
      }),
    );
  },
);

export const getOperatorRecoveryDelegateUpdateds = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit, offset } = parseListQuery(req.query);
    const result =
      await queryService.getOperatorRecoveryDelegateUpdateds(limit);
    return res.status(200).json(
      successResponse(result || [], {
        limit,
        offset,
      }),
    );
  },
);

export const getOperatorRecovereds = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit, offset } = parseListQuery(req.query);
    const result = await queryService.getOperatorRecovereds(limit);
    return res.status(200).json(
      successResponse(result || [], {
        limit,
        offset,
      }),
    );
  },
);

export const getOperatorRecoveryAliasUpdateds = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit, offset } = parseListQuery(req.query);
    const result = await queryService.getOperatorRecoveryAliasUpdateds(limit);
    return res.status(200).json(
      successResponse(result || [], {
        limit,
        offset,
      }),
    );
  },
);

export const getTreasuryUpdateds = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit, offset } = parseListQuery(req.query);
    const result = await queryService.getTreasuryUpdateds(limit);
    return res.status(200).json(
      successResponse(result || [], {
        limit,
        offset,
      }),
    );
  },
);

// ID-based endpoints
export const getTransactionByHash = asyncHandler(
  async (req: Request, res: Response) => {
    const txHash = parseTxHashQuery(req.query);
    if (!txHash) {
      throw ApiErrors.badRequest("Invalid transaction hash");
    }

    const result = await queryService.getTransactionByHash(txHash);
    if (!result) {
      throw ApiErrors.notFound("Transaction");
    }

    return res.status(200).json(successResponse(result));
  },
);

export const getNonceById = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, signer, operator } = req.query;
    const resolvedSigner = (signer || operator) as string | undefined;

    if (!tenantId || !resolvedSigner) {
      throw ApiErrors.badRequest(
        "tenantId and signer (or operator) are required",
      );
    }

    const result = await queryService.getAllNonceConsumedInfoById(
      tenantId as string,
      resolvedSigner,
    );
    return res.status(200).json(successResponse(result || []));
  },
);

export const getPenaltyById = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = parseIdQuery(req.query);
    if (!tenantId) {
      throw ApiErrors.badRequest("tenantId is required");
    }

    const result = await queryService.getPenaltyById(tenantId);
    return res.status(200).json(successResponse(result || []));
  },
);

export const getTenantById = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = parseIdQuery(req.query);
    if (!tenantId) {
      throw ApiErrors.badRequest("tenantId is required");
    }

    const result = await queryService.getAllTenantInfoById(tenantId);
    return res.status(200).json(successResponse(result || []));
  },
);

export const getTenantInfo = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = parseIdQuery(req.query);
    if (!tenantId) {
      throw ApiErrors.badRequest("tenantId is required");
    }

    const result = await queryService.getTenantInfo(tenantId);
    if (!result) {
      throw ApiErrors.notFound("Tenant");
    }

    return res.status(200).json(successResponse(result));
  },
);

export const getTenantRuntimeConfig = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = parseIdQuery(req.query);
    if (!tenantId) {
      throw ApiErrors.badRequest("tenantId is required");
    }

    const result = await queryService.getTenantRuntimeConfig(tenantId);
    return res.status(200).json(successResponse(result));
  },
);

export const getDocumentById = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, fileHash } = req.query;

    if (!tenantId || !fileHash) {
      throw ApiErrors.badRequest("tenantId and fileHash are required");
    }

    const result = await queryService.getAllDocumentInfoById(
      tenantId as string,
      fileHash as string,
    );
    return res.status(200).json(successResponse(result || []));
  },
);

export const getDocumentStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, fileHash } = req.query;

    if (!tenantId || !fileHash) {
      throw ApiErrors.badRequest("tenantId and fileHash are required");
    }

    const result = await queryService.getDocumentStatus(
      tenantId as string,
      fileHash as string,
    );
    if (!result) {
      throw ApiErrors.notFound("Document");
    }

    return res.status(200).json(successResponse(result));
  },
);

export const getOperatorById = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, operator } = req.query;

    if (!tenantId || !operator) {
      throw ApiErrors.badRequest("tenantId and operator are required");
    }

    const result = await queryService.getAllOperatorInfoById(
      tenantId as string,
      operator as string,
    );
    return res.status(200).json(successResponse(result || []));
  },
);

export const getOperatorStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, operator } = req.query;

    if (!tenantId || !operator) {
      throw ApiErrors.badRequest("tenantId and operator are required");
    }

    const result = await queryService.getOperatorStatus(
      tenantId as string,
      operator as string,
    );
    if (!result) {
      throw ApiErrors.notFound("Operator");
    }

    return res.status(200).json(successResponse(result));
  },
);

export const getNonceCountById = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, operator, signer } = req.query;
    const resolvedOperator = (operator || signer) as string | undefined;

    if (!tenantId || !resolvedOperator) {
      throw ApiErrors.badRequest(
        "tenantId and operator (or signer) are required",
      );
    }

    const count = await queryService.getNonceCount(
      tenantId as string,
      resolvedOperator,
    );
    return res.status(200).json(
      successResponse({
        tenantId,
        operator: resolvedOperator,
        nonce: count,
      }),
    );
  },
);

export const verifyDocumentStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, fileHash } = req.query;

    if (!tenantId || !fileHash) {
      throw ApiErrors.badRequest("tenantId and fileHash are required");
    }

    const result = await queryService.verifyDocument(
      tenantId as string,
      fileHash as string,
    );
    if (!result) {
      throw ApiErrors.notFound("Document");
    }

    return res.status(200).json(successResponse(result));
  },
);

export const getHasSignedDocument = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, fileHash, signer } = req.query;

    if (!tenantId || !fileHash || !signer) {
      throw ApiErrors.badRequest("tenantId, fileHash and signer are required");
    }

    const hasSigned = await queryService.hasSignedDocument(
      tenantId as string,
      fileHash as string,
      signer as string,
    );

    return res.status(200).json(
      successResponse({
        tenantId,
        fileHash,
        signer,
        hasSigned,
      }),
    );
  },
);

export const getIsDocumentCoSignQualified = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, fileHash } = req.query;

    if (!tenantId || !fileHash) {
      throw ApiErrors.badRequest("tenantId and fileHash are required");
    }

    const qualified = await queryService.isDocumentCoSignQualified(
      tenantId as string,
      fileHash as string,
    );

    return res.status(200).json(
      successResponse({
        tenantId,
        fileHash,
        qualified,
      }),
    );
  },
);

export const getCoSignStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, fileHash } = req.query;

    if (!tenantId || !fileHash) {
      throw ApiErrors.badRequest("tenantId and fileHash are required");
    }

    const result = await queryService.getCoSignStatus(
      tenantId as string,
      fileHash as string,
    );
    if (!result) {
      throw ApiErrors.notFound("Document");
    }

    return res.status(200).json(successResponse(result));
  },
);

export const getCoSignPolicyCurrent = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, docType } = req.query;

    if (!tenantId || docType === undefined) {
      throw ApiErrors.badRequest("tenantId and docType are required");
    }

    const parsedDocType = Number(docType);
    if (!Number.isInteger(parsedDocType) || parsedDocType < 0) {
      throw ApiErrors.badRequest("docType must be a non-negative integer");
    }

    const result = await queryService.getCoSignPolicy(
      tenantId as string,
      parsedDocType,
    );
    if (!result) {
      throw ApiErrors.notFound("CoSignPolicy");
    }

    return res.status(200).json(successResponse(result));
  },
);

export const getCoSignOperatorConfigCurrent = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, docType, operator } = req.query;

    if (!tenantId || docType === undefined || !operator) {
      throw ApiErrors.badRequest("tenantId, docType and operator are required");
    }

    const parsedDocType = Number(docType);
    if (!Number.isInteger(parsedDocType) || parsedDocType < 0) {
      throw ApiErrors.badRequest("docType must be a non-negative integer");
    }

    const result = await queryService.getCoSignOperatorConfig(
      tenantId as string,
      parsedDocType,
      operator as string,
    );
    if (!result) {
      throw ApiErrors.notFound("CoSignOperatorConfig");
    }

    return res.status(200).json(successResponse(result));
  },
);

export const getCurrentViolationPenalty = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, violationCode } = req.query;

    if (!tenantId || !violationCode) {
      throw ApiErrors.badRequest("tenantId and violationCode are required");
    }

    const penaltyBps = await queryService.getCurrentViolationPenalty(
      tenantId as string,
      violationCode as string,
    );
    if (penaltyBps === null) {
      throw ApiErrors.notFound("ViolationPenalty");
    }

    return res.status(200).json(
      successResponse({
        tenantId,
        violationCode,
        penaltyBps,
      }),
    );
  },
);

export const getRecoveryAliasStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, operator } = req.query;

    if (!tenantId || !operator) {
      throw ApiErrors.badRequest("tenantId and operator are required");
    }

    const result = await queryService.getRecoveryAliasStatus(
      tenantId as string,
      operator as string,
    );
    if (!result) {
      throw ApiErrors.notFound("RecoveryAliasStatus");
    }

    return res.status(200).json(successResponse(result));
  },
);
