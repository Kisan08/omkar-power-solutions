"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface QuoteData {
  proposalNo: string;
  date: string;
  validUntil: string;
  clientName: string;
  siteAddress: string;
  contactPerson: string;
  systemCapacity: number;
  ratePerWp: number;
}

function calculateQuote(data: QuoteData) {
  const wp = data.systemCapacity * 1000;
  const panels = Math.ceil(wp / 580);
  const inverterKw = data.systemCapacity;
  const estGeneration = Math.round(1332 * data.systemCapacity);
  const exGST = wp * data.ratePerWp;
  const gst = exGST * 0.12;
  const total = exGST + gst;
  const t1 = total * 0.30;
  const t2 = total * 0.40;
  const t3 = total * 0.20;
  const t4 = total * 0.10;
  const timeline = data.systemCapacity >= 75 ? "100 days from PO & Advance" : "60-70 days from PO & Advance";
  return { wp, panels, inverterKw, estGeneration, exGST, gst, total, t1, t2, t3, t4, timeline };
}

function formatINR(amount: number) {
  return `Rs. ${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, "0")} / ${String(d.getMonth() + 1).padStart(2, "0")} / ${d.getFullYear()}`;
}

const DARK_BLUE = "#0D3260";
const BLUE = "#1A4F8A";
const ACCENT = "#F5A623";
const LIGHT_BLUE = "#EEF2FF";

