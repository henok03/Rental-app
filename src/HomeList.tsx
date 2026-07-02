import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
interface Property {
  id: number;

  name: string;
  title: string;

  location: string;
  address?: string;

  price: number;
  rent?: number;

  rooms: number;

  bedrooms: number;
  bathrooms: number;

  baths?: number;

  sqft: number;
  size?: number;
landlord_name?: string;
landlord_phone?: string;
landlord_email?: string;
landlord_whatsapp?: string;
landlord_telegram?: string;
  image_url: string;

  rating?: number;
}

interface HomeListProps {
  dark: boolean;
  country: string;
  rooms: string;
  price: string;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  showFavoritesOnly: boolean;
}
function PropertyCard({
  property,
  dark,
  index,
}: {
  property: Property;
  dark: boolean;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  index: number;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    /* ANIMATION ADDED: "cs-card-in" fades+slides each card up on mount, staggered by index via inline animationDelay.
       ANIMATION ADDED: "cs-card-hover" lifts the card + deepens its shadow on hover (defined in global <style> below). */
    <div
      className="cs-card-in cs-card-hover"
      onClick={async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    navigate("/signup");
    return;
  }

  navigate(`/property/${property.id}`);
}}
      style={{
        background: dark ? "#1e1e2f" : "#fff",
        borderRadius: "18px",
        overflow: "hidden",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        cursor: "pointer",
        transition: "transform 0.25s ease, box-shadow 0.25s ease, background 0.3s",
        animationDelay: `${Math.min(index, 10) * 0.06}s`,
      }}
    >
      {/* Image */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "220px",
          overflow: "hidden",
        }}
      >
        {/* ANIMATION ADDED: "cs-card-img" slightly zooms the image on card hover (defined in global <style>) */}
        <img
          className="cs-card-img"
          src={property.image_url}
          alt={property.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.4s ease",
          }}
        />

        {/* Heart Icon */}

      </div>

      {/* Content */}
      <div style={{ padding: "18px" }}>
        <h3
          style={{
            fontSize: "20px",
            fontWeight: 600,
            marginBottom: "8px",
            color: dark ? "#fff" : "#111",
            transition: "color 0.3s",
          }}
        >
          {property.name}
        </h3>

        <p
          style={{
            color: "#777",
            fontSize: "14px",
            marginBottom: "10px",
          }}
        >
          📍 {property.location}
        </p>

        <p
          style={{
            color: "#7c3aed",
            fontSize: "20px",
            fontWeight: 700,
            marginBottom: "14px",
          }}
        >
         ${Number(property.price).toLocaleString()} {t("perMonth")}
        </p>

{/* Bottom Info */}
{/* Bottom Info */}
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13px",
    fontWeight: "500",
    color: dark ? "#94a3b8" : "#64748b",
    borderTop: dark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #f1f5f9",
    paddingTop: "14px",
    marginTop: "4px",
    transition: "border-color 0.3s, color 0.3s",
  }}
>
  {/* Landlord Name */}
  <div style={{ display: "flex", alignItems: "center", gap: "6px", maxWidth: "110px" }}>
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
      {property.landlord_name || t("host")}
    </span>
  </div>

  {/* NEW: Property Space / Dimensions Overview */}
  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
    {/* Layout Spec */}
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M3 9h18M9 21V3" />
      </svg>
      <span>
        {t("roomsCount", { count: property.rooms })}
      </span>
    </div>

   
  </div>

  {/* Rating */}
  {property.rating && (
    /* ANIMATION ADDED: "cs-rating-pop" makes the star rating pop in once when the card first renders */
    <div className="cs-rating-pop" style={{ display: "flex", alignItems: "center", gap: "4px", color: "#f59e0b" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      <span style={{ fontWeight: "600", color: dark ? "#fff" : "#0f172a" }}>
        {property.rating.toFixed(1)}
      </span>
    </div>
  )}
</div>
      </div>
    </div>
  );
}

