import { Code } from "../contracts/codes";
import { Address } from "./address";
import { Contract } from "./Contract";
import { ContractFactory } from "./ContractFactory";
import { Message } from "./Message";

class Vm {
  private _transactions: {
    sender: string;
    receiver: string;
    message: Message;
  }[] = [];
  private _contracts: { [address: string]: Contract<any> } = {};

  private registerContract(contract: Contract<any>) {
    this._contracts[contract.address.toString()] = contract;
  }

  private getContract(address: Address): Contract<any> {
    const contract = this._contracts[address.toString()];
    if (!contract) {
      throw new Error(`Contract with id ${address} does not exist`);
    }
    return contract;
  }

  sendMessage(senderAddr: Address, receiverAddr: Address, message: Message) {
    const senderContract = this.getContract(senderAddr);
    const receiverContract = this.getContract(receiverAddr);

    this.addTransaction(senderAddr, receiverAddr, message);

    // "Send" the message by adding it to the receiver's queue
    receiverContract.messageQueue.push(message);

    // Process message queue asynchronously
    setImmediate(() => this.processMessageQueue(receiverAddr));
  }

  async deployContract(
    senderAddr: Address,
    factory: ContractFactory,
    code: Code,
    initialStorage: any
  ): Promise<Contract<any>> {
    const contract = factory.createContract(code, initialStorage);
    if (this._contracts[contract.address.toString()]) {
      throw new Error(`Contract with id ${contract.address} already exists`);
    }

    this.addTransaction(senderAddr, contract.address, {
      ...{ code, initialStorage },
      opcode: "Contract Deployment",
    });

    this.registerContract(contract);
    return contract;
  }

  private async processMessageQueue(receiverAddr: Address) {
    const contract = this.getContract(receiverAddr);

    while (contract.messageQueue.length > 0) {
      const message = contract.messageQueue.shift();
      if (message) {
        await contract.receiveMessage(message);
      }
    }
  }

  private addTransaction(sender: Address, receiver: Address, message: Message) {
    this._transactions.push({
      sender: sender.toString(),
      receiver: receiver.toString(),
      message: message,
    });
  }

  get transactions() {
    return this._transactions;
  }

  get contracts() {
    return this._contracts;
  }
}

export default Vm;
