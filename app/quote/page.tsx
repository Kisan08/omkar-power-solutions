"use client";
import { useState, type ChangeEvent, type ReactNode, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

/* ─── Types ─── */
interface QuoteForm {
  proposalNo: string;
  date: string;
  validUntil: string;
  clientName: string;
  siteAddress: string;
  contactPerson: string;
  systemCapacity: number;
  ratePerKw: number;
  acCableSpec: string; // ← add this
}

/* ─── Constants ─── */
const GST_RATE = 0.089;
const PANEL_WP = 580;
const YIELD_KWH = 1332;
const NAVY        = "#0F1E3D";
const BLUE        = "#1E88E5";
const ACCENT      = "#F5A623";
const LIGHT       = "#E8F1FA";
const GREEN_DARK  = "#16A34A";
const GREEN_LIGHT = "#DCFCE7";
const RED_DARK    = "#DC2626";
const RED_LIGHT   = "#FEE2E2";

/* ─── Helpers ─── */
const pad = (n: number) => String(n).padStart(2, "0");
const inr = (n: number) => `Rs. ${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const fmtDate = (s: string) => {
  if (!s) return "—";
  const d = new Date(s);
  return `${pad(d.getDate())} / ${pad(d.getMonth() + 1)} / ${d.getFullYear()}`;
};

function compute(f: QuoteForm) {
  const wp     = f.systemCapacity * 1000;
  const panels = Math.ceil(wp / PANEL_WP);
  const instWp = panels * PANEL_WP;
  const gen    = Math.round(YIELD_KWH * f.systemCapacity);
  const net    = Math.round((f.systemCapacity * f.ratePerKw) / 500) * 500;
  const exGst  = Math.round(net / (1 + GST_RATE));
  const gst    = net - exGst;
  return {
    wp, panels, instWp, gen, exGst, gst, net,
    t1: Math.round(net * 0.30),
    t2: Math.round(net * 0.40),
    t3: Math.round(net * 0.20),
    t4: Math.round(net * 0.10),
  };
}
type Calc = ReturnType<typeof compute>;

/* ─── Base styles ─── */
const BASE: CSSProperties = { padding: "7px 12px", border: "1px solid #d0d7e2", fontSize: 11.5 };
const TH: CSSProperties   = { ...BASE, background: NAVY,  color: "white", fontWeight: 700, textAlign: "left" };
const TD: CSSProperties   = { ...BASE };
const LB: CSSProperties   = { ...BASE, background: LIGHT, fontWeight: 600, color: NAVY };

/* ─── Shared components ─── */

function NavBar({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{
      background: NAVY, color: "white",
      padding: "7px 14px", marginTop: 14, marginBottom: 8,
      borderLeft: `4px solid ${BLUE}`,
      fontWeight: 700, fontSize: 12.5, letterSpacing: 0.4,
    }}>
      {title.toUpperCase()}
      {sub && (
        <span style={{
          color: BLUE, fontWeight: 400, fontStyle: "italic",
          marginLeft: 10, fontSize: 11, textTransform: "none",
        }}>— {sub}</span>
      )}
    </div>
  );
}

function BlueBar({ children }: { children: ReactNode }) {
  return (
    <div style={{
      background: BLUE, color: "white",
      padding: "6px 14px", marginTop: 10, marginBottom: 0,
      fontWeight: 600, fontSize: 16,
    }}>{children}</div>
  );
}

function PageHeader() {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      paddingBottom: 10, borderBottom: `2px solid ${BLUE}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img src="/logo.png" alt="OPS"
          style={{ width: 46, height: 46, objectFit: "contain" }} />
        <div>
          <div style={{ color: NAVY, fontWeight: 700, fontSize: 14.5, letterSpacing: 0.4 }}>
            OMKAR POWER SOLUTIONS
          </div>
          <div style={{ color: "#555", fontSize: 9.5, fontStyle: "italic", marginTop: 1 }}>
            Engineering &nbsp;·&nbsp; Procurement &nbsp;·&nbsp; Construction (EPC) – Solar Division
          </div>
          <div style={{ color: "#555", fontSize: 9.5, marginTop: 2 }}>
            📞 8452035102 &nbsp;·&nbsp; omkarpowersolutions16@gmail.com &nbsp;·&nbsp; GST: 27FAVPD3160C1ZE
          </div>
        </div>
      </div>
      <div>
        <img
            src="/waaree_logo.png"
            alt="Waaree"
            style={{ height: 48, objectFit: "contain" }}
        />
      </div>
    </div>
  );
}

