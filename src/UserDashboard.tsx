import { useState } from "react";
import HomeList from "./HomeList";
import { useEffect } from "react";
import { supabase } from "./supabaseClient";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageToggle from "./LanguageToggle";


// ─── Inline SVG Icon System ────────────────────────────────────────────────
const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const FilterIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="12" y1="18" x2="12" y2="18" />
  </svg>
);
const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const HeartOutlineIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const XIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Trust badge icons
const ShieldIcon = () => (
  <svg width="18" height="18"  viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const HeadphonesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0118 0v6" />
    <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3z" />
    <path d="M3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
  </svg>
);
const TagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

// ─── Theme tokens ──────────────────────────────────────────────────────────
const theme = {
  dark: {
    bg: "#0d0d1a",
    navBg: "rgba(13,13,26,0.96)",
    cardBg: "#15152a",
    inputBg: "#1a1a30",
    border: "#252540",
    text: "#eeeeff",
    subtext: "#8080a8",
    badgeBg: "#15152a",
  },
  light: {
    bg: "#f4f4f9",
    navBg: "rgba(255,255,255,0.96)",
    cardBg: "#ffffff",
    inputBg: "#f8f8fc",
    border: "#e4e4ef",
    text: "#12122a",
    subtext: "#6060888",
    badgeBg: "#ffffff",
  },
};

// ─── Component ─────────────────────────────────────────────────────────────
export default function UserDashboard() {
  const [dark, setDark] = useState(true);
 const { t } = useTranslation();
  const [country, setCountry] = useState("");
const [rooms, setRooms] = useState("All");
const [price, setPrice] = useState("All");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const th = dark ? theme.dark : theme.light;
  const requireAuth = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    navigate("/signup");
    return false;
  }

  return true;
};
useEffect(() => {
  getUser();
  loadFavorites();

  window.addEventListener("focus", loadFavorites);

  return () => {
    window.removeEventListener("focus", loadFavorites);
  };
}, []);

async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    setUserName(user.user_metadata?.full_name || "");
    setUserEmail(user.email || "");
  }
}

async function loadFavorites() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data } = await supabase
    .from("favorites")
    .select("property_id")
    .eq("user_id", user.id);

  setFavorites(
    data?.map((item) => item.property_id) || []
  );
}
async function toggleFavorite(propertyId: number) { 
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    navigate("/signup");
    return;
  }

  const exists = favorites.includes(propertyId);

  if (exists) {
    await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("property_id", propertyId);

    setFavorites((prev) =>
      prev.filter((id) => id !== propertyId)
    );
  } else {
    await supabase
      .from("favorites")
      .insert({
        user_id: user.id,
        property_id: propertyId,
      });

    setFavorites((prev) => [...prev, propertyId]);
  }
}

  return (
    <div style={{ minHeight: "100vh", background: th.bg, color: th.text, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", transition: "background 0.3s, color 0.3s" }}>

      {/* ── NAVBAR ─────────────────────────────────────────────────── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: th.navBg,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: `1px solid ${th.border}`,
        padding: "0 28px", height: "62px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "9px", flexShrink: 0 }}>
          <span style={{ color: "#7c3aed" }}><HomeIcon /></span>
          <div>
            <div style={{ fontWeight: 800, fontSize: "15px", letterSpacing: "-0.3px", color: "#7c3aed", lineHeight: 1.1 }}>{t("logoName", "CountryStay")}</div>
            <div style={{ fontSize: "10px", color: th.subtext, lineHeight: 1.1 }}>{t("logoSubtitle", "Find your perfect home")}</div>
          </div>
        </div>

        {/* Desktop links */}
        <div
  className="cs-desktop-nav"
  style={{
    display: "flex",
    gap: "46px",
    alignItems: "center",
  }}
>
  <Link
    to="/"
    style={{
      color: "#7c3aed",
      textDecoration: "none",
      fontWeight: 700,
    }}
  >
    {t("home", "Home")}
  </Link>

  <Link
    to="/how-it-works"
    style={{
      color: th.text,
      textDecoration: "none",
    }}
  >
    {t("howItWorks", "How It Works")}
  </Link>
<button
  onClick={async () => {
    const ok = await requireAuth();
    if (ok) navigate("/add-property");
  }}
  style={{
    background: "none",
    border: "none",
    color: th.text,
    cursor: "pointer",
    fontSize: "inherit",
  }}
>
  {t("addHome", "Add Home")}
</button>
  <Link
    to="/contact"
    style={{
      color: th.text,
      textDecoration: "none",
    }}
  >
    {t("contact", "Contact")}
  </Link>
</div>

        {/* Right controls */}
      <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flexShrink: 0,
  }}
>
  <div
    className="cs-desktop-icons"
    style={{ display: "flex", gap: "14px" }}
  >
    {/* Favorites */}
    <button
      onClick={() =>
        setShowFavoritesOnly((prev) => !prev)
      }
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        color: showFavoritesOnly
          ? "#7c3aed"
          : th.text,
        padding: 0,
      }}
    >
      <HeartOutlineIcon />

      <span
        style={{
          fontSize: "10px",
          color: showFavoritesOnly
            ? "#7c3aed"
            : th.subtext,
        }}
      >
        {t("favorites", "Favorites")} ({favorites.length})
      </span>
    </button>


  </div>