function QuotationDocument({ form, calc }: { form: QuoteData; calc: ReturnType<typeof calculateQuote> }) {
  return (
    <div id="quotation-document" style={{ fontFamily: "Calibri, Arial, sans-serif", fontSize: 10, color: "#222", background: "white", padding: 32, maxWidth: 800, margin: "0 auto" }}>

      {/* ── HEADER ── */}
      {[1, 2, 3, 4, 5, 6].map((page) => null)}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12, paddingBottom: 10, borderBottom: `2px solid ${BLUE}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/logo.png" alt="OPS" style={{ width: 44, height: 44, objectFit: "contain" }} />
          <div>
            <div style={{ color: BLUE, fontWeight: "bold", fontSize: 15 }}>OMKAR POWER SOLUTIONS</div>
            <div style={{ color: "#555", fontSize: 9 }}>Engineering • Procurement • Construction (EPC) – Solar Division</div>
            <div style={{ color: "#555", fontSize: 9 }}>📞 8452035102 &nbsp;✉ omkarpowersolutions16@gmail.com</div>
          </div>
        </div>
        <div style={{ background: DARK_BLUE, color: "white", padding: "10px 18px", borderRadius: 6, textAlign: "center" }}>
          <div style={{ fontSize: 8, letterSpacing: 1 }}>TECHNO-COMMERCIAL</div>
          <div style={{ color: ACCENT, fontWeight: "bold", fontSize: 13 }}>PROPOSAL</div>
        </div>
      </div>

      {/* ── PREPARED FOR ── */}
      <div style={{ background: ACCENT, padding: "7px 14px", borderRadius: 4, marginBottom: 16, fontWeight: "bold", fontSize: 11 }}>
        PREPARED FOR: {form.clientName.toUpperCase() || "CLIENT NAME"} | {form.systemCapacity} kWp ROOFTOP SOLAR PV SYSTEM
      </div>

      {/* ── SECTION 1 — OUR STORY ── */}
      <SectionHeader title="SECTION 1 — OUR STORY" />
      <div style={{ border: `1px solid #ddd`, borderRadius: 4, padding: "10px 14px", marginBottom: 10, background: "#FAFBFF" }}>
        <p style={{ marginBottom: 6 }}>We are a professional Solar EPC company delivering high-quality, efficient, and reliable solar energy solutions across Maharashtra. We handle everything end-to-end — from engineering design and procurement of premium components to installation, commissioning, and long-term maintenance.</p>
        <p>Our focus on quality workmanship, safety, and long-term performance ensures every project delivers maximum return on investment.</p>
      </div>

      {/* Services */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10 }}>
        <thead>
          <tr style={{ background: DARK_BLUE, color: "white" }}>
            <th colSpan={4} style={{ padding: "6px 10px", textAlign: "left", fontSize: 10 }}>OUR SERVICES</th>
          </tr>
          <tr style={{ background: "#f0f4ff" }}>
            {["☀ On-Grid Solar", "🔋 Off-Grid / Hybrid", "🏭 C&I Projects", "🔧 O&M Services"].map(s => (
              <th key={s} style={{ padding: "5px 8px", border: "1px solid #ddd", color: BLUE, fontWeight: "bold", fontSize: 9, textAlign: "left" }}>{s}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: "5px 8px", border: "1px solid #ddd", fontSize: 9 }}>Grid-tied rooftop systems with net metering for societies, homes & offices.</td>
            <td style={{ padding: "5px 8px", border: "1px solid #ddd", fontSize: 9 }}>Battery-backed systems for areas with power cuts or zero grid dependency.</td>
            <td style={{ padding: "5px 8px", border: "1px solid #ddd", fontSize: 9 }}>Large-scale commercial & industrial solar plants for maximum ROI.</td>
            <td style={{ padding: "5px 8px", border: "1px solid #ddd", fontSize: 9 }}>Annual maintenance contracts to ensure peak system performance.</td>
          </tr>
        </tbody>
      </table>

      {/* Why Choose Us */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
        <thead>
          <tr style={{ background: DARK_BLUE, color: "white" }}>
            <th colSpan={2} style={{ padding: "6px 10px", textAlign: "left", fontSize: 10 }}>WHY CHOOSE US</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ background: "#f0fff4" }}>
            <td style={{ padding: "6px 10px", border: "1px solid #ddd", fontSize: 9 }}>
              {["✔ Turnkey EPC — single point responsibility", "✔ Tier-1 modules & inverters only", "✔ HDG structures with 15-yr corrosion warranty", "✔ Erection All Risk & Marine insurance included"].map(i => <div key={i}>{i}</div>)}
            </td>
            <td style={{ padding: "6px 10px", border: "1px solid #ddd", fontSize: 9 }}>
              {["✔ DISCOM approvals fully managed by us", "✔ Height-trained workforce, zero accident record", "✔ Performance monitoring setup included", "✔ Post-commissioning AMC support available"].map(i => <div key={i}>{i}</div>)}
            </td>
          </tr>
        </tbody>
      </table>

      <Footer />

      {/* ── SECTION 2 — PROPOSAL DETAILS ── */}
      <div style={{ marginTop: 24 }}>
        <SectionHeader title="SECTION 2 — PROPOSAL DETAILS" />
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
          <tbody>
            <tr>
              <td style={{ background: LIGHT_BLUE, padding: "5px 8px", fontWeight: "bold", border: "1px solid #ddd", width: "20%" }}>Proposal No.</td>
              <td style={{ padding: "5px 8px", border: "1px solid #ddd", width: "30%" }}>{form.proposalNo}</td>
              <td style={{ background: LIGHT_BLUE, padding: "5px 8px", fontWeight: "bold", border: "1px solid #ddd", width: "20%" }}>Date</td>
              <td style={{ padding: "5px 8px", border: "1px solid #ddd", width: "30%" }}>{formatDate(form.date)}</td>
            </tr>
            <tr>
              <td style={{ background: LIGHT_BLUE, padding: "5px 8px", fontWeight: "bold", border: "1px solid #ddd" }}>Client Name</td>
              <td style={{ padding: "5px 8px", border: "1px solid #ddd", fontWeight: "bold" }}>{form.clientName || "—"}</td>
              <td style={{ background: LIGHT_BLUE, padding: "5px 8px", fontWeight: "bold", border: "1px solid #ddd" }}>Valid Until</td>
              <td style={{ padding: "5px 8px", border: "1px solid #ddd" }}>{formatDate(form.validUntil)}</td>
            </tr>
            <tr>
              <td style={{ background: LIGHT_BLUE, padding: "5px 8px", fontWeight: "bold", border: "1px solid #ddd" }}>Site Address</td>
              <td style={{ padding: "5px 8px", border: "1px solid #ddd" }}>{form.siteAddress || "—"}</td>
              <td style={{ background: LIGHT_BLUE, padding: "5px 8px", fontWeight: "bold", border: "1px solid #ddd" }}>Contact Person</td>
              <td style={{ padding: "5px 8px", border: "1px solid #ddd" }}>{form.contactPerson || "—"}</td>
            </tr>
          </tbody>
        </table>

        {/* System at a Glance */}
        <SectionHeader title="SYSTEM AT A GLANCE" />
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
          <thead>
            <tr style={{ background: DARK_BLUE, color: "white" }}>
              {["SYSTEM CAPACITY", "SOLAR PANELS", "INVERTER", "EST. GENERATION"].map(h => (
                <th key={h} style={{ padding: "6px 8px", border: "1px solid #ddd", textAlign: "center" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ textAlign: "center" }}>
              <td style={{ padding: "10px", border: "1px solid #ddd", fontWeight: "bold", fontSize: 16, color: BLUE }}>{form.systemCapacity} kWp</td>
              <td style={{ padding: "10px", border: "1px solid #ddd", fontWeight: "bold" }}>{calc.panels} Panels<br /><span style={{ fontWeight: "normal", fontSize: 9 }}>Waaree 580 Wp</span></td>
              <td style={{ padding: "10px", border: "1px solid #ddd", fontWeight: "bold" }}>{calc.inverterKw} kW<br /><span style={{ fontWeight: "normal", fontSize: 9 }}>Waaree String</span></td>
              <td style={{ padding: "10px", border: "1px solid #ddd", fontWeight: "bold", color: "#22c55e" }}>{calc.estGeneration.toLocaleString()} kWh<br /><span style={{ fontWeight: "normal", fontSize: 9 }}>per year (est.)</span></td>
            </tr>
          </tbody>
        </table>

        {/* Technical Specs */}
        <SectionHeader title="TECHNICAL SPECIFICATIONS" />
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
          <tbody>
            {[
              ["Module", "Waaree / Premier TopCon Bifacial 580 Wp DCR", "Inverter", `Waaree ${form.systemCapacity} kW String Inverter`],
              ["Structure", "Hot-Dip Galvanized (HDG)", "DC Cable", "4 mm² Tinned Cu, EN-50618 (Waasol)"],
              ["Performance Ratio", "75% | GHI: 1,850 kWh/m²", "Degradation", "0.45% YoY from Year 2"],
              ["Timeline", calc.timeline, "BIS / Compliance", "Yes — Module BIS | EN-50618 Cables"],
            ].map((row, i) => (
              <tr key={i}>
                <td style={{ background: LIGHT_BLUE, padding: "5px 8px", fontWeight: "bold", border: "1px solid #ddd", width: "18%", color: BLUE }}>{row[0]}</td>
                <td style={{ padding: "5px 8px", border: "1px solid #ddd", width: "32%" }}>{row[1]}</td>
                <td style={{ background: LIGHT_BLUE, padding: "5px 8px", fontWeight: "bold", border: "1px solid #ddd", width: "18%", color: BLUE }}>{row[2]}</td>
                <td style={{ padding: "5px 8px", border: "1px solid #ddd", width: "32%" }}>{row[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Footer />
      </div>

      {/* ── SECTION 3 — PRICING ── */}
      <div style={{ marginTop: 24 }}>
        <SectionHeader title="SECTION 3 — PRICING" />
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
          <thead>
            <tr style={{ background: DARK_BLUE, color: "white" }}>
              <th style={{ padding: "6px 10px", border: "1px solid #ddd", textAlign: "left" }}>PRICING BREAKDOWN</th>
              <th style={{ padding: "6px 10px", border: "1px solid #ddd", textAlign: "right" }}>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["System Capacity", `${calc.wp.toLocaleString()} Wp (${calc.panels} × 580 Wp panels)`],
              ["Rate (Rs. / Wp)", `Rs. ${form.ratePerWp}.00 / Wp`],
              ["Total Price (excl. GST)", formatINR(calc.exGST)],
              ["GST @ 12%", formatINR(calc.gst)],
            ].map(([label, val], i) => (
              <tr key={i}>
                <td style={{ background: LIGHT_BLUE, padding: "5px 10px", fontWeight: "bold", border: "1px solid #ddd", color: BLUE }}>{label}</td>
                <td style={{ padding: "5px 10px", border: "1px solid #ddd", textAlign: "right", fontWeight: i >= 2 ? "bold" : "normal" }}>{val}</td>
              </tr>
            ))}
            <tr style={{ background: "#FFF9E6" }}>
              <td style={{ padding: "8px 10px", fontWeight: "bold", border: "1px solid #ddd", fontSize: 12 }}>TOTAL PRICE (incl. GST)</td>
              <td style={{ padding: "8px 10px", border: "1px solid #ddd", textAlign: "right", fontWeight: "bold", fontSize: 14, color: ACCENT }}>{formatINR(calc.total)}</td>
            </tr>
          </tbody>
        </table>

        {/* Payment Schedule */}
        <SectionHeader title="PAYMENT SCHEDULE" />
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
          <thead>
            <tr style={{ background: DARK_BLUE, color: "white" }}>
              <th style={{ padding: "6px 8px", border: "1px solid #ddd", width: "8%" }}></th>
              <th style={{ padding: "6px 8px", border: "1px solid #ddd", textAlign: "left" }}>MILESTONE</th>
              <th style={{ padding: "6px 8px", border: "1px solid #ddd", textAlign: "center" }}>%</th>
              <th style={{ padding: "6px 8px", border: "1px solid #ddd", textAlign: "right" }}>AMOUNT (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "T-1", desc: "Advance on Purchase Order", pct: "30%", amt: calc.t1 },
              { label: "T-2", desc: "Material Delivery to Site", pct: "40%", amt: calc.t2 },
              { label: "T-3", desc: "Installation & Commissioning", pct: "20%", amt: calc.t3 },
              { label: "T-4", desc: "Net Meter Approval & System Handover", pct: "10%", amt: calc.t4 },
            ].map((row) => (
              <tr key={row.label}>
                <td style={{ padding: "5px 8px", border: "1px solid #ddd", background: BLUE, color: "white", textAlign: "center", fontWeight: "bold" }}>{row.label}</td>
                <td style={{ padding: "5px 8px", border: "1px solid #ddd" }}>{row.desc}</td>
                <td style={{ padding: "5px 8px", border: "1px solid #ddd", textAlign: "center", fontWeight: "bold" }}>{row.pct}</td>
                <td style={{ padding: "5px 8px", border: "1px solid #ddd", textAlign: "right", fontWeight: "bold", color: BLUE }}>{formatINR(row.amt)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Warranties */}
        <SectionHeader title="WARRANTIES" />
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
          <thead>
            <tr style={{ background: DARK_BLUE, color: "white" }}>
              <th style={{ padding: "6px 8px", border: "1px solid #ddd", textAlign: "left" }}>Component</th>
              <th style={{ padding: "6px 8px", border: "1px solid #ddd", textAlign: "left" }}>Coverage</th>
              <th style={{ padding: "6px 8px", border: "1px solid #ddd", textAlign: "center" }}>Period</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Solar PV Modules", "Manufacturing Defect", "12 Years"],
              ["Solar PV Modules", "Linear Performance", "30 Years"],
              ["Inverter", "Standard Warranty", "5 Years (extendable to 8)"],
              ["Structure (HDG)", "Corrosion Warranty", "15 Years"],
              ["Balance of System", "OEM Standard", "1 Year"],
              ["Workmanship", "Installation Quality", "1 Year"],
            ].map(([comp, cov, period], i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#f0fff4" : "white" }}>
                <td style={{ padding: "5px 8px", border: "1px solid #ddd", fontWeight: "bold", color: BLUE }}>{comp}</td>
                <td style={{ padding: "5px 8px", border: "1px solid #ddd" }}>{cov}</td>
                <td style={{ padding: "5px 8px", border: "1px solid #ddd", textAlign: "center", fontWeight: "bold", color: "#22c55e" }}>{period}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Footer />
      </div>

      {/* ── APPENDIX ── */}
      <div style={{ marginTop: 24 }}>
        <div style={{ background: DARK_BLUE, color: "white", padding: "6px 10px", textAlign: "center", fontWeight: "bold", fontSize: 11, marginBottom: 4 }}>
          APPENDIX — FOR YOUR REFERENCE
        </div>
        <div style={{ color: "#555", fontStyle: "italic", fontSize: 9, marginBottom: 10, textAlign: "center" }}>
          The following sections contain detailed technical specifications, scope of work and material list for your records.
        </div>

        {/* Inclusions & Exclusions */}
        <SectionHeader title="A1 — INCLUSIONS & EXCLUSIONS" />
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
          <thead>
            <tr>
              <th style={{ background: "#22c55e", color: "white", padding: "6px 10px", border: "1px solid #ddd", textAlign: "center", width: "50%" }}>✔ INCLUDED</th>
              <th style={{ background: "#ef4444", color: "white", padding: "6px 10px", border: "1px solid #ddd", textAlign: "center", width: "50%" }}>✘ EXCLUDED (Client Scope)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "8px 10px", border: "1px solid #ddd", background: "#f0fff4", fontSize: 9 }}>
                {["✔ Solar modules, inverter, mounting structure", "✔ DC & AC cables, connectors, cable trays", "✔ Earthing system & lightning arrester", "✔ Net meter with LT/CT box", "✔ DISCOM net metering approval", "✔ Erection All Risk & Marine insurance", "✔ Commissioning, testing & monitoring setup"].map(i => <div key={i}>{i}</div>)}
              </td>
              <td style={{ padding: "8px 10px", border: "1px solid #ddd", background: "#fff5f5", fontSize: 9 }}>
                {["✘ Water supply at site", "✘ Internet for monitoring", "✘ Power during installation", "✘ Service lift / crane", "✘ Roof access ladder", "✘ Removal of existing system (if any)", "✘ Meter merging / load enhancement"].map(i => <div key={i}>{i}</div>)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Bill of Material */}
        <SectionHeader title="A2 — BILL OF MATERIAL" />
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
          <thead>
            <tr style={{ background: DARK_BLUE, color: "white" }}>
              <th style={{ padding: "5px 8px", border: "1px solid #ddd", width: "6%" }}>Sr.</th>
              <th style={{ padding: "5px 8px", border: "1px solid #ddd", width: "25%" }}>Item</th>
              <th style={{ padding: "5px 8px", border: "1px solid #ddd" }}>Make / Specifications</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["1", "Solar PV Modules", "Waaree / Premier TopCon Bifacial 580 Wp | BIS Compliant | 0.45% degradation/yr"],
              ["2", "String Inverter", `Waaree ${form.systemCapacity} kW | Grid-tied | Remote monitoring ready`],
              ["3", "Mounting Structure", "Hot-Dip Galvanized (HDG) | SS-304 A2-70 Fasteners | 15-yr warranty"],
              ["4", "DC Cables", "4 mm² Tinned Cu UV-Protected | Waasol | EN-50618 Certified"],
              ["5", "DC Connectors (MC4)", "Siemens | IP67 rated | Weatherproof"],
              ["6", "AC Cables", "Polycab/KEI | Al XLPE Armoured | Bimetallic Lugs | Inv→ACDB→Panel"],
              ["7", "AC Distribution Box", "Schneider/L&T/ABB | MCCB Thermal-Magnetic | OC, SC & EL protection | SPD-2: Phoenix/Citel"],
              ["8", "Earthing System", "Polycab/KEI | Module-Module: 4 sq mm Cu | Inverter/Panel: 16 sq mm Cu"],
              ["9", "Earth Pits & LA", "True Power/Sabo | Maintenance-Free Chemical Pits | 17.2 mm Dia Cu-Bonded 250µ"],
              ["10", "Earth Strip", "ARMOLEX | 25×3 mm GI Strip"],
              ["11", "Cable Tray/Conduit", "HDPE DWC UV (DC) | GI Tray (AC)"],
              ["12", "Net Meter + LT/CT Box", "As per DISCOM spec | Fully included in scope"],
              ["13", "Lightning Arrester", "Standard scope | Included"],
              ["14", "AC Termination", "Comet/Dowells | Double-Compression Weatherproof Glands | Al/Cu Lugs"],
              ["15", "EPC & Insurance", "Height-trained team | Zero accident record | EAR + Marine Insurance till commissioning"],
              ["16", "DISCOM Approval", "Net metering registration — fully managed by Omkar Power Solutions"],
            ].map(([sr, item, spec], i) => (
              <tr key={sr} style={{ background: i % 2 === 0 ? "white" : "#f9fafb" }}>
                <td style={{ padding: "4px 8px", border: "1px solid #ddd", textAlign: "center" }}>{sr}</td>
                <td style={{ padding: "4px 8px", border: "1px solid #ddd", fontWeight: "bold", color: BLUE }}>{item}</td>
                <td style={{ padding: "4px 8px", border: "1px solid #ddd", fontSize: 9 }}>{spec}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Scope of Work */}
        <SectionHeader title="A3 — SCOPE OF WORK MATRIX" />
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
          <thead>
            <tr style={{ background: DARK_BLUE, color: "white" }}>
              <th style={{ padding: "5px 8px", border: "1px solid #ddd", width: "6%" }}>#</th>
              <th style={{ padding: "5px 8px", border: "1px solid #ddd" }}>Description</th>
              <th style={{ padding: "5px 8px", border: "1px solid #ddd", textAlign: "center" }}>Design</th>
              <th style={{ padding: "5px 8px", border: "1px solid #ddd", textAlign: "center" }}>Supply</th>
              <th style={{ padding: "5px 8px", border: "1px solid #ddd", textAlign: "center" }}>Install</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["1", "Design & Engineering", "OPS", "—", "—"],
              ["2", "Solar PV Modules", "OPS", "OPS", "OPS"],
              ["3", "Inverters", "OPS", "OPS", "OPS"],
              ["4", "Mounting Structures", "OPS", "OPS", "OPS"],
              ["5", "LT Panels / ACDB", "OPS", "OPS", "OPS"],
              ["6", "DC & AC Cables", "OPS", "OPS", "OPS"],
              ["7", "Earthing System", "OPS", "OPS", "OPS"],
              ["8", "Spare Feeder", "OPS", "OPS", "OPS"],
              ["9", "Net Metering & DISCOM", "OPS", "—", "OPS"],
            ].map(([num, desc, design, supply, install], i) => (
              <tr key={num} style={{ background: i % 2 === 0 ? "white" : "#f9fafb" }}>
                <td style={{ padding: "4px 8px", border: "1px solid #ddd", textAlign: "center" }}>{num}</td>
                <td style={{ padding: "4px 8px", border: "1px solid #ddd", fontWeight: "bold" }}>{desc}</td>
                {[design, supply, install].map((val, j) => (
                  <td key={j} style={{ padding: "4px 8px", border: "1px solid #ddd", textAlign: "center", color: val === "OPS" ? "#22c55e" : "#999", fontWeight: val === "OPS" ? "bold" : "normal" }}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Signatures */}
        <SectionHeader title="ACCEPTANCE & SIGNATURES" />
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
          <thead>
            <tr style={{ background: DARK_BLUE, color: "white" }}>
              <th style={{ padding: "6px 10px", border: "1px solid #ddd", textAlign: "left" }}>For Omkar Power Solutions</th>
              <th style={{ padding: "6px 10px", border: "1px solid #ddd", textAlign: "left" }}>Accepted by — {form.clientName || "Client"}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "30px 10px 10px", border: "1px solid #ddd", verticalAlign: "bottom" }}>
                <div style={{ borderTop: "1px solid #999", paddingTop: 4, fontSize: 9 }}>
                  <div>Authorised Signatory</div>
                  <div style={{ fontWeight: "bold" }}>Name: Omkar Deshmukh</div>
                  <div>Date: _______________</div>
                </div>
              </td>
              <td style={{ padding: "30px 10px 10px", border: "1px solid #ddd", verticalAlign: "bottom" }}>
                <div style={{ borderTop: "1px solid #999", paddingTop: 4, fontSize: 9 }}>
                  <div>Client Signature</div>
                  <div style={{ fontWeight: "bold" }}>Name: Chairman / Authorised Signatory</div>
                  <div>Date: _______________</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ textAlign: "center", color: BLUE, fontWeight: "bold", fontSize: 11, marginBottom: 16 }}>
          Thank you for choosing Omkar Power Solutions — Powering a Greener Tomorrow ☀
        </div>

        <Footer />
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{ background: "#1A4F8A", color: "white", padding: "5px 10px", borderRadius: 4, fontWeight: "bold", fontSize: 10, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 3, height: 14, background: "#F5A623", borderRadius: 2 }} />
      {title}
    </div>
  );
}

function Footer() {
  return (
    <div style={{ borderTop: "1px solid #ddd", paddingTop: 6, textAlign: "center", color: "#666", fontSize: 8, marginTop: 8 }}>
      Omkar Power Solutions | 8452035102 | omkarpowersolutions16@gmail.com | Confidential
    </div>
  );
}

export default function QuotePage() {
  const today = new Date().toISOString().split("T")[0];
  const validDate = new Date();
  validDate.setDate(validDate.getDate() + 30);
  const validStr = validDate.toISOString().split("T")[0];

  const [form, setForm] = useState<QuoteData>({
    proposalNo: `OPS-${new Date().getFullYear()}-001`,
    date: today,
    validUntil: validStr,
    clientName: "",
    siteAddress: "",
    contactPerson: "",
    systemCapacity: 10,
    ratePerWp: 52,
  });

  const calc = calculateQuote(form);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "systemCapacity" || name === "ratePerWp" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleDownloadPDF = async () => {
    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;

    const element = document.getElementById("quotation-document");
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    const pageHeight = pdf.internal.pageSize.getHeight();
    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`Proposal for ${form.clientName || "Client"} ${form.systemCapacity} KW.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white px-4 py-2 rounded-xl transition-all duration-300"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <span className="text-blue-400">←</span>
            <span>Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="OPS" width={28} height={28} className="object-contain" />
            <span className="text-white font-medium">OPS — Quotation Generator</span>
          </div>
        </div>
        {/* <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 text-sm font-medium bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-xl transition-colors"
        >
          ⬇ Download PDF
        </button> */}
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* LEFT — Form */}
        <div
          className="rounded-2xl p-6 h-fit md:sticky md:top-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
          }}
        >
          <h2 className="text-lg font-medium text-white mb-1">Fill Client Details</h2>
          <p className="text-xs text-gray-500 mb-6">All calculations are automatic</p>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Proposal No.</label>
                <input name="proposalNo" value={form.proposalNo} onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Date</label>
                <input type="date" name="date" value={form.date} onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Client Name</label>
              <input name="clientName" value={form.clientName} onChange={handleChange} placeholder="e.g. Dynamic Crest"
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500 placeholder-gray-600" />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Site Address</label>
              <input name="siteAddress" value={form.siteAddress} onChange={handleChange} placeholder="e.g. Kalyan East, Maharashtra"
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500 placeholder-gray-600" />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Contact Person (Phone)</label>
              <input name="contactPerson" value={form.contactPerson} onChange={handleChange} placeholder="e.g. 9594339594"
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500 placeholder-gray-600" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">System Capacity (kWp)</label>
                <input type="number" name="systemCapacity" value={form.systemCapacity} onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Rate (Rs./Wp)</label>
                <input type="number" name="ratePerWp" value={form.ratePerWp} onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500" />
              </div>
            </div>

            {/* Auto calculated */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mt-2">
              <p className="text-xs text-gray-500 mb-3">Auto-calculated:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  ["Panels needed", `${calc.panels} × 580 Wp`],
                  ["Est. generation", `${calc.estGeneration.toLocaleString()} kWh/yr`],
                  ["Price excl. GST", formatINR(calc.exGST)],
                  ["GST @ 12%", formatINR(calc.gst)],
                  ["Total incl. GST", formatINR(calc.total)],
                  ["Timeline", calc.timeline],
               ].map(([label, val]) => (
                <div key={String(label)} className="contents">
                    <div className="text-gray-400">{String(label)}:</div>
                    <div className={`font-medium ${label === "Total incl. GST" ? "text-yellow-400" : "text-white"}`}>{String(val)}</div>
                </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={handleDownloadPDF}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white text-sm font-medium py-3 rounded-xl transition-colors"
                >
                    ⬇ Download PDF
                </button>
                <button
                    onClick={() => window.print()}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-3 rounded-xl transition-colors"
                >
                    🖨 Print
                </button>
            </div>
          </div>
        </div>

        {/* RIGHT — Preview */}
        <div className="overflow-auto rounded-2xl border border-gray-800" style={{ maxHeight: "90vh" }}>
          <QuotationDocument form={form} calc={calc} />
        </div>
        <style>{`
            @media print {
                body * { visibility: hidden; }
                #quotation-document, #quotation-document * { visibility: visible; }
                #quotation-document {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                }
            }
        `}</style>
      </div>
    </div>
  );
}