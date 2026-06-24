"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

type CallStatus =
  | "pending"
  | "calling"
  | "interested"
  | "not_interested"
  | "call_back"
  | "no_answer"
  | "failed";

interface Client {
  id: string;
  name: string;
  phone: string;
  status: CallStatus;
  response: string | null;
  called_at: string | null;
  created_at: string;
}

const STATUS_CONFIG: Record<CallStatus, { label: string; color: string; bg: string }> = {
  pending:        { label: "Pending",        color: "#6B7280", bg: "#F3F4F6" },
  calling:        { label: "Calling…",       color: "#1A4F8A", bg: "#EFF6FF" },
  interested:     { label: "Interested ✅",  color: "#065F46", bg: "#D1FAE5" },
  not_interested: { label: "Not Interested", color: "#991B1B", bg: "#FEE2E2" },
  call_back:      { label: "Call Back 🔁",   color: "#92400E", bg: "#FEF3C7" },
  no_answer:      { label: "No Answer",      color: "#6B7280", bg: "#F3F4F6" },
  failed:         { label: "Failed",         color: "#7C3AED", bg: "#EDE9FE" },
};

const ALL_STATUSES: CallStatus[] = [
  "pending","calling","interested","not_interested","call_back","no_answer","failed",
];

function StatusBadge({ status }: { status: CallStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span style={{
      backgroundColor: cfg.bg, color: cfg.color,
      padding: "2px 8px", borderRadius: 999,
      fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
    }}>
      {cfg.label}
    </span>
  );
}

function formatPhone(p: string) {
  const d = p.replace(/\D/g, "");
  if (d.length === 10) return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
  if (d.length === 12 && d.startsWith("91")) return `+91 ${d.slice(2, 7)} ${d.slice(7)}`;
  return p;
}