<LanguageToggle dark={dark} t={th} />
  {/* Dark mode toggle */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "6px",
    }}
  >
    <span
      style={{
        color: th.subtext,
        display: "flex",
      }}
    >
      <MoonIcon />
    </span>

    <button
      onClick={() => setDark((d) => !d)}
      aria-label="Toggle dark mode"
      style={{
        width: "42px",
        height: "23px",
        background: dark
          ? "#7c3aed"
          : "#cbd5e1",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.3s",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          display: "block",
          width: "17px",
          height: "17px",
          background: "#fff",
          borderRadius: "50%",
          position: "absolute",
          top: "3px",
          left: dark ? "22px" : "3px",
          transition: "left 0.25s",
          boxShadow:
            "0 1px 4px rgba(0,0,0,0.28)",
        }}
      />
    </button>

    <span
      style={{
        color: th.subtext,
        display: "flex",
      }}
    >
      <SunIcon />
    </span>
  </div>

  {/* User avatar */}
<div
onClick={async () => {
  const ok = await requireAuth();

  if (ok) {
    setShowProfile(!showProfile);
  }
}}
  style={{
    display: "flex",
    alignItems: "center",
    gap: "7px",
    cursor: "pointer",
    position: "relative",
  }}
>
    <div
      style={{
        width: "34px",
        height: "34px",
        borderRadius: "50%",
        background: dark
          ? "#252540"
          : "#e8e8f4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: th.text,
      }}
    >
      <UserIcon />
    </div>

    <span
      className="cs-desktop-me"
      style={{
        fontSize: "13px",
        fontWeight: 600,
      }}
    >
      {t("me", "Me")} ▾
    </span>
   {showProfile && (
  <div
    style={{
      position: "absolute",
      top: "54px",
      right: 0,
      background: th.cardBg,
      border: `1px solid ${th.border || "rgba(255,255,255,0.08)"}`,
      borderRadius: "12px",
      padding: "16px",
      minWidth: "240px",
      boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
      zIndex: 999,
      display: "flex",
      flexDirection: "column",
    }}
  >
    {/* User Information Header */}
    <div style={{ padding: "0 8px 12px 8px", borderBottom: `1px solid ${th.border || "rgba(255,255,255,0.08)"}`, marginBottom: "8px" }}>
      <div
        style={{
          fontWeight: 600,
          fontSize: "14px",
          color: th.text || "#fff",
          textTransform: "capitalize"
        }}
      >
        {userName}
      </div>
      <div
        style={{
          fontSize: "12px",
          color: th.subtext || "#94a3b8",
          marginTop: "2px",
        }}
      >
        {userEmail}
      </div>
    </div>

    {/* Navigation Links */}
    <button
      onClick={() => navigate("/my-homes")}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 12px",
        background: "transparent",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        color: th.text || "#fff",
        fontSize: "14px",
        textAlign: "left",
        transition: "background 0.2s ease",
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
    >
      {/* Professional Home Icon */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
      {t("myHomes", "My Homes")}
    </button>

    <button
      onClick={() => navigate("/add-property")}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 12px",
        background: "transparent",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        color: th.text || "#fff",
        fontSize: "14px",
        textAlign: "left",
        transition: "background 0.2s ease",
        marginBottom: "8px"
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
    >
      {/* Professional Plus/Add Icon */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14"/>
        <path d="M12 5v14"/>
      </svg>
      {t("addHome", "Add Home")}
    </button>

    {/* Divider */}
    <div style={{ height: "1px", background: th.border || "rgba(255,255,255,0.08)", margin: "4px 0" }} />

    {/* Logout Button */}
    <button
      onClick={async () => {
        await supabase.auth.signOut();
        navigate("/login");
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 12px",
        background: "transparent",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        color: "#f87171",
        fontSize: "14px",
        textAlign: "left",
        fontWeight: 500,
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"}
      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
    >
      {/* Professional Log Out Icon */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1-2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" x2="9" y1="12" y2="12"/>
      </svg>
      {t("logout", "Logout")}
    </button>
  </div>
)}
  </div>

  {/* Hamburger */}
  <button
    className="cs-mobile-btn"
    onClick={() => setMobileOpen((o) => !o)}
    style={{
      display: "none",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: th.text,
      padding: 0,
    }}
  >
    {mobileOpen ? <XIcon /> : <MenuIcon />}
  </button>
</div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{
          position: "fixed", top: "62px", left: 0, right: 0, zIndex: 99,
          background: dark ? "#15152a" : "#fff",
          borderBottom: `1px solid ${th.border}`,
          padding: "20px 28px",
          display: "flex", flexDirection: "column", gap: "18px",
        }}>
          {mobileOpen && (
 <div
  style={{
    position: "fixed",
    top: "62px",
    left: 0,
    right: 0,
    zIndex: 99,
    background: dark ? "#15152a" : "#fff",
    borderBottom: `1px solid ${th.border}`,
    padding: "20px 28px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  }}
>
  {/* Navigation */}
  <Link
    to="/"
    onClick={() => setMobileOpen(false)}
    style={{
      color: "#7c3aed",
      textDecoration: "none",
      fontWeight: 700,
    }}
  >
    {t("home", "Home")}
  </Link>
  
  <Link
    to="/how-it-works"
    onClick={() => setMobileOpen(false)}
    style={{
      color: th.text,
      textDecoration: "none",
    }}
  >
    {t("howItWorks", "How It Works")}
  </Link>

  {/* Styled Button to look exactly like the Links */}
  <button
    onClick={async () => {
      setMobileOpen(false); // Closes the mobile menu when clicked
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/signup");
        return;
      }

      navigate("/add-property");
    }}
    style={{
      background: "none",
      border: "none",
      padding: 0,
      margin: 0,
      font: "inherit",
      color: th.text,
      textDecoration: "none",
      textAlign: "left",
      cursor: "pointer",
    }}
  >
    {t("addHome", "Add Home")}
  </button>

  <Link
    to="/contact"
    onClick={() => setMobileOpen(false)}
    style={{
      color: th.text,
      textDecoration: "none",
    }}
  >
    {t("contact", "Contact")}
  </Link>


    {/* Favorites */}
    <button
      onClick={() => {
        setShowFavoritesOnly((prev) => !prev);
        setMobileOpen(false);
      }}
      style={{
        background: "none",
        border: "none",
        color: showFavoritesOnly ? "#7c3aed" : th.text,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
        padding: 0,
        fontSize: "15px",
      }}
    >
      <HeartOutlineIcon />
      {t("favorites", "Favorites")} ({favorites.length})
    </button>

   
  </div>
)}
        </div>
      )}
</nav>
      {/* ── HERO BANNER ────────────────────────────────────────────── */}
   <section
  style={{
    position: "relative",
    minHeight: "360px",
    background:
      "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80') center/cover no-repeat",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
padding: "32px 16px 80px",
  }}
>
  {/* 🔥 DARK OVERLAY (IMPORTANT FOR PRO LOOK) */}
  <div
    style={{
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(135deg, rgba(26, 24, 24, 0.82), rgba(23, 23, 58, 0.63))",
    }}
  />

  {/* Atmospheric glows (kept but softened) */}
  <div style={{ position: "absolute", top: "-80px", right: "-60px", width: "520px", height: "420px", background: "radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
  <div style={{ position: "absolute", bottom: "-60px", left: "35%", width: "340px", height: "240px", background: "radial-gradient(ellipse, rgba(56,132,255,0.10) 0%, transparent 75%)", pointerEvents: "none" }} />
  <div style={{ position: "absolute", top: "20%", left: "20%", width: "200px", height: "200px", background: "radial-gradient(ellipse, rgba(124,58,237,0.07) 0%, transparent 75%)", pointerEvents: "none" }} />

  {/* CONTENT */}
  <div className="cs-hero-in" style={{ maxWidth: "520px", zIndex: 2, position: "relative" }}>
    <h1
      style={{
        margin: 0,
        color: "#fff",
        fontSize: "clamp(30px, 5.5vw, 52px)",
        fontWeight: 800,
        lineHeight: 1.12,
        letterSpacing: "-0.5px",
      }}
    >
      {t("heroTitle1", "Find Your")} <br />
      <span style={{ color: "#8b5cf6" }}>{t("heroTitleAccent", "Perfect Home")}</span> <br />
      {t("heroTitle2", "Anywhere")}
    </h1>

    <p
      style={{
        color: "rgba(255,255,255,0.7)",
        marginTop: "14px",
        fontSize: "15px",
        lineHeight: 1.65,
      }}
    >
      {t("heroSubtitle", "Search by country and find homes that fit your lifestyle.")}
    </p>
  </div>
</section>

      {/* ── FLOATING SEARCH BAR ────────────────────────────────────── */}
      <div style={{ padding: "0 28px", marginTop: "-35px", position: "relative", zIndex: 10 }}>
        <div className="cs-searchbar-in" style={{
          maxWidth: "940px", margin: "0 auto",
          background: dark ? "#15152a" : "#fff",
          borderRadius: "18px",
          boxShadow: dark ? "0 12px 48px rgba(0,0,0,0.5)" : "0 12px 48px rgba(0,0,0,0.12)",
          padding: "24px 28px",
          display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "flex-end",
          border: `1px solid ${th.border}`,
        }}>
          {/* Country input */}
          <div style={{ flex: "1 1 200px", minWidth: "160px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <GlobeIcon />
              <span style={{ fontWeight: 700, fontSize: "13px", color: th.text }}>{t("findCountry", "Find Country")}</span>
            </div>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: th.subtext, pointerEvents: "none" }}><SearchIcon /></span>
              <input
                value={country}
                onChange={e => setCountry(e.target.value)}
                placeholder={t("searchPlaceholder", "Search your country")}
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "10px 38px 10px 38px",
                  border: `1px solid ${th.border}`,
                  borderRadius: "9px",
                  background: th.inputBg,
                  color: th.text,
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => (e.target.style.borderColor = "#7c3aed")}
                onBlur={e => (e.target.style.borderColor = th.border)}
              />
              <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: th.subtext, cursor: "pointer" }}><FilterIcon /></span>
            </div>
          </div>

          {/* Vertical divider */}
          <div className="cs-divider" style={{ width: "1px", background: th.border, alignSelf: "stretch" }} />

          {/* Preferences */}
          <div style={{ flex: "2 1 340px", minWidth: "280px" }}>
            <div style={{ fontWeight: 700, fontSize: "13px", marginBottom: "10px", color: th.text }}>{t("selectPreferences", "Select Your Preferences")}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "flex-end" }}>
              {/* Room select */}
              <div style={{ flex: "1 1 120px", minWidth: "110px" }}>
                <div style={{ fontSize: "10px", color: th.subtext, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "5px" }}>{t("roomNo", "Room No")}</div>
                <div style={{ position: "relative" }}>
                  <select
                    value={rooms}
                    onChange={e => setRooms(e.target.value)}
                    style={{ appearance: "none", width: "100%", padding: "9px 32px 9px 12px", border: `1px solid ${th.border}`, borderRadius: "9px", background: th.inputBg, color: th.text, fontSize: "14px", cursor: "pointer", outline: "none" }}
                  >
                    <option value="All">{t("all", "All")}</option>
                    <option value="1 Room">{t("room1", "1 Room")}</option>
                    <option value="2 Rooms">{t("rooms2", "2 Rooms")}</option>
                    <option value="3 Rooms">{t("rooms3", "3 Rooms")}</option>
                    <option value="4+ Rooms">{t("rooms4Plus", "4+ Rooms")}</option>
                  </select>
                  <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: th.subtext }}><ChevronDownIcon /></span>
                </div>
              </div>

              {/* Price select */}
              <div style={{ flex: "1 1 140px", minWidth: "120px" }}>
                <div style={{ fontSize: "10px", color: th.subtext, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "5px" }}>{t("priceRange", "Price Range")}</div>
                <div style={{ position: "relative" }}>
                  <select
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    style={{ appearance: "none", width: "100%", padding: "9px 32px 9px 12px", border: `1px solid ${th.border}`, borderRadius: "9px", background: th.inputBg, color: th.text, fontSize: "14px", cursor: "pointer", outline: "none" }}
                  >
{["All", "< $20k", "$20 – 30k", "$30 – 50k", "$50k+"].map((p) => (
  <option key={p}>{p}</option>
))}
                  </select>
                  <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: th.subtext }}><ChevronDownIcon /></span>
                </div>
              </div>

              {/* Search button */}
              <button
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
                  color: "#fff", border: "none", borderRadius: "10px",
                  padding: "10px 22px", fontWeight: 700, fontSize: "14px",
                  cursor: "pointer", whiteSpace: "nowrap",
                  transition: "opacity 0.2s, transform 0.15s",
                  boxShadow: "0 4px 16px rgba(124,58,237,0.35)",
                  flexShrink: 0,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.97)"; }}
                onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
              >
                <SearchIcon /> {t("searchHomes", "Search Homes")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── HOME LIST (injected from HomeList.tsx) ─────────────────── */}
    <HomeList
  dark={dark}
  country={country}
  rooms={rooms}
  price={price}
  favorites={favorites}
  onToggleFavorite={toggleFavorite}
  showFavoritesOnly={showFavoritesOnly}
