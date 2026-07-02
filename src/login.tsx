import { useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageToggle from "./LanguageToggle";
// ─── Theme ────────────────────────────────────────────────────────────────
const T = {
  bg: "#0d0d1a",
  cardBg: "#15152a",
  inputBg: "#1a1a30",
  border: "#252540",
  borderFocus: "#7c3aed",
  text: "#eeeeff",
  subtext: "#8080a8",
  accent: "#7c3aed",
  accentDark: "#5b21b6",
  error: "#ef4444",
  success: "#22c55e",
};

// ─── Icons ────────────────────────────────────────────────────────────────
const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.subtext} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
);
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.subtext} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
const EyeIcon = ({ open }: { open: boolean }) => open ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.subtext} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.subtext} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// ─── Input Field ──────────────────────────────────────────────────────────
function InputField({
  icon, type = "text", placeholder, value, onChange, rightSlot,
}: {
  icon: React.ReactNode; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void; rightSlot?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "10px",
      background: T.inputBg,
      border: `1.5px solid ${focused ? T.borderFocus : T.border}`,
      borderRadius: "12px", padding: "0 14px",
      transition: "border-color 0.2s",
    }}>
      <span style={{ flexShrink: 0, display: "flex" }}>{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={e => { if (e.key === "Enter") document.getElementById("login-btn")?.click(); }}
        style={{
          flex: 1, background: "none", border: "none", outline: "none",
          color: T.text, fontSize: "14px", padding: "13px 0",
          fontFamily: "inherit",
        }}
      />
      {rightSlot && <span style={{ flexShrink: 0, display: "flex", cursor: "pointer" }}>{rightSlot}</span>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────
export default function Login() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  // Where to send the user after login succeeds. Defaults to homepage
  // if nobody sent them here with a ?redirect= link.
  const redirectTo = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    setErrorMsg("");
    if (!email.trim()) { setErrorMsg(t("emailRequired", "Email is required.")); return; }
    if (!password.trim()) { setErrorMsg(t("passwordRequired", "Password is required.")); return; }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      // Send them back to wherever they came from (e.g. a property page),
      // instead of always going to the homepage.
      navigate(redirectTo);
    } catch (err: any) {
      setErrorMsg(err.message || t("loginFailed", "Login failed. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      display: "flex", flexDirection: "column",
    }}>
      {/* Background glows */}
      <div style={{ position: "fixed", top: "-100px", left: "-80px", width: "500px", height: "500px", background: "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-80px", right: "-60px", width: "400px", height: "400px", background: "radial-gradient(ellipse, rgba(56,132,255,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* ── TOP BAR ── */}
      <nav style={{
        position: "relative", zIndex: 10,
        borderBottom: `1px solid ${T.border}`,
        padding: "0 clamp(16px,4vw,32px)", height: "62px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <span style={{ color: T.accent }}><HomeIcon /></span>
          <div>
            <div style={{ fontWeight: 800, fontSize: "15px", color: T.accent, lineHeight: 1.1 }}>{t("logoName", "CountryStay")}</div>
            <div style={{ fontSize: "10px", color: T.subtext, lineHeight: 1.1 }}>{t("logoSubtitle", "Find your perfect home")}</div>
          </div>
        </Link>
        <div style={{ position: 'absolute', top: '16px', right: '120px', zIndex: 50 }}>
          <LanguageToggle dark={true} t={T} />
        </div>
        <Link
          to={`/signup${redirectTo !== "/" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
          style={{
            fontSize: "13px", fontWeight: 600, color: T.subtext,
            textDecoration: "none", padding: "7px 16px",
            border: `1px solid ${T.border}`, borderRadius: "9px",
            transition: "border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = T.accent; (e.currentTarget as HTMLAnchorElement).style.color = T.accent; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = T.border; (e.currentTarget as HTMLAnchorElement).style.color = T.subtext; }}
        >
          {t("signUp", "Sign Up")}
        </Link>
      </nav>

      {/* ── MAIN ── */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "clamp(24px,5vw,48px) clamp(16px,4vw,24px)",
        position: "relative", zIndex: 1,
      }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>

          {/* Card */}
          <div style={{
            background: T.cardBg,
            border: `1px solid ${T.border}`,
            borderRadius: "24px",
            padding: "clamp(24px,5vw,40px)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          }}>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "14px",
                background: "linear-gradient(135deg,#7c3aed,#5b21b6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px",
                boxShadow: "0 8px 24px rgba(124,58,237,0.4)",
              }}>
                <HomeIcon />
              </div>
              <h1 style={{ margin: 0, fontWeight: 800, fontSize: "22px", color: T.text }}>{t("welcomeBack", "Welcome Back")}</h1>
              <p style={{ margin: "6px 0 0", fontSize: "14px", color: T.subtext }}>
                {t("signInToContinue", "Sign in to continue to CountryStay")}
              </p>
            </div>

            {/* Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

              <InputField
                icon={<MailIcon />}
                type="email"
                placeholder={t("emailAddressPlaceholder", "Email Address")}
                value={email}
                onChange={setEmail}
              />

              <InputField
                icon={<LockIcon />}
                type={showPassword ? "text" : "password"}
                placeholder={t("passwordOnlyPlaceholder", "Password")}
                value={password}
                onChange={setPassword}
                rightSlot={
                  <span onClick={() => setShowPassword(s => !s)}>
                    <EyeIcon open={showPassword} />
                  </span>
                }
              />

              {/* Error */}
              {errorMsg && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "11px 14px", fontSize: "13px", color: T.error }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.error} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  {errorMsg}
                </div>
              )}

              {/* Submit */}
              <button
                id="login-btn"
                onClick={handleLogin}
                disabled={loading}
                style={{
                  width: "100%", padding: "13px",
                  background: loading ? "#1e1e38" : "linear-gradient(135deg,#7c3aed,#5b21b6)",
                  color: loading ? T.subtext : "#fff",
                  border: "none", borderRadius: "12px",
                  fontWeight: 700, fontSize: "15px",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  boxShadow: loading ? "none" : "0 4px 20px rgba(124,58,237,0.4)",
                  transition: "opacity 0.2s", fontFamily: "inherit",
                  marginTop: "4px",
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.88"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
              >
                {loading ? (
                  <>
                    <span style={{ width: "16px", height: "16px", border: `2px solid ${T.subtext}`, borderTopColor: "transparent", borderRadius: "50%", animation: "lg-spin 0.7s linear infinite", display: "inline-block" }} />
                    {t("signingIn", "Signing in…")}
                  </>
                ) : t("signInButton", "Sign In")}
              </button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "4px 0" }}>
                <div style={{ flex: 1, height: "1px", background: T.border }} />
                <span style={{ fontSize: "12px", color: T.subtext }}>{t("noAccountYet", "don't have an account?")}</span>
                <div style={{ flex: 1, height: "1px", background: T.border }} />
              </div>

              {/* Sign up link */}
              <Link
                to={`/signup${redirectTo !== "/" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
                style={{
                  display: "block", textAlign: "center",
                  padding: "12px",
                  background: "none",
                  border: `1px solid ${T.border}`,
                  borderRadius: "12px",
                  color: T.text, fontWeight: 600, fontSize: "14px",
                  textDecoration: "none",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = T.accent; (e.currentTarget as HTMLAnchorElement).style.color = T.accent; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = T.border; (e.currentTarget as HTMLAnchorElement).style.color = T.text; }}
              >
                {t("createNewAccount", "Create a New Account")}
              </Link>
            </div>
          </div>

          {/* Footer note */}
          <p style={{ textAlign: "center", fontSize: "12px", color: T.subtext, marginTop: "20px" }}>
            {t("protectedBySupabase", "Protected by Supabase Auth")} ·{" "}
            <span style={{ color: T.accent, cursor: "pointer" }}>{t("privacyPolicy", "Privacy Policy")}</span>
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        input::placeholder { color: ${T.subtext}; }
        @keyframes lg-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}