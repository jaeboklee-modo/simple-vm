import { Contract } from "../utils/Contract";
import { Code } from "./codes";
import { ContractFactory } from "../utils/ContractFactory";
import { Message } from "../utils/Message";

export interface BinStorage {
  tokenX: bigint;
  tokenY: bigint;
  totalLiquidity: bigint;
  exchangeRatio: bigint; // New field to store the initial exchange ratio
}

export type BinMessage =
  | AddLiquidityMessage
  | SwapMessage
  | RemoveLiquidityMessage;

export interface AddLiquidityMessage extends Message {
  readonly opcode: "addLiquidity";
  readonly amountX: bigint;
  readonly amountY: bigint;
}
export interface SwapMessage extends Message {
  readonly opcode: "swap";
  readonly tokenIn: "X" | "Y";
  readonly amountIn: bigint;
}

export interface RemoveLiquidityMessage extends Message {
  readonly opcode: "removeLiquidity";
  readonly liquidity: bigint;
}

export class BinFactory extends ContractFactory {
  createContract(code: Code, initialStorage: BinStorage): Bin {
    const contract = new Bin(this.vm, code, initialStorage);
    return contract;
  }
}

export class Bin extends Contract<BinStorage> {
  async receiveMessage(message: BinMessage) {
    switch (message.opcode) {
      case "addLiquidity":
        await this.addLiquidity(message.amountX, message.amountY);
        break;
      case "swap":
        await this.swap(message.tokenIn, message.amountIn);
        break;
      case "removeLiquidity":
        await this.removeLiquidity(message.liquidity);
        break;
    }
  }

  private async removeLiquidity(liquidity: bigint) {
    this.storage.tokenX -=
      (this.storage.tokenX * liquidity) / this.storage.totalLiquidity;
    this.storage.tokenY -=
      (this.storage.tokenY * liquidity) / this.storage.totalLiquidity;
    this.storage.totalLiquidity -= liquidity;

    console.log(
      this.storage.tokenX,
      this.storage.tokenY,
      this.storage.totalLiquidity
    );
  }

  private async addLiquidity(amountX: bigint, amountY: bigint) {
    // Check if the provided liquidity matches the initial exchange ratio

    this.storage.tokenX += amountX;
    this.storage.tokenY += amountY;
    this.storage.totalLiquidity += amountX + amountY;
  }

  private async swap(tokenIn: "X" | "Y", amountIn: bigint) {
    if (tokenIn === "X") {
      const amountOut = this.getOutputAmount(amountIn);
      this.storage.tokenX += amountIn;
      this.storage.tokenY -= amountOut;
    } else {
      const amountOut = this.getOutputAmount(amountIn);
      this.storage.tokenY += amountIn;
      this.storage.tokenX -= amountOut;
    }
  }

  private getOutputAmount(inputAmount: bigint): bigint {
    // Calculate the output amount based on the initial exchange ratio
    return inputAmount * this.storage.exchangeRatio;
  }

  get loadStorage() {
    return {
      tokenX: this.storage.tokenX,
      tokenY: this.storage.tokenY,
      totalLiquidity: this.storage.totalLiquidity,
      exchangeRatio: this.storage.exchangeRatio,
    };
  }
}
