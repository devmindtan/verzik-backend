# Dataflow Sign API (Write/Sign) - Verzik Backend

Tai lieu nay mo ta rieng nhom API ghi state va ky giao dich blockchain.

Muc tieu:

- Tach biet hoan toan voi query API.
- Bao phu day du cac ham write da co trong SDK `BlockchainSignClient`.
- Mo ta luong: Input -> Validation -> Service -> SDK Sign Client -> Tx Hash output.

## 0. Wallet Auth (Backend-only)

Sign APIs hien tai yeu cau wallet session token tu backend:

1. `POST /api/v1/blockchain/auth/wallet/nonce` voi body `{ address }`.
2. Client ky `message` tra ve tu nonce endpoint bang vi user.
3. `POST /api/v1/blockchain/auth/wallet/verify` voi `{ address, signature }` de lay `token`.
4. Goi cac API `/sign/*` voi header `Authorization: Bearer <token>`.

Thong tin duoc gan tu session:

- `walletSession.address`: dia chi vi da login.
- `walletSession.role`: role tu `checkPermission`.
- `walletSession.tenantId`: tenant mac dinh neu co `DEFAULT_TENANT_ID`.

## 1. Kiem Tra SDK Coverage

SDK sign client da co day du cac action write:

1. `createTenant`
2. `setTenantStatus`
3. `joinAsOperator`
4. `topUpStake`
5. `updateOperatorMetadata`
6. `requestUnstake`
7. `executeUnstake`
8. `registerWithSignature`
9. `coSignDocumentWithSignature`
10. `setRecoveryDelegate`
11. `recoverOperatorByDelegate`
12. `setTreasury`
13. `revokeDocument`
14. `slashOperator`
15. `softSlashOperator`
16. `setOperatorStatus`
17. `recoverOperatorByAdmin`
18. `setCoSignPolicy`
19. `setCoSignOperator`
20. `setMinOperatorStake`
21. `setUnstakeCooldown`
22. `setViolationPenalty`

Ket luan: SDK da du, backend can expose API day du (da bo sung).

## 2. Gas Payer Matrix (Hien Tai)

Phan loai theo smartcontract + backend hien tai:

### 2.1 Nhom Relayer (server gui tx, PRIVATE_KEY env tra gas)

- `createTenant`
- `setTenantStatus`
- `setOperatorStatus`
- `setTreasury`
- `slashOperator`
- `softSlashOperator`
- `setMinOperatorStake`
- `setUnstakeCooldown`
- `setViolationPenalty`
- `setCoSignPolicy`
- `setCoSignOperator`
- `recoverOperatorByAdmin`
- `registerWithSignature` (user ky typed-data, backend relay)
- `coSignDocumentWithSignature` (user ky typed-data, backend relay)

### 2.2 Nhom Wallet-Direct (vi dang nhap tu gui tx, vi user tra gas)

- `joinAsOperator`
- `topUpStake`
- `updateOperatorMetadata`
- `requestUnstake`
- `executeUnstake`
- `setRecoveryDelegate`
- `recoverOperatorByDelegate`

Ly do: cac ham nay phu thuoc truc tiep `msg.sender` trong contract, khong co variant EIP-712 de relay dung danh tinh user.

### 2.3 Hybrid theo role

- `revokeDocument`: hop le voi issuer (wallet-direct) hoac tenant admin (co the relay neu backend signer dung role).

## 3. Pipeline Chung Cho Sign API

Dataflow chung:

1. Request `POST /api/v1/blockchain/sign/*` + `Authorization: Bearer <token>` vao Express.
2. Controller validate body theo field bat buoc va kieu du lieu.
3. Neu endpoint thuoc nhom Wallet-Direct: backend tra loi yeu cau gui tx truc tiep tu vi login.
4. Neu endpoint thuoc nhom Relayer: controller goi `BlockchainSignService`.
5. Service lay `SignClient` tu `createBlockchainSignClient`.
6. SDK gui transaction on-chain qua `protocolContract` va `wallet` (PRIVATE_KEY).
7. SDK `await tx.wait()` va tra `receipt.hash`.
8. Controller tra 200 voi `successResponse({ txHash })`.

Luu y cau hinh:

- Can `RPC_URL`, `PROTOCOL_ADDRESS`, va `PRIVATE_KEY` de gui tx.
- Neu thieu private key, sdk se nem loi khong the ky/gui transaction.
- Co the dat `DEFAULT_TENANT_ID` de khong can truyen `tenantId` moi request.

