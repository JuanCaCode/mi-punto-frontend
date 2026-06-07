import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  api,
  ApiError,
  getToken,
  setUnauthorizedHandler,
  TOKEN_STORAGE_KEY,
} from "./api";

function mockFetchOnce(opts: {
  status?: number;
  json?: unknown;
  text?: string;
  contentType?: string;
}) {
  const status = opts.status ?? 200;
  const contentType =
    opts.contentType ?? (opts.json !== undefined ? "application/json" : "text/plain");
  const fetchMock = vi.fn().mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
    headers: { get: () => contentType },
    json: async () => opts.json,
    text: async () => opts.text ?? "",
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("getToken", () => {
  beforeEach(() => localStorage.clear());

  it("devuelve null si no hay token", () => {
    expect(getToken()).toBeNull();
  });

  it("lee un token JSON-encoded (formato Jotai)", () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify("abc123"));
    expect(getToken()).toBe("abc123");
  });

  it("hace fallback a texto plano si no es JSON", () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, "plano");
    expect(getToken()).toBe("plano");
  });

  it("devuelve null si el JSON no es string", () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify({ a: 1 }));
    expect(getToken()).toBeNull();
  });
});

describe("api", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.unstubAllGlobals());

  it("hace GET y devuelve el JSON", async () => {
    const fetchMock = mockFetchOnce({ json: { ok: true } });
    const data = await api<{ ok: boolean }>("/ping");
    expect(data).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8000/ping",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("agrega Authorization cuando hay token", async () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify("tok"));
    const fetchMock = mockFetchOnce({ json: {} });
    await api("/secure");
    const headers = fetchMock.mock.calls[0][1].headers;
    expect(headers.Authorization).toBe("Bearer tok");
  });

  it("no envía Authorization en peticiones anónimas", async () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify("tok"));
    const fetchMock = mockFetchOnce({ json: {} });
    await api("/public", { anonymous: true });
    const headers = fetchMock.mock.calls[0][1].headers;
    expect(headers.Authorization).toBeUndefined();
  });

  it("agrega Content-Type JSON para body objeto", async () => {
    const fetchMock = mockFetchOnce({ json: {} });
    await api("/x", { method: "POST", body: { a: 1 } });
    const opts = fetchMock.mock.calls[0][1];
    expect(opts.headers["Content-Type"]).toBe("application/json");
    expect(opts.body).toBe(JSON.stringify({ a: 1 }));
  });

  it("no fija Content-Type para FormData", async () => {
    const fetchMock = mockFetchOnce({ json: {} });
    const fd = new FormData();
    await api("/upload", { method: "POST", body: fd });
    const opts = fetchMock.mock.calls[0][1];
    expect(opts.headers["Content-Type"]).toBeUndefined();
    expect(opts.body).toBe(fd);
  });

  it("devuelve undefined ante 204", async () => {
    mockFetchOnce({ status: 204 });
    await expect(api("/no-content")).resolves.toBeUndefined();
  });

  it("lanza ApiError con el detail del backend", async () => {
    mockFetchOnce({ status: 400, json: { detail: "Datos inválidos" } });
    await expect(api("/bad")).rejects.toMatchObject({
      status: 400,
      message: "Datos inválidos",
    });
    await expect(api("/bad")).rejects.toBeInstanceOf(ApiError);
  });

  it("invoca el handler de no-autorizado ante 401", async () => {
    const handler = vi.fn();
    setUnauthorizedHandler(handler);
    mockFetchOnce({ status: 401, json: { detail: "no auth" } });
    await expect(api("/secure")).rejects.toBeInstanceOf(ApiError);
    expect(handler).toHaveBeenCalledOnce();
    setUnauthorizedHandler(() => {});
  });
});
