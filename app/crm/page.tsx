"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  CallStatus,
  { label: string; color: string; bg: string }
> = {
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: CallStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      style={{
        backgroundColor: cfg.bg,
        color: cfg.color,
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {cfg.label}
    </span>
  );
}

function formatPhone(p: string) {
  const d = p.replace(/\D/g, "");
  if (d.length === 10) return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
  if (d.length === 12 && d.startsWith("91"))
    return `+91 ${d.slice(2, 7)} ${d.slice(7)}`;
  return p;
}

function exportToCSV(clients: Client[]) {
  const header = ["Name", "Phone", "Status", "Response", "Called At", "Created At"];
  const rows = clients.map((c) => [
    c.name,
    c.phone,
    c.status,
    c.response ?? "",
    c.called_at ?? "",
    c.created_at,
  ]);
  const csv = [header, ...rows]
    .map((r) => r.map((v) => `"${v}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "crm_clients.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Component ────────────────────────────────────────────────────────────────

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

  // ── Fetch clients ──────────────────────────────────────────────────────────

  const fetchClientsRef = useRef(async () => {
    try {
      const res = await fetch("/api/crm/clients");
      if (!res.ok) {
        const body = await res.text();
        console.error("fetchClients HTTP error", res.status, body);
        return;
      }
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
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // ── Toast ─────────────────────────────────────────────────────────────────

  function showToast(msg: string, type: "ok" | "err") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  // ── Upload PDF ────────────────────────────────────────────────────────────

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadedCount(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/extract-clients", { method: "POST", body: fd });
      if (!res.ok) throw new Error((await res.json()).error ?? "Upload failed");
      const { inserted } = await res.json();
      setUploadedCount(inserted);
      showToast(`${inserted} clients imported successfully`, "ok");
      await fetchClients();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Upload failed", "err");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  // ── Single call ───────────────────────────────────────────────────────────

  async function callOne(client: Client) {
    setCallingId(client.id);
    try {
      const res = await fetch("/api/make-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: client.id, phone: client.phone, name: client.name }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Call failed");
      showToast(`Calling ${client.name}…`, "ok");
      setClients((prev) =>
        prev.map((c) => (c.id === client.id ? { ...c, status: "calling" } : c))
      );
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Call failed", "err");
    } finally {
      setCallingId(null);
    }
  }

  // ── Reset single client ───────────────────────────────────────────────────

  async function resetOne(client: Client) {
    try {
      const res = await fetch("/api/crm/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: client.id }),
      });
      if (!res.ok) throw new Error();
      setClients((prev) =>
        prev.map((c) =>
          c.id === client.id
            ? { ...c, status: "pending", response: null, called_at: null }
            : c
        )
      );
      showToast(`${client.name} reset to pending`, "ok");
    } catch {
      showToast("Reset failed", "err");
    }
  }

  // ── Call all pending ──────────────────────────────────────────────────────

  async function callAllPending() {
    const pending = clients.filter((c) => c.status === "pending");
    if (pending.length === 0) {
      showToast("No pending clients to call", "err");
      return;
    }
    setCallingAll(true);
    try {
      for (const c of pending) {
        await fetch("/api/make-call", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clientId: c.id, phone: c.phone, name: c.name }),
        });
        setClients((prev) =>
          prev.map((x) => (x.id === c.id ? { ...x, status: "calling" } : x))
        );
        await new Promise((r) => setTimeout(r, 1200));
      }
      showToast(`Initiated calls for ${pending.length} clients`, "ok");
    } catch {
      showToast("Some calls failed — check status", "err");
    } finally {
      setCallingAll(false);
    }
  }

  // ── Filtered list ─────────────────────────────────────────────────────────

  const filtered = clients.filter((c) => {
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    const matchSearch =
      search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    return matchStatus && matchSearch;
  });

  // ── Stats ─────────────────────────────────────────────────────────────────

  const stats = {
    total:         clients.length,
    pending:       clients.filter((c) => c.status === "pending").length,
    interested:    clients.filter((c) => c.status === "interested").length,
    callBack:      clients.filter((c) => c.status === "call_back").length,
    notInterested: clients.filter((c) => c.status === "not_interested").length,
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F1F5F9", fontFamily: "Calibri, sans-serif" }}>

      {/* ── Toast ── */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 9999,
            backgroundColor: toast.type === "ok" ? "#065F46" : "#991B1B",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            fontSize: 14,
            fontWeight: 600,
            maxWidth: 340,
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ backgroundColor: "#1A4F8A", color: "#fff", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="OPS Logo" style={{ height: 40, borderRadius: 6 }} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Omkar Power Solutions</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>CRM — AI Calling Dashboard</div>
          </div>
        </div>
        <Link href="/"
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white px-4 py-2 rounded-xl"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <span className="text-blue-400">←</span><span>Home</span>
        </Link>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px" }}>

        {/* ── Stat cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 24 }}>
          {[
            { label: "Total Clients",  value: stats.total,         color: "#1A4F8A" },
            { label: "Pending",        value: stats.pending,       color: "#6B7280" },
            { label: "Interested",     value: stats.interested,    color: "#065F46" },
            { label: "Call Back",      value: stats.callBack,      color: "#92400E" },
            { label: "Not Interested", value: stats.notInterested, color: "#991B1B" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                backgroundColor: "#fff",
                borderRadius: 10,
                padding: "16px 18px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                borderTop: `4px solid ${s.color}`,
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Actions row ── */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            padding: "18px 20px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            marginBottom: 20,
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
          }}
        >
          <label
            style={{
              backgroundColor: "#1A4F8A",
              color: "#fff",
              padding: "9px 18px",
              borderRadius: 7,
              fontSize: 13,
              fontWeight: 700,
              cursor: uploading ? "wait" : "pointer",
              opacity: uploading ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {uploading ? "⏳ Importing…" : "📄 Import PDF"}
            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>

          {uploadedCount !== null && (
            <span style={{ fontSize: 13, color: "#065F46", fontWeight: 600 }}>
              ✅ {uploadedCount} clients imported
            </span>
          )}

          <div style={{ flex: 1 }} />

          <input
            type="text"
            placeholder="🔍 Search name or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: "1px solid #D1D5DB",
              borderRadius: 7,
              padding: "8px 14px",
              fontSize: 13,
              width: 220,
              outline: "none",
              fontFamily: "Calibri, sans-serif",
            }}
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as CallStatus | "all")}
            style={{
              border: "1px solid #D1D5DB",
              borderRadius: 7,
              padding: "8px 12px",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "Calibri, sans-serif",
            }}
          >
            <option value="all">All Statuses</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
            ))}
          </select>

          <button
            onClick={callAllPending}
            disabled={callingAll || stats.pending === 0}
            style={{
              backgroundColor: callingAll ? "#6B7280" : "#F5A623",
              color: "#fff",
              border: "none",
              borderRadius: 7,
              padding: "9px 18px",
              fontSize: 13,
              fontWeight: 700,
              cursor: callingAll || stats.pending === 0 ? "not-allowed" : "pointer",
              opacity: stats.pending === 0 ? 0.5 : 1,
            }}
          >
            {callingAll ? "📞 Calling…" : `📞 Call All Pending (${stats.pending})`}
          </button>

          <button
            onClick={() => exportToCSV(filtered)}
            disabled={filtered.length === 0}
            style={{
              backgroundColor: "#0D3260",
              color: "#fff",
              border: "none",
              borderRadius: 7,
              padding: "9px 18px",
              fontSize: 13,
              fontWeight: 700,
              cursor: filtered.length === 0 ? "not-allowed" : "pointer",
              opacity: filtered.length === 0 ? 0.5 : 1,
            }}
          >
            ⬇ Export CSV
          </button>
        </div>

        {/* ── Table ── */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          {loading ? (
            <div style={{ padding: 48, textAlign: "center", color: "#6B7280", fontSize: 15 }}>
              Loading clients…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 48, textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📂</div>
              <div style={{ fontSize: 15, color: "#6B7280" }}>
                {clients.length === 0
                  ? "No clients yet — import a PDF to get started"
                  : "No clients match this filter"}
              </div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "2px solid #E2E8F0" }}>
                    {["#", "Name", "Phone", "Status", "Response", "Called At", "Action"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 16px",
                          textAlign: "left",
                          fontWeight: 700,
                          color: "#374151",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((client, idx) => (
                    <tr
                      key={client.id}
                      style={{
                        borderBottom: "1px solid #F1F5F9",
                        backgroundColor: idx % 2 === 0 ? "#fff" : "#FAFAFA",
                      }}
                    >
                      <td style={{ padding: "11px 16px", color: "#9CA3AF" }}>{idx + 1}</td>
                      <td style={{ padding: "11px 16px", fontWeight: 600, color: "#111827" }}>
                        {client.name}
                      </td>
                      <td style={{ padding: "11px 16px", color: "#374151", whiteSpace: "nowrap" }}>
                        {formatPhone(client.phone)}
                      </td>
                      <td style={{ padding: "11px 16px" }}>
                        <StatusBadge status={client.status} />
                      </td>
                      <td style={{ padding: "11px 16px", color: "#6B7280", maxWidth: 200 }}>
                        {client.response ?? "—"}
                      </td>
                      <td style={{ padding: "11px 16px", color: "#9CA3AF", whiteSpace: "nowrap" }}>
                        {client.called_at
                          ? new Date(client.called_at).toLocaleString("en-IN", {
                              day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                            })
                          : "—"}
                      </td>
                      <td style={{ padding: "11px 16px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={() => callOne(client)}
                            disabled={
                              callingId === client.id ||
                              client.status === "calling" ||
                              client.status === "interested" ||
                              callingAll
                            }
                            style={{
                              backgroundColor:
                                client.status === "interested"
                                  ? "#D1FAE5"
                                  : client.status === "calling" || callingId === client.id
                                  ? "#EFF6FF"
                                  : "#1A4F8A",
                              color:
                                client.status === "interested"
                                  ? "#065F46"
                                  : client.status === "calling" || callingId === client.id
                                  ? "#1A4F8A"
                                  : "#fff",
                              border: "none",
                              borderRadius: 6,
                              padding: "6px 14px",
                              fontSize: 12,
                              fontWeight: 700,
                              cursor:
                                callingId === client.id ||
                                client.status === "calling" ||
                                client.status === "interested" ||
                                callingAll
                                  ? "not-allowed"
                                  : "pointer",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {client.status === "interested"
                              ? "✅ Done"
                              : callingId === client.id || client.status === "calling"
                              ? "📞 Calling…"
                              : "📞 Call"}
                          </button>
                          {client.status !== "pending" && (
                            <button
                              onClick={() => resetOne(client)}
                              title="Reset to Pending"
                              style={{
                                backgroundColor: "#F3F4F6",
                                color: "#6B7280",
                                border: "none",
                                borderRadius: 6,
                                padding: "6px 10px",
                                fontSize: 14,
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
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
            <div
              style={{
                padding: "10px 16px",
                borderTop: "1px solid #F1F5F9",
                fontSize: 12,
                color: "#9CA3AF",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Showing {filtered.length} of {clients.length} clients</span>
              <span>Auto-refreshes every 5 s</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