## 3. Danh Sach Sign Endpoints Va Dataflow

## 3.1 Tenant Governance

### `POST /api/v1/blockchain/sign/create-tenant`

Input:

- `tenantName`
- `treasuryAddress`
- `config.admin`
- `config.operatorManager`
- `config.minStake`
- `config.unstakeCooldown` (bigint-compatible)

Flow:

1. Validate body.
2. Service -> `signClient.createTenant(...)`.
3. Contract ghi tenant moi.
4. Tra `txHash`.

### `POST /api/v1/blockchain/sign/tenant-status`

Input:

- `tenantId`
- `isActive` (boolean)

Flow:

1. Validate body.
2. Service -> `signClient.setTenantStatus(...)`.
3. Contract cap nhat status tenant.
4. Tra `txHash`.

## 3.2 Operator Lifecycle

### `POST /api/v1/blockchain/sign/join-operator`

Input:

- `tenantId` (optional neu da co `DEFAULT_TENANT_ID`)
- `metadataURI`
- `stakeAmount`

Flow:

1. Validate body.
2. Backend tra thong bao Wallet-Direct required.
3. Client phai goi contract truc tiep bang vi login de user tra gas.

### `POST /api/v1/blockchain/sign/topup-stake`

Input:

- `tenantId`
- `stakeAmount`

Flow:

1. Validate body.
2. Backend tra thong bao Wallet-Direct required.
3. Client phai goi contract truc tiep bang vi login de user tra gas.

### `POST /api/v1/blockchain/sign/operator-metadata`

Input:

- `tenantId`
- `metadataURI`

Flow:

1. Validate body.
2. Backend tra thong bao Wallet-Direct required.
3. Client phai goi contract truc tiep bang vi login de user tra gas.

### `POST /api/v1/blockchain/sign/request-unstake`

Input:

- `tenantId`

Flow:

1. Validate body.
2. Backend tra thong bao Wallet-Direct required.
3. Client phai goi contract truc tiep bang vi login de user tra gas.

### `POST /api/v1/blockchain/sign/execute-unstake`

Input:

- `tenantId`

Flow:

1. Validate body.
2. Backend tra thong bao Wallet-Direct required.
3. Client phai goi contract truc tiep bang vi login de user tra gas.

### `POST /api/v1/blockchain/sign/operator-status`

Input:

- `tenantId`
- `operator`
- `isActive` (boolean)
- `reason`

Flow:

1. Validate body.
2. Service -> `signClient.setOperatorStatus(...)`.
3. Contract cap nhat status operator.
4. Tra `txHash`.

### `POST /api/v1/blockchain/sign/slash-operator`

Input:

- `tenantId`
- `operator`
- `reason`

Flow:

1. Validate body.
2. Service -> `signClient.slashOperator(...)`.
3. Contract hard slash.
4. Tra `txHash`.

### `POST /api/v1/blockchain/sign/soft-slash-operator`

Input:

- `tenantId`
- `operator`
- `violationCode`
- `reason`

Flow:

1. Validate body.
2. Service -> `signClient.softSlashOperator(...)`.
3. Contract soft slash theo penalty config.
4. Tra `txHash`.

## 3.3 Document Anchoring / Co-sign

### `POST /api/v1/blockchain/sign/register-with-signature`

Input:

- `payload.tenantId` (optional neu da co `DEFAULT_TENANT_ID`)
- `payload.fileHash`
- `payload.owner` (optional, mac dinh theo wallet session)
- `payload.cid`
- `payload.ciphertextHash`
- `payload.encryptionMetaHash`
- `payload.docType` (int)
- `payload.version` (int)
- `payload.nonce` (bigint-compatible)
- `payload.deadline` (bigint-compatible)

Flow:

1. Validate payload + `signature`.
2. Verify off-chain: signature phai thuoc vi dang login.
3. Service -> `signClient.registerWithProvidedSignature(payload, signature)`.
4. Backend relay tx len chain (server tra gas), contract recover signer tu payload/signature.
5. Tra `txHash`.

### `POST /api/v1/blockchain/sign/cosign-with-signature`

Input:

- `payload.tenantId` (optional neu da co `DEFAULT_TENANT_ID`)
- `payload.fileHash`
- `payload.nonce` (bigint-compatible)
- `payload.deadline` (bigint-compatible)

