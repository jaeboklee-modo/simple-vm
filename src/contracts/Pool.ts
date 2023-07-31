import { Bin, BinFactory, BinStorage } from "./Bin";
import { Contract } from "../utils/Contract";
import { Code } from "./codes";
import { ContractFactory } from "../utils/ContractFactory";
import { Address } from "../utils/address";
import { Message } from "../utils/Message";

export interface PoolStorage {
  // Add any other properties needed for the pool
  tokenX: Address;
  tokenY: Address;
}

export class PoolFactory extends ContractFactory {
  createContract(code: Code, initialStorage: PoolStorage): Pool {
    const contract = new Pool(this.vm, code, initialStorage);
    return contract;
  }
}

export class Pool extends Contract<PoolStorage> {
  private bins: Bin[] = [];

  async receiveMessage(message: Message) {
    this.deployBin(1n);
    this.deployBin(2n);
    this.deployBin(3n);
  }

  async deployBin(exchangeRatio: bigint) {
    const factory = new BinFactory(this.vm);
    const binStorage: BinStorage = {
      tokenX: 0n,
      tokenY: 0n,
      totalLiquidity: 0n,
      exchangeRatio,
    };
    return await this.vm.deployContract(
      this.address,
      factory,
      Code.bin,
      binStorage
    );
  }
}
