import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("combina varias clases", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("ignora valores falsy", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("aplica el merge de Tailwind (la ultima clase gana)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("resuelve clases condicionales", () => {
    expect(cn("base", { active: true, hidden: false })).toBe("base active");
  });
});
