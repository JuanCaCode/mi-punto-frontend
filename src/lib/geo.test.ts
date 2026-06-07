import { describe, it, expect, vi, afterEach } from "vitest";
import {
  haversineKm,
  buildGoogleMapsUrl,
  CITY_COORDS,
  getCurrentPosition,
  GeolocationUnavailableError,
  GeolocationDeniedError,
} from "./geo";

describe("haversineKm", () => {
  it("es 0 entre el mismo punto", () => {
    const p = { lat: 4.65, lng: -74.08 };
    expect(haversineKm(p, p)).toBe(0);
  });

  it("calcula la distancia Bogotá–Medellín (~240 km)", () => {
    const d = haversineKm(CITY_COORDS["Bogotá"], CITY_COORDS["Medellín"]);
    expect(d).toBeGreaterThan(230);
    expect(d).toBeLessThan(260);
  });
});

describe("buildGoogleMapsUrl", () => {
  it("formatea las coordenadas con 6 decimales", () => {
    const url = buildGoogleMapsUrl(4.6533, -74.0836);
    expect(url).toBe(
      "https://www.google.com/maps/search/?api=1&query=4.653300,-74.083600",
    );
  });
});

describe("CITY_COORDS", () => {
  it("incluye las 8 ciudades soportadas", () => {
    expect(Object.keys(CITY_COORDS)).toHaveLength(8);
    expect(CITY_COORDS["Cali"]).toEqual({ lat: 3.4516, lng: -76.532 });
  });
});

describe("getCurrentPosition", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("rechaza con GeolocationUnavailableError si no hay geolocation", async () => {
    vi.stubGlobal("navigator", {});
    await expect(getCurrentPosition()).rejects.toBeInstanceOf(
      GeolocationUnavailableError,
    );
  });

  it("resuelve con las coordenadas en caso de éxito", async () => {
    vi.stubGlobal("navigator", {
      geolocation: {
        getCurrentPosition: (success: (p: unknown) => void) =>
          success({ coords: { latitude: 1, longitude: 2 } }),
      },
    });
    await expect(getCurrentPosition()).resolves.toEqual({ lat: 1, lng: 2 });
  });

  it("rechaza con GeolocationDeniedError si se niega el permiso", async () => {
    vi.stubGlobal("navigator", {
      geolocation: {
        getCurrentPosition: (
          _success: unknown,
          error: (e: unknown) => void,
        ) => error({ code: 1, PERMISSION_DENIED: 1, message: "denegado" }),
      },
    });
    await expect(getCurrentPosition()).rejects.toBeInstanceOf(
      GeolocationDeniedError,
    );
  });
});
