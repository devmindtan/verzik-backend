# Dataflow Text Cho API Verzik Backend

Tai lieu nay mo ta luong du lieu tu luc API nhan input den luc tra output trong runtime hien tai cua `verzik-backend`.

Pham vi:

- Chi tinh cac endpoint dang duoc mount trong `src/index.ts`.
- Mo ta theo luong: Route -> Controller -> Validation -> Service -> Data source -> Response/Error.
- Co ghi chu cac endpoint/file chua nam trong runtime path.

## 1. Pipeline Chung (Ap Dung Cho Moi API)

Dataflow chung:

1. Request vao Express app.
2. Qua `cors()` voi origin/headers/methods theo ENV.
3. Qua `express.json()` de parse body JSON (neu co).
4. Match route theo prefix `/api/v1/blockchain` (hoac `/`, `/health`).
5. Controller duoc wrap boi `asyncHandler`.
6. Controller validate input (query/body) -> goi Service.
7. Service goi 1 trong 2 nguon du lieu:

- Direct query (RPC + contract reader/protocol) qua `DirectQueryClient`.
- Graph query (subgraph/graph node) qua `GraphQueryClient`.

8. Controller dong goi ket qua bang `successResponse({ data, meta?, links? })`.
9. Neu throw `ApiError` -> `errorHandler` tra JSON loi dung status code.
10. Neu throw loi khac -> `errorHandler` tra 500.

## 2. Health Endpoints

### `GET /`

Dataflow:

1. Route root trong `src/index.ts` nhan request.
2. Khong can input.
3. Tra 200 voi envelope:

- `data.message = "Sandbox Backend API Server"`
- `data.version = "1.0.0"`
- `data.status = "running"`

### `GET /health`

Dataflow:

1. Route health trong `src/index.ts` nhan request.
2. Khong can input.
3. Tra 200 voi envelope:

- `data.status = "healthy"`
- `data.timestamp = ISO string`.

## 3. Query APIs (`GET /api/v1/blockchain/*`)

## 3.1 Nhom List Endpoints

Pattern chung:

1. Route map sang controller query tu `src/routes/blockchain.query.api.ts`.
2. Controller goi `parseListQuery(req.query)`:

- `limit`: min=1, max=1000, default=20.
- `offset`: min=0, default=0.

3. Controller goi service tuong ung voi `limit`.
4. Service goi `queryClient.getSelectedQueries([...], limit)` den GraphQueryClient.
5. Neu service bat loi: log va tra `[]` (hoac `{ data: [], total: 0 }`).
6. Controller luon tra 200 voi `successResponse(...)`, kem `meta.limit`, `meta.offset` (va co endpoint kem `meta.total`).

Danh sach list endpoint va service method:

- `GET /documents` -> `getDocumentAnchoreds(limit)` -> graph query `getDocumentAnchoreds`.
- `GET /documents/cosigneds` -> `getDocumentCoSigneds(limit)`.
- `GET /documents/revokeds` -> `getDocumentRevokeds(limit)`.
- `GET /operators` -> `getOperatorJoineds(limit)` -> graph query `getOperatorJoineds`.
- `GET /operators/metadata-updateds` -> `getOperatorMetadataUpdateds(limit)`.
- `GET /operators/status-updateds` -> `getOperatorStatusUpdateds(limit)`.
- `GET /operators/stake-topped-ups` -> `getOperatorStakeToppedUps(limit)`.
- `GET /tenants` -> `getTenantCreateds(limit)` -> graph query `getTenantCreateds`.
- `GET /tenants/status-updateds` -> `getTenantStatusUpdateds(limit)`.
- `GET /tenants/min-operator-stake-updateds` -> `getMinOperatorStakeUpdateds(limit)`.
- `GET /tenants/unstake-cooldown-updateds` -> `getUnstakeCooldownUpdateds(limit)`.
- `GET /tenants/treasury-updateds` -> `getTreasuryUpdateds(limit)`.
- `GET /penalties` -> `getViolationPenaltyUpdateds(limit)` -> graph query `getViolationPenaltyUpdateds`.
- `GET /nonces` -> `getNonceConsumeds(limit)` -> graph query `getNonceConsumeds`.
- `GET /protocol-initializeds` -> `getProtocolInitializeds(limit)`.
- `GET /documents/qualifieds` -> `getDocumentCoSignQualifieds(limit)`.
- `GET /cosign-operators` -> `getCoSignOperatorConfigureds(limit)`.
- `GET /cosign-policies` -> `getCoSignPolicyUpdateds(limit)`.
- `GET /operators/hard-slashed` -> `getOperatorHardSlasheds(limit)`.
- `GET /operators/soft-slashed` -> `getOperatorSoftSlasheds(limit)`.
- `GET /operators/unstake-requested` -> `getOperatorUnstakeRequesteds(limit)`.
- `GET /operators/unstaked` -> `getOperatorUnstakeds(limit)`.
- `GET /operators/recovery-delegate-updateds` -> `getOperatorRecoveryDelegateUpdateds(limit)`.
- `GET /operators/recovereds` -> `getOperatorRecovereds(limit)`.
- `GET /operators/recovery-alias-updateds` -> `getOperatorRecoveryAliasUpdateds(limit)`.

