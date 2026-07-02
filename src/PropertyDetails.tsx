import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "leaflet/dist/leaflet.css";

import { useTranslation } from "react-i18next";
import { useTheme } from "./ThemeContext";

import {
  MapContainer,
  TileLayer,
  Marker,
} from "react-leaflet";

import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
// ─── Theme ────────────────────────────────────────────────────────────────
const theme = {
  dark: {
    bg: "#0d0d1a",
    cardBg: "#15152a",
    inputBg: "#1a1a30",
    border: "#252540",
    text: "#eeeeff",
    subtext: "#8080a8",
  },
  light: {
    bg: "#f4f4f9",
    cardBg: "#ffffff",
    inputBg: "#f8f8fc",
    border: "#e4e4ef",
    text: "#12122a",
    subtext: "#606088",
  },
};

// ─── Pending action helpers (guest → signup → resume) ─────────────────────
const PENDING_ACTION_KEY = "pendingPropertyAction";
type PendingAction = "save" | "share" | "contact";

function savePendingAction(propertyId: string, action: PendingAction) {
  localStorage.setItem(PENDING_ACTION_KEY, JSON.stringify({ propertyId, action }));
}
function getPendingAction(): { propertyId: string; action: PendingAction } | null {
  const raw = localStorage.getItem(PENDING_ACTION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function clearPendingAction() {
  localStorage.removeItem(PENDING_ACTION_KEY);
}

// ─── Icons ────────────────────────────────────────────────────────────────
const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const BedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4v16"/><path d="M2 8h18a2 2 0 012 2v10"/><path d="M2 17h20"/><path d="M6 8v5"/>
  </svg>
);
const BathIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 10h16v4a6 6 0 01-6 6H10a6 6 0 01-6-6v-4z"/><line x1="4" y1="10" x2="20" y2="10"/>
  </svg>
);
const AreaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
  </svg>
);
const PinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.01 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);
const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);
const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);


// ─── Skeleton ─────────────────────────────────────────────────────────────
function Skeleton({ w = "100%", h = "20px", radius = "8px", dark = true }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: radius,
      background: dark ? "#1e1e38" : "#e8e8f4",
      animation: "cs-pulse 1.6s ease-in-out infinite",
    }} />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────
