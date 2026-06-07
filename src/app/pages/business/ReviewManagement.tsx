import { Loader2, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/app/components/EmptyState";
import { ErrorState } from "@/app/components/ErrorState";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { StarRating } from "@/app/components/StarRating";
import { useMyBusiness } from "@/modules/businesses/hooks";
import { useBusinessReviews, useRespondToReview } from "@/modules/reviews/hooks";

type Filter = "all" | "pending" | "responded";

export default function ReviewManagement() {
  const myBusiness = useMyBusiness();
  const businessId = myBusiness.data?.id;
  const reviewsQuery = useBusinessReviews(businessId);
  const respondMutation = useRespondToReview();

  const [filter, setFilter] = useState<Filter>("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState("");

  const reviews = useMemo(() => reviewsQuery.data ?? [], [reviewsQuery.data]);
  const filtered = useMemo(() => {
    if (filter === "pending") return reviews.filter((r) => !r.response);
    if (filter === "responded") return reviews.filter((r) => !!r.response);
    return reviews;
  }, [reviews, filter]);

  if (myBusiness.isLoading) {
    return (
      <div className="py-20">
        <LoadingSpinner label="Cargando…" />
      </div>
    );
  }

  if (!myBusiness.data) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-700">
          Aún no tienes un negocio. Crea el perfil para empezar a recibir reseñas.
        </p>
      </div>
    );
  }

  const startEditing = (id: number, current: string | null = null) => {
    setEditingId(id);
    setDraft(current ?? "");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setDraft("");
  };

  const submitResponse = async (reviewId: number) => {
    if (draft.trim().length < 2) {
      toast.error("Escribe una respuesta");
      return;
    }
    try {
      await respondMutation.mutateAsync({ reviewId, payload: { body: draft.trim() } });
      toast.success("Respuesta publicada");
      cancelEditing();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "No pudimos publicar la respuesta";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de reseñas</h1>
        <p className="text-gray-600">
          Revisa y responde las reseñas de tus clientes para fortalecer la reputación de tu negocio.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
          Todas ({reviews.length})
        </FilterButton>
        <FilterButton active={filter === "pending"} onClick={() => setFilter("pending")} color="yellow">
          Pendientes ({reviews.filter((r) => !r.response).length})
        </FilterButton>
        <FilterButton active={filter === "responded"} onClick={() => setFilter("responded")} color="green">
          Respondidas ({reviews.filter((r) => !!r.response).length})
        </FilterButton>
      </div>

      {reviewsQuery.isLoading && (
        <div className="py-20">
          <LoadingSpinner />
        </div>
      )}

      {reviewsQuery.isError && (
        <ErrorState title="No pudimos cargar las reseñas" onRetry={() => reviewsQuery.refetch()} />
      )}

      {!reviewsQuery.isLoading && !reviewsQuery.isError && filtered.length === 0 && (
        <EmptyState
          title="Sin reseñas"
          message={
            filter === "pending"
              ? "No tienes reseñas pendientes de respuesta."
              : filter === "responded"
              ? "Aún no has respondido reseñas."
              : "Tu negocio todavía no tiene reseñas."
          }
        />
      )}

      <div className="space-y-4">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{r.user_full_name}</h3>
                <p className="text-xs text-gray-500">
                  {new Date(r.created_at).toLocaleString()}
                </p>
              </div>
              <StarRating rating={r.rating} readonly size="sm" />
            </div>

            <p className="text-gray-700 whitespace-pre-wrap mb-4">{r.comment}</p>

            {r.response && editingId !== r.id && (
              <div className="ml-4 border-l-4 border-blue-200 pl-3 bg-blue-50 py-2 rounded-r-md">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-blue-900">Tu respuesta</p>
                  <button
                    onClick={() => startEditing(r.id, r.response?.body ?? null)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                </div>
                <p className="text-sm text-blue-900">{r.response.body}</p>
              </div>
            )}

            {!r.response && editingId !== r.id && (
              <button
                onClick={() => startEditing(r.id)}
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                Responder
              </button>
            )}

            {editingId === r.id && (
              <div className="space-y-3">
                <textarea
                  rows={3}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Escribe tu respuesta…"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => submitResponse(r.id)}
                    disabled={respondMutation.isPending}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 inline-flex items-center gap-2"
                  >
                    {respondMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {r.response ? "Actualizar" : "Publicar respuesta"}
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface FilterButtonProps {
  active: boolean;
  color?: "blue" | "yellow" | "green";
  onClick: () => void;
  children: React.ReactNode;
}

function FilterButton({ active, color = "blue", onClick, children }: FilterButtonProps) {
  const activeColor =
    color === "yellow"
      ? "bg-yellow-500"
      : color === "green"
      ? "bg-green-600"
      : "bg-blue-600";
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
        active ? `${activeColor} text-white` : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
      }`}
    >
      {children}
    </button>
  );
}
