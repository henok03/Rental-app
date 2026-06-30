import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

// ─── Theme ────────────────────────────────────────────────────────────────
const T = {
  bg: "#0d0d1a",
  navBg: "rgba(13,13,26,0.96)",
  cardBg: "#15152a",
  inputBg: "#1a1a30",
  border: "#252540",
  text: "#eeeeff",
  subtext: "#8080a8",
  accent: "#7c3aed",
  accentDark: "#5b21b6",
  error: "#ef4444",
  tagBg: "#1e1e38",
};

// ─── Icons ────────────────────────────────────────────────────────────────
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const BackIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const PinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const BedIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4v16"/><path d="M2 8h18a2 2 0 012 2v10"/><path d="M2 17h20"/>
  </svg>
);
const BathIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 10h16v4a6 6 0 01-6 6H10a6 6 0 01-6-6v-4z"/><line x1="4" y1="10" x2="20" y2="10"/>
  </svg>
);

// ─── Skeleton Card ────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ background: T.cardBg, borderRadius: "18px", overflow: "hidden", border: `1px solid ${T.border}` }}>
      <div style={{ width: "100%", height: "200px", background: T.tagBg, animation: "mh-pulse 1.6s ease-in-out infinite" }} />
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ height: "16px", width: "65%", background: T.tagBg, borderRadius: "6px", animation: "mh-pulse 1.6s ease-in-out infinite" }} />
        <div style={{ height: "13px", width: "45%", background: T.tagBg, borderRadius: "6px", animation: "mh-pulse 1.6s ease-in-out infinite" }} />
        <div style={{ height: "20px", width: "35%", background: T.tagBg, borderRadius: "6px", animation: "mh-pulse 1.6s ease-in-out infinite" }} />
        <div style={{ height: "1px", background: T.border }} />
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ flex: 1, height: "36px", background: T.tagBg, borderRadius: "8px", animation: "mh-pulse 1.6s ease-in-out infinite" }} />
          <div style={{ flex: 1, height: "36px", background: T.tagBg, borderRadius: "8px", animation: "mh-pulse 1.6s ease-in-out infinite" }} />
        </div>
      </div>
    </div>
  );
}

