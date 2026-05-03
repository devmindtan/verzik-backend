import { BlockchainQueryClient } from "../configs/blockchain.query.config";
import type {
  DocumentCoSigned,
  DocumentRevoked,
  TenantCreated,
  OperatorJoined,
  ViolationPenaltyUpdated,
  NonceConsumed,
  EnhancedTxResult,
  CoSignOperatorConfigured,
  CoSignPolicyUpdated,
  MinOperatorStakeUpdated,
  OperatorMetadataUpdated,
  OperatorRecovered,
  OperatorRecoveryAliasUpdated,
  OperatorRecoveryDelegateUpdated,
  OperatorSlashed,
  OperatorSoftSlashed,
  OperatorStakeToppedUp,
  OperatorStatusUpdated,
  OperatorUnstakeRequested,
  OperatorUnstaked,
  OperatorStatus,
  ProtocolInitialized,
  TenantInfo,
  TenantStatusUpdated,
  TreasuryUpdated,
  UnstakeCooldownUpdated,
  DocumentSnapshot,
} from "@verzik/sdk";
import type { DataResponseWithTotal } from "../types/graph.type";
export class BlockchainQueryService {
  private queryClient: BlockchainQueryClient;
  constructor() {
    this.queryClient = new BlockchainQueryClient();
  }

