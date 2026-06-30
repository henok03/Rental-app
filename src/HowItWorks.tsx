import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "./supabaseClient";

// ─── Inline SVG Icon System ────────────────────────────────────────────────
const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const MessageIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);
const HeartOutlineIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
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
  },
  light: {
    bg: "#f4f4f9",
    navBg: "rgba(255,255,255,0.96)",
    cardBg: "#ffffff",
    inputBg: "#f8f8fc",
    border: "#e4e4ef",
    text: "#12122a",
    subtext: "#606088",
  },
};

const steps = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    title: "Search Homes",
    desc: "Enter your country, set your room preference and budget. Our smart search instantly surfaces homes that match your lifestyle.",
    detail: "Filter by rooms, price range, and location all at once.",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
      </svg>
    ),
    title: "Explore Listings",
    desc: "Browse verified homes with real photos, detailed descriptions, and transparent pricing. Save favourites to compare later.",
    detail: "Every listing is reviewed and verified by our team.",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
    title: "Contact Owner",
    desc: "Message owners directly through our secure chat. Ask questions, negotiate terms, and book instantly — no third-party fees.",
    detail: "Payments are protected and fully encrypted.",
  },
];

const faqs = [
  { q: "Is CountryStay free to use?", a: "Yes — browsing, searching, and messaging owners is completely free for renters. Owners pay a small listing fee." },
  { q: "How do I know a listing is real?", a: "Every home goes through a manual review process. Verified badges indicate listings our team has inspected." },
  { q: "Can I cancel a booking?", a: "Cancellation policies vary by owner. You'll see the policy clearly before you confirm any booking." },
  { q: "What countries are supported?", a: "We currently support homes in over 60 countries and are expanding monthly. Search your country to check availability." },
];

