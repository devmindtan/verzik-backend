import {
  BlockchainSignClient as SignClient,
  createBlockchainSignClient,
} from "@verzik/sdk";
import dotenv from "dotenv";
dotenv.config();

export class BlockchainSignClient {
  protected signClient: SignClient;

  constructor() {
    this.signClient = createBlockchainSignClient({
      rpcUrl: process.env.RPC_URL || "",
      protocolAddress: process.env.PROTOCOL_ADDRESS || "",
      readerAddress: process.env.READER_ADDRESS || "",
      privateKey: process.env.PRIVATE_KEY || "",
    });
  }
  async getSignClient() {
    return this.signClient;
  }
}