export default function HomeList({
  dark,
  country,
  rooms,
  price,
  favorites,
  onToggleFavorite,
  showFavoritesOnly,
}: HomeListProps) {
  const { t } = useTranslation();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
  setLoading(true);

  const { data, error } = await supabase
    .from("properties")
    .select("*");

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    setError(error.message);
  } else {
    setProperties(data || []);
  }

  setLoading(false);
}
const filteredProperties = properties.filter((property) => {
  const matchesCountry =
    !country ||
    property.location
      .toLowerCase()
      .includes(country.toLowerCase());

  const roomCount = parseInt(rooms);
const matchesRooms =
  rooms === "All" ||
  !rooms ||
  (rooms === "4+ Rooms"
    ? property.rooms >= 4
    : property.rooms === roomCount);

  let matchesPrice = true;



if (price === "< $20k") {
  matchesPrice = property.price < 20000;
}

if (price === "$20 – 30k") {
  matchesPrice =
    property.price >= 20000 &&
    property.price <= 30000;
}

if (price === "$30 – 50k") {
  matchesPrice =
    property.price >= 30000 &&
    property.price <= 50000;
}

if (price === "$50k+") {
  matchesPrice =
    property.price >= 50000;
}

  const matchesFavorite =
    !showFavoritesOnly ||
    favorites.includes(property.id);

  return (
    matchesCountry &&
    matchesRooms &&
    matchesPrice &&
    matchesFavorite
  );
});
console.log(properties);
console.log(filteredProperties);
  return (
    <section
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "60px 20px",
      }}
    >
      <h2
        style={{
          fontSize: "34px",
          fontWeight: 700,
          marginBottom: "8px",
          color: dark ? "#fff" : "#111",
          transition: "color 0.3s",
        }}
      >
        {t("popularHomes")}
      </h2>

      <p
        style={{
          color: "#777",
          marginBottom: "30px",
        }}
      >
        {t("exploreHandpickedHomes")}
      </p>

      {/* ANIMATION ADDED: "cs-spinner" gives the loading state an actual spinning indicator instead of static text */}
      {loading && (
        <p style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="cs-spinner" />
          {t("loadingProperties")}
        </p>
      )}

      {/* ANIMATION ADDED: "cs-error-in" makes the error message shake briefly to draw attention */}
      {error && (
        <p className="cs-error-in" style={{ color: "red" }}>
          {t("errorPrefix")} {error}
        </p>
      )}

      {!loading && !error && (
   <div
  style={{
    display: "grid",
    /* 1. Changed "320px" to "1fr" so cards stretch flexibly to fill available row space */
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "28px",
    /* 2. Changed "start" to "center" or "space-between" equivalent to balance any remaining edge space */
    justifyContent: "stretch", 
    width: "100%",
  }}
>
  {filteredProperties.map((property, index) => (
    <PropertyCard
      key={property.id}
      property={property}
      dark={dark}
      isFavorite={favorites.includes(property.id)}
      onToggleFavorite={onToggleFavorite}
      index={index}
    />
  ))}
</div>
      )}

      {/* ── GLOBAL STYLES (animations added) ───────────────────────── */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .cs-card-in, .cs-card-hover, .cs-card-img, .cs-rating-pop, .cs-spinner, .cs-error-in {
            animation: none !important;
            transition: none !important;
          }
        }

        /* cs-card-in: each property card fades + slides up on mount, staggered via inline animationDelay */
        @keyframes csCardIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cs-card-in { animation: csCardIn 0.5s ease-out both; }

        /* cs-card-hover: card lifts and shadow deepens on hover */
        .cs-card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 36px rgba(0,0,0,0.16);
        }

        /* cs-card-img: image zooms in slightly when its parent card is hovered */
        .cs-card-hover:hover .cs-card-img {
          transform: scale(1.06);
        }

        /* cs-rating-pop: star rating pops in once on render */
        @keyframes csRatingPop {
          0%   { opacity: 0; transform: scale(0.6); }
          70%  { opacity: 1; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        .cs-rating-pop { animation: csRatingPop 0.4s 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

        /* cs-spinner: small rotating loading indicator next to "Loading properties..." */
        .cs-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(124,58,237,0.25);
          border-top-color: #7c3aed;
          border-radius: 50%;
          display: inline-block;
          animation: csSpin 0.7s linear infinite;
        }
        @keyframes csSpin {
          to { transform: rotate(360deg); }
        }

        /* cs-error-in: error message shakes briefly to draw the eye */
        @keyframes csErrorIn {
          0%, 100% { transform: translateX(0); }
          20%      { transform: translateX(-6px); }
          40%      { transform: translateX(6px); }
          60%      { transform: translateX(-4px); }
          80%      { transform: translateX(4px); }
        }
        .cs-error-in { animation: csErrorIn 0.4s ease-in-out; }
      `}</style>
    </section>
  );
}