function exportToCSV(clients: Client[]) {
  const header = ["Name", "Phone", "Status", "Response", "Called At", "Created At"];
  const rows = clients.map((c) => [c.name, c.phone, c.status, c.response ?? "", c.called_at ?? "", c.created_at]);
  const csv = [header, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "crm_clients.csv"; a.click();
  URL.revokeObjectURL(url);
}

export default function CRMPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [callingId, setCallingId] = useState<string | null>(null);
  const [callingAll, setCallingAll] = useState(false);
  const [filterStatus, setFilterStatus] = useState<CallStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [uploadedCount, setUploadedCount] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchClientsRef = useRef(async () => {
    try {
      const res = await fetch("/api/crm/clients");
      if (!res.ok) { console.error("fetchClients error", res.status); return; }
      const data: Client[] = await res.json();
      setClients(data);
    } catch (err) {
      console.error("fetchClients exception:", err);
    } finally {
      setLoading(false);
    }
  });

  const fetchClients = fetchClientsRef.current;

  useEffect(() => {
    const run = () => { fetchClientsRef.current(); };
    run();
    pollRef.current = setInterval(run, 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  function showToast(msg: string, type: "ok" | "err") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setUploadedCount(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/extract-clients", { method: "POST", body: fd });
      if (!res.ok) throw new Error((await res.json()).error ?? "Upload failed");
      const { inserted } = await res.json();
      setUploadedCount(inserted);
      showToast(`${inserted} clients imported`, "ok");
      await fetchClients();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Upload failed", "err");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function callOne(client: Client) {
    setCallingId(client.id);
    try {
      const res = await fetch("/api/make-call", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: client.id, phone: client.phone, name: client.name }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Call failed");
      showToast(`Calling ${client.name}…`, "ok");
      setClients((prev) => prev.map((c) => c.id === client.id ? { ...c, status: "calling" } : c));
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Call failed", "err");
    } finally { setCallingId(null); }
  }

  async function resetOne(client: Client) {
    try {
      const res = await fetch("/api/crm/reset", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: client.id }),
      });
      if (!res.ok) throw new Error();
      setClients((prev) => prev.map((c) => c.id === client.id ? { ...c, status: "pending", response: null, called_at: null } : c));
      showToast(`${client.name} reset to pending`, "ok");
    } catch { showToast("Reset failed", "err"); }
  }

  async function callAllPending() {
    const pending = clients.filter((c) => c.status === "pending");
    if (pending.length === 0) { showToast("No pending clients to call", "err"); return; }
    setCallingAll(true);
    try {
      for (const c of pending) {
        await fetch("/api/make-call", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clientId: c.id, phone: c.phone, name: c.name }),
        });
        setClients((prev) => prev.map((x) => x.id === c.id ? { ...x, status: "calling" } : x));
        await new Promise((r) => setTimeout(r, 1200));
      }
      showToast(`Initiated calls for ${pending.length} clients`, "ok");
    } catch { showToast("Some calls failed", "err"); }
    finally { setCallingAll(false); }
  }

  const filtered = clients.filter((c) => {
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    const matchSearch = search === "" || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    return matchStatus && matchSearch;
  });

  const stats = {
    total:         clients.length,
    pending:       clients.filter((c) => c.status === "pending").length,
    interested:    clients.filter((c) => c.status === "interested").length,
    callBack:      clients.filter((c) => c.status === "call_back").length,
    notInterested: clients.filter((c) => c.status === "not_interested").length,
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F1F5F9", fontFamily: "Calibri, sans-serif" }}>

      <style>{`
        .crm-stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 20px; }
        .crm-actions { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; background: #fff; border-radius: 10px; padding: 14px 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); margin-bottom: 16px; }
        .crm-search { border: 1px solid #D1D5DB; border-radius: 7px; padding: 8px 12px; font-size: 13px; width: 200px; outline: none; font-family: Calibri, sans-serif; }
        .crm-select { border: 1px solid #D1D5DB; border-radius: 7px; padding: 8px 10px; font-size: 13px; cursor: pointer; font-family: Calibri, sans-serif; }
        .crm-card { display: grid; background: #fff; border-radius: 10px; padding: 14px 16px; margin-bottom: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); gap: 8px; }
        @media (max-width: 640px) {
          .crm-stats { grid-template-columns: repeat(3, 1fr) !important; }
          .crm-stats .stat-hide { display: none; }
          .crm-actions { flex-direction: column; align-items: stretch; }
          .crm-search { width: 100% !important; }
          .crm-select { width: 100%; }
          .crm-btn { width: 100%; text-align: center; justify-content: center; }
          .crm-spacer { display: none; }
          .crm-desktop-table { display: none !important; }
          .crm-mobile-list { display: block !important; }
          .crm-header-title { font-size: 15px !important; }
          .crm-header-sub { display: none; }
          .crm-select option { color: #374151; background: #fff; }
          .crm-actions { position: relative; z-index: 2; }
        }
        @media (min-width: 641px) {
          .crm-mobile-list { display: none !important; }
          .crm-desktop-table { display: block !important; }
        }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 16, right: 16, left: 16, zIndex: 9999,
          backgroundColor: toast.type === "ok" ? "#065F46" : "#991B1B",
          color: "#fff", padding: "12px 16px", borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)", fontSize: 14, fontWeight: 600,
          maxWidth: 360, margin: "0 auto",
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ backgroundColor: "#1A4F8A", color: "#fff", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="OPS" style={{ height: 36, borderRadius: 6 }} />
          <div>
            <div className="crm-header-title" style={{ fontSize: 16, fontWeight: 700 }}>Omkar Power Solutions</div>
            <div className="crm-header-sub" style={{ fontSize: 12, opacity: 0.8 }}>CRM — AI Calling Dashboard</div>
          </div>
        </div>
        <Link href="/" style={{ color: "#F5A623", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>← Home</Link>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 12px" }}>

        {/* Stat cards */}
        <div className="crm-stats">
          {[
            { label: "Total",    value: stats.total,         color: "#1A4F8A", hide: false },
            { label: "Pending",  value: stats.pending,       color: "#6B7280", hide: false },
            { label: "Interested", value: stats.interested,  color: "#065F46", hide: false },
            { label: "Call Back",  value: stats.callBack,    color: "#92400E", hide: true  },
            { label: "Not Int.",   value: stats.notInterested, color: "#991B1B", hide: true },
          ].map((s) => (
            <div key={s.label} className={s.hide ? "stat-hide" : ""}
              style={{ backgroundColor: "#fff", borderRadius: 10, padding: "12px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderTop: `4px solid ${s.color}` }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="crm-actions">
          <label className="crm-btn" style={{
            backgroundColor: "#1A4F8A", color: "#fff", padding: "9px 16px",
            borderRadius: 7, fontSize: 13, fontWeight: 700,
            cursor: uploading ? "wait" : "pointer", opacity: uploading ? 0.7 : 1,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            {uploading ? "⏳ Importing…" : "📄 Import File"}
            <input ref={fileRef} type="file" accept=".pdf,.xlsx,.xls,.xlsm,.csv"
              style={{ display: "none" }} onChange={handleUpload} disabled={uploading} />
          </label>

          {uploadedCount !== null && (
            <span style={{ fontSize: 13, color: "#065F46", fontWeight: 600 }}>✅ {uploadedCount} imported</span>
          )}

          <div className="crm-spacer" style={{ flex: 1 }} />

          <input type="text" className="crm-search" placeholder="🔍 Search name or phone…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ position: "relative", zIndex: 1 }}
            />

          <select className="crm-select" value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as CallStatus | "all")}
            style={{
                border: "1px solid #D1D5DB", borderRadius: 7,
                padding: "8px 10px", fontSize: 13, cursor: "pointer",
                fontFamily: "Calibri, sans-serif", backgroundColor: "#fff",
                color: "#374151", appearance: "auto" as never,
                WebkitAppearance: "menulist",
                position: "relative", zIndex: 1,
                }}>
            <option value="all">All Statuses</option>
            {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
            ))}
            </select>

          <button className="crm-btn" onClick={callAllPending}
            disabled={callingAll || stats.pending === 0}
            style={{
              backgroundColor: callingAll ? "#6B7280" : "#F5A623", color: "#fff",
              border: "none", borderRadius: 7, padding: "9px 16px", fontSize: 13,
              fontWeight: 700, cursor: callingAll || stats.pending === 0 ? "not-allowed" : "pointer",
              opacity: stats.pending === 0 ? 0.5 : 1,
            }}>
            {callingAll ? "📞 Calling…" : `📞 Call All (${stats.pending})`}
          </button>

          <button className="crm-btn" onClick={() => exportToCSV(filtered)}
            disabled={filtered.length === 0}
            style={{
              backgroundColor: "#0D3260", color: "#fff", border: "none",
              borderRadius: 7, padding: "9px 16px", fontSize: 13, fontWeight: 700,
              cursor: filtered.length === 0 ? "not-allowed" : "pointer",
              opacity: filtered.length === 0 ? 0.5 : 1,
            }}>
            ⬇ Export CSV
          </button>
        </div>

        {/* Table — desktop */}
        <div className="crm-desktop-table" style={{ backgroundColor: "#fff", borderRadius: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: 48, textAlign: "center", color: "#6B7280" }}>Loading clients…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 48, textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📂</div>
              <div style={{ fontSize: 15, color: "#6B7280" }}>
                {clients.length === 0 ? "No clients yet — import a file to get started" : "No clients match this filter"}
              </div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "2px solid #E2E8F0" }}>
                    {["#", "Name", "Phone", "Status", "Response", "Called At", "Action"].map((h) => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#374151", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((client, idx) => (
                    <tr key={client.id} style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: idx % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ padding: "11px 16px", color: "#9CA3AF" }}>{idx + 1}</td>
                      <td style={{ padding: "11px 16px", fontWeight: 600, color: "#111827" }}>{client.name}</td>
                      <td style={{ padding: "11px 16px", color: "#374151", whiteSpace: "nowrap" }}>{formatPhone(client.phone)}</td>
                      <td style={{ padding: "11px 16px" }}><StatusBadge status={client.status} /></td>
                      <td style={{ padding: "11px 16px", color: "#6B7280", maxWidth: 200 }}>{client.response ?? "—"}</td>
                      <td style={{ padding: "11px 16px", color: "#9CA3AF", whiteSpace: "nowrap" }}>
                        {client.called_at ? new Date(client.called_at).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}
                      </td>
                      <td style={{ padding: "11px 16px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => callOne(client)}
                            disabled={callingId === client.id || client.status === "calling" || client.status === "interested" || callingAll}
                            style={{
                              backgroundColor: client.status === "interested" ? "#D1FAE5" : client.status === "calling" || callingId === client.id ? "#EFF6FF" : "#1A4F8A",
                              color: client.status === "interested" ? "#065F46" : client.status === "calling" || callingId === client.id ? "#1A4F8A" : "#fff",
                              border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 700,
                              cursor: callingId === client.id || client.status === "calling" || client.status === "interested" || callingAll ? "not-allowed" : "pointer",
                              whiteSpace: "nowrap",
                            }}>
                            {client.status === "interested" ? "✅ Done" : callingId === client.id || client.status === "calling" ? "📞 Calling…" : "📞 Call"}
                          </button>
                          {client.status !== "pending" && (
                            <button onClick={() => resetOne(client)} title="Reset to Pending"
                              style={{ backgroundColor: "#F3F4F6", color: "#6B7280", border: "none", borderRadius: 6, padding: "6px 10px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                              ↺
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {filtered.length > 0 && (
            <div style={{ padding: "10px 16px", borderTop: "1px solid #F1F5F9", fontSize: 12, color: "#9CA3AF", display: "flex", justifyContent: "space-between" }}>
              <span>Showing {filtered.length} of {clients.length} clients</span>
              <span>Auto-refreshes every 5s</span>
            </div>
          )}
        </div>

        {/* Cards — mobile */}
        <div className="crm-mobile-list">
          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "#6B7280" }}>Loading clients…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📂</div>
              <div style={{ fontSize: 14, color: "#6B7280" }}>
                {clients.length === 0 ? "No clients yet — import a file to get started" : "No clients match this filter"}
              </div>
            </div>
          ) : (
            <>
              {filtered.map((client, idx) => (
                <div key={client.id} className="crm-card">
                  {/* Row 1: index + name + status */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, color: "#9CA3AF", minWidth: 20 }}>{idx + 1}.</span>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{client.name}</span>
                    </div>
                    <StatusBadge status={client.status} />
                  </div>
                  {/* Row 2: phone */}
                  <div style={{ fontSize: 13, color: "#374151" }}>📱 {formatPhone(client.phone)}</div>
                  {/* Row 3: response if any */}
                  {client.response && (
                    <div style={{ fontSize: 12, color: "#6B7280", backgroundColor: "#F9FAFB", padding: "6px 10px", borderRadius: 6 }}>
                      {client.response}
                    </div>
                  )}
                  {/* Row 4: called at */}
                  {client.called_at && (
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                      Called: {new Date(client.called_at).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  )}
                  {/* Row 5: actions */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => callOne(client)}
                      disabled={callingId === client.id || client.status === "calling" || client.status === "interested" || callingAll}
                      style={{
                        flex: 1,
                        backgroundColor: client.status === "interested" ? "#D1FAE5" : client.status === "calling" || callingId === client.id ? "#EFF6FF" : "#1A4F8A",
                        color: client.status === "interested" ? "#065F46" : client.status === "calling" || callingId === client.id ? "#1A4F8A" : "#fff",
                        border: "none", borderRadius: 7, padding: "9px", fontSize: 13, fontWeight: 700,
                        cursor: callingId === client.id || client.status === "calling" || client.status === "interested" || callingAll ? "not-allowed" : "pointer",
                      }}>
                      {client.status === "interested" ? "✅ Done" : callingId === client.id || client.status === "calling" ? "📞 Calling…" : "📞 Call"}
                    </button>
                    {client.status !== "pending" && (
                      <button onClick={() => resetOne(client)}
                        style={{ backgroundColor: "#F3F4F6", color: "#6B7280", border: "none", borderRadius: 7, padding: "9px 14px", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
                        ↺
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div style={{ padding: "10px 4px", fontSize: 12, color: "#9CA3AF", textAlign: "center" }}>
                Showing {filtered.length} of {clients.length} clients · Auto-refreshes every 5s
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
