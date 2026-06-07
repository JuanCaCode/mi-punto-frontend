import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/api", () => ({ api: vi.fn().mockResolvedValue({}) }));

import { api } from "@/lib/api";
import {
  listBusinessesForOwner,
  getBusinessForOwner,
  toggleBusiness,
  createMyBusiness,
  updateMyBusinessLocation,
  listCategories,
  listPublicBusinesses,
  listNearbyBusinesses,
  getPublicBusiness,
} from "./services";

const apiMock = vi.mocked(api);

describe("servicios de negocios", () => {
  beforeEach(() => apiMock.mockClear());

  it("listBusinessesForOwner sin filtros llama a /businesses/admin", () => {
    listBusinessesForOwner();
    expect(apiMock).toHaveBeenCalledWith("/businesses/admin");
  });

  it("listBusinessesForOwner arma el query string con filtros", () => {
    listBusinessesForOwner({ q: "café", status: "active" });
    expect(apiMock).toHaveBeenCalledWith(
      "/businesses/admin?q=caf%C3%A9&status=active",
    );
  });

  it("getBusinessForOwner usa la ruta admin del negocio", () => {
    getBusinessForOwner(7);
    expect(apiMock).toHaveBeenCalledWith("/businesses/7/admin");
  });

  it("toggleBusiness hace PATCH", () => {
    toggleBusiness(3);
    expect(apiMock).toHaveBeenCalledWith("/businesses/3/toggle", {
      method: "PATCH",
    });
  });

  it("createMyBusiness hace POST a /businesses/me", () => {
    const payload = { name: "X", category_id: 1, city: "Bogotá" } as never;
    createMyBusiness(payload);
    expect(apiMock).toHaveBeenCalledWith("/businesses/me", {
      method: "POST",
      body: payload,
    });
  });

  it("updateMyBusinessLocation hace PUT a /businesses/me/location", () => {
    const payload = { lat: 1, lng: 2 } as never;
    updateMyBusinessLocation(payload);
    expect(apiMock).toHaveBeenCalledWith("/businesses/me/location", {
      method: "PUT",
      body: payload,
    });
  });

  it("listCategories es anónimo", () => {
    listCategories();
    expect(apiMock).toHaveBeenCalledWith("/categories", { anonymous: true });
  });

  it("listPublicBusinesses arma filtros de catálogo", () => {
    listPublicBusinesses({ city: "Cali", category_id: 2, q: "pan", page: 1 });
    expect(apiMock).toHaveBeenCalledWith(
      "/businesses?city=Cali&category_id=2&q=pan&page=1",
    );
  });

  it("listPublicBusinesses sin parámetros no agrega query", () => {
    listPublicBusinesses();
    expect(apiMock).toHaveBeenCalledWith("/businesses");
  });

  it("listNearbyBusinesses arma lat/lng/radius", () => {
    listNearbyBusinesses({ lat: 4.6, lng: -74, radius_km: 3 });
    expect(apiMock).toHaveBeenCalledWith(
      "/businesses/nearby?lat=4.6&lng=-74&radius_km=3",
    );
  });

  it("getPublicBusiness usa la ruta pública", () => {
    getPublicBusiness(9);
    expect(apiMock).toHaveBeenCalledWith("/businesses/9");
  });
});
