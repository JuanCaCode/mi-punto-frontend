import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock del cliente HTTP: los servicios solo deben delegar en `api`.
vi.mock("@/lib/api", () => ({ api: vi.fn().mockResolvedValue({}) }));

import { api } from "@/lib/api";
import { loginRequest, registerRequest, meRequest } from "./services";

const apiMock = vi.mocked(api);

describe("servicios de auth", () => {
  beforeEach(() => apiMock.mockClear());

  it("loginRequest hace POST anónimo a /auth/login", () => {
    loginRequest({ email: "a@b.com", password: "x" });
    expect(apiMock).toHaveBeenCalledWith("/auth/login", {
      method: "POST",
      body: { email: "a@b.com", password: "x" },
      anonymous: true,
    });
  });

  it("registerRequest hace POST anónimo a /auth/register", () => {
    const payload = {
      email: "a@b.com",
      password: "password1",
      full_name: "Ana",
      role: "end_user" as const,
    };
    registerRequest(payload);
    expect(apiMock).toHaveBeenCalledWith("/auth/register", {
      method: "POST",
      body: payload,
      anonymous: true,
    });
  });

  it("meRequest hace GET a /auth/me", () => {
    meRequest();
    expect(apiMock).toHaveBeenCalledWith("/auth/me");
  });
});
