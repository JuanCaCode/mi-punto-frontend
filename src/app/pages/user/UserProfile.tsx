import { Loader2, Save, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

import { EmptyState } from "@/app/components/EmptyState";
import { ErrorState } from "@/app/components/ErrorState";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { ProfileAvatarUpload } from "@/app/components/ProfileAvatarUpload";
import { StarRating } from "@/app/components/StarRating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/modules/auth/hooks";
import { useMyReviews } from "@/modules/reviews/hooks";
import { useUpdateMe } from "@/modules/users/hooks";

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export default function UserProfile() {
  const { user } = useCurrentUser();
  const reviewsQuery = useMyReviews();
  const updateMe = useUpdateMe();

  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (user) setFullName(user.full_name);
  }, [user]);

  if (!user) {
    return (
      <div className="py-20">
        <LoadingSpinner />
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim().length < 2) {
      toast.error("Ingresa tu nombre completo");
      return;
    }
    try {
      await updateMe.mutateAsync({ full_name: fullName.trim() });
      toast.success("Datos actualizados");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "No pudimos actualizar tus datos";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl px-6 py-6 mx-auto">
      <div className="flex items-center gap-4">
        <Avatar className="size-14 border border-blue-100">
          <AvatarImage src={user.avatar_url ?? undefined} alt={user.full_name} />
          <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
            {initialsFromName(user.full_name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi perfil</h1>
          <p className="text-gray-600">Tu información y las reseñas que publicaste</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <ProfileAvatarUpload user={user} />

        <div className="border-t border-gray-100 pt-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={updateMe.isPending}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 inline-flex items-center gap-2"
        >
          {updateMe.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Guardar cambios
        </button>
      </form>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="font-semibold text-lg mb-4">Mis reseñas publicadas</h2>

        {reviewsQuery.isLoading && <LoadingSpinner />}
        {reviewsQuery.isError && (
          <ErrorState
            title="No pudimos cargar tus reseñas"
            onRetry={() => reviewsQuery.refetch()}
          />
        )}
        {!reviewsQuery.isLoading &&
          !reviewsQuery.isError &&
          (reviewsQuery.data?.length ?? 0) === 0 && (
            <EmptyState
              title="Aún no publicaste reseñas"
              message="Explora negocios y comparte tu experiencia."
              icon={<Star className="w-12 h-12" />}
              action={
                <Link
                  to="/user/catalog"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Ver catálogo
                </Link>
              }
            />
          )}

        <div className="space-y-4">
          {reviewsQuery.data?.map((r) => (
            <div key={r.id} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <Link
                    to={`/user/business/${r.business_id}`}
                    className="font-medium text-gray-900 hover:underline"
                  >
                    {r.business_name}
                  </Link>
                  <p className="text-xs text-gray-500">
                    {r.business_category} · {r.business_city} ·{" "}
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
                <StarRating rating={r.rating} readonly size="sm" />
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{r.comment}</p>
              {r.response && (
                <div className="mt-3 ml-4 border-l-4 border-blue-200 pl-3 bg-blue-50 py-2 rounded-r-md">
                  <p className="text-xs font-medium text-blue-900 mb-0.5">
                    Respuesta del negocio
                  </p>
                  <p className="text-sm text-blue-900">{r.response.body}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