// ─── Property Card ────────────────────────────────────────────────────────
function HomeCard({ home, onEdit, onDelete }: { home: any; onEdit: () => void; onDelete: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await onDelete();
    setDeleting(false);
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: T.cardBg,
        borderRadius: "18px",
        overflow: "hidden",
        border: `1px solid ${hovered ? "#7c3aed50" : T.border}`,
        transition: "transform 0.22s, box-shadow 0.22s, border-color 0.22s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 16px 40px rgba(124,58,237,0.15)" : "0 2px 12px rgba(0,0,0,0.3)",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: "200px", overflow: "hidden", flexShrink: 0 }}>
        <img
          src={home.image_url}
          alt={home.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s", transform: hovered ? "scale(1.04)" : "scale(1)" }}
        />
        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)", pointerEvents: "none" }} />
        {/* Price badge */}
        <div style={{
          position: "absolute", bottom: "12px", left: "12px",
          background: "linear-gradient(135deg,#7c3aed,#5b21b6)",
          borderRadius: "10px", padding: "5px 12px",
          fontSize: "14px", fontWeight: 800, color: "#fff",
          boxShadow: "0 4px 12px rgba(124,58,237,0.4)",
        }}>
          ${Number(home.price).toLocaleString()}<span style={{ fontWeight: 400, fontSize: "11px", opacity: 0.85 }}>/mo</span>
        </div>
        {/* Rating if exists */}
        {home.rating != null && (
          <div style={{
            position: "absolute", top: "12px", left: "12px",
            background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)",
            borderRadius: "20px", padding: "4px 10px",
            display: "flex", alignItems: "center", gap: "4px",
            fontSize: "12px", fontWeight: 700, color: "#fff",
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            {Number(home.rating).toFixed(1)}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
        {/* Name */}
        <div style={{ fontWeight: 700, fontSize: "16px", color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {home.name}
        </div>

        {/* Location */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px", color: T.subtext, fontSize: "13px" }}>
          <PinIcon />
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{home.location}</span>
        </div>

        {/* Stats */}
        {(home.bedrooms || home.rooms || home.sqft) && (
          <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: T.subtext }}>
            {home.bedrooms && (
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><BedIcon />{home.bedrooms} bed</span>
            )}
            {home.rooms && (
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><BathIcon />{home.rooms} room</span>
            )}
            {home.sqft && (
              <span>{home.sqft} sqft</span>
            )}
          </div>
        )}

        {/* Divider */}
        <div style={{ height: "1px", background: T.border }} />

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={onEdit}
            style={{
              flex: 1, padding: "9px 12px",
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: "9px", color: "#a78bfa",
              fontWeight: 600, fontSize: "13px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              transition: "background 0.2s", fontFamily: "inherit",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(124,58,237,0.22)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(124,58,237,0.12)")}
          >
            <EditIcon /> Edit
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              flex: 1, padding: "9px 12px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: "9px", color: "#f87171",
              fontWeight: 600, fontSize: "13px", cursor: deleting ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              transition: "background 0.2s", fontFamily: "inherit",
              opacity: deleting ? 0.6 : 1,
            }}
            onMouseEnter={e => { if (!deleting) e.currentTarget.style.background = "rgba(239,68,68,0.18)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
          >
            {deleting ? (
              <span style={{ width: "13px", height: "13px", border: "2px solid #f87171", borderTopColor: "transparent", borderRadius: "50%", animation: "mh-spin 0.7s linear infinite", display: "inline-block" }} />
            ) : <TrashIcon />}
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────
export default function MyHomes() {
  const [homes, setHomes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { loadHomes(); }, []);

  async function loadHomes() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: false });
    setHomes(data || []);
    setLoading(false);
  }

  async function deleteHome(id: number) {
    if (!window.confirm("Delete this property? This cannot be undone.")) return;
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (!error) setHomes(prev => prev.filter(h => h.id !== id));
  }

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* ── TOP BAR ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: T.navBg, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
        borderBottom: `1px solid ${T.border}`,
        padding: "0 clamp(14px,4vw,32px)", height: "62px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button
            onClick={() => navigate(-1)}
            style={{ display: "flex", alignItems: "center", gap: "6px", background: T.tagBg, border: "none", borderRadius: "9px", padding: "7px 14px", color: T.text, fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "background 0.2s", fontFamily: "inherit" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#7c3aed20")}
            onMouseLeave={e => (e.currentTarget.style.background = T.tagBg)}
          >
            <BackIcon /> Back
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <span style={{ color: T.accent }}><HomeIcon /></span>
            <span style={{ fontWeight: 800, fontSize: "15px", color: T.accent }}>CountryStay</span>
          </div>
        </div>

        {/* Add Property */}
        <button
          onClick={() => navigate("/add-property")}
          style={{
            display: "flex", alignItems: "center", gap: "7px",
            background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`,
            border: "none", borderRadius: "10px",
            padding: "8px 18px", color: "#fff",
            fontSize: "13px", fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 14px rgba(124,58,237,0.35)",
            transition: "opacity 0.2s", fontFamily: "inherit",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          <PlusIcon /> Add Property
        </button>
      </nav>

      {/* ── PAGE BODY ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "clamp(24px,4vw,48px) clamp(14px,4vw,28px)" }}>

        {/* Header */}
        <div style={{ marginBottom: "clamp(20px,3vw,32px)", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(22px,4vw,30px)" }}>My Properties</h1>
            <p style={{ margin: "6px 0 0", color: T.subtext, fontSize: "14px" }}>
              {loading ? "Loading your listings…" : `${homes.length} propert${homes.length === 1 ? "y" : "ies"} listed`}
            </p>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(clamp(240px,28vw,300px),1fr))", gap: "clamp(14px,2.5vw,24px)" }}>
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : homes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "clamp(60px,10vw,100px) 20px" }}>
            <div style={{ fontSize: "clamp(56px,10vw,80px)", marginBottom: "16px" }}>🏠</div>
            <div style={{ fontWeight: 700, fontSize: "20px", color: T.text, marginBottom: "8px" }}>No properties yet</div>
            <div style={{ fontSize: "14px", color: T.subtext, marginBottom: "28px" }}>Start by adding your first property listing.</div>
            <button
              onClick={() => navigate("/add-property")}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`,
                border: "none", borderRadius: "12px",
                padding: "12px 24px", color: "#fff",
                fontWeight: 700, fontSize: "15px", cursor: "pointer",
                boxShadow: "0 4px 16px rgba(124,58,237,0.35)",
                fontFamily: "inherit",
              }}
            >
              <PlusIcon /> Add Your First Property
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(clamp(240px,28vw,300px),1fr))", gap: "clamp(14px,2.5vw,24px)" }}>
            {homes.map(home => (
              <HomeCard
                key={home.id}
                home={home}
                onEdit={() => navigate(`/edit-property/${home.id}`)}
                onDelete={() => deleteHome(home.id)}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        @keyframes mh-pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
        @keyframes mh-spin   { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}