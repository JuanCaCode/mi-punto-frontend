import { Eye, Power, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

import { EmptyState } from "@/app/components/EmptyState";
import { ErrorState } from "@/app/components/ErrorState";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { useOwnerBusinesses, useToggleBusiness } from "@/modules/businesses/hooks";

type StatusFilter = "all" | "active" | "inactive";

export default function GlobalBusinessManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("all");

  const businessesQuery = useOwnerBusinesses({
    status: filterStatus === "all" ? undefined : filterStatus,
  });
  const toggleMutation = useToggleBusiness();

  const businesses = useMemo(() => businessesQuery.data ?? [], [businessesQuery.data]);

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return businesses;
    const q = searchTerm.toLowerCase();
    return businesses.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.category_name.toLowerCase().includes(q),
    );
  }, [businesses, searchTerm]);

  const handleToggle = async (id: number, name: string) => {
    try {
      const result = await toggleMutation.mutateAsync(id);
      toast.success(
        `${name} ahora está ${result.is_active ? "activo" : "inactivo"}`,
        { duration: 2500 },
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No pudimos actualizar el estado";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión Global de Negocios</h1>
        <p className="text-gray-600">
          Supervisa y modera todos los negocios registrados en la plataforma
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, ciudad o categoría..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <FilterButton active={filterStatus === "all"} color="blue" onClick={() => setFilterStatus("all")}>
              Todos
            </FilterButton>
            <FilterButton active={filterStatus === "active"} color="green" onClick={() => setFilterStatus("active")}>
              Activos
            </FilterButton>
            <FilterButton active={filterStatus === "inactive"} color="red" onClick={() => setFilterStatus("inactive")}>
              Inactivos
            </FilterButton>
          </div>
        </div>

        <p className="text-sm text-gray-600">
          Mostrando {filtered.length} de {businesses.length} negocios
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {businessesQuery.isLoading && (
          <div className="py-12">
            <LoadingSpinner label="Cargando negocios…" />
          </div>
        )}

        {businessesQuery.isError && (
          <div className="py-6">
            <ErrorState
              title="No pudimos cargar los negocios"
              onRetry={() => businessesQuery.refetch()}
            />
          </div>
        )}

        {!businessesQuery.isLoading && !businessesQuery.isError && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <Th>Nombre del negocio</Th>
                  <Th>Ciudad</Th>
                  <Th>Categoría</Th>
                  <Th>Administrador</Th>
                  <Th>Estado</Th>
                  <Th>Acciones</Th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{b.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{b.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{b.category_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-700">{b.admin_full_name}</div>
                      <div className="text-xs text-gray-500">{b.admin_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          b.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {b.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/owner/businesses/${b.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver detalle"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleToggle(b.id, b.name)}
                          disabled={toggleMutation.isPending}
                          className={`disabled:opacity-50 ${
                            b.is_active
                              ? "text-red-600 hover:text-red-900"
                              : "text-green-600 hover:text-green-900"
                          }`}
                          title={b.is_active ? "Desactivar" : "Activar"}
                        >
                          <Power className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <EmptyState
                title="Sin coincidencias"
                message="No se encontraron negocios que coincidan con la búsqueda."
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      {children}
    </th>
  );
}

interface FilterButtonProps {
  active: boolean;
  color: "blue" | "green" | "red";
  onClick: () => void;
  children: React.ReactNode;
}

function FilterButton({ active, color, onClick, children }: FilterButtonProps) {
  const activeColor =
    color === "blue" ? "bg-blue-600" : color === "green" ? "bg-green-600" : "bg-red-600";
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        active ? `${activeColor} text-white` : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
}
