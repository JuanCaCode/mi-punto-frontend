import { ImageIcon, MapPin, Star } from "lucide-react";
import { Link } from "react-router";

import type { PublicBusinessSummary } from "@/modules/businesses/types";

interface BusinessCardProps {
  business: PublicBusinessSummary;
}

export function BusinessCard({ business }: BusinessCardProps) {
  const {
    id,
    name,
    category,
    address,
    average_rating,
    review_count,
    cover_url,
    logo_url,
    distance_km,
    city,
  } = business;

  return (
    <Link
      to={`/user/business/${id}`}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200">
        {cover_url ? (
          <img
            src={cover_url}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-blue-400">
            <ImageIcon className="w-12 h-12" />

          </div>
        )}
        {logo_url && (
          <div className="absolute bottom-2 left-2 w-12 h-12 rounded-lg bg-white shadow-md border border-white overflow-hidden">
            <img src={logo_url} alt={`Logo ${name}`} className="w-full h-full object-contain" />

          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-xl text-gray-900 truncate">
              {name}
            </h3>

            <p className="text-sm text-gray-600 mt-1">
              {category.name}
            </p>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0 bg-yellow-50 px-2 py-1 rounded-md">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />

            <span className="font-medium text-sm text-gray-800">
              {review_count > 0 ? average_rating.toFixed(1) : "—"}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2 text-sm text-gray-600 mt-auto">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />

          <div className="min-w-0">
            <p className="truncate">
              {address || city}
            </p>

            {distance_km !== null && distance_km !== undefined && (
              <p className="text-blue-600 mt-1 font-medium">
                {distance_km.toFixed(1)} km
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}