/>

      {/* ── TRUST BADGES ───────────────────────────────────────────── */}
      {/* ── SIMPLE TRUST BAR ───────────────────────────────────── */}
<section
  style={{
    padding: "18px 28px 40px",
    borderTop: `1px solid ${th.border}`,
    marginTop: "20px",
  }}
>
  <div
    style={{
      maxWidth: "1100px",
      margin: "0 auto",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      gap: "26px",
      color: th.subtext,
      fontSize: "13px",
      fontWeight: 500,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
      <ShieldIcon />
      <span>{t("verifiedHomes", "Verified Homes")}</span>
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
      <LockIcon />
      <span>{t("securePayments", "Secure Payments")}</span>
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
      <HeadphonesIcon />
      <span>{t("support", "24/7 Support")}</span>
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
      <TagIcon />
      <span>{t("bestPrices", "Best Prices")}</span>
    </div>
  </div>
</section>

      {/* ── GLOBAL STYLES ──────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        @media (max-width: 768px) {
          .cs-desktop-nav  { display: none !important; }
          .cs-desktop-icons { display: none !important; }
          .cs-desktop-me  { display: none !important; }
          .cs-mobile-btn  { display: flex !important; }
          .cs-divider     { display: none !important; }
        }
      `}</style>
    </div>
  );
}