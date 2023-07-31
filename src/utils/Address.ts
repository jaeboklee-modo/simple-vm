import { createHash } from "crypto";
import { Code } from "../contracts/codes";

export class Address {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static generate(code: Code, initData: any): Address {
    const data = JSON.stringify({ code, initData }, (_, v) =>
      typeof v === "bigint" ? v.toString() : v
    );
    const value = createHash("sha256").update(data).digest("hex");
    return new Address(value);
  }

  equals(otherId: Address): boolean {
    return this.value === otherId.value;
  }

  toString(): string {
    return this.value;
  }

  static random(): Address {
    const value = createHash("sha256").update("").digest("hex");
    return new Address(value);
  }
}