Luu y quan trong:

- Truong `offset` hien duoc validate va tra trong `meta`, nhung chua truyen vao service/subgraph query. Nghia la phan trang thuc te hien tai chi theo `limit`.

## 3.2 Tenant Count

### `GET /tenant-count`

Dataflow:

1. Controller goi `queryService.getTenantCount()`.
2. Service lay direct client `getDirectQuery()`.
3. Goi `directQuery.getTenantCount()` qua RPC.
4. Convert sang `Number`.
5. Tra 200 voi `data.count`.
6. Neu loi service: tra `0` (van 200).

## 3.3 Detail Endpoints (Theo ID/Query)

### `GET /transaction?txHash=...`

Dataflow:

1. Controller parse `txHash` bang `parseTxHashQuery(req.query)`.
2. Neu null -> throw `ApiErrors.badRequest("Invalid transaction hash")` (400).
3. Service goi `directQuery.getTransactionByHash(txHash)`.
4. Service JSON-serialize de chuyen `bigint` thanh string.
5. Neu khong co data -> controller throw `ApiErrors.notFound("Transaction")` (404).
6. Neu co data -> tra 200 voi `data = transaction`.

### `GET /nonce?tenantId=...&signer=...` hoac `?tenantId=...&operator=...`

Dataflow:

1. Controller doc truc tiep query `tenantId`, `signer`, `operator` (uu tien signer, fallback operator).
2. Neu thieu -> 400 (`tenantId and signer (or operator) are required`).
3. Service goi custom graph query `nonceConsumeds(where: { tenantId, signer })`.
4. Tra 200 voi danh sach su kien nonce (hoac `[]`).

### `GET /penalty?id=...`

Dataflow:

1. Controller goi `parseIdQuery(req.query)` (doc truong `id`).
2. Neu null -> 400 message `tenantId is required`.
3. Service custom query `violationPenaltyUpdateds(where: { tenantId })`.
4. Tra 200 voi data/[] .

### `GET /tenant?id=...`

Dataflow:

1. Parse `id`.
2. Neu thieu -> 400 (`tenantId is required`).
3. Service custom query tong hop:

- `tenantCreateds`
- `tenantStatusUpdateds`
- `minOperatorStakeUpdateds`
- `unstakeCooldownUpdateds`

4. Tra 200 voi snapshot tong hop theo tenant.

### `GET /tenant-info?id=...`

Dataflow:

1. Parse `id`.
2. Neu thieu -> 400 (`tenantId is required`).
3. Service goi direct query `getTenantInfo(tenantId)`.
4. Neu null -> 404 `Tenant not found`.
5. Neu co data -> 200.

### `GET /tenant-config?id=...`

Dataflow:

1. Parse `id`.
2. Neu thieu -> 400 (`tenantId is required`).
3. Service goi direct query `getTenantRuntimeConfig(tenantId)`.
4. Service convert ve object number:

- `minOperatorStake`
- `unstakeCooldown`

5. Tra 200. Neu loi service: tra `{ minOperatorStake: 0, unstakeCooldown: 0 }`.

### `GET /document?tenantId=...&fileHash=...`

Dataflow:

1. Controller validate `tenantId` va `fileHash` (doc truc tiep query).
2. Neu thieu -> 400 (`tenantId and fileHash are required`).
3. Service custom graph query tong hop:

- `documentAnchoreds`
- `documentCoSignQualifieds`
- `documentCoSigneds`
- `documentRevokeds`

4. Service lower-case `tenantId`, `fileHash` truoc khi query.
5. Tra 200 voi data tong hop/[] .

### `GET /document-status?tenantId=...&fileHash=...`

Dataflow:

1. Validate `tenantId`, `fileHash`.
2. Neu thieu -> 400.
3. Service goi direct query `getDocumentStatus(tenantId, fileHash)`.
4. Neu null -> 404 `Document not found`.
5. Neu co -> 200.

### `GET /operator?tenantId=...&operator=...`

Dataflow:

1. Validate `tenantId`, `operator`.
2. Neu thieu -> 400.
3. Service custom graph query tong hop:

- `operatorJoineds`
- `operatorStatusUpdateds`
- `coSignOperatorConfigureds`
- `operatorStakeToppedUps`
- `operatorSlasheds`
- `operatorSoftSlasheds`

4. Service lower-case `tenantId`, `operator` truoc khi query.
5. Tra 200 voi data tong hop/[] .

