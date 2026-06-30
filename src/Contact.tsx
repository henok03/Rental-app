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

const contactInfo = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: "Email",
    value: "support@countrystay.com",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10a19.79 19.79 0 01-3-8.65 2 2 0 012-2.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 6.91a16 16 0 005.35 5.35l.91-1.35a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7a2 2 0 011.72 2z" />
      </svg>
    ),
    label: "Phone",
    value: "+1 (800) 555-0190",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    label: "Response Time",
    value: "Within 24 hours",
  },
];

export default function Contact() {
  const [dark, setDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const t = dark ? theme.dark : theme.light;

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.full_name || "");
        setUserEmail(user.email || "");
        setName(user.user_metadata?.full_name || "");
        setEmail(user.email || "");
      }
    }
    getUser();
  }, []);

  function handleSend() {
    if (!name.trim() || !message.trim()) return;
    setSent(true);
  }

  const inputStyle = (field: string) => ({
    width: "100%",
    boxSizing: "border-box" as const,
    padding: "13px 16px",
    border: `1px solid ${focused === field ? "#7c3aed" : t.border}`,
    borderRadius: "12px",
    background: t.inputBg,
    color: t.text,
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "'DM Sans', sans-serif",
  });

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", transition: "background 0.3s, color 0.3s" }}>

      {/* ── NAVBAR ─────────────────────────────────────────────────── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: t.navBg,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: `1px solid ${t.border}`,
        padding: "0 clamp(14px,4vw,28px)", height: "62px",
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
          <Link to="/how-it-works" style={{ color: t.text, textDecoration: "none" }}>How It Works</Link>
          <Link to="/contact" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 700 }}>Contact</Link>
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
            <Link to="/" onClick={() => setMobileOpen(false)} style={{ fontSize: "15px", color: t.text, textDecoration: "none" }}>Home</Link>
            <Link to="/how-it-works" onClick={() => setMobileOpen(false)} style={{ fontSize: "15px", color: t.text, textDecoration: "none" }}>How It Works</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)} style={{ fontSize: "15px", fontWeight: 700, color: "#7c3aed", textDecoration: "none" }}>Contact</Link>
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section style={{
        position: "relative",
        minHeight: "clamp(200px, 30vw, 280px)",
        background: "linear-gradient(135deg, #08081a 0%, #120830 45%, #0b1835 100%)",
        overflow: "hidden",
        display: "flex", alignItems: "center",
        padding: "clamp(40px,6vw,60px) clamp(16px,4vw,28px) clamp(60px,8vw,80px)",
      }}>
        <div style={{ position: "absolute", top: "-80px", left: "-60px", width: "480px", height: "380px", background: "radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 68%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-40px", right: "20%", width: "300px", height: "200px", background: "radial-gradient(ellipse, rgba(56,132,255,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "600px", zIndex: 1, position: "relative", margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "100px", padding: "6px 16px", marginBottom: "20px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#8b5cf6", display: "inline-block" }} />
            <span style={{ fontSize: "12px", color: "#a78bfa", fontWeight: 600, letterSpacing: "0.04em" }}>WE'RE HERE TO HELP</span>
          </div>
          <h1 style={{ margin: 0, color: "#fff", fontSize: "clamp(28px, 5.5vw, 52px)", fontWeight: 800, lineHeight: 1.12, letterSpacing: "-0.5px" }}>
            Contact <span style={{ color: "#8b5cf6" }}>Us</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", marginTop: "14px", fontSize: "clamp(13px,2vw,15px)", lineHeight: 1.7 }}>
            Have a question or need help? Our team typically responds within 24 hours.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ────────────────────────────────────────────── */}
      <section style={{ padding: "clamp(32px,5vw,64px) clamp(14px,4vw,28px) clamp(40px,6vw,80px)", maxWidth: "1000px", margin: "0 auto" }}>
        <div className="cs-contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "clamp(16px,3vw,32px)", alignItems: "start" }}>

          {/* Left: contact info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <h2 style={{ margin: "0 0 8px", fontSize: "clamp(16px,2.5vw,20px)", fontWeight: 700, color: t.text }}>Get in Touch</h2>
              <p style={{ margin: 0, color: t.subtext, fontSize: "14px", lineHeight: 1.7 }}>
                Fill out the form and we'll get back to you as soon as possible.
              </p>
            </div>

            {contactInfo.map((info, i) => (
              <div key={i} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: "14px", padding: "16px 18px", display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {info.icon}
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: t.subtext, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "3px" }}>{info.label}</div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: t.text }}>{info.value}</div>
                </div>
              </div>
            ))}

            {/* Social links */}
            <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: "14px", padding: "16px 18px" }}>
              <div style={{ fontSize: "11px", color: t.subtext, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>Follow Us</div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {["Twitter", "LinkedIn", "Instagram"].map(s => (
                  <div key={s} style={{ padding: "6px 12px", borderRadius: "8px", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", fontSize: "12px", color: "#a78bfa", cursor: "pointer", fontWeight: 600 }}>{s}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: "20px", padding: "clamp(20px,4vw,32px)", boxShadow: dark ? "0 12px 48px rgba(0,0,0,0.3)" : "0 12px 48px rgba(0,0,0,0.08)" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <h3 style={{ margin: "0 0 8px", fontSize: "20px", fontWeight: 700, color: t.text }}>Message Sent!</h3>
                <p style={{ color: t.subtext, fontSize: "14px", lineHeight: 1.7, marginBottom: "24px" }}>Thanks for reaching out. We'll respond within 24 hours.</p>
                <button onClick={() => { setSent(false); setMessage(""); setSubject(""); }} style={{ padding: "11px 24px", borderRadius: "10px", border: `1px solid ${t.border}`, background: "none", color: t.text, cursor: "pointer", fontWeight: 600, fontSize: "14px", fontFamily: "'DM Sans', sans-serif" }}>
                  Send Another
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 700, color: t.text }}>Send a Message</h3>
                  <p style={{ margin: 0, color: t.subtext, fontSize: "13px" }}>All fields marked with * are required.</p>
                </div>

                <div className="cs-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.subtext, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Name *</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inputStyle("name")} onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.subtext, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={inputStyle("email")} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.subtext, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Subject</label>
                  <div style={{ position: "relative" }}>
                    <select value={subject} onChange={e => setSubject(e.target.value)} style={{ ...inputStyle("subject"), appearance: "none", cursor: "pointer", paddingRight: "36px" }} onFocus={() => setFocused("subject")} onBlur={() => setFocused(null)}>
                      <option value="">Select a topic…</option>
                      <option>General Question</option>
                      <option>Booking Help</option>
                      <option>Listing Issue</option>
                      <option>Payment Problem</option>
                      <option>Account Support</option>
                      <option>Other</option>
                    </select>
                    <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: t.subtext }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                    </span>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.subtext, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Message *</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Tell us how we can help…" rows={5} style={{ ...inputStyle("message"), resize: "none" }} onFocus={() => setFocused("message")} onBlur={() => setFocused(null)} />
                </div>

                <button
                  onClick={handleSend}
                  disabled={!name.trim() || !message.trim()}
                  style={{
                    padding: "13px", borderRadius: "12px", border: "none",
                    background: name.trim() && message.trim() ? "linear-gradient(135deg, #7c3aed, #5b21b6)" : (dark ? "#252540" : "#e4e4ef"),
                    color: name.trim() && message.trim() ? "#fff" : t.subtext,
                    fontWeight: 700, cursor: name.trim() && message.trim() ? "pointer" : "not-allowed",
                    boxShadow: name.trim() && message.trim() ? "0 6px 20px rgba(124,58,237,0.35)" : "none",
                    fontSize: "14px", fontFamily: "'DM Sans', sans-serif",
                    transition: "opacity 0.2s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  }}
                  onMouseEnter={e => { if (name.trim() && message.trim()) (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                  Send Message
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── GLOBAL STYLES ──────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        @media (max-width: 768px) {
          .cs-desktop-nav   { display: none !important; }
          .cs-desktop-icons { display: none !important; }
          .cs-desktop-me    { display: none !important; }
          .cs-mobile-btn    { display: flex !important; }
        }
        @media (max-width: 680px) {
          .cs-contact-grid  { grid-template-columns: 1fr !important; }
          .cs-form-row      { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}