  private toSafeJson<T>(data: T): T {
    return JSON.parse(
      JSON.stringify(data, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    ) as T;
  }

  async getTenantCount(): Promise<number> {
    try {
      const directQuery = await this.queryClient.getDirectQuery();
      const count = await directQuery.getTenantCount();
      const data = Number(count);
      return data;
    } catch (error) {
      console.error("Service Error [getTenantCount]:", error);
      return 0;
    }
  }

  async getNonceCount(tenantId: string, operator: string): Promise<number> {
    try {
      const directQuery = await this.queryClient.getDirectQuery();
      const count = await directQuery.getNonceCount(tenantId, operator);
      const data = Number(count);
      return data;
    } catch (error) {
      console.error("Service Error [getNonce]:", error);
      return 0;
    }
  }

  async getTransactionByHash(txHash: string): Promise<EnhancedTxResult | null> {
    try {
      const directQuery = await this.queryClient.getDirectQuery();
      const data = await directQuery.getTransactionByHash(txHash);
      return this.toSafeJson(data);
    } catch (error) {
      console.error("Service Error [getTransactionByHash]:", error);
      return null;
    }
  }
  async getCoSignOperatorConfigureds(
    first?: number,
  ): Promise<CoSignOperatorConfigured[]> {
    try {
      const data = await this.queryClient.getSelectedQueries(
        ["getCoSignOperatorConfigureds"],
        first,
      );
      const result = data as Record<string, any>;
      return result["getCoSignOperatorConfigureds"];
    } catch (error) {
      console.error("Service Error [getCoSignOperatorConfigureds]:", error);
      return [];
    }
  }
  async getCoSignPolicyUpdateds(
    first?: number,
  ): Promise<CoSignPolicyUpdated[]> {
    try {
      const data = await this.queryClient.getSelectedQueries(
        ["getCoSignPolicyUpdateds"],
        first,
      );
      const result = data as Record<string, any>;
      return result["getCoSignPolicyUpdateds"];
    } catch (error) {
      console.error("Service Error [getCoSignPolicyUpdateds]:", error);
      return [];
    }
  }
  async getOperatorHardSlasheds(first?: number): Promise<OperatorSlashed[]> {
    try {
      const data = await this.queryClient.getSelectedQueries(
        ["getOperatorSlasheds"],
        first,
      );
      const result = data as Record<string, any>;
      return result["getOperatorSlasheds"];
    } catch (error) {
      console.error("Service Error [getOperatorSlasheds]:", error);
      return [];
    }
  }
  async getOperatorSoftSlasheds(
    first?: number,
  ): Promise<OperatorSoftSlashed[]> {
    try {
      const data = await this.queryClient.getSelectedQueries(
        ["getOperatorSoftSlasheds"],
        first,
      );
      const result = data as Record<string, any>;
      return result["getOperatorSoftSlasheds"];
    } catch (error) {
      console.error("Service Error [getOperatorSoftSlasheds]:", error);
      return [];
    }
  }
  async getOperatorUnstakeRequesteds(
    first?: number,
  ): Promise<OperatorUnstakeRequested[]> {
    try {
      const data = await this.queryClient.getSelectedQueries(
        ["getOperatorUnstakeRequesteds"],
        first,
      );
      const result = data as Record<string, any>;
      return result["getOperatorUnstakeRequesteds"];
    } catch (error) {
      console.error("Service Error [getOperatorUnstakeRequesteds]:", error);
      return [];
    }
  }
  async getOperatorUnstakeds(first?: number): Promise<OperatorUnstaked[]> {
    try {
      const data = await this.queryClient.getSelectedQueries(
        ["getOperatorUnstakeds"],
        first,
      );
      const result = data as Record<string, any>;
      return result["getOperatorUnstakeds"];
    } catch (error) {
      console.error("Service Error [getOperatorUnstakeds]:", error);
      return [];
    }
  }
  async getTenantRuntimeConfig(tenantId: string): Promise<{
    minOperatorStake: number;
    unstakeCooldown: number;
  }> {
    try {
      const directQuery = await this.queryClient.getDirectQuery();
      const data = await directQuery.getTenantRuntimeConfig(tenantId);
      return {
        minOperatorStake: Number(data.minOperatorStake),
        unstakeCooldown: Number(data.unstakeCooldown),
      };
    } catch (error) {
      console.error("Service Error [getTenantRuntimeConfig]:", error);
      return { minOperatorStake: 0, unstakeCooldown: 0 };
    }
  }
  async getDocumentStatus(
    tenantId: string,
    fileHash: string,
  ): Promise<DocumentSnapshot | null> {
    try {
      const directQuery = await this.queryClient.getDirectQuery();
      const data = await directQuery.getDocumentStatus(tenantId, fileHash);
      return this.toSafeJson(data);
    } catch (error) {
      console.error("Service Error [getDocumentStatus]:", error);
      return null;
    }
  }

  async verifyDocument(
    tenantId: string,
    fileHash: string,
  ): Promise<{
    exists: boolean;
    isValid: boolean;
    issuer: string;
    cid: string;
  } | null> {
    try {
      const directQuery = await this.queryClient.getDirectQuery();
      const data = await directQuery.verify(tenantId, fileHash);
      return this.toSafeJson(data);
    } catch (error) {
      console.error("Service Error [verifyDocument]:", error);
      return null;
    }
  }

  async hasSignedDocument(
    tenantId: string,
    fileHash: string,
    signer: string,
  ): Promise<boolean> {
    try {
      const directQuery = await this.queryClient.getDirectQuery();
      return await directQuery.hasSignedDocument(tenantId, fileHash, signer);
    } catch (error) {
      console.error("Service Error [hasSignedDocument]:", error);
      return false;
    }
  }

  async isDocumentCoSignQualified(
    tenantId: string,
    fileHash: string,
  ): Promise<boolean> {
    try {
      const directQuery = await this.queryClient.getDirectQuery();
      return await directQuery.isDocumentCoSignQualified(tenantId, fileHash);
    } catch (error) {
      console.error("Service Error [isDocumentCoSignQualified]:", error);
      return false;
    }
  }

  async getCoSignStatus(
    tenantId: string,
    fileHash: string,
  ): Promise<Record<string, unknown> | null> {
    try {
      const directQuery = await this.queryClient.getDirectQuery();
      const data = await directQuery.getCoSignStatus(tenantId, fileHash);
      return this.toSafeJson(data as unknown as Record<string, unknown>);
    } catch (error) {
      console.error("Service Error [getCoSignStatus]:", error);
      return null;
    }
  }

  async getCoSignPolicy(
    tenantId: string,
    docType: number,
  ): Promise<Record<string, unknown> | null> {
    try {
      const directQuery = await this.queryClient.getDirectQuery();
      const data = await directQuery.getCoSignPolicy(tenantId, docType);
      return this.toSafeJson(data as unknown as Record<string, unknown>);
    } catch (error) {
      console.error("Service Error [getCoSignPolicy]:", error);
      return null;
    }
  }

  async getCoSignOperatorConfig(
    tenantId: string,
    docType: number,
    operator: string,
  ): Promise<{ whitelisted: boolean; roleId: number } | null> {
    try {
      const directQuery = await this.queryClient.getDirectQuery();
      const data = await directQuery.getCoSignOperatorConfig(
        tenantId,
        docType,
        operator,
      );
      return data;
    } catch (error) {
      console.error("Service Error [getCoSignOperatorConfig]:", error);
      return null;
    }
  }

  async getCurrentViolationPenalty(
    tenantId: string,
    violationCode: string,
  ): Promise<number | null> {
    try {
      const directQuery = await this.queryClient.getDirectQuery();
      const data = await directQuery.getViolationPenalty(
        tenantId,
        violationCode,
      );
      return data;
    } catch (error) {
      console.error("Service Error [getCurrentViolationPenalty]:", error);
      return null;
    }
  }

  async getRecoveryAliasStatus(
    tenantId: string,
    operator: string,
  ): Promise<Record<string, unknown> | null> {
    try {
      const directQuery = await this.queryClient.getDirectQuery();
      const data = await directQuery.getRecoveryAliasStatus(tenantId, operator);
      return this.toSafeJson(data as Record<string, unknown>);
    } catch (error) {
      console.error("Service Error [getRecoveryAliasStatus]:", error);
      return null;
    }
  }
  async getOperatorStatus(
    tenantId: string,
    operator: string,
  ): Promise<OperatorStatus | null> {
    try {
      const directQuery = await this.queryClient.getDirectQuery();
      const data = await directQuery.getOperatorStatus(tenantId, operator);
      return this.toSafeJson(data);
    } catch (error) {
      console.error("Service Error [getOperatorStatus]:", error);
      return null;
    }
  }
  async getTenantInfo(tenantId: string): Promise<TenantInfo | null> {
    try {
      const directQuery = await this.queryClient.getDirectQuery();
      const data = await directQuery.getTenantInfo(tenantId);
      return this.toSafeJson(data);
    } catch (error) {
      console.error("Service Error [getTenantInfo]:", error);
      return null;
    }
  }

  async getNonceConsumeds(first?: number): Promise<NonceConsumed[]> {
    try {
      const data = await this.queryClient.getSelectedQueries(
        ["getNonceConsumeds"],
        first,
      );
      const result = data as Record<string, any>;
      return result["getNonceConsumeds"];
    } catch (error) {
      console.error("Service Error [getNonceConsumeds]:", error);
      return [];
    }
  }

  async getAllNonceConsumedInfoById(tenantId: string, signer: string) {
    try {
      const query = `
        query GetAllNonceConsumedInfoById($tenantId: String!, $signer: String!) {
          nonceConsumeds(
            where: { 
              tenantId: $tenantId, 
              signer: $signer 
            }, 
            orderBy: blockTimestamp, 
            orderDirection: desc
          ) {
            blockNumber
            blockTimestamp
            id
            newNonce
            oldNonce
            signer
            tenantId
            transactionHash
          }
}
      `;

      const variables = { tenantId, signer };
      const data = await this.queryClient.getCustomQuery(query, variables);
      return data;
    } catch (error) {
      console.error("Service Error [GetAllNonceConsumedInfoById]:", error);
      return [];
    }
  }

  async getDocumentAnchoreds(first?: number): Promise<DataResponseWithTotal> {
    try {
      const data = await this.queryClient.getSelectedQueries(
        ["getDocumentAnchoreds"],
        first,
      );
      const result = data as Record<string, any>;
      return {
        data: result["getDocumentAnchoreds"] || [],
        total: result["getDocumentAnchoreds"].length || 0,
      };
    } catch (error) {
      console.error("Service Error [getDocumentAnchoreds]:", error);
      return {
        data: [],
        total: 0,
      };
    }
  }

  async getTenantCreateds(first?: number): Promise<TenantCreated[]> {
    try {
      const data = await this.queryClient.getSelectedQueries(
        ["getTenantCreateds"],
        first,
      );
      const result = data as Record<string, any>;
      return result["getTenantCreateds"];
    } catch (error) {
      console.error("Service Error [getTenantCreateds]:", error);
      return [];
    }
  }

  async getProtocolInitializeds(
    first?: number,
  ): Promise<ProtocolInitialized[]> {
    try {
      const data = await this.queryClient.getSelectedQueries(
        ["getProtocolInitializeds"],
        first,
      );
      const result = data as Record<string, any>;
      return result["getProtocolInitializeds"];
    } catch (error) {
      console.error("Service Error [getProtocolInitializeds]:", error);
      return [];
    }
  }

  async getTenantStatusUpdateds(
    first?: number,
  ): Promise<TenantStatusUpdated[]> {
    try {
      const data = await this.queryClient.getSelectedQueries(
        ["getTenantStatusUpdateds"],
        first,
      );
      const result = data as Record<string, any>;
      return result["getTenantStatusUpdateds"];
    } catch (error) {
      console.error("Service Error [getTenantStatusUpdateds]:", error);
      return [];
    }
  }

  async getMinOperatorStakeUpdateds(
    first?: number,
  ): Promise<MinOperatorStakeUpdated[]> {
    try {
      const data = await this.queryClient.getSelectedQueries(
        ["getMinOperatorStakeUpdateds"],
        first,
      );
      const result = data as Record<string, any>;
      return result["getMinOperatorStakeUpdateds"];
    } catch (error) {
      console.error("Service Error [getMinOperatorStakeUpdateds]:", error);
      return [];
    }
  }

  async getUnstakeCooldownUpdateds(
    first?: number,
  ): Promise<UnstakeCooldownUpdated[]> {
    try {
      const data = await this.queryClient.getSelectedQueries(
        ["getUnstakeCooldownUpdateds"],
        first,
      );
      const result = data as Record<string, any>;
      return result["getUnstakeCooldownUpdateds"];
    } catch (error) {
      console.error("Service Error [getUnstakeCooldownUpdateds]:", error);
      return [];
    }
  }

  async getOperatorMetadataUpdateds(
    first?: number,
  ): Promise<OperatorMetadataUpdated[]> {
    try {
      const data = await this.queryClient.getSelectedQueries(
        ["getOperatorMetadataUpdateds"],
        first,
      );
      const result = data as Record<string, any>;
      return result["getOperatorMetadataUpdateds"];
    } catch (error) {
      console.error("Service Error [getOperatorMetadataUpdateds]:", error);
      return [];
    }
  }

  async getOperatorStatusUpdateds(
    first?: number,
  ): Promise<OperatorStatusUpdated[]> {
    try {
      const data = await this.queryClient.getSelectedQueries(
        ["getOperatorStatusUpdateds"],
        first,
      );
      const result = data as Record<string, any>;
      return result["getOperatorStatusUpdateds"];
    } catch (error) {
      console.error("Service Error [getOperatorStatusUpdateds]:", error);
      return [];
    }
  }

  async getOperatorStakeToppedUps(
    first?: number,
  ): Promise<OperatorStakeToppedUp[]> {
    try {
      const data = await this.queryClient.getSelectedQueries(
        ["getOperatorStakeToppedUps"],
        first,
      );
      const result = data as Record<string, any>;
      return result["getOperatorStakeToppedUps"];
    } catch (error) {
      console.error("Service Error [getOperatorStakeToppedUps]:", error);
      return [];
    }
  }

  async getOperatorRecoveryDelegateUpdateds(
    first?: number,
  ): Promise<OperatorRecoveryDelegateUpdated[]> {
    try {
      const data = await this.queryClient.getSelectedQueries(
        ["getOperatorRecoveryDelegateUpdateds"],
        first,
      );
      const result = data as Record<string, any>;
      return result["getOperatorRecoveryDelegateUpdateds"];
    } catch (error) {
      console.error(
        "Service Error [getOperatorRecoveryDelegateUpdateds]:",
        error,
      );
      return [];
    }
  }

  async getOperatorRecovereds(first?: number): Promise<OperatorRecovered[]> {
    try {
      const data = await this.queryClient.getSelectedQueries(
        ["getOperatorRecovereds"],
        first,
      );
      const result = data as Record<string, any>;
      return result["getOperatorRecovereds"];
    } catch (error) {
      console.error("Service Error [getOperatorRecovereds]:", error);
      return [];
    }
  }

  async getOperatorRecoveryAliasUpdateds(
    first?: number,
  ): Promise<OperatorRecoveryAliasUpdated[]> {
    try {
      const data = await this.queryClient.getSelectedQueries(
        ["getOperatorRecoveryAliasUpdateds"],
        first,
      );
      const result = data as Record<string, any>;
      return result["getOperatorRecoveryAliasUpdateds"];
    } catch (error) {
      console.error("Service Error [getOperatorRecoveryAliasUpdateds]:", error);
      return [];
    }
  }

  async getTreasuryUpdateds(first?: number): Promise<TreasuryUpdated[]> {
    try {
      const data = await this.queryClient.getSelectedQueries(
        ["getTreasuryUpdateds"],
        first,
      );
      const result = data as Record<string, any>;
      return result["getTreasuryUpdateds"];
    } catch (error) {
      console.error("Service Error [getTreasuryUpdateds]:", error);
      return [];
    }
  }

  async getDocumentCoSigneds(first?: number): Promise<DocumentCoSigned[]> {
    try {
      const data = await this.queryClient.getSelectedQueries(
        ["getDocumentCoSigneds"],
        first,
      );
      const result = data as Record<string, any>;
      return result["getDocumentCoSigneds"];
    } catch (error) {
      console.error("Service Error [getDocumentCoSigneds]:", error);
      return [];
    }
  }

  async getDocumentRevokeds(first?: number): Promise<DocumentRevoked[]> {
    try {
      const data = await this.queryClient.getSelectedQueries(
        ["getDocumentRevokeds"],
        first,
      );
      const result = data as Record<string, any>;
      return result["getDocumentRevokeds"];
    } catch (error) {
      console.error("Service Error [getDocumentRevokeds]:", error);
      return [];
    }
  }

  async getAllTenantInfoById(tenantId: string) {
    try {
      const query = `
        query GetAllTenantInfoById($tenantId: String!) {
          tenantCreateds(where: { tenantId: $tenantId }, first: 1) {
            admin
            manager
            treasury
            blockTimestamp
            transactionHash
          }
          tenantStatusUpdateds(where: { tenantId: $tenantId }, orderBy: blockTimestamp, orderDirection: desc) {
            isActive
            blockTimestamp
            transactionHash
          }
          minOperatorStakeUpdateds(where: { tenantId: $tenantId }, orderBy: blockTimestamp, orderDirection: desc) {
            oldValue
            newValue
            blockTimestamp
            transactionHash
          }
          unstakeCooldownUpdateds(where: { tenantId: $tenantId }, orderBy: blockTimestamp, orderDirection: desc) {
            oldValue
            newValue
            blockTimestamp
            transactionHash
          }
        }
      `;

      const variables = { tenantId };
      const data = await this.queryClient.getCustomQuery(query, variables);
      return data;
    } catch (error) {
      console.error("Service Error [GetAllTenantInfoById]:", error);
      return [];
    }
  }

  async getAllDocumentInfoById(tenantId: string, fileHash: string) {
    try {
      const query = `
        query GetAllDocumentInfoById($tenantId: String!, $fileHash: String!) {
          documentAnchoreds(where: {tenantId: $tenantId, fileHash: $fileHash}, first: 1) {
            blockNumber
            cid
            blockTimestamp
            ciphertextHash
            docType
            encryptionMetaHash
            fileHash
            id
            issuer
            transactionHash
            owner
            tenantId
            version
          }
          documentCoSignQualifieds(where: { tenantId: $tenantId, fileHash: $fileHash}, orderBy: blockTimestamp, orderDirection: desc) {
            blockNumber
            blockTimestamp
            fileHash
            id
            roleMask
            tenantId
            transactionHash
            trustedSigners
          }
          documentCoSigneds(where: { tenantId: $tenantId, fileHash: $fileHash}, orderBy: blockTimestamp, orderDirection: desc) {
            blockNumber
            blockTimestamp
            fileHash
            id
            signer
            tenantId
            totalSigners
            transactionHash
          }
          documentRevokeds(where: { tenantId: $tenantId, fileHash: $fileHash}, orderBy: blockTimestamp, orderDirection: desc) {
            blockTimestamp
            blockNumber
            id
            fileHash
            reason
            tenantId
            transactionHash
            revoker
          }
        }
      `;
      const variables = {
        tenantId: tenantId.toLowerCase(),
        fileHash: fileHash.toLowerCase(),
      };
      const data = await this.queryClient.getCustomQuery(query, variables);
      return data;
    } catch (error) {
      console.error("Service Error [GetAllDocumentInfoById]:", error);
      return [];
    }
  }

  async getAllOperatorInfoById(tenantId: string, operator: string) {
    try {
      const query = `
        query GetAllOperatorInfoById($tenantId: String!, $operator: String!) {
          operatorJoineds(where: { tenantId: $tenantId, operator: $operator}, first: 1) {
            blockNumber
            blockTimestamp
            id
            metadata
            stake
            tenantId
            transactionHash
            operator
          }
          operatorStatusUpdateds(where: { tenantId: $tenantId, operator: $operator}, orderBy: blockTimestamp, orderDirection: desc) {
            blockNumber
            blockTimestamp
            id
            isActive
            tenantId
            transactionHash
            operator
            reason
          }
          coSignOperatorConfigureds(where: { tenantId: $tenantId, operator: $operator}, orderBy: blockTimestamp, orderDirection: desc) {
            blockNumber
            blockTimestamp
            docType
            id
            operator
            roleId
            tenantId
            transactionHash
            whitelisted
          }
          operatorStakeToppedUps(where: { tenantId: $tenantId, operator: $operator}, orderBy: blockTimestamp, orderDirection: desc) {
            amount
            blockNumber
            blockTimestamp
            id
            operator
            tenantId
            totalStake
            transactionHash
          }
          operatorSlasheds (where: { tenantId: $tenantId, operator: $operator}, orderBy: blockTimestamp, orderDirection: desc){
            amount
            blockNumber
            blockTimestamp
            id
            operator
            reason
            slasher
            tenantId
            transactionHash
          }
          operatorSoftSlasheds(where: { tenantId: $tenantId, operator: $operator}, orderBy: blockTimestamp, orderDirection: desc) {
            blockNumber
            blockTimestamp
            id
            operator
            penaltyBps
            reason
            remainingStake
            slashedAmount
            slasher
            tenantId
            transactionHash
            violationCode
          }
        }
      `;
      const variables = {
        tenantId: tenantId.toLowerCase(),
        operator: operator.toLowerCase(),
      };
      const data = await this.queryClient.getCustomQuery(query, variables);
      return data;
    } catch (error) {
      console.error("Service Error [GetAllOperatorInfoById]:", error);
      return [];
    }
  }
  async getOperatorJoineds(first?: number): Promise<DataResponseWithTotal> {
    try {
      const data = await this.queryClient.getSelectedQueries(
        ["getOperatorJoineds"],
        first,
      );
      const result = data as Record<string, any>;
      return {
        data: result["getOperatorJoineds"] || [],
        total: result["getOperatorJoineds"].length || 0,
      };
    } catch (error) {
      console.error("Service Error [getOperatorJoineds]:", error);
      return {
        data: [],
        total: 0,
      };
    }
  }
  async getViolationPenaltyUpdateds(
    first?: number,
  ): Promise<ViolationPenaltyUpdated[]> {
    try {
      const data = await this.queryClient.getSelectedQueries(
        ["getViolationPenaltyUpdateds"],
        first,
      );
      const result = data as Record<string, any>;
      return result["getViolationPenaltyUpdateds"];
    } catch (error) {
      console.error("Service Error [getViolationPenaltyUpdateds]:", error);
      return [];
    }
  }
  async getPenaltyById(tenantId: string): Promise<ViolationPenaltyUpdated[]> {
    try {
      const query = `
        query GetPenaltyById($tenantId: String!) {
          violationPenaltyUpdateds(where: {tenantId: $tenantId}, first: 1) {
            blockNumber
            id
            newPenaltyBps
            blockTimestamp
            tenantId
            oldPenaltyBps
            transactionHash
            violationCode
          }
        }
      `;
      const variables = {
        tenantId: tenantId.toLowerCase(),
      };
      const data = (await this.queryClient.getCustomQuery(
        query,
        variables,
      )) as ViolationPenaltyUpdated[];
      return data;
    } catch (error) {
      console.error("Service Error [GetPenaltyById]:", error);
      return [];
    }
  }

  async getTenantsByUsers(address: string): Promise<TenantCreated[]> {
    try {
      const data = await this.queryClient.getSelectedQueries(
        ["getTenantsByUsers"],
        address,
      );
      const result = data as Record<string, any>;
      return result["getTenantsByUsers"];
    } catch (error) {
      console.error("Service Error [getTenantsByUser]:", error);
      return [];
    }
  }

  async getOperatorByUsers(address: string): Promise<OperatorJoined[]> {
    try {
      const data = await this.queryClient.getSelectedQueries(
        ["getOperatorByUsers"],
        address,
      );
      const result = data as Record<string, any>;
      return result["getOperatorByUsers"];
    } catch (error) {
      console.error("Service Error [getOperatorByUsers]:", error);
      return [];
    }
  }

  async getDocumentCoSignQualifieds(
    first?: number,
  ): Promise<DataResponseWithTotal> {
    try {
      const data = await this.queryClient.getSelectedQueries(
        ["getDocumentCoSignQualifieds"],
        first,
      );
      const result = data as Record<string, any>;
      return {
        data: result["getDocumentCoSignQualifieds"] || [],
        total: result["getDocumentCoSignQualifieds"].length || 0,
      };
    } catch (error) {
      console.error("Service Error [getDocumentCoSignQualifieds]:", error);
      return {
        data: [],
        total: 0,
      };
    }
  }
}