export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [property, setProperty] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState("");

  const [loading, setLoading] = useState(true);
  const { dark } = useTheme();
  const [saved, setSaved] = useState(false);
  const [showAgent, setShowAgent] = useState(false);

  useEffect(() => {
    checkSaved();
  }, []);

  // Resume whatever action the user wanted once we know the property + they're logged in
  useEffect(() => {
    if (!property) return;
    resumePendingAction();
  }, [property]);

  async function checkSaved() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", user.id)
      .eq("property_id", id)
      .maybeSingle();

    setSaved(!!data);
  }

  const t_ = dark ? theme.dark : theme.light;

  useEffect(() => { fetchProperty(); }, []);

  async function fetchProperty() {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();
    setProperty(data);
    setLoading(false);
    const { data: propertyData } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    const { data: imageData } = await supabase
      .from("property_images")
      .select("*")
      .eq("property_id", id);

    setProperty(propertyData);

    setImages(imageData || []);

    if (imageData && imageData.length > 0) {
      setSelectedImage(imageData[0].image_url);
    }
  }

  // ── Auth gate: if guest, remember what they wanted and send to signup ───
  async function requireAuth(action: PendingAction) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      savePendingAction(id as string, action);
      navigate(`/signup?redirect=/property/${id}`);
      return null;
    }
    return user;
  }

  // ── After coming back from signup, finish the original action ──────────
  async function resumePendingAction() {
    const pending = getPendingAction();
    if (!pending || String(pending.propertyId) !== String(id)) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return; // still not logged in, nothing to resume

    clearPendingAction();
    await checkSaved();

    if (pending.action === "save") await toggleSave();
    else if (pending.action === "share") await handleShare();
    else if (pending.action === "contact") setShowAgent(true);
  }

  async function toggleSave() {
    const user = await requireAuth("save");
    if (!user) return;

    if (saved) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("property_id", Number(id))
        .eq("user_id", user.id);

      if (!error) {
        setSaved(false);
      }
      return;
    } else {
      const { error } = await supabase
        .from("favorites")
        .insert({
          user_id: user.id,
          property_id: Number(id),
        });

      if (error) {
        console.log(error);
        return;
      }

      setSaved(true);
    }
  }

  async function handleShare() {
    const user = await requireAuth("share");
    if (!user) return;

    const propertyUrl = `${window.location.origin}/property/${property.id}`;

    const shareData = {
      title: property.name,
      text: `${t("shareText", "Check out this property")}: ${property.name}`,
      url: propertyUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(propertyUrl);
        alert(t("linkCopied", "Property link copied to clipboard!"));
      }
    } catch (error) {
      console.log("Share cancelled", error);
    }
  }

  async function handleContactAgent() {
    const user = await requireAuth("contact");
    if (!user) return;
    setShowAgent(true);
  }

  // ── Loading ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: t_.bg, padding: "clamp(16px,4vw,32px)", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
          <Skeleton w="120px" h="36px" radius="10px" dark={dark} />
          <Skeleton w="100%" h="clamp(240px,45vw,480px)" radius="20px" dark={dark} />
          <Skeleton w="60%" h="32px" radius="8px" dark={dark} />
          <Skeleton w="35%" h="20px" radius="6px" dark={dark} />
          <Skeleton w="25%" h="28px" radius="6px" dark={dark} />
        </div>
        <style>{`@keyframes cs-pulse{0%,100%{opacity:1}50%{opacity:0.45}}`}</style>
      </div>
    );
  }

  // ── Not found ────────────────────────────────────────────────────────
  if (!property) {
    return (
      <div style={{ minHeight: "100vh", background: t_.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", color: t_.text }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🏚</div>
          <h2 style={{ fontWeight: 800, marginBottom: "8px" }}>{t("propertyNotFound", "Property not found")}</h2>
          <p style={{ color: t_.subtext, marginBottom: "24px" }}>{t("listingRemoved", "This listing may have been removed.")}</p>
          <button onClick={() => navigate(-1)} style={{ padding: "10px 24px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: 700 }}>
            {t("goBack", "Go Back")}
          </button>
        </div>
      </div>
    );
  }

  // ── Main render ──────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: t_.bg, color: t_.text, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", transition: "background 0.3s, color 0.3s" }}>

      {/* ── TOP BAR ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: dark ? "rgba(13,13,26,0.96)" : "rgba(255,255,255,0.96)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: `1px solid ${t_.border}`,
        padding: "0 clamp(14px,4vw,32px)",
        height: "62px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
       <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  }}
>
        <button
  onClick={() => navigate("/")}
  style={{
    display: "flex", alignItems: "center", gap: "7px",
    background: dark ? "#1e1e38" : "#f0f0fa",
    border: "none", borderRadius: "9px",
    padding: "7px 14px", color: t_.text,
    fontSize: "13px", fontWeight: 600, cursor: "pointer",
    transition: "background 0.2s",
  }}
  onMouseEnter={e => (e.currentTarget.style.background = "#7c3aed20")}
  onMouseLeave={e => (e.currentTarget.style.background = dark ? "#1e1e38" : "#f0f0fa")}
>
  <BackIcon /> {t("back", "Back")}
</button>
          
        </div>

       <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>


      <button
  onClick={toggleSave}
  style={{
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: saved
      ? "rgba(124,58,237,0.15)"
      : (dark ? "#1e1e38" : "#f0f0fa"),
    border: `1px solid ${saved ? "#7c3aed" : t_.border}`,
    borderRadius: "9px",
    padding: "7px 14px",
    color: saved ? "#7c3aed" : t_.text,
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  }}
>
  <HeartIcon />
  {saved ? t("saved", "Saved") : t("save", "Save")}
</button>

          <button
  onClick={handleShare}
  style={{
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: dark ? "#1e1e38" : "#f0f0fa",
    border: `1px solid ${t_.border}`,
    borderRadius: "9px",
    padding: "7px 14px",
    color: t_.text,
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  }}
>
  <ShareIcon />
  {t("share", "Share")}
</button>
        </div>
      </div>

      {/* ── PAGE BODY ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "clamp(20px,4vw,40px) clamp(14px,4vw,32px)" }}>

        {/* ── IMAGE ── */}
        <div style={{ borderRadius: "20px", overflow: "hidden", position: "relative" }}>
          <img
  src={selectedImage || property.image_url}
  alt={property.name}
  style={{
    width: "100%",
    height: "500px",
    objectFit: "cover",
  }}
/>
<div
  style={{
    display: "flex",
    gap: "10px",
    marginTop: "10px",
    flexWrap: "wrap",
  }}
>
  {images.map((img) => (
    <img
      key={img.id}
      src={img.image_url}
      alt=""
      onClick={() =>
        setSelectedImage(img.image_url)
      }
      style={{
        width: "100px",
        height: "80px",
        objectFit: "cover",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    />
  ))}
</div>

          {/* Rating badge — only if rating exists in DB */}
          {property.rating != null && (
            <div style={{
              position: "absolute", top: "16px", left: "16px",
              background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)",
              borderRadius: "20px", padding: "5px 12px",
              display: "flex", alignItems: "center", gap: "6px",
              fontSize: "13px", fontWeight: 700, color: "#fff",
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              {Number(property.rating).toFixed(1)}
            </div>
          )}
        </div>

        {/* ── TWO-COLUMN ── */}
        <div
          className="cs-prop-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr clamp(260px,30%,340px)",
            gap: "clamp(20px,3vw,32px)",
            marginTop: "clamp(20px,3vw,32px)",
            alignItems: "start",
          }}
        >
          {/* ── LEFT ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(16px,2.5vw,24px)" }}>

            {/* Title + price */}
            <div style={{ background: t_.cardBg, borderRadius: "16px", padding: "clamp(16px,3vw,26px)", border: `1px solid ${t_.border}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                <div>
                  <h1 style={{ margin: 0, fontSize: "clamp(20px,3.5vw,28px)", fontWeight: 800, lineHeight: 1.2 }}>
                    {property.name}
                  </h1>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "10px", color: t_.subtext, fontSize: "14px" }}>
                    <PinIcon /> {property.location}
                  </div>
                </div>
                <div style={{
                  background: "linear-gradient(135deg,#7c3aed15,#5b21b615)",
                  border: "1px solid #7c3aed40",
                  borderRadius: "12px", padding: "10px 18px", textAlign: "right", flexShrink: 0,
                }}>
                  <div style={{ color: "#7c3aed", fontWeight: 800, fontSize: "clamp(20px,3vw,26px)", lineHeight: 1 }}>
                    ${property.price.toLocaleString()}
                  </div>
                  <div style={{ color: t_.subtext, fontSize: "12px", marginTop: "3px" }}>{t("perMonth", "per month")}</div>
                </div>
              </div>

              {/* Stat tiles */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "20px" }}>
                {[
                     { icon: <BathIcon />, value: property.rooms, label: t("rooms", "Rooms") },
                  { icon: <BedIcon />, value: property.bedrooms, label: t("bedrooms", "Bedrooms") },
               
                  { icon: <AreaIcon />, value: `${property.sqft}`, label: t("sqft", "sqft") },
                ].map(({ icon, value, label }) => (
                  <div key={label} style={{
                    flex: "1 1 90px",
                    background: dark ? "#1e1e38" : "#f4f4f9",
                    borderRadius: "12px", padding: "14px 16px",
                    display: "flex", flexDirection: "column", gap: "8px",
                    border: `1px solid ${t_.border}`,
                  }}>
                    {icon}
                    <div style={{ fontWeight: 800, fontSize: "18px", color: t_.text }}>{value}</div>
                    <div style={{ fontSize: "12px", color: t_.subtext }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Property info — only real DB fields */}
            <div style={{ background: t_.cardBg, borderRadius: "16px", padding: "clamp(16px,3vw,26px)", border: `1px solid ${t_.border}` }}>
              <h3 style={{ margin: "0 0 16px", fontWeight: 700, fontSize: "16px" }}>{t("propertyInformation", "Property Information")}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", gap: "12px" }}>
                {[
                  [t("address", "Address"),   property.address],
                  [t("bedrooms", "Bedrooms"),  property.bedrooms],
                  [t("rooms", "Rooms"), property.rooms],
                  [t("area", "Area"),      `${property.sqft} ${t("sqft", "sqft")}`],
                ].map(([label, value]) => (
                  value != null && value !== "" ? (
                    <div key={label as string} style={{
                      background: dark ? "#1a1a30" : "#f8f8fc",
                      borderRadius: "10px", padding: "12px 16px",
                      border: `1px solid ${t_.border}`,
                    }}>
                      <div style={{ fontSize: "11px", color: t_.subtext, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "5px" }}>{label}</div>
                      <div style={{ fontWeight: 600, fontSize: "14px", color: t_.text }}>{value}</div>
                    </div>
                  ) : null
                ))}
              </div>
            </div>
            <div
  style={{
    background: t_.cardBg,
    borderRadius: "16px",
    padding: "24px",
    border: `1px solid ${t_.border}`,
  }}
>
  <h3
    style={{
      marginBottom: "16px",
      fontWeight: 700,
    }}
  >
    {t("amenities", "Amenities")}
  </h3>

  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
    }}
  >
    {property.amenities?.map(
      (item: string) => (
        <div
          key={item}
          style={{
            padding: "8px 14px",
            borderRadius: "999px",
            background:
              "rgba(124,58,237,0.15)",
            border:
              "1px solid rgba(124,58,237,0.4)",
            color: "#c4b5fd",
            fontWeight: 600,
            fontSize: "13px",
          }}
        >
          {item}
        </div>
      )
    )}
  </div>
</div>
<div
  style={{
    background: t_.cardBg,
    borderRadius: "16px",
    padding: "24px",
    border: `1px solid ${t_.border}`,
  }}
>
  <h3
    style={{
      marginBottom: "16px",
      fontWeight: 700,
    }}
  >
    {t("locationMap", "Location Map")}
  </h3>
{property?.lat && property?.lng ? (
  <MapContainer
    center={[
      property.lat,
      property.lng,
    ]}
    zoom={15}
    style={{
      height: "400px",
      width: "100%",
      borderRadius: "12px",
    }}
    
  >
    
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />

    <Marker
      position={[
        property.lat,
        property.lng,
      ]}
    />
  </MapContainer>
  ) : (
  <p>{t("locationNotAvailable", "Location not available")}</p>
)}
          </div>

</div>
          {/* ── RIGHT ── */}
          <div style={{ position: "sticky", top: "82px", display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Contact card */}
            <div style={{
              background: t_.cardBg, border: `1px solid ${t_.border}`,
              borderRadius: "18px", padding: "clamp(16px,3vw,24px)",
              boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(0,0,0,0.08)",
            }}>
              <div style={{ fontWeight: 800, fontSize: "18px", marginBottom: "6px" }}>{t("interested", "Interested?")}</div>
              <div style={{ color: t_.subtext, fontSize: "13px", marginBottom: "20px" }}>
                {t("contactAgentSubtitle", "Contact our agent to schedule a viewing.")}
              </div>

              <button
  onClick={handleContactAgent}
  style={{
    width: "100%",
    padding: "13px",
    background: "linear-gradient(135deg,#7c3aed,#5b21b6)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    boxShadow: "0 4px 16px rgba(124,58,237,0.4)",
  }}
>
  <PhoneIcon />
  {t("contactAgent", "Contact Agent")}
</button>
{showAgent && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    }}
  >
    <div
      style={{
        width: "90%",
        maxWidth: "500px",
        background: "#15152a",
        borderRadius: "16px",
        padding: "24px",
        color: "#fff",
      }}
    >
      <h2>{t("landlordInformation", "Landlord Information")}</h2>

      <p>
        <strong>{t("nameLabel", "Name")}:</strong> {property.landlord_name}
      </p>

      <p>
        <strong>{t("phoneLabel", "Phone")}:</strong> {property.landlord_phone}
      </p>

      <p>
        <strong>{t("emailLabel", "Email")}:</strong> {property.landlord_email}
      </p>

   <div
  style={{
    display: "flex",
    gap: "12px",
    marginTop: "15px",
    flexWrap: "wrap",
  }}
>
  <a
    href={`https://wa.me/${property.landlord_whatsapp}`}
    target="_blank"
    rel="noreferrer"
    style={{
      flex: 1,
      minWidth: "150px",
      textAlign: "center",
      padding: "12px 16px",
      background: "#25D366",
      color: "#fff",
      textDecoration: "none",
      borderRadius: "10px",
      fontWeight: 600,
      fontSize: "14px",
      boxShadow: "0 4px 12px rgba(37,211,102,0.3)",
    }}
  >
    📱 {t("whatsappChat", "WhatsApp Chat")}
  </a>

  <a
    href={`https://t.me/${property.landlord_telegram?.replace("@", "")}`}
    target="_blank"
    rel="noreferrer"
    style={{
      flex: 1,
      minWidth: "150px",
      textAlign: "center",
      padding: "12px 16px",
      background: "#229ED9",
      color: "#fff",
      textDecoration: "none",
      borderRadius: "10px",
      fontWeight: 600,
      fontSize: "14px",
      boxShadow: "0 4px 12px rgba(34,158,217,0.3)",
    }}
  >
    ✈️ {t("telegramMessage", "Telegram Message")}
  </a>
</div>
      <button
        onClick={() => setShowAgent(false)}
        style={{
          marginTop: "15px",
          width: "100%",
          padding: "12px",
          border: "none",
          borderRadius: "10px",
          background: "#7c3aed",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {t("close", "Close")}
      </button>
    </div>
  </div>
)}
            </div>

            {/* Price card */}
          
          </div>
        </div>
      </div>

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        @keyframes cs-pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
        @media (max-width: 820px) {
          .cs-prop-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .cs-prop-grid > div:last-child { position: static !important; }
        }
        @media (min-width: 1800px) {
          .cs-prop-grid { grid-template-columns: 1fr 400px !important; }
        }
      `}</style>
    </div>
  );
}