import { Code } from "../contracts/codes";
import Vm from "../utils/Vm";
import { Pool, PoolFactory, PoolStorage } from "../contracts/Pool";
import { Address } from "../utils/address";

describe("Pool Test", () => {
  let vm: Vm;
  let pool: Pool;
  const x: Address = Address.random();
  const y: Address = Address.random();
  const deployer: Address = Address.random();

  beforeEach(async () => {
    vm = new Vm();

    const poolFactory = new PoolFactory(vm);
    const poolStorage: PoolStorage = {
      tokenX: x,
      tokenY: y,
    };
    pool = (await vm.deployContract(
      deployer,
      poolFactory,
      Code.pool,
      poolStorage
    )) as Pool;
  });

  it("Should create correct number of contract instances", async () => {
    await pool.receiveMessage({ opcode: "" });
    console.log(vm.transactions);
  });

  afterAll(() => {
    console.log(`Total number of messages sent: ${vm.transactions}`);
  });
});
