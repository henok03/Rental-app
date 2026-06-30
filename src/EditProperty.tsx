import { useState, useRef, useCallback, useEffect } from "react";
import type { DragEvent, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "./supabaseClient";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ─── Theme (mirrors AddProperty / UserDashboard) ──────────────────────────
const T = {
  bg: "#0d0d1a",
  navBg: "rgba(13,13,26,0.96)",
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
  tagBg: "#1e1e38",
};

// ─── Icons ────────────────────────────────────────────────────────────────
const BackIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const UploadIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
  </svg>
);
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.success} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.error} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────
interface ImageFile {
  id: string;
  file?: File;      // present for newly added local images
  preview: string;
  existingUrl?: string; // present for images already saved in DB
  dbId?: number;        // property_images row id, if it exists in DB
}

interface FormErrors {
  [key: string]: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function fileToPreview(file: File): Promise<string> {
  return new Promise((res) => {
    const reader = new FileReader();
    reader.onload = (e) => res(e.target?.result as string);
    reader.readAsDataURL(file);
  });
}

async function uploadToSupabase(file: File, bucket = "property-images"): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `properties/${uid()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// ─── Sub-components ───────────────────────────────────────────────────────

function Label({ children, required }: { children: string; required?: boolean }) {
  return (
    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: T.subtext, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "7px" }}>
      {children}{required && <span style={{ color: T.accent, marginLeft: "3px" }}>*</span>}
    </label>
  );
}

function Input({
  placeholder, value, onChange, type = "text", error,
}: {
  placeholder?: string; value: string; onChange: (v: string) => void;
  type?: string; error?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", boxSizing: "border-box",
          padding: "11px 14px",
          background: T.inputBg,
          border: `1.5px solid ${error ? T.error : focused ? T.borderFocus : T.border}`,
          borderRadius: "10px", color: T.text,
          fontSize: "14px", outline: "none",
          transition: "border-color 0.2s",
          fontFamily: "inherit",
        }}
      />
      {error && <p style={{ margin: "5px 0 0", fontSize: "12px", color: T.error }}>{error}</p>}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: T.cardBg, border: `1px solid ${T.border}`,
      borderRadius: "16px", padding: "clamp(18px,3vw,28px)",
      display: "flex", flexDirection: "column", gap: "18px",
    }}>
      <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: T.text, paddingBottom: "12px", borderBottom: `1px solid ${T.border}` }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function ImageDropZone({
  label, onFiles, multiple = false,
}: {
  label: string; onFiles: (files: File[]) => void; multiple?: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    if (files.length) onFiles(files);
  }, [onFiles]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith("image/"));
    if (files.length) onFiles(files);
    e.target.value = "";
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${dragging ? T.accent : T.border}`,
        borderRadius: "12px",
        padding: "28px 20px",
        textAlign: "center",
        cursor: "pointer",
        background: dragging ? "rgba(124,58,237,0.06)" : T.inputBg,
        transition: "border-color 0.2s, background 0.2s",
      }}
    >
      <UploadIcon />
      <p style={{ margin: "10px 0 4px", fontSize: "14px", fontWeight: 600, color: T.text }}>{label}</p>
      <p style={{ margin: 0, fontSize: "12px", color: T.subtext }}>Drag & drop or click to browse · JPG, PNG, WEBP</p>
      <input ref={inputRef} type="file" accept="image/*" multiple={multiple} style={{ display: "none" }} onChange={handleChange} />
    </div>
  );
}

