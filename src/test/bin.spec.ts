import {
  AddLiquidityMessage,
  Bin,
  BinFactory,
  BinStorage,
  RemoveLiquidityMessage,
  SwapMessage,
} from "../contracts/Bin";
import { Code } from "../contracts/codes";
import Vm from "../utils/Vm";
import { Address } from "../utils/address";

describe("Bin Test", () => {
  let vm: Vm;
  let bin: Bin;
  const deployer: Address = Address.random();

  beforeEach(async () => {
    vm = new Vm();

    const binFactory = new BinFactory(vm);
    const binStorage: BinStorage = {
      tokenX: 0n,
      tokenY: 0n,
      totalLiquidity: 0n,
      exchangeRatio: 2n,
    };

    bin = (await vm.deployContract(
      deployer,
      binFactory,
      Code.bin,
      binStorage
    )) as Bin;
  });

  it("Should add liquidity correctly", async () => {
    const addLiquidityMessage: AddLiquidityMessage = {
      opcode: "addLiquidity",
      amountX: 100n,
      amountY: 50n,
    };
    await bin.receiveMessage(addLiquidityMessage);

    expect(bin.loadStorage.tokenX).toBe(100n);
    expect(bin.loadStorage.tokenY).toBe(50n);
    expect(bin.loadStorage.totalLiquidity).toBe(150n);
  });

  it("Should swap tokens correctly", async () => {
    const addLiquidityMessage: AddLiquidityMessage = {
      opcode: "addLiquidity",
      amountX: 100n,
      amountY: 50n,
    };
    await bin.receiveMessage(addLiquidityMessage);

    const swapMessage: SwapMessage = {
      opcode: "swap",
      tokenIn: "X",
      amountIn: 10n,
    };
    await bin.receiveMessage(swapMessage);

    expect(bin.loadStorage.tokenX).toBe(110n);
    expect(bin.loadStorage.tokenY).toBe(30n);
  });

  it("Should remove liquidity correctly", async () => {
    const addLiquidityMessage: AddLiquidityMessage = {
      opcode: "addLiquidity",
      amountX: 100n,
      amountY: 50n,
    };
    await bin.receiveMessage(addLiquidityMessage);

    const removeLiquidityMessage: RemoveLiquidityMessage = {
      opcode: "removeLiquidity",
      liquidity: 30n,
    };
    await bin.receiveMessage(removeLiquidityMessage);

    console.log(bin.loadStorage);

    expect(bin.loadStorage.tokenX).toBe(80n);
    expect(bin.loadStorage.tokenY).toBe(40n);
    expect(bin.loadStorage.totalLiquidity).toBe(120n);
  });
});