### `GET /operator-status?tenantId=...&operator=...`

Dataflow:

1. Validate `tenantId`, `operator`.
2. Neu thieu -> 400.
3. Service goi direct query `getOperatorStatus(tenantId, operator)`.
4. Neu null -> 404 `Operator not found`.
5. Neu co -> 200.

## 4. Permission API (`POST /api/v1/blockchain/permissions/check`)

### `POST /permissions/check`

Input body:

- `address: string` (Ethereum wallet).

Dataflow:

1. Route map vao `checkPermissionHandler`.
2. Controller validate:

- Co `address` trong body, neu khong -> 400.
- `ethers.isAddress(address)` hop le, neu khong -> 400.

3. Controller goi service `checkPermission(address)`.
4. Service normalize checksum + lowercase.
5. Service read ENV bat buoc:

- `RPC_URL`
- `PROTOCOL_ADDRESS`
- (optional) `READER_ADDRESS`.

6. Service validate format address ENV.
7. Service tao `JsonRpcProvider`, song song lay network, blockNumber, protocol bytecode.
8. Service tao blockchain context (`createBlockchainContext`).
9. Buoc 1 check role on-chain:

- Tinh role hash `PROTOCOL_ADMIN_ROLE`.
- Goi `protocolContract.hasRole(PROTOCOL_ADMIN_ROLE, userAddress)`.
- Neu true -> return role `PROTOCOL_OWNER`.

10. Buoc 2 check tenant role tren subgraph:

- Goi `getTenantsByUsers(userAddressLower)`.
- So khop voi `admin`, `manager`, `treasury`.
- Return role dau tien match: `TENANT_ADMIN` | `TENANT_MANAGER` | `TENANT_TREASURY`.

11. Buoc 3 check operator tren subgraph:

- Goi `getOperatorByUsers(userAddressLower)`.
- Neu match `operator` -> return `OPERATOR`.

12. Neu khong match gi -> return `GUEST`.
13. Controller tra 200:

- `data.address`
- `data.role`
- `data.hasPermission = !!role`.

Luu y quan trong:

- Hien tai `role` luon la string (`PROTOCOL_OWNER`, ..., `GUEST`), nen `hasPermission = !!role` se luon la `true` ke ca `GUEST`.

## 5. Error Dataflow

Khi controller throw `ApiError`:

1. `asyncHandler` bat loi va chuyen vao `next(err)`.
2. `errorHandler` kiem tra `instanceof ApiError`.
3. Tra JSON:

- `error.code`
- `error.message`
- `error.details?`.

4. HTTP status theo error factory (400/401/403/404/422/429/500/503/502).

Khi throw loi thuong:

1. `errorHandler` log stack.
2. Tra 500 `internal_error`.
3. Message la generic trong production, chi tiet hon o non-production.

## 6. Not Found Route

Dataflow:

1. Request khong match bat ky route nao.
2. `notFoundHandler` tra 404:

- `error.code = not_found`
- `error.message = "Route not found"`.

## 7. Cac File Co San Nhung Chua Nam Trong Runtime Path

- `src/controllers/blockchain.sign.controller.ts`: da expose day du write/sign endpoint.
- `src/services/blockchain.sign.service.ts`: da duoc route/controller runtime goi thong qua sign APIs.

Nghia la backend hien tai da tach ro query/permission APIs va write/sign APIs qua HTTP.

## 8. Coverage Emit -> SDK -> Backend

Ket qua doi chieu event emit trong `IVoucherProtocolErrorsEvents`:

- SDK (`GraphQueryClient`) da co method truy van cho toan bo event emit trong interface.
- Backend da duoc bo sung endpoint list de cover day du cac event do.
- Khong can sua them o SDK cho danh sach event emit nay.

## 9. Nhom API Detail Theo 2 Loai

Phan loai API detail theo yeu cau nghiep vu:

Loai 1: Trang thai hien tai cua doi tuong tren blockchain (moi nhat)

- `GET /tenant-info`
- `GET /tenant-config`
- `GET /operator-status`
- `GET /document-status`
- `GET /nonce-count`
- `GET /violation-penalty`
- `GET /document-verify`
- `GET /document-signed`
- `GET /document-cosign-qualified`
- `GET /cosign-status`
- `GET /cosign-policy`
- `GET /cosign-operator-config`
- `GET /recovery-alias-status`

Loai 2: Lich su giao dich/phat sinh su kien theo doi tuong cha

- `GET /tenant`
- `GET /operator`
- `GET /document`
- `GET /nonce`
- `GET /penalty`

Ngoai ra, cac endpoint list event (tenants/operators/documents/.../updateds, .../slashed, .../recovereds) la lich su su kien tong hop toan he thong hoac theo bo loc phia query, khong phai snapshot state hien tai.
