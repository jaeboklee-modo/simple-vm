import { Message } from "../utils/Message";

export type OrderMessage = MarketOrderMessage | LimitOrderMessage;

export interface MarketOrderMessage extends Message {
  readonly opcode: "marketOrder";
  readonly tokens: number;
}

export interface LimitOrderMessage extends Message {
  readonly opcode: "limitOrder";
  readonly tokens: number;
  readonly desiredPrice: number;
}

export class OrderQueue {
  private orders: LimitOrderMessage[] = [];

  addOrder(order: LimitOrderMessage): void {
    this.orders.push(order);
  }

  processQueue(marketOrder: MarketOrderMessage): void {
    // Process the queue based on the market order
    // You'll need to implement the logic for this part
  }

  removeOrder(order: LimitOrderMessage): void {
    const index = this.orders.findIndex((o) => o === order);
    if (index !== -1) {
      this.orders.splice(index, 1);
    }
  }
}
