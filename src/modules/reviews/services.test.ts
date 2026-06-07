import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/api", () => ({ api: vi.fn().mockResolvedValue({}) }));

import { api } from "@/lib/api";
import {
  listBusinessReviews,
  createReview,
  respondToReview,
  listMyReviews,
} from "./services";

const apiMock = vi.mocked(api);

describe("servicios de reseñas", () => {
  beforeEach(() => apiMock.mockClear());

  it("listBusinessReviews pagina por defecto", () => {
    listBusinessReviews(5);
    expect(apiMock).toHaveBeenCalledWith(
      "/businesses/5/reviews?page=1&page_size=50",
    );
  });

  it("createReview hace POST con el payload", () => {
    const payload = { rating: 5, comment: "Muy bueno" };
    createReview(5, payload);
    expect(apiMock).toHaveBeenCalledWith("/businesses/5/reviews", {
      method: "POST",
      body: payload,
    });
  });

  it("respondToReview hace POST a la respuesta", () => {
    respondToReview(10, { body: "Gracias" });
    expect(apiMock).toHaveBeenCalledWith("/reviews/10/response", {
      method: "POST",
      body: { body: "Gracias" },
    });
  });

  it("listMyReviews consulta /users/me/reviews", () => {
    listMyReviews();
    expect(apiMock).toHaveBeenCalledWith("/users/me/reviews");
  });
});
