import { useTranslation } from "react-i18next";

export default function LanguageToggle({ dark, t }: { dark: boolean; t: any }) {
  const { i18n } = useTranslation();

  // Toggle between English ('en') and Amharic ('am')
  const toggleLanguage = () => {
    const nextLang = i18n.language === "en" ? "am" : "en";
    i18n.changeLanguage(nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: dark ? "#1e1e38" : "#f0f0fa",
        border: `1px solid ${t.border || (dark ? "#3b3b5e" : "#cbd5e1")}`,
        borderRadius: "9px",
        padding: "6px 12px",
        color: t.text,
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = dark ? "#2e2e4e" : "#e2e2f0";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = dark ? "#1e1e38" : "#f0f0fa";
      }}
    >
      <span>🌐</span> 
      {/* Dynamically shows the label based on the active language */}
      <span>{i18n.language === "en" ? "EN" : "አማርኛ"}</span>
      
      {/* Small Chevron Down */}
      <svg 
        width="12" 
        height="12" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        style={{ marginLeft: "2px" }}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}