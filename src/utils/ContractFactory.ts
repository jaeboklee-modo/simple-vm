import { Contract } from "./Contract";
import { Code } from "../contracts/codes";
import Vm from "./Vm";

export abstract class ContractFactory {
  protected vm: Vm;

  constructor(vm: Vm) {
    this.vm = vm;
  }

  abstract createContract(code: Code, initialStorage: any): Contract<any>;
}