Flow:

1. Validate payload + `signature`.
2. Verify off-chain: signature phai thuoc vi dang login.
3. Service -> `signClient.coSignWithProvidedSignature(payload, signature)`.
4. Backend relay tx len chain (server tra gas), contract recover signer tu payload/signature.
5. Tra `txHash`.

### `POST /api/v1/blockchain/sign/revoke-document`

Input:

- `tenantId`
- `fileHash`
- `reason`

Flow:

1. Validate body.
2. Service -> `signClient.revokeDocument(...)`.
3. Contract revoke document.
4. Tra `txHash`.

### `POST /api/v1/blockchain/sign/cosign-policy`

Input:

- `tenantId`
- `docType` (int)
- `enabled` (boolean)
- `minStake` (string ETH)
- `minSigners` (bigint-compatible)
- `requiredRoleMask` (bigint-compatible)

Flow:

1. Validate body.
2. Service -> `signClient.setCoSignPolicy(...)`.
3. Contract cap nhat policy.
4. Tra `txHash`.

### `POST /api/v1/blockchain/sign/cosign-operator`

Input:

- `tenantId`
- `docType` (int)
- `operator`
- `whitelisted` (boolean)
- `roleId` (int)

Flow:

1. Validate body.
2. Service -> `signClient.setCoSignOperator(...)`.
3. Contract cap nhat whitelist/role.
4. Tra `txHash`.

## 3.4 Recovery

### `POST /api/v1/blockchain/sign/recovery-delegate`

Input:

- `tenantId`
- `delegate`

Flow:

1. Validate body.
2. Backend tra thong bao Wallet-Direct required.
3. Client phai goi contract truc tiep bang vi login de user tra gas.

### `POST /api/v1/blockchain/sign/recover-by-delegate`

Input:

- `tenantId`
- `lostOperator`
- `reason`

Flow:

1. Validate body.
2. Backend tra thong bao Wallet-Direct required.
3. Client phai goi contract truc tiep bang vi login de user tra gas.

### `POST /api/v1/blockchain/sign/recover-by-admin`

Input:

- `tenantId`
- `lostOperator`
- `newOperator`
- `reason`

Flow:

1. Validate body.
2. Service -> `signClient.recoverOperatorByAdmin(...)`.
3. Contract recover theo admin.
4. Tra `txHash`.

## 3.5 Tenant Runtime Config

### `POST /api/v1/blockchain/sign/treasury`

Input:

- `tenantId`
- `newTreasury`

Flow:

1. Validate body.
2. Service -> `signClient.setTreasury(...)`.
3. Contract doi treasury.
4. Tra `txHash`.

### `POST /api/v1/blockchain/sign/min-operator-stake`

Input:

- `tenantId`
- `newMinOperatorStake` (string ETH)

Flow:

1. Validate body.
2. Service -> `signClient.setMinOperatorStake(...)`.
3. Contract doi min stake.
4. Tra `txHash`.

### `POST /api/v1/blockchain/sign/unstake-cooldown`

Input:

- `tenantId`
- `newUnstakeCooldown` (bigint-compatible)

Flow:

1. Validate body.
2. Service -> `signClient.setUnstakeCooldown(...)`.
3. Contract doi cooldown.
4. Tra `txHash`.

### `POST /api/v1/blockchain/sign/violation-penalty`

Input:

- `tenantId`
- `violationCode`
- `penaltyBps` (int)

Flow:

1. Validate body.
2. Service -> `signClient.setViolationPenalty(...)`.
3. Contract doi muc penalty cho violation code.
4. Tra `txHash`.

## 4. Error Flow (Sign APIs)

1. Controller validate that bai -> throw `ApiErrors.badRequest(...)` (400).
2. Service/SDK throw loi blockchain -> service catch va tra chuoi rong.
3. Controller bat ket qua txHash rong -> throw `internal_error` co message theo action.
4. `errorHandler` tra envelope error chuan.

## 5. Tach Biet Query Va Sign

- Query APIs: doc/tra cuu trang thai va lich su (`GET`).
- Sign APIs: thao tac ghi state + ky tx (`POST /sign/*`).
- Tai lieu query tiep tuc nam o `docs/API_DATAFLOW.md`.
- Tai lieu sign nam rieng o file nay de tranh tron hai luong read/write.