function ImagePreviewGrid({
  images, onRemove,
}: {
  images: ImageFile[]; onRemove: (id: string) => void;
}) {
  if (!images.length) return null;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px,1fr))", gap: "10px", marginTop: "12px" }}>
      {images.map((img) => (
        <div key={img.id} style={{ position: "relative", borderRadius: "10px", overflow: "hidden", aspectRatio: "1", border: `1px solid ${T.border}` }}>
          <img src={img.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <button
            type="button"
            onClick={() => onRemove(img.id)}
            style={{
              position: "absolute", top: "5px", right: "5px",
              width: "22px", height: "22px", borderRadius: "50%",
              background: "rgba(0,0,0,0.65)", border: "none",
              color: "#fff", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = T.error)}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0.65)")}
          >
            <XIcon />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────
export default function EditProperty() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Text fields
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [rooms, setRooms] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [sqft, setSqft] = useState("");
  const [rating, setRating] = useState("");
  const [landlordName, setLandlordName] = useState("");
  const [landlordPhone, setLandlordPhone] = useState("");
  const [landlordEmail, setLandlordEmail] = useState("");
  const [landlordWhatsapp, setLandlordWhatsapp] = useState("");
  const [landlordTelegram, setLandlordTelegram] = useState("");

  // Images
  const [mainImages, setMainImages] = useState<ImageFile[]>([]); // single item, either existing or new
  const [extraImages, setExtraImages] = useState<ImageFile[]>([]); // existing + new mixed
  const [removedExtraDbIds, setRemovedExtraDbIds] = useState<number[]>([]);

  const [amenityInput, setAmenityInput] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);

  // UI state
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const popularAmenities = [
    "WiFi", "Parking", "Pool", "Gym", "Air Conditioning",
    "Security", "TV", "Kitchen", "Balcony", "Garden",
  ];

  const [position, setPosition] = useState({ lat: 9.032, lng: 38.746 });

  function LocationPicker() {
    useMapEvents({
      click(e: any) {
        setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  }

  // ── Load existing property ──────────────────────────────────────────
  useEffect(() => {
    loadProperty();
  }, [id]);

  async function loadProperty() {
    if (!id) {
      setErrorMsg("No property id provided.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }

    const { data: prop, error: propErr } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (propErr || !prop) {
      setErrorMsg(propErr?.message || "Property not found.");
      setLoading(false);
      return;
    }

    if (prop.user_id !== user.id) {
      setErrorMsg("You don't have permission to edit this property.");
      setLoading(false);
      return;
    }

    setName(prop.name ?? "");
    setTitle(prop.title ?? "");
    setLocation(prop.location ?? "");
    setAddress(prop.address ?? "");
    setPrice(prop.price != null ? String(prop.price) : "");
    setRooms(prop.rooms != null ? String(prop.rooms) : "");
    setBedrooms(prop.bedrooms != null ? String(prop.bedrooms) : "");
    setBathrooms(prop.bathrooms != null ? String(prop.bathrooms) : "");
    setSqft(prop.sqft != null ? String(prop.sqft) : "");
    setRating(prop.rating != null ? String(prop.rating) : "");
    setLandlordName(prop.landlord_name ?? "");
    setLandlordPhone(prop.landlord_phone ?? "");
    setLandlordEmail(prop.landlord_email ?? "");
    setLandlordWhatsapp(prop.landlord_whatsapp ?? "");
    setLandlordTelegram(prop.landlord_telegram ?? "");
    setAmenities(Array.isArray(prop.amenities) ? prop.amenities : []);
    setPosition({
      lat: prop.lat != null ? Number(prop.lat) : 9.032,
      lng: prop.lng != null ? Number(prop.lng) : 38.746,
    });

    if (prop.image_url) {
      setMainImages([{ id: uid(), preview: prop.image_url, existingUrl: prop.image_url }]);
    }

    const { data: extraRows } = await supabase
      .from("property_images")
      .select("*")
      .eq("property_id", prop.id);

    if (extraRows && extraRows.length) {
      setExtraImages(
        extraRows.map((row: any) => ({
          id: uid(),
          preview: row.image_url,
          existingUrl: row.image_url,
          dbId: row.id,
        }))
      );
    }

    setLoading(false);
  }

  // ── Validation ──────────────────────────────────────────────────────
  function validate(): boolean {
    const e: FormErrors = {};
    if (!name.trim())       e.name = "Property name is required";
    if (!location.trim())   e.location = "Location is required";
    if (!price.trim())      e.price = "Price is required";
    else if (isNaN(Number(price)) || Number(price) <= 0) e.price = "Enter a valid price";
    if (bedrooms && isNaN(Number(bedrooms))) e.bedrooms = "Must be a number";
    if (rooms && isNaN(Number(rooms))) e.rooms = "Must be a number";
    if (sqft && isNaN(Number(sqft))) e.sqft = "Must be a number";
    if (rating && (isNaN(Number(rating)) || Number(rating) < 0 || Number(rating) > 5))
      e.rating = "Rating must be between 0 and 5";
    if (!mainImages.length) e.mainImage = "A main image is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function addAmenity() {
    const value = amenityInput.trim();
    if (!value) return;
    if (!amenities.includes(value)) {
      setAmenities([...amenities, value]);
    }
    setAmenityInput("");
  }

  function removeAmenity(item: string) {
    setAmenities(amenities.filter((a) => a !== item));
  }

  // ── Image handlers ──────────────────────────────────────────────────
  async function addMainImages(files: File[]) {
    const first = files[0]; // only one main image
    const preview = await fileToPreview(first);
    setMainImages([{ id: uid(), file: first, preview }]);
    setErrors((prev) => ({ ...prev, mainImage: "" }));
  }

  async function addExtraImages(files: File[]) {
    const newImgs: ImageFile[] = await Promise.all(
      files.map(async (f) => ({ id: uid(), file: f, preview: await fileToPreview(f) }))
    );
    setExtraImages((prev) => [...prev, ...newImgs]);
  }

  function removeMain(id: string) {
    setMainImages((prev) => prev.filter((i) => i.id !== id));
  }

  function removeExtra(removeId: string) {
    setExtraImages((prev) => {
      const target = prev.find((i) => i.id === removeId);
      if (target?.dbId) {
        setRemovedExtraDbIds((ids) => [...ids, target.dbId as number]);
      }
      return prev.filter((i) => i.id !== removeId);
    });
  }

  // ── Submit ──────────────────────────────────────────────────────────
  async function handleSubmit() {
    setSuccessMsg("");
    setErrorMsg("");
    if (!validate() || !id) return;

    setSubmitting(true);
    try {
      // 1. Resolve main image url — upload new file if one was chosen, else keep existing
      const mainImg = mainImages[0];
      let mainUrl = mainImg.existingUrl ?? "";
      if (mainImg.file) {
        mainUrl = await uploadToSupabase(mainImg.file);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      // 2. Update property row
      const { error: updateErr } = await supabase
        .from("properties")
        .update({
          name,
          title,
          location,
          amenities,
          address,
          price:     Number(price),
          rent:      Number(price),
          rooms:     rooms     ? Number(rooms)     : null,
          bedrooms:  bedrooms  ? Number(bedrooms)  : null,
          bathrooms: bathrooms ? Number(bathrooms) : null,
          baths:     bathrooms ? Number(bathrooms) : null,
          sqft:      sqft      ? Number(sqft)      : null,
          size:      sqft      ? Number(sqft)      : null,
          image_url: mainUrl,
          rating:    rating    ? Number(rating)    : null,
          landlord_name: landlordName,
          landlord_phone: landlordPhone,
          landlord_email: landlordEmail,
          landlord_whatsapp: landlordWhatsapp,
          landlord_telegram: landlordTelegram,
          lat: position.lat,
          lng: position.lng,
        })
        .eq("id", id)
        .eq("user_id", user.id);

      if (updateErr) throw new Error(updateErr.message);

      // 3. Remove deleted extra images from DB
      if (removedExtraDbIds.length > 0) {
        const { error: delErr } = await supabase
          .from("property_images")
          .delete()
          .in("id", removedExtraDbIds);
        if (delErr) throw new Error(delErr.message);
      }

      // 4. Upload + insert any newly added extra images
      const newExtra = extraImages.filter((img) => img.file);
      if (newExtra.length > 0) {
        const extraUrls = await Promise.all(newExtra.map((img) => uploadToSupabase(img.file as File)));
        const rows = extraUrls.map((url) => ({ property_id: Number(id), image_url: url }));
        const { error: imgErr } = await supabase.from("property_images").insert(rows);
        if (imgErr) throw new Error(imgErr.message);
      }

      setSuccessMsg("Property updated successfully! Redirecting…");
      setRemovedExtraDbIds([]);
      setTimeout(() => navigate(-1), 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, color: T.text, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
        <span style={{
          width: "28px", height: "28px", border: `3px solid ${T.border}`,
          borderTopColor: T.accent, borderRadius: "50%",
          animation: "ep-spin 0.7s linear infinite", display: "inline-block",
        }} />
        <style>{`@keyframes ep-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
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
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: T.tagBg, border: "none", borderRadius: "9px",
              padding: "7px 14px", color: T.text,
              fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "background 0.2s",
              fontFamily: "inherit",
            }}
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
        <div style={{ fontSize: "13px", color: T.subtext, fontWeight: 500 }}>Edit Property</div>
      </nav>

      {/* ── PAGE ── */}
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "clamp(24px,4vw,48px) clamp(14px,4vw,24px)" }}>

        {/* Page title */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(22px,4vw,30px)", lineHeight: 1.2 }}>
            Edit Property
          </h1>
          <p style={{ margin: "8px 0 0", color: T.subtext, fontSize: "14px" }}>
            Update the details below and save your changes.
          </p>
        </div>

        {/* ── FORM ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Basic Info */}
          <SectionCard title="Basic Information">
            <div className="ep-grid-2">
              <div>
                <Label required>Property Name</Label>
                <Input value={name} onChange={setName} placeholder="e.g. Modern Villa" error={errors.name} />
              </div>
              <div>
                <Label>Title</Label>
                <Input value={title} onChange={setTitle} placeholder="e.g. Luxury 3-Bed Home" />
              </div>
            </div>
            <div className="ep-grid-2">
              <div>
                <Label required>Location</Label>
                <Input value={location} onChange={setLocation} placeholder="e.g. Dubai, UAE" error={errors.location} />
              </div>
              <div>
                <Label>Address</Label>
                <Input value={address} onChange={setAddress} placeholder="Street address" />
              </div>
            </div>
          </SectionCard>

          {/* Pricing */}
          <SectionCard title="Pricing">
            <div>
              <Label required>Monthly Price ($)</Label>
              <Input value={price} onChange={setPrice} type="number" placeholder="e.g. 2500" error={errors.price} />
            </div>
          </SectionCard>

          {/* Map */}
          <SectionCard title="Location on Map">
            <MapContainer
              center={[position.lat, position.lng]}
              zoom={13}
              style={{ height: "400px", width: "100%", borderRadius: "12px" }}
            >
              <TileLayer
                url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=ABqKSXtmafZwP3KNza5g`}
              />
              <LocationPicker />
              <Marker
                draggable
                position={[position.lat, position.lng]}
                eventHandlers={{
                  dragend: (e) => {
                    const marker = e.target;
                    const pos = marker.getLatLng();
                    setPosition({ lat: pos.lat, lng: pos.lng });
                  },
                }}
              />
            </MapContainer>
          </SectionCard>

          {/* Amenities */}
          <SectionCard title="Amenities">
            <div style={{ display: "flex", gap: "12px", marginBottom: "18px" }}>
              <input
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                placeholder="Add amenity (WiFi, Pool, Gym...)"
                style={{
                  flex: 1, padding: "11px 14px",
                  background: T.inputBg, border: `1.5px solid ${T.border}`,
                  borderRadius: "10px", color: T.text, fontSize: "14px",
                  outline: "none", fontFamily: "inherit",
                }}
              />
              <button
                type="button"
                onClick={addAmenity}
                style={{
                  padding: "0 18px", border: "none", borderRadius: "10px",
                  background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`,
                  color: "#fff", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
                }}
              >
                + Add
              </button>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "18px" }}>
              {popularAmenities.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    if (!amenities.includes(item)) setAmenities([...amenities, item]);
                  }}
                  style={{
                    background: T.tagBg, border: `1px solid ${T.border}`, color: T.text,
                    padding: "8px 14px", borderRadius: "999px", cursor: "pointer",
                    fontSize: "13px", fontWeight: 500, transition: "0.2s",
                  }}
                >
                  + {item}
                </button>
              ))}
            </div>

            {amenities.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {amenities.map((item) => (
                  <div
                    key={item}
                    style={{
                      background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.4)",
                      color: "#c4b5fd", padding: "8px 14px", borderRadius: "999px",
                      display: "flex", alignItems: "center", gap: "8px",
                      fontSize: "13px", fontWeight: 600,
                    }}
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeAmenity(item)}
                      style={{ background: "none", border: "none", color: "#c4b5fd", cursor: "pointer", fontSize: "16px", lineHeight: 1, padding: 0 }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Landlord */}
          <SectionCard title="Landlord Information">
            <div className="ep-grid-2">
              <div>
                <Label>Landlord Name</Label>
                <Input value={landlordName} onChange={setLandlordName} placeholder="John Smith" />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input value={landlordPhone} onChange={setLandlordPhone} placeholder="+251..." />
              </div>
            </div>
            <div className="ep-grid-2">
              <div>
                <Label>Email</Label>
                <Input value={landlordEmail} onChange={setLandlordEmail} placeholder="john@email.com" />
              </div>
              <div>
                <Label>WhatsApp</Label>
                <Input value={landlordWhatsapp} onChange={setLandlordWhatsapp} placeholder="+251..." />
              </div>
            </div>
            <div>
              <Label>Telegram Username</Label>
              <Input value={landlordTelegram} onChange={setLandlordTelegram} placeholder="@username" />
            </div>
          </SectionCard>

          {/* Property Details */}
          <SectionCard title="Property Details">
            <div className="ep-grid-3">
              <div>
                <Label>Rooms</Label>
                <Input value={rooms} onChange={setRooms} type="number" placeholder="e.g. 5" />
              </div>
              <div>
                <Label>Bedrooms</Label>
                <Input value={bedrooms} onChange={setBedrooms} type="number" placeholder="e.g. 3" error={errors.bedrooms} />
              </div>
              <div>
                <Label>Rooms</Label>
                <Input value={rooms} onChange={setRooms} type="number" placeholder="e.g. 2" error={errors.rooms} />
              </div>
            </div>
            <div className="ep-grid-2">
              <div>
                <Label>Square Feet</Label>
                <Input value={sqft} onChange={setSqft} type="number" placeholder="e.g. 1800" error={errors.sqft} />
              </div>
              <div>
                <Label>Rating (0–5)</Label>
                <Input value={rating} onChange={setRating} type="number" placeholder="e.g. 4.5" error={errors.rating} />
              </div>
            </div>
          </SectionCard>

          {/* Main Image */}
          <SectionCard title="Main Image">
            {mainImages.length === 0 ? (
              <ImageDropZone label="Upload Main Property Image" onFiles={addMainImages} />
            ) : (
              <>
                <ImagePreviewGrid images={mainImages} onRemove={removeMain} />
                <button
                  type="button"
                  onClick={() => document.getElementById("ep-main-trigger")?.click()}
                  style={{
                    display: "flex", alignItems: "center", gap: "7px",
                    background: "none", border: `1px dashed ${T.border}`,
                    borderRadius: "9px", padding: "8px 16px",
                    color: T.subtext, fontSize: "13px", fontWeight: 600,
                    cursor: "pointer", width: "fit-content",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.subtext; }}
                >
                  Replace Image
                  <input
                    id="ep-main-trigger"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []).filter(f => f.type.startsWith("image/"));
                      if (files.length) addMainImages(files);
                      e.target.value = "";
                    }}
                  />
                </button>
              </>
            )}
            {errors.mainImage && (
              <p style={{ margin: 0, fontSize: "12px", color: T.error }}>{errors.mainImage}</p>
            )}
          </SectionCard>

          {/* Extra Images */}
          <SectionCard title="Extra Images">
            <ImageDropZone label="Upload Additional Images" onFiles={addExtraImages} multiple />
            <ImagePreviewGrid images={extraImages} onRemove={removeExtra} />
            {extraImages.length > 0 && (
              <p style={{ margin: 0, fontSize: "12px", color: T.subtext }}>
                {extraImages.length} image{extraImages.length !== 1 ? "s" : ""} selected
              </p>
            )}
            {extraImages.length > 0 && (
              <button
                type="button"
                onClick={() => document.getElementById("ep-extra-trigger")?.click()}
                style={{
                  display: "flex", alignItems: "center", gap: "7px",
                  background: "none", border: `1px dashed ${T.border}`,
                  borderRadius: "9px", padding: "8px 16px",
                  color: T.subtext, fontSize: "13px", fontWeight: 600,
                  cursor: "pointer", transition: "border-color 0.2s, color 0.2s",
                  width: "fit-content",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.subtext; }}
              >
                <PlusIcon /> Add More Images
                <input
                  id="ep-extra-trigger"
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith("image/"));
                    if (files.length) addExtraImages(files);
                    e.target.value = "";
                  }}
                />
              </button>
            )}
          </SectionCard>

          {/* Feedback messages */}
          {successMsg && (
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
              borderRadius: "12px", padding: "14px 18px", fontSize: "14px", fontWeight: 500, color: T.success,
            }}>
              <CheckCircleIcon /> {successMsg}
            </div>
          )}
          {errorMsg && (
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "12px", padding: "14px 18px", fontSize: "14px", fontWeight: 500, color: T.error,
            }}>
              <AlertIcon /> {errorMsg}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              width: "100%", padding: "14px",
              background: submitting ? T.tagBg : `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`,
              color: submitting ? T.subtext : "#fff",
              border: "none", borderRadius: "12px",
              fontWeight: 700, fontSize: "16px", cursor: submitting ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              boxShadow: submitting ? "none" : "0 4px 20px rgba(124,58,237,0.4)",
              transition: "opacity 0.2s, transform 0.15s, background 0.3s",
              fontFamily: "inherit",
            }}
            onMouseEnter={e => { if (!submitting) e.currentTarget.style.opacity = "0.88"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
            onMouseDown={e => { if (!submitting) e.currentTarget.style.transform = "scale(0.98)"; }}
            onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            {submitting ? (
              <>
                <span style={{
                  width: "18px", height: "18px", border: `2px solid ${T.subtext}`,
                  borderTopColor: "transparent", borderRadius: "50%",
                  animation: "ep-spin2 0.7s linear infinite", display: "inline-block",
                }} />
                Saving Changes…
              </>
            ) : "Save Changes"}
          </button>
        </div>
      </div>

      {/* ── STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        input::placeholder { color: ${T.subtext}; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { opacity: 0.4; }
        @keyframes ep-spin2 { to { transform: rotate(360deg); } }

        .ep-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .ep-grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 560px) {
          .ep-grid-2, .ep-grid-3 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}