import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema } from "./schemas";

describe("loginSchema", () => {
  it("acepta credenciales válidas", () => {
    const r = loginSchema.safeParse({ email: "a@b.com", password: "x" });
    expect(r.success).toBe(true);
  });

  it("rechaza email inválido", () => {
    const r = loginSchema.safeParse({ email: "no-email", password: "x" });
    expect(r.success).toBe(false);
  });

  it("rechaza contraseña vacía", () => {
    const r = loginSchema.safeParse({ email: "a@b.com", password: "" });
    expect(r.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("acepta un registro válido", () => {
    const r = registerSchema.safeParse({
      email: "a@b.com",
      password: "password1",
      full_name: "Ana Pérez",
      role: "end_user",
    });
    expect(r.success).toBe(true);
  });

  it("rechaza contraseña menor a 8 caracteres", () => {
    const r = registerSchema.safeParse({
      email: "a@b.com",
      password: "corta",
      full_name: "Ana",
      role: "end_user",
    });
    expect(r.success).toBe(false);
  });

  it("rechaza un rol no permitido", () => {
    const r = registerSchema.safeParse({
      email: "a@b.com",
      password: "password1",
      full_name: "Ana",
      role: "owner",
    });
    expect(r.success).toBe(false);
  });
});
