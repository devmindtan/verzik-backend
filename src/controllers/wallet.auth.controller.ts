import { Request, Response } from "express";
import { ethers } from "ethers";
import { asyncHandler } from "../middlewares/errorHandler";
import { ApiErrors } from "../utils/errors";
import { successResponse } from "../utils/response";
import {
  getWalletSession,
  issueWalletNonce,
  revokeWalletSession,
  verifyWalletLogin,
} from "../services/wallet.auth.service";

function requireAddress(value: unknown): string {
  if (typeof value !== "string" || !ethers.isAddress(value)) {
    throw ApiErrors.badRequest("Invalid wallet address format");
  }
  return ethers.getAddress(value);
}

function requireBearerToken(req: Request): string {
  const authHeader = req.header("authorization")?.trim();
  if (!authHeader) {
    throw ApiErrors.unauthorized("Missing Authorization header");
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    throw ApiErrors.unauthorized("Authorization must be Bearer token");
  }

  return token;
}

export const requestWalletNonce = asyncHandler(
  async (req: Request, res: Response) => {
    const address = requireAddress(req.body?.address);
    const payload = issueWalletNonce(address);

    return res.status(200).json(
      successResponse({
        address: payload.address,
        nonce: payload.nonce,
        message: payload.message,
        expiresAt: payload.expiresAt,
      }),
    );
  },
);

export const verifyWalletSignature = asyncHandler(
  async (req: Request, res: Response) => {
    const address = requireAddress(req.body?.address);
    const signature = req.body?.signature;

    if (typeof signature !== "string" || signature.trim().length === 0) {
      throw ApiErrors.badRequest("signature is required");
    }

    const session = await verifyWalletLogin(address, signature.trim());

    return res.status(200).json(
      successResponse({
        token: session.token,
        address: session.address,
        role: session.role,
        tenantId: session.tenantId || null,
        expiresAt: session.expiresAt,
      }),
    );
  },
);

export const getWalletMe = asyncHandler(async (req: Request, res: Response) => {
  const token = requireBearerToken(req);
  const session = getWalletSession(token);

  if (!session) {
    throw ApiErrors.unauthorized("Invalid or expired wallet session");
  }

  return res.status(200).json(
    successResponse({
      address: session.address,
      role: session.role,
      tenantId: session.tenantId || null,
      expiresAt: session.expiresAt,
    }),
  );
});

export const logoutWallet = asyncHandler(
  async (req: Request, res: Response) => {
    const token = requireBearerToken(req);
    revokeWalletSession(token);

    return res.status(200).json(successResponse({ loggedOut: true }));
  },
);