export default function HowItWorks() {
  const [dark, setDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const t = dark ? theme.dark : theme.light;

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.full_name || "");
        setUserEmail(user.email || "");
      }
    }
    getUser();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", transition: "background 0.3s, color 0.3s" }}>

      {/* ── NAVBAR ─────────────────────────────────────────────────── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: t.navBg,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: `1px solid ${t.border}`,
        padding: "0 28px", height: "62px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "9px", flexShrink: 0 }}>
          <span style={{ color: "#7c3aed" }}><HomeIcon /></span>
          <div>
            <div style={{ fontWeight: 800, fontSize: "15px", letterSpacing: "-0.3px", color: "#7c3aed", lineHeight: 1.1 }}>CountryStay</div>
            <div style={{ fontSize: "10px", color: t.subtext, lineHeight: 1.1 }}>Find your perfect home</div>
          </div>
        </div>

        {/* Desktop links */}
        <div className="cs-desktop-nav" style={{ display: "flex", gap: "46px", alignItems: "center" }}>
          <Link to="/" style={{ color: t.text, textDecoration: "none" }}>Home</Link>
          <Link to="/how-it-works" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 700 }}>How It Works</Link>
          <Link to="/contact" style={{ color: t.text, textDecoration: "none" }}>Contact</Link>
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexShrink: 0 }}>
          <div className="cs-desktop-icons" style={{ display: "flex", gap: "14px" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", color: t.text, padding: 0 }}>
              <HeartOutlineIcon />
              <span style={{ fontSize: "10px", color: t.subtext }}>Favorites</span>
            </button>
            <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", color: t.text, padding: 0 }}>
              <MessageIcon />
              <span style={{ fontSize: "10px", color: t.subtext }}>Messages</span>
            </button>
          </div>

          {/* Dark mode toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: t.subtext, display: "flex" }}><MoonIcon /></span>
            <button onClick={() => setDark(d => !d)} aria-label="Toggle dark mode" style={{ width: "42px", height: "23px", background: dark ? "#7c3aed" : "#cbd5e1", border: "none", borderRadius: "12px", cursor: "pointer", position: "relative", transition: "background 0.3s", flexShrink: 0 }}>
              <span style={{ display: "block", width: "17px", height: "17px", background: "#fff", borderRadius: "50%", position: "absolute", top: "3px", left: dark ? "22px" : "3px", transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.28)" }} />
            </button>
            <span style={{ color: t.subtext, display: "flex" }}><SunIcon /></span>
          </div>

          {/* User avatar */}
          <div onClick={() => setShowProfile(!showProfile)} style={{ display: "flex", alignItems: "center", gap: "7px", cursor: "pointer", position: "relative" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: dark ? "#252540" : "#e8e8f4", display: "flex", alignItems: "center", justifyContent: "center", color: t.text }}>
              <UserIcon />
            </div>
            <span className="cs-desktop-me" style={{ fontSize: "13px", fontWeight: 600 }}>Me ▾</span>
            {showProfile && (
              <div style={{ position: "absolute", top: "46px", right: 0, background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px", minWidth: "220px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", zIndex: 999 }}>
                <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "6px" }}>{userName}</div>
                <div style={{ fontSize: "13px", color: t.subtext }}>{userEmail}</div>
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button className="cs-mobile-btn" onClick={() => setMobileOpen(o => !o)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: t.text, padding: 0 }}>
            {mobileOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div style={{ position: "fixed", top: "62px", left: 0, right: 0, zIndex: 99, background: dark ? "#15152a" : "#fff", borderBottom: `1px solid ${t.border}`, padding: "20px 28px", display: "flex", flexDirection: "column", gap: "18px" }}>
          <Link
  to="/"
  onClick={() => setMobileOpen(false)}
  style={{
    fontSize: "15px",
    color: t.text,
    textDecoration: "none",
  }}
>
  Home
</Link>

<Link
  to="/how-it-works"
  onClick={() => setMobileOpen(false)}
  style={{
    fontSize: "15px",
    fontWeight: 700,
    color: "#7c3aed",
    textDecoration: "none",
  }}
>
  How It Works
</Link>

<Link
  to="/contact"
  onClick={() => setMobileOpen(false)}
  style={{
    fontSize: "15px",
    color: t.text,
    textDecoration: "none",
  }}
>
  Contact
</Link>



          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section style={{
        position: "relative",
        minHeight: "320px",
        background: "linear-gradient(135deg, #08081a 0%, #120830 45%, #0b1835 100%)",
        overflow: "hidden",
        display: "flex", alignItems: "center",
        padding: "60px 28px 80px",
      }}>
        <div style={{ position: "absolute", top: "-80px", right: "-60px", width: "520px", height: "420px", background: "radial-gradient(ellipse, rgba(124,58,237,0.22) 0%, transparent 68%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-40px", left: "30%", width: "340px", height: "240px", background: "radial-gradient(ellipse, rgba(56,132,255,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "600px", zIndex: 1, position: "relative", margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "100px", padding: "6px 16px", marginBottom: "20px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#8b5cf6", display: "inline-block" }} />
            <span style={{ fontSize: "12px", color: "#a78bfa", fontWeight: 600, letterSpacing: "0.04em" }}>SIMPLE PROCESS</span>
          </div>
          <h1 style={{ margin: 0, color: "#fff", fontSize: "clamp(32px, 5.5vw, 52px)", fontWeight: 800, lineHeight: 1.12, letterSpacing: "-0.5px" }}>
            How It <span style={{ color: "#8b5cf6" }}>Works</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", marginTop: "14px", fontSize: "15px", lineHeight: 1.7 }}>
            Three simple steps stand between you and your perfect home anywhere in the world.
          </p>
        </div>
      </section>

      {/* ── STEPS ───────────────────────────────────────────────────── */}
      <section style={{ padding: "64px 28px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              background: t.cardBg,
              border: `1px solid ${t.border}`,
              borderRadius: "20px",
              padding: "32px 28px",
              position: "relative",
              overflow: "hidden",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.08)",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = dark ? "0 16px 48px rgba(124,58,237,0.2)" : "0 16px 48px rgba(124,58,237,0.12)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = dark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.08)"; }}
            >
              {/* Step number watermark */}
              <div style={{ position: "absolute", top: "16px", right: "20px", fontSize: "72px", fontWeight: 800, color: dark ? "rgba(124,58,237,0.08)" : "rgba(124,58,237,0.06)", lineHeight: 1, userSelect: "none" }}>{i + 1}</div>

              <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "linear-gradient(135deg, #7c3aed, #5b21b6)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px", boxShadow: "0 6px 20px rgba(124,58,237,0.35)" }}>
                {s.icon}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div style={{ width: "22px", height: "22px", borderRadius: "6px", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, color: "#8b5cf6" }}>{i + 1}</div>
                <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: t.text }}>{s.title}</h2>
              </div>

              <p style={{ margin: 0, color: t.subtext, fontSize: "14px", lineHeight: 1.7 }}>{s.desc}</p>

              <div style={{ marginTop: "18px", padding: "10px 14px", background: dark ? "rgba(124,58,237,0.08)" : "rgba(124,58,237,0.05)", borderRadius: "10px", border: `1px solid rgba(124,58,237,0.15)`, fontSize: "12px", color: "#a78bfa", display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                {s.detail}
              </div>

              {/* connector arrow (not on last) */}
              {i < steps.length - 1 && (
                <div className="cs-connector" style={{ display: "none" }} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section style={{ padding: "0 28px 80px", maxWidth: "760px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, color: t.text, margin: 0 }}>
            Frequently Asked <span style={{ color: "#8b5cf6" }}>Questions</span>
          </h2>
          <p style={{ color: t.subtext, marginTop: "10px", fontSize: "14px" }}>Everything you need to know before getting started.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: t.cardBg, border: `1px solid ${openFaq === i ? "rgba(124,58,237,0.4)" : t.border}`, borderRadius: "14px", overflow: "hidden", transition: "border-color 0.2s" }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: "100%", background: "none", border: "none", padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", color: t.text, textAlign: "left" }}
              >
                <span style={{ fontWeight: 600, fontSize: "14px" }}>{faq.q}</span>
                <span style={{ color: "#7c3aed", transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s", fontSize: "20px", lineHeight: 1, flexShrink: 0, marginLeft: "12px" }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 20px 18px", color: t.subtext, fontSize: "14px", lineHeight: 1.7 }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section style={{ padding: "0 28px 80px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(91,33,182,0.12) 100%)",
          border: "1px solid rgba(124,58,237,0.25)",
          borderRadius: "24px",
          padding: "48px 36px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "240px", height: "240px", background: "radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
          <h2 style={{ margin: 0, fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 800, color: t.text }}>Ready to find your <span style={{ color: "#8b5cf6" }}>perfect home?</span></h2>
          <p style={{ color: t.subtext, marginTop: "10px", fontSize: "14px", marginBottom: "28px" }}>Join thousands of people who found their home through CountryStay.</p>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, #7c3aed, #5b21b6)", color: "#fff", textDecoration: "none", borderRadius: "12px", padding: "13px 28px", fontWeight: 700, fontSize: "14px", boxShadow: "0 6px 20px rgba(124,58,237,0.35)" }}>
            Start Searching
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </Link>
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
        }
      `}</style>
    </div>
  );
}