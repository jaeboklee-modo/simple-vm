import { Code } from "../contracts/codes";
import { Message } from "./Message";
import Vm from "./Vm";
import { Address } from "./address";

abstract class VmObject {
  protected vm: Vm;

  constructor(vm: Vm) {
    this.vm = vm;
  }
}

export abstract class Contract<T> extends VmObject {
  readonly address: Address;
  protected code: Code;
  protected storage: T;
  messageQueue: Message[] = [];

  constructor(vm: Vm, code: Code, initialStorage: T) {
    super(vm);
    this.code = code;
    this.storage = initialStorage;
    this.address = Address.generate(code, initialStorage);
  }

  // Methods to send and receive messages
  async receiveMessage(message: Message): Promise<void> {
    console.log("Message received", message);
  }
}
