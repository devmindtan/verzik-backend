import { BlockchainSignClient } from "../configs/blockchain.sign.config";
import type { TenantConfig } from "@verzik/sdk";

export interface RegisterPayload {
  tenantId: string;
  fileHash: string;
  owner: string;
  cid: string;
  ciphertextHash: string;
  encryptionMetaHash: string;
  docType: number;
  version: number;
  nonce: bigint;
  deadline: bigint;
}

export interface CoSignPayload {
  tenantId: string;
  fileHash: string;
  nonce: bigint;
  deadline: bigint;
}

export class BlockchainSignService {
  private signClient: BlockchainSignClient;

  constructor() {
    this.signClient = new BlockchainSignClient();
  }

  private async getClient() {
    return this.signClient.getSignClient();
  }

  async createTenant(
    tenantName: string,
    treasuryAddress: string,
    config: TenantConfig,
  ): Promise<string> {
    try {
      const signObj = await this.getClient();
      return await signObj.createTenant(tenantName, treasuryAddress, config);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`createTenant failed: ${message}`);
    }
  }

  async setTenantStatus(tenantId: string, isActive: boolean): Promise<string> {
    try {
      const signObj = await this.getClient();
      return await signObj.setTenantStatus(tenantId, isActive);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`setTenantStatus failed: ${message}`);
    }
  }

  async joinAsOperator(
    tenantId: string,
    metadataURI: string,
    stakeAmount: string,
  ): Promise<string> {
    try {
      const signObj = await this.getClient();
      return await signObj.joinAsOperator(tenantId, metadataURI, stakeAmount);
    } catch (error) {
      console.error("Service Error [joinAsOperator]:", error);
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`joinAsOperator failed: ${message}`);
    }
  }

  async topUpStake(tenantId: string, stakeAmount: string): Promise<string> {
    try {
      const signObj = await this.getClient();
      return await signObj.topUpStake(tenantId, stakeAmount);
    } catch (error) {
      console.error("Service Error [topUpStake]:", error);
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`topUpStake failed: ${message}`);
    }
  }

  async updateOperatorMetadata(
    tenantId: string,
    metadataURI: string,
  ): Promise<string> {
    try {
      const signObj = await this.getClient();
      return await signObj.updateOperatorMetadata(tenantId, metadataURI);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`updateOperatorMetadata failed: ${message}`);
    }
  }

  async requestUnstake(tenantId: string): Promise<string> {
    try {
      const signObj = await this.getClient();
      return await signObj.requestUnstake(tenantId);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`requestUnstake failed: ${message}`);
    }
  }

  async executeUnstake(tenantId: string): Promise<string> {
    try {
      const signObj = await this.getClient();
      return await signObj.executeUnstake(tenantId);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`executeUnstake failed: ${message}`);
    }
  }

  async registerWithSignature(
    payload: RegisterPayload,
    signature: string,
  ): Promise<string> {
    try {
      const signObj = await this.getClient();
      return await signObj.registerWithProvidedSignature(payload, signature);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`registerWithSignature failed: ${message}`);
    }
  }

  async coSignDocumentWithSignature(
    payload: CoSignPayload,
    signature: string,
  ): Promise<string> {
    try {
      const signObj = await this.getClient();
      return await signObj.coSignWithProvidedSignature(payload, signature);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`coSignDocumentWithSignature failed: ${message}`);
    }
  }

  async setRecoveryDelegate(
    tenantId: string,
    delegate: string,
  ): Promise<string> {
    try {
      const signObj = await this.getClient();
      return await signObj.setRecoveryDelegate(tenantId, delegate);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`setRecoveryDelegate failed: ${message}`);
    }
  }

  async recoverOperatorByDelegate(
    tenantId: string,
    lostOperator: string,
    reason: string,
  ): Promise<string> {
    try {
      const signObj = await this.getClient();
      return await signObj.recoverOperatorByDelegate(
        tenantId,
        lostOperator,
        reason,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`recoverOperatorByDelegate failed: ${message}`);
    }
  }

  async setTreasury(tenantId: string, newTreasury: string): Promise<string> {
    try {
      const signObj = await this.getClient();
      return await signObj.setTreasury(tenantId, newTreasury);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`setTreasury failed: ${message}`);
    }
  }

  async revokeDocument(
    tenantId: string,
    fileHash: string,
    reason: string,
  ): Promise<string> {
    try {
      const signObj = await this.getClient();
      return await signObj.revokeDocument(tenantId, fileHash, reason);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`revokeDocument failed: ${message}`);
    }
  }

  async slashOperator(
    tenantId: string,
    operator: string,
    reason: string,
  ): Promise<string> {
    try {
      const signObj = await this.getClient();
      return await signObj.slashOperator(tenantId, operator, reason);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`slashOperator failed: ${message}`);
    }
  }

  async softSlashOperator(
    tenantId: string,
    operator: string,
    violationCode: string,
    reason: string,
  ): Promise<string> {
    try {
      const signObj = await this.getClient();
      return await signObj.softSlashOperator(
        tenantId,
        operator,
        violationCode,
        reason,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`softSlashOperator failed: ${message}`);
    }
  }

  async setOperatorStatus(
    tenantId: string,
    operator: string,
    isActive: boolean,
    reason: string,
  ): Promise<string> {
    try {
      const signObj = await this.getClient();
      return await signObj.setOperatorStatus(
        tenantId,
        operator,
        isActive,
        reason,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`setOperatorStatus failed: ${message}`);
    }
  }

  async recoverOperatorByAdmin(
    tenantId: string,
    lostOperator: string,
    newOperator: string,
    reason: string,
  ): Promise<string> {
    try {
      const signObj = await this.getClient();
      return await signObj.recoverOperatorByAdmin(
        tenantId,
        lostOperator,
        newOperator,
        reason,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`recoverOperatorByAdmin failed: ${message}`);
    }
  }

  async setCoSignPolicy(
    tenantId: string,
    docType: number,
    enabled: boolean,
    minStake: string,
    minSigners: bigint,
    requiredRoleMask: bigint,
  ): Promise<string> {
    try {
      const signObj = await this.getClient();
      return await signObj.setCoSignPolicy(
        tenantId,
        docType,
        enabled,
        minStake,
        minSigners,
        requiredRoleMask,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`setCoSignPolicy failed: ${message}`);
    }
  }

  async setCoSignOperator(
    tenantId: string,
    docType: number,
    operator: string,
    whitelisted: boolean,
    roleId: number,
  ): Promise<string> {
    try {
      const signObj = await this.getClient();
      return await signObj.setCoSignOperator(
        tenantId,
        docType,
        operator,
        whitelisted,
        roleId,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`setCoSignOperator failed: ${message}`);
    }
  }

  async setMinOperatorStake(
    tenantId: string,
    newMinOperatorStake: string,
  ): Promise<string> {
    try {
      const signObj = await this.getClient();
      return await signObj.setMinOperatorStake(tenantId, newMinOperatorStake);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`setMinOperatorStake failed: ${message}`);
    }
  }

  async setUnstakeCooldown(
    tenantId: string,
    newUnstakeCooldown: bigint,
  ): Promise<string> {
    try {
      const signObj = await this.getClient();
      return await signObj.setUnstakeCooldown(tenantId, newUnstakeCooldown);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`setUnstakeCooldown failed: ${message}`);
    }
  }

  async setViolationPenalty(
    tenantId: string,
    violationCode: string,
    penaltyBps: number,
  ): Promise<string> {
    try {
      const signObj = await this.getClient();
      return await signObj.setViolationPenalty(
        tenantId,
        violationCode,
        penaltyBps,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`setViolationPenalty failed: ${message}`);
    }
  }
}
