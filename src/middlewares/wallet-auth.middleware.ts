import { Request, Response, NextFunction } from "express";
import { getWalletSession } from "../services/wallet.auth.service";
import { ApiErrors } from "../utils/errors";

function extractBearerToken(req: Request): string {
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

export function requireWalletSession(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const token = extractBearerToken(req);
  const session = getWalletSession(token);

  if (!session) {
    throw ApiErrors.unauthorized("Invalid or expired wallet session");
  }

  req.walletSession = session;
  next();
}