function PageFooter() {
  return (
    <div style={{
      borderTop: "1px solid #ddd", paddingTop: 5, marginTop: "auto",
      textAlign: "center", color: "#888", fontSize: 9,
    }}>
      Omkar Power Solutions &nbsp;·&nbsp; 8452035102 &nbsp;·&nbsp; omkarpowersolutions16@gmail.com &nbsp;·&nbsp; Confidential
    </div>
  );
}

function Page({ children }: { children: ReactNode }) {
  return (
    <div className="quote-page" style={{
      fontFamily: "Calibri, Arial, sans-serif",
      fontSize: 11.5, color: "#1a1a1a", background: "white",
      padding: "26px 32px", width: 794, minHeight: 1123,
      margin: "0 auto 18px", boxSizing: "border-box",
      display: "flex", flexDirection: "column", pageBreakAfter: "always",
    }}>
      <PageHeader />
      <div style={{ flex: 1, paddingTop: 4 }}>{children}</div>
      <PageFooter />
    </div>
  );
}

/* ─── PAGE 1 — Our Story ─── */
function P1() {
  return (
    <>
      {/* Real cover image */}
      <div style={{ marginTop: 10, marginBottom: 4 }}>
        <img
          src="/solar_cover.jpg"
          alt="Omkar Power Solutions"
          style={{ width: "100%", height: 175, objectFit: "cover", borderRadius: 3, display: "block" }}
        />
      </div>

      <NavBar title="Our Story" sub="Who we are" />
      <div style={{
        background: LIGHT, padding: "11px 15px", borderRadius: 3,
        fontSize: 11.5, lineHeight: 1.6, borderLeft: `3px solid ${BLUE}`,
      }}>
        <p style={{ marginBottom: 7 }}>
          Omkar Power Solutions is a professional Solar EPC company delivering high-quality, efficient,
          and reliable solar energy solutions across Maharashtra. We handle everything end-to-end —
          engineering design, premium component procurement, installation, commissioning, and long-term
          maintenance support.
        </p>
        <p>
          Our focus on quality workmanship, safety, and long-term performance ensures every project
          delivers maximum return on investment for our clients.
        </p>
      </div>

      <BlueBar>OUR SERVICES</BlueBar>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            {[
              { icon: "☀", t: "On-Grid Solar",     d: "Grid-tied systems with net metering for societies & offices" },
              { icon: "🔋", t: "Off-Grid / Hybrid", d: "Battery-backed systems for zero grid dependency" },
              { icon: "🏭", t: "C&I Projects",      d: "Large commercial & industrial solar plants for max ROI" },
              { icon: "🔧", t: "O&M Services",      d: "Annual maintenance for peak system performance" },
            ].map(s => (
              <td key={s.t} style={{
                padding: "10px 12px", border: "1px solid #d0d7e2",
                fontSize: 10.5, width: "25%", verticalAlign: "top",
              }}>
                <div style={{ fontWeight: 700, color: NAVY, marginBottom: 4, fontSize: 11 }}>
                  {s.icon} {s.t}
                </div>
                <div style={{ color: "#444", lineHeight: 1.4 }}>{s.d}</div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <BlueBar>WHY CHOOSE OMKAR POWER SOLUTIONS</BlueBar>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr style={{ background: GREEN_LIGHT }}>
            {[
              [
                "Turnkey EPC — single point responsibility",
                "Tier-1 Waaree & Premier modules only",
                "HDG structures — 15-yr corrosion warranty",
                "EAR & Marine insurance included",
              ],
              [
                "DISCOM net metering handled end-to-end",
                "Height-trained team, zero accident record",
                "Remote monitoring setup included",
                "Post-commissioning AMC available",
              ],
            ].map((col, ci) => (
              <td key={ci} style={{
                padding: "11px 16px", border: "1px solid #d0d7e2",
                fontSize: 11, width: "50%", verticalAlign: "top", lineHeight: 1.9,
              }}>
                {col.map(i => (
                  <div key={i}>
                    <span style={{ color: GREEN_DARK, fontWeight: 700, marginRight: 7 }}>✔</span>{i}
                  </div>
                ))}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </>
  );
}

/* ─── PAGE 2 — Proposal Details ─── */
function P2({ f, c }: { f: QuoteForm; c: Calc }) {
  return (
    <>
      <NavBar title="Proposal Details" />
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={{ ...LB, width: "18%" }}>Proposal No.</td>
            <td style={{ ...TD, width: "32%" }}>{f.proposalNo}</td>
            <td style={{ ...LB, width: "18%" }}>Date</td>
            <td style={{ ...TD, width: "32%" }}>{fmtDate(f.date)}</td>
          </tr>
          <tr>
            <td style={LB}>Client Name</td>
            <td style={{ ...TD, fontWeight: 700 }}>{f.clientName || "—"}</td>
            <td style={LB}>Valid Until</td>
            <td style={TD}>{fmtDate(f.validUntil)}</td>
          </tr>
          <tr>
            <td style={LB}>Site Address</td>
            <td colSpan={3} style={TD}>{f.siteAddress || "__________________"}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: 18 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: BLUE, color: "white" }}>
              {["SYSTEM CAPACITY", "SOLAR PANELS", "INVERTER", "EST. GENERATION"].map(h => (
                <th key={h} style={{
                  padding: "7px 10px", border: "1px solid #d0d7e2",
                  textAlign: "left", fontSize: 11, width: "25%",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: "#F5F9FF" }}>
              <td style={{ padding: "16px 12px", border: "1px solid #d0d7e2", textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 22, color: BLUE }}>{f.systemCapacity} kWp</div>
                <div style={{ color: "#666", fontSize: 9.5, marginTop: 2 }}>System Size</div>
              </td>
              <td style={{ padding: "16px 12px", border: "1px solid #d0d7e2", textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: NAVY }}>{c.panels} Panels</div>
                <div style={{ color: "#666", fontSize: 9.5, marginTop: 2 }}>Waaree / Premier TopCon Bifacial</div>
                <div style={{ color: "#666", fontSize: 9.5 }}>580 Wp each</div>
              </td>
              <td style={{ padding: "16px 12px", border: "1px solid #d0d7e2", textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: NAVY }}>{f.systemCapacity} kW String</div>
                <div style={{ color: "#666", fontSize: 9.5, marginTop: 2 }}>Waaree String Inverter</div>
              </td>
              <td style={{ padding: "16px 12px", border: "1px solid #d0d7e2", textAlign: "center", background: GREEN_LIGHT }}>
                <div style={{ fontWeight: 700, fontSize: 19, color: GREEN_DARK }}>
                  {c.gen.toLocaleString("en-IN")}
                </div>
                <div style={{ color: "#555", fontSize: 9.5, marginTop: 2 }}>kWh / year (est.)</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <NavBar title="Technical Specifications" />
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {[
            ["Module",            `Waaree / Premier TopCon Bifacial 580 Wp DCR`,  "Inverter",         `Waaree String Inverter ${f.systemCapacity} kW String`],
            ["Structure",         "Hot-Dip Galvanized (HDG)",                      "DC Cable",         "4 mm² Tinned Cu, EN-50618 (Waasol)"],
            ["Performance Ratio", "75%  |  GHI: 1,850 kWh/m²",                    "Degradation",      "0.45% YoY from Year 2"],
            ["Timeline",          "60–70 days from PO & Advance",                  "BIS / Compliance", "Yes — Module BIS | EN-50618"],
          ].map((row, i) => (
            <tr key={i}>
              <td style={{ ...LB, width: "18%" }}>{row[0]}</td>
              <td style={{ ...TD, width: "32%" }}>{row[1]}</td>
              <td style={{ ...LB, width: "18%" }}>{row[2]}</td>
              <td style={{ ...TD, width: "32%" }}>{row[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

/* ─── PAGE 3 — Pricing ─── */
function P3({ f, c }: { f: QuoteForm; c: Calc }) {
  return (
    <>
      <NavBar title="Pricing" sub="Investment summary" />
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ ...TH, width: "55%" }}>DESCRIPTION</th>
            <th style={TH}>AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...LB, fontWeight: 600 }}>System Capacity</td>
            <td style={TD}>{c.panels} Panels × 580 Wp = {c.instWp.toLocaleString("en-IN")} Wp</td>
          </tr>
          <tr>
            <td style={{ ...LB, fontWeight: 600 }}>Rate (Rs. / kW)</td>
            <td style={TD}>Rs. {f.ratePerKw.toLocaleString("en-IN")} per kW (incl. GST)</td>
          </tr>
          <tr>
            <td style={{ ...LB, fontWeight: 600 }}>Total (excl. GST @ 8.9%)</td>
            <td style={{ ...TD, fontWeight: 700 }}>{inr(c.exGst)}</td>
          </tr>
          <tr>
            <td style={{ ...LB, fontWeight: 600 }}>GST @ 8.9%</td>
            <td style={TD}>{inr(c.gst)}</td>
          </tr>
          <tr style={{ background: NAVY }}>
            <td style={{ padding: "10px 12px", border: "1px solid #d0d7e2", color: "white", fontWeight: 700, fontSize: 13 }}>
              NET TOTAL (incl. GST)
            </td>
            <td style={{ padding: "10px 12px", border: "1px solid #d0d7e2", color: ACCENT, fontWeight: 700, fontSize: 15 }}>
              {inr(c.net)}
            </td>
          </tr>
        </tbody>
      </table>

      <NavBar title="Payment Schedule" sub="Milestone-based" />
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ ...TH, width: "8%" }}></th>
            <th style={TH}>MILESTONE</th>
            <th style={{ ...TH, textAlign: "center", width: "14%" }}>%</th>
            <th style={{ ...TH, textAlign: "right", width: "24%" }}>AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {[
            { l: "T-1", d: "Advance on Purchase Order",     p: "30%", a: c.t1 },
            { l: "T-2", d: "Material Delivery to Site",     p: "40%", a: c.t2 },
            { l: "T-3", d: "Installation & Commissioning",  p: "20%", a: c.t3 },
            { l: "T-4", d: "Net Meter Approval & Handover", p: "10%", a: c.t4 },
          ].map(r => (
            <tr key={r.l}>
              <td style={{ ...TD, background: BLUE, color: "white", textAlign: "center", fontWeight: 700 }}>{r.l}</td>
              <td style={TD}>{r.d}</td>
              <td style={{ ...TD, textAlign: "center", fontWeight: 700 }}>{r.p}</td>
              <td style={{ ...TD, textAlign: "right", fontWeight: 700 }}>{inr(r.a)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

/* ─── PAGE 4 — Warranties + Inclusions/Exclusions ─── */
function P4() {
  return (
    <>
      <NavBar title="Warranties" sub="OEM guaranteed" />
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ ...TH, width: "35%" }}>COMPONENT</th>
            <th style={TH}>COVERAGE</th>
            <th style={{ ...TH, textAlign: "center", width: "20%" }}>PERIOD</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Solar PV Modules",  "Manufacturing Defect",           "12 Years"],
            ["Solar PV Modules",  "Linear Performance (80% output)", "30 Years"],
            ["Inverter",          "Standard OEM Warranty",           "5 Years (ext. to 8)"],
            ["Structure (HDG)",   "Corrosion Warranty",              "15 Years"],
            ["Balance of System", "OEM Standard",                    "1 Year"],
            ["Workmanship",       "Installation Quality",            "1 Year"],
          ].map(([comp, cov, period], i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : GREEN_LIGHT }}>
              <td style={{ ...TD, fontWeight: 700, color: NAVY }}>{comp}</td>
              <td style={TD}>{cov}</td>
              <td style={{ ...TD, textAlign: "center", fontWeight: 700, color: GREEN_DARK }}>{period}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <NavBar title="Inclusions & Exclusions" sub="Scope clarity" />
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ ...TD, background: BLUE,     color: "white", fontWeight: 700, width: "50%", textAlign: "left" }}>
              ✔&nbsp; INCLUDED IN SCOPE
            </th>
            <th style={{ ...TD, background: RED_DARK, color: "white", fontWeight: 700, width: "50%", textAlign: "left" }}>
              ✘&nbsp; EXCLUDED — CLIENT SCOPE
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...TD, background: GREEN_LIGHT, lineHeight: 1.95, verticalAlign: "top", padding: "12px 16px" }}>
              {[
                "Solar modules, inverter, mounting structure",
                "DC & AC cables, connectors, cable trays",
                "Earthing system & lightning arrester",
                "Net meter with LT/CT box",
                "DISCOM net metering approval",
                "EAR & Marine insurance till commissioning",
                "Commissioning, testing & monitoring setup",
              ].map(i => (
                <div key={i}>
                  <span style={{ color: GREEN_DARK, fontWeight: 700, marginRight: 7 }}>✔</span>{i}
                </div>
              ))}
            </td>
            <td style={{ ...TD, background: RED_LIGHT, lineHeight: 1.95, verticalAlign: "top", padding: "12px 16px" }}>
              {[
                "Water supply at site",
                "Internet for monitoring",
                "Power during installation",
                "Service lift / crane",
                "Roof access ladder",
                "Removal of existing old system",
                "Meter merging / load enhancement",
              ].map(i => (
                <div key={i}>
                  <span style={{ color: RED_DARK, fontWeight: 700, marginRight: 7 }}>✘</span>{i}
                </div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

/* ─── PAGE 5 — Appendix: BoM + Scope Matrix ─── */
function P5({ f }: { f: QuoteForm }) {
  const bom = [
    ["1",  "Solar PV Modules",      `Waaree / Premier TopCon Bifacial 580 Wp | BIS Compliant | 0.45% degradation/yr`],
    ["2",  "String Inverter",       `Waaree String Inverter ${f.systemCapacity} kW String | Grid-tied | Remote monitoring ready`],
    ["3",  "Mounting Structure",    "Hot-Dip Galvanized (HDG) | SS-304 A2-70 Fasteners | 15-yr warranty"],
    ["4",  "DC Cables",             "4 mm² Tinned Cu UV-Protected | Waasol | EN-50618 Certified"],
    ["5",  "DC Connectors (MC4)",   "Siemens | IP67 rated | Weatherproof"],
    ["6",  "AC Cables",             "Polycab/KEI | Al XLPE Armoured | Bimetallic Lugs | Inv→ACDB→Panel"],
    ["7",  "AC Distribution Box",   "Schneider/L&T/ABB | MCCB | OC, SC & EL protection | SPD-2"],
    ["8",  "Earthing System",       "Polycab/KEI | Module-Module: 4 sq mm Cu | Inverter: 16 sq mm Cu"],
    ["9",  "Earth Pits & LA",       "True Power/Sabo | Maintenance-Free Chemical Pits | Cu-Bonded 250µ"],
    ["10", "Earth Strip",           "ARMOLEX | 25×3 mm GI Strip"],
    ["11", "Cable Tray/Conduit",    "HDPE DWC UV (DC) | GI Tray (AC)"],
    ["12", "Net Meter + LT/CT Box", "As per DISCOM spec | Fully included"],
    ["13", "Lightning Arrester",    "Standard scope | Included"],
    ["14", "AC Termination",        "Comet/Dowells | Double-Compression Weatherproof Glands"],
    ["15", "EPC & Insurance",       "Height-trained team | Zero accident record | EAR + Marine Insurance"],
    ["16", "DISCOM Approval",       "Net metering registration — fully managed by Omkar Power Solutions"],
  ];

  const scope = [
    ["1", "Design & Engineering",  "OPS", "—",   "—"],
    ["2", "Solar PV Modules",      "OPS", "OPS", "OPS"],
    ["3", "Inverters",             "OPS", "OPS", "OPS"],
    ["4", "Mounting Structures",   "OPS", "OPS", "OPS"],
    ["5", "LT Panels / ACDB",      "OPS", "OPS", "OPS"],
    ["6", "DC & AC Cables",        "OPS", "OPS", "OPS"],
    ["7", "Earthing System",       "OPS", "OPS", "OPS"],
    ["8", "Spare Feeder",          "OPS", "OPS", "OPS"],
    ["9", "Net Metering & DISCOM", "OPS", "—",   "OPS"],
  ];

  return (
    <>
      <NavBar title="Appendix" sub="Technical details & scope documentation" />
        <NavBar title="Additional Technical Specifications" />
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 8 }}>
        <thead>
            <tr>
            <th style={{ ...TH, width: "18%" }}>Item</th>
            <th style={{ ...TH, width: "30%" }}>Description</th>
            <th style={{ ...TH, width: "10%", textAlign: "center" }}>Unit</th>
            <th style={{ ...TH, width: "12%", textAlign: "center" }}>Qty</th>
            <th style={TH}>Make / Brand</th>
            </tr>
        </thead>
        <tbody>
            {/* AC Cable — EDITABLE */}
            <tr style={{ background: "#fff" }}>
            <td style={{ ...TD, fontWeight: 700, color: NAVY }}>AC Cable</td>
            <td style={{ ...TD, color: BLUE, fontWeight: 500 }}>{f.acCableSpec || "—"}</td>
            <td style={{ ...TD, textAlign: "center" }}>Meter</td>
            <td style={{ ...TD, textAlign: "center" }}>As per Design</td>
            <td style={TD}>Havells / RR / Polycab</td>
            </tr>
            {/* ACDB — fixed */}
            <tr style={{ background: "#F5F9FF" }}>
            <td style={{ ...TD, fontWeight: 700, color: NAVY }}>ACDB</td>
            <td style={TD}>MCB/MCCB/ACB with protection as per standards with MCB</td>
            <td style={{ ...TD, textAlign: "center" }}>Nos</td>
            <td style={{ ...TD, textAlign: "center" }}>As per Design</td>
            <td style={{ ...TD, fontSize: 9.5 }}>
                PHOENIXCONTACT / MCB SCHNEIDER / C&S / L&T / ABB / GE / SIEMENS Equivalent,
                SPDDEHN / OBO METAL ENCLOSURE ACDB SPD HAVELLS / PHOENIX CONTACT WITH NVR
            </td>
            </tr>
            {/* DCDB — fixed */}
            <tr style={{ background: "#fff" }}>
            <td style={{ ...TD, fontWeight: 700, color: NAVY }}>DCDB</td>
            <td style={TD}>MCB/MCCB/ACB with protection as per standards with MCB</td>
            <td style={{ ...TD, textAlign: "center" }}>Nos</td>
            <td style={{ ...TD, textAlign: "center" }}>As per Design</td>
            <td style={{ ...TD, fontSize: 9.5 }}>
                PHOENIXCONTACT / MCB SCHNEIDER / C&S / L&T / ABB / GE / SIEMENS Equivalent,
                SPDDEHN / OBO METAL ENCLOSURE ACDB SPD HAVELLS / PHOENIX CONTACT WITH NVR
            </td>
            </tr>
            {/* Earthing — fixed */}
            <tr style={{ background: "#F5F9FF" }}>
            <td style={{ ...TD, fontWeight: 700, color: NAVY }}>Earthing</td>
            <td style={{ ...TD, fontSize: 9.5 }}>
                3m 17.2mm Dia 250 micron with 12.5kg Chemical Compound Bag with Chamber cover
            </td>
            <td style={{ ...TD, textAlign: "center" }}>Nos</td>
            <td style={{ ...TD, textAlign: "center" }}>As per Design</td>
            <td style={TD}>Elink / Powertrac / Equivalent</td>
            </tr>
            {/* Lightning Arrestor — fixed */}
            <tr style={{ background: "#fff" }}>
            <td style={{ ...TD, fontWeight: 700, color: NAVY }}>Lightning Arrestor</td>
            <td style={{ ...TD, fontSize: 9.5 }}>
                Conventional LA — Copper Bonded 5 Spike Lightning Arrestor as per IEC-62305 &amp; IS 2309,
                250µ Multi Point Solid Spike Lightning Arrestor Pipe Dia: 14.2mm, Length: 1.2Mtr,
                1 set along with Fasteners, clamps, and insulators.
            </td>
            <td style={{ ...TD, textAlign: "center" }}>Nos</td>
            <td style={{ ...TD, textAlign: "center" }}>As per Design</td>
            <td style={TD}>Elink / Powertrac / Equivalent</td>
            </tr>
        </tbody>
        </table>
      <NavBar title="Bill of Material" sub="Scope of supply & service" />
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ ...TH, width: "5%", textAlign: "center" }}>Sr.</th>
            <th style={{ ...TH, width: "26%" }}>Item</th>
            <th style={TH}>Make / Specifications</th>
          </tr>
        </thead>
        <tbody>
          {bom.map(([sr, item, spec], i) => (
            <tr key={sr} style={{ background: i % 2 === 0 ? "#fff" : "#F5F9FF" }}>
              <td style={{ ...TD, textAlign: "center", fontSize: 10.5 }}>{sr}</td>
              <td style={{ ...TD, fontWeight: 700, color: NAVY, fontSize: 10.5 }}>{item}</td>
              <td style={{ ...TD, fontSize: 10.5 }}>{spec}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <NavBar title="Scope of Work Matrix" sub="Design · Supply · Installation" />
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ ...TH, width: "6%", textAlign: "center" }}>#</th>
            <th style={TH}>Description</th>
            <th style={{ ...TH, textAlign: "center", width: "14%" }}>Design</th>
            <th style={{ ...TH, textAlign: "center", width: "14%" }}>Supply</th>
            <th style={{ ...TH, textAlign: "center", width: "14%" }}>Install</th>
          </tr>
        </thead>
        <tbody>
          {scope.map(([num, desc, design, supply, install], i) => (
            <tr key={num} style={{ background: i % 2 === 0 ? "#fff" : "#F5F9FF" }}>
              <td style={{ ...TD, textAlign: "center" }}>{num}</td>
              <td style={{ ...TD, fontWeight: 700 }}>{desc}</td>
              {[design, supply, install].map((v, j) => (
                <td key={j} style={{
                  ...TD, textAlign: "center", fontWeight: 700,
                  color: v === "OPS" ? GREEN_DARK : "#999",
                }}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

/* ─── PAGE 6 — Signatures ─── */
function P6({ f }: { f: QuoteForm }) {
  return (
    <>
      <NavBar title="Acceptance & Signatures" />
      <div style={{
        background: LIGHT, border: `1px solid ${BLUE}`, borderRadius: 3,
        padding: "10px 16px", fontSize: 11.5, lineHeight: 1.6, marginBottom: 20,
      }}>
        By signing below, both parties agree to the terms and conditions of this
        Techno-Commercial Proposal.{" "}
        <span style={{ color: RED_DARK, fontWeight: 600 }}>
          Payment milestones as per the schedule above. GST additional as applicable.
          Proposal valid for 30 days.
        </span>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: BLUE, color: "white" }}>
            <th style={{ padding: "8px 14px", border: "1px solid #d0d7e2", fontWeight: 700, textAlign: "left", width: "50%" }}>
              FOR OMKAR POWER SOLUTIONS
            </th>
            <th style={{ padding: "8px 14px", border: "1px solid #d0d7e2", fontWeight: 700, textAlign: "left" }}>
              ACCEPTED BY — {f.clientName ? f.clientName.toUpperCase() : "CLIENT"}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: "55px 20px 20px", border: "1px solid #d0d7e2", verticalAlign: "bottom" }}>
              <div style={{ borderTop: "1px solid #aaa", paddingTop: 8, fontSize: 10.5 }}>
                <div style={{ color: "#666" }}>Authorised Signatory</div>
                <div style={{ fontWeight: 700, marginTop: 3 }}>Name: Omkar Deshmukh</div>
                <div style={{ marginTop: 2 }}>Designation: Proprietor</div>
                <div style={{ marginTop: 8 }}>Date: _______________</div>
                <div style={{ marginTop: 5, color: "#666" }}>Seal:</div>
              </div>
            </td>
            <td style={{ padding: "55px 20px 20px", border: "1px solid #d0d7e2", verticalAlign: "bottom" }}>
              <div style={{ borderTop: "1px solid #aaa", paddingTop: 8, fontSize: 10.5 }}>
                <div style={{ color: "#666" }}>Authorised Signatory</div>
                <div style={{ fontWeight: 700, marginTop: 3 }}>
                  Name: {f.clientName || "___________________"}
                </div>
                <div style={{ marginTop: 2 }}>Designation: ___________________</div>
                <div style={{ marginTop: 8 }}>Date: _______________</div>
                <div style={{ marginTop: 5, color: "#666" }}>Seal:</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{
        marginTop: 28, background: NAVY, color: "white",
        textAlign: "center", padding: "12px", borderRadius: 3,
        fontSize: 12, fontWeight: 600,
      }}>
        <span style={{ color: ACCENT }}>Thank you for choosing Omkar Power Solutions</span>
        {" "}— Powering a Greener Tomorrow ☀
      </div>
    </>
  );
}

/* ─── Full Document ─── */
function QuotationDocument({ f, c }: { f: QuoteForm; c: Calc }) {
  return (
    <div id="quotation-document">
      <Page><P1 /></Page>
      <Page><P2 f={f} c={c} /></Page>
      <Page><P3 f={f} c={c} /></Page>
      <Page><P4 /></Page>
      <Page><P5 f={f} /></Page>
      <Page><P6 f={f} /></Page>
    </div>
  );
}

/* ─── Field (outside QuotePage) ─── */
function Field({
  label, name, value, onChange, type = "text", placeholder = "",
}: {
  label: string;
  name: keyof QuoteForm;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
      <input
        type={type} name={name} value={value}
        onChange={onChange} placeholder={placeholder}
        className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500 placeholder-gray-600"
      />
    </div>
  );
}

/* ─── Main Page ─── */
export default function QuotePage() {
  const today = new Date().toISOString().split("T")[0];
  const valid = new Date(); valid.setDate(valid.getDate() + 30);

  const [f, setF] = useState<QuoteForm>({
  proposalNo: `OPS-${new Date().getFullYear()}-001`,
  date: today,
  validUntil: valid.toISOString().split("T")[0],
  clientName: "",
  siteAddress: "",
  contactPerson: "",
  systemCapacity: 15,
  ratePerKw: 59833,
  acCableSpec: "4C x 25 sq. mm AL Armoured as per Design", // ← add this
});

  const [busy, setBusy] = useState(false);
  const c = compute(f);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setF(p => ({
      ...p,
      [name]: name === "systemCapacity" || name === "ratePerKw"
        ? parseFloat(value) || 0 : value,
    }));
  };

  const downloadPDF = async () => {
    setBusy(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;
      const pages = document.querySelectorAll<HTMLElement>(".quote-page");
      if (!pages.length) return;
      const pdf = new jsPDF("p", "mm", "a4");
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();
      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i], {
          scale: 2, useCORS: true, logging: false,
          backgroundColor: "#ffffff", windowWidth: 794,
        });
        const img = canvas.toDataURL("image/png");
        const ih = (canvas.height * pw) / canvas.width;
        if (i > 0) pdf.addPage();
        const yOff = ih < ph ? (ph - ih) / 2 : 0;
        pdf.addImage(img, "PNG", 0, yOff, pw, Math.min(ih, ph));
      }
      pdf.save(`Proposal for ${f.clientName || "Client"} ${f.systemCapacity} KW.pdf`);
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="border-b border-gray-800 px-6 h-16 flex items-center gap-4">
        <Link href="/"
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white px-4 py-2 rounded-xl"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <span className="text-blue-400">←</span><span>Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="OPS" width={28} height={28} className="object-contain" />
          <span className="text-white font-medium">OPS — Quotation Generator</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Form */}
        <div className="rounded-2xl p-6 h-fit md:sticky md:top-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
          }}>
          <h2 className="text-lg font-medium text-white mb-1">Fill Client Details</h2>
          <p className="text-xs text-gray-500 mb-6">Preview updates live</p>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Proposal No." name="proposalNo" value={f.proposalNo} onChange={onChange} />
              <Field label="Date" name="date" type="date" value={f.date} onChange={onChange} />
            </div>
            <Field label="Client / Society Name" name="clientName" value={f.clientName} onChange={onChange}
              placeholder="e.g. Neelkanth Srushti Vaidyanath" />
            <Field label="Site Address" name="siteAddress" value={f.siteAddress} onChange={onChange}
              placeholder="e.g. Kalyan East, Maharashtra" />
            <Field label="Contact Person / Phone" name="contactPerson" value={f.contactPerson} onChange={onChange}
              placeholder="e.g. 9594339594" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="System Capacity (kWp)" name="systemCapacity" type="number"
                value={f.systemCapacity} onChange={onChange} />
              <Field label="Rate (Rs./kW incl. GST)" name="ratePerKw" type="number"
                value={f.ratePerKw} onChange={onChange} />
            </div>
            <Field label="Valid Until" name="validUntil" type="date" value={f.validUntil} onChange={onChange} />
            <Field
            label="AC Cable Spec"
            name="acCableSpec"
            value={f.acCableSpec}
            onChange={onChange}
            placeholder="e.g. 4C x 25 sq. mm AL Armoured as per Design"
            />
            {/* Auto-calc */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mt-1">
              <p className="text-xs text-gray-500 mb-3">Auto-calculated:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  ["Panels",          `${c.panels} × 580 Wp`],
                  ["Est. generation", `${c.gen.toLocaleString("en-IN")} kWh/yr`],
                  ["Excl. GST",       inr(c.exGst)],
                  ["GST @ 8.9%",      inr(c.gst)],
                  ["Net Total",       inr(c.net)],
                  ["T-1 (30%)",       inr(c.t1)],
                  ["T-2 (40%)",       inr(c.t2)],
                  ["T-3 (20%)",       inr(c.t3)],
                  ["T-4 (10%)",       inr(c.t4)],
                ].map(([l, v]) => (
                  <div key={l} className="contents">
                    <div className="text-gray-400">{l}:</div>
                    <div className={`font-medium ${l === "Net Total" ? "text-yellow-400" : "text-white"}`}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={downloadPDF} disabled={busy}
                className="flex-1 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 text-white text-sm font-medium py-3 rounded-xl transition-colors">
                {busy ? "Generating…" : "⬇ Download PDF"}
              </button>
              <button onClick={() => window.print()}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-3 rounded-xl transition-colors">
                🖨 Print
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="overflow-auto rounded-2xl border border-gray-800"
          style={{ maxHeight: "90vh", background: "#e5e7eb" }}>
          <div style={{ padding: 16 }}>
            <QuotationDocument f={f} c={c} />
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #quotation-document, #quotation-document * { visibility: visible; }
          #quotation-document { position: fixed; top: 0; left: 0; width: 100%; }
          .quote-page { page-break-after: always; margin: 0 !important; box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}