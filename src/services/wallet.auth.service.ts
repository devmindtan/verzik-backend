import crypto from "crypto";
import { ethers } from "ethers";
import { checkPermission } from "./blockchain.permission.service";
import type { WalletAuthNonce, WalletSession } from "../types/auth.types";

const nonceStore = new Map<string, WalletAuthNonce>();
const sessionStore = new Map<string, WalletSession>();

const NONCE_TTL_MS = Number(process.env.WALLET_NONCE_TTL_MS || 5 * 60 * 1000);
const SESSION_TTL_MS = Number(
  process.env.WALLET_SESSION_TTL_MS || 24 * 60 * 60 * 1000,
);

function nowMs(): number {
  return Date.now();
}

function randomHex(size = 16): string {
  return crypto.randomBytes(size).toString("hex");
}

function buildSignInMessage(address: string, nonce: string): string {
  const appName = process.env.APP_NAME?.trim() || "Verzik Backend";
  return [
    `${appName} Wallet Login`,
    `Address: ${address}`,
    `Nonce: ${nonce}`,
    `Issued At: ${new Date().toISOString()}`,
  ].join("\n");
}

function cleanupExpired(): void {
  const now = nowMs();

  for (const [address, nonceItem] of nonceStore.entries()) {
    if (nonceItem.expiresAt <= now) {
      nonceStore.delete(address);
    }
  }

  for (const [token, session] of sessionStore.entries()) {
    if (session.expiresAt <= now) {
      sessionStore.delete(token);
    }
  }
}

export function issueWalletNonce(address: string): WalletAuthNonce {
  cleanupExpired();

  const checksumAddress = ethers.getAddress(address);
  const nonce = randomHex(16);
  const message = buildSignInMessage(checksumAddress, nonce);
  const expiresAt = nowMs() + NONCE_TTL_MS;

  const payload: WalletAuthNonce = {
    address: checksumAddress,
    nonce,
    message,
    expiresAt,
  };

  nonceStore.set(checksumAddress.toLowerCase(), payload);
  return payload;
}

export async function verifyWalletLogin(
  address: string,
  signature: string,
): Promise<WalletSession> {
  cleanupExpired();

  const checksumAddress = ethers.getAddress(address);
  const key = checksumAddress.toLowerCase();
  const savedNonce = nonceStore.get(key);

  if (!savedNonce || savedNonce.expiresAt <= nowMs()) {
    throw new Error("Nonce expired or not found");
  }

  const recovered = ethers.verifyMessage(savedNonce.message, signature);
  if (recovered.toLowerCase() !== key) {
    throw new Error("Invalid wallet signature");
  }

  nonceStore.delete(key);

  const role = await checkPermission(checksumAddress);
  const issuedAt = nowMs();
  const expiresAt = issuedAt + SESSION_TTL_MS;
  const token = randomHex(32);
  const tenantId = process.env.DEFAULT_TENANT_ID?.trim();

  const session: WalletSession = {
    token,
    address: checksumAddress,
    role,
    issuedAt,
    expiresAt,
    tenantId: tenantId || undefined,
  };

  sessionStore.set(token, session);
  return session;
}

export function getWalletSession(token: string): WalletSession | null {
  cleanupExpired();

  const session = sessionStore.get(token);
  if (!session) {
    return null;
  }

  if (session.expiresAt <= nowMs()) {
    sessionStore.delete(token);
    return null;
  }

  return session;
}

export function revokeWalletSession(token: string): void {
  sessionStore.delete(token);
}
