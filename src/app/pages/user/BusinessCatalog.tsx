import { useAtom } from "jotai";
import { Filter, List, MapIcon, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import { BusinessCard } from "@/app/components/BusinessCard";
import { EmptyState } from "@/app/components/EmptyState";
import { ErrorState } from "@/app/components/ErrorState";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { useCategories, usePublicBusinesses } from "@/modules/businesses/hooks";
import { selectedLocationAtom } from "@/modules/location/atoms";

export default function BusinessCatalog() {
  const [location, setLocation] = useAtom(selectedLocationAtom);
  const categoriesQuery = useCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);

  const businessesQuery = usePublicBusinesses({
    city: location.city ?? undefined,
    category_id: categoryId,
    q: searchTerm || undefined,
    page_size: 60,
  });

  return (
    <div className="space-y-6 px-6 py-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Negocios cercanos
          </h1>

          <p className="text-gray-600">
            {location.city
              ? `Mostrando negocios en ${location.city}`
              : "Mostrando todos los negocios"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/user/map"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            <MapIcon className="w-4 h-4" />
            Ver mapa
          </Link>

          <button
            onClick={() => setLocation({ city: null, lat: null, lng: null })}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            title="Cambiar ubicación"
          >
            <List className="w-4 h-4" />
            Cambiar ubicación
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre…"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />

          <select
            value={categoryId ?? ""}
            onChange={(e) =>
              setCategoryId(
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
            className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las categorías</option>

            {categoriesQuery.data?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {businessesQuery.isLoading && (
        <div className="py-16">
          <LoadingSpinner label="Buscando negocios…" />
        </div>
      )}

      {businessesQuery.isError && (
        <ErrorState
          title="No pudimos cargar el catálogo"
          onRetry={() => businessesQuery.refetch()}
        />
      )}

      {!businessesQuery.isLoading &&
        !businessesQuery.isError &&
        (businessesQuery.data?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessesQuery.data.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Sin resultados"
            message="Probá cambiando los filtros o seleccionando otra ciudad."
          />
        ))}
    </div>
  );
}