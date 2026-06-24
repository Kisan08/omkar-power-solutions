// ─────────────────────────────────────────────────────────────────────────────
// COMPANY CONFIG — Edit this file to white-label the entire platform
// ─────────────────────────────────────────────────────────────────────────────

const COMPANY = {
  // ── Identity ──────────────────────────────────────────────────────────────
  name:        "Omkar Power Solutions",
  shortName:   "OPS",
  tagline:     "Engineering · Procurement · Construction (EPC) – Solar Division",
  gst:         "27FAVPD3160C1ZE",

  // ── Contact ───────────────────────────────────────────────────────────────
  phone:       "8452035102",
  email:       "omkarpowersolutions16@gmail.com",
  address:     "Kalyan East, Maharashtra",
  website:     "https://onesolarpower.in",

  // ── Assets ────────────────────────────────────────────────────────────────
  logo:        "/logo.png",         // place in /public/
  coverImage:  "/solar_cover.jpg",  // place in /public/
  favicon:     "/favicon.ico",

  // ── Brand Colors ──────────────────────────────────────────────────────────
  colors: {
    primary:   "#1A4F8A",   // main blue
    dark:      "#0D3260",   // dark blue
    accent:    "#F5A623",   // orange
    light:     "#E8F1FA",   // light blue bg
  },

  // ── Quote / Proposal defaults ─────────────────────────────────────────────
  quote: {
    panelBrand:     "Waaree / Premier TopCon Bifacial 580 Wp DCR",
    inverterBrand:  "Waaree String Inverter",
    yieldKwh:       1332,       // kWh per kWp per year
    degradation:    0.45,       // % per year from Year 2
    gstRate:        0.089,      // 8.9%
    panelWp:        580,
    defaultRate:    55,         // Rs./Wp excl. GST
    subsidyPerKw:   0,          // Rs. per kW (PM Surya Ghar)
    milestones:     [30, 40, 20, 10], // T1/T2/T3/T4 %
  },

  // ── CRM AI Calling ────────────────────────────────────────────────────────
  aiCall: {
    // Voice script uses company name automatically
    interestedWhatsApp: true,   // send WhatsApp on interested press
    ownerPhone: "917400261410", // WhatsApp alerts go here
  },

  // ── Partner Logos (shown in proposals) ───────────────────────────────────
  partnerLogos: [
    { src: "/waaree_logo.png",       alt: "Waaree" },
    { src: "/adani_solar.png",       alt: "Adani Solar" },
    { src: "/premier_energies.png",  alt: "Premier Energies" },
  ],

  // ── Client Logos (shown in proposals) ────────────────────────────────────
  clientLogos: [
    { src: "/client_hiranandani.jpeg", alt: "Hiranandani" },
    { src: "/client_mahavir.jpeg",     alt: "Mahavir" },
    { src: "/client_jpinfra.jpeg",     alt: "JP Infra" },
    { src: "/client_lodha.jpeg",       alt: "Lodha" },
    { src: "/client_triveni.jpeg",     alt: "Triveni" },
    { src: "/client_regency.jpeg",     alt: "Regency" },
    { src: "/client_mohan.jpeg",       alt: "Mohan Group" },
  ],
};

export default COMPANY;