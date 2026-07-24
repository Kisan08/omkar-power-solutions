"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const stats = [
  { label: "Generation", value: "4.2", unit: "kW", change: "+12%" },
  { label: "Saved", value: "1,840", unit: "₹", change: "+8%" },
  { label: "CO₂ Offset", value: "312", unit: "kg", change: "↑" },
  { label: "Health", value: "98", unit: "%", change: "Normal" },
];

const ADMIN_EMAIL = "omkarpowersolutions16@gmail.com";

export default function DashboardPage() {
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);
  const [firstName, setFirstName] = useState("Omkar");
  const [isAdmin, setIsAdmin] = useState(false);
  const user = { firstName };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/login");
        return;
      }
      const metaName = data.session.user.user_metadata?.full_name as string | undefined;
      if (metaName) setFirstName(metaName.split(" ")[0]);
      setIsAdmin(data.session.user.email === ADMIN_EMAIL);
      setAuthChecking(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.replace("/login");
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm your AI solar advisor. Ask me anything about your system, savings, or maintenance." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [angle, setAngle] = useState(0);
  const [counter, setCounter] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    let frame = 0;
    const animate = () => {
      frame++;
      setAngle(frame * 0.3);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    if (counter < 1840) {
      const timer = setTimeout(() => setCounter((c) => Math.min(c + 24, 1840)), 16);
      return () => clearTimeout(timer);
    }
  }, [counter]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    ctx.clearRect(0, 0, W, H);

    // Outer glow rings
    for (let i = 3; i > 0; i--) {
      ctx.beginPath();
      ctx.arc(cx, cy, 80 + i * 18, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(59,130,246,${0.06 * i})`;
      ctx.lineWidth = 12;
      ctx.stroke();
    }

    // Rotating dashed orbit
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.beginPath();
    ctx.arc(0, 0, 110, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(59,130,246,0.2)";
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 8]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Orbiting dot
    ctx.beginPath();
    ctx.arc(110, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#60a5fa";
    ctx.shadowColor = "#60a5fa";
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.restore();

    // Counter-rotating orbit
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((-angle * 0.6 * Math.PI) / 180);
    ctx.beginPath();
    ctx.arc(0, 0, 140, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(99,102,241,0.15)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 10]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Second orbiting dot
    ctx.beginPath();
    ctx.arc(140, 0, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#818cf8";
    ctx.shadowColor = "#818cf8";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();

    // Sun core glow
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 70);
    grad.addColorStop(0, "rgba(251,191,36,0.95)");
    grad.addColorStop(0.4, "rgba(245,158,11,0.8)");
    grad.addColorStop(0.7, "rgba(234,88,12,0.4)");
    grad.addColorStop(1, "rgba(234,88,12,0)");
    ctx.beginPath();
    ctx.arc(cx, cy, 70, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 40;
    ctx.fill();

    // Sun surface
    ctx.beginPath();
    ctx.arc(cx, cy, 52, 0, Math.PI * 2);
    ctx.fillStyle = "#fbbf24";
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 30;
    ctx.fill();

    // Sun rays
    for (let i = 0; i < 8; i++) {
      const a = ((angle + i * 45) * Math.PI) / 180;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(a);
      ctx.beginPath();
      ctx.moveTo(56, 0);
      ctx.lineTo(68, 0);
      ctx.strokeStyle = "rgba(251,191,36,0.7)";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();
    }

    // Particles
    for (let i = 0; i < 6; i++) {
      const a = ((angle * 1.5 + i * 60) * Math.PI) / 180;
      const r = 85 + Math.sin(angle * 0.05 + i) * 8;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(251,191,36,${0.4 + Math.sin(angle * 0.1 + i) * 0.3})`;
      ctx.fill();
    }

  }, [angle]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Sorry, something went wrong. Please try again." }]);
    }
    setLoading(false);
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Top Navbar */}
      <nav className="border-b border-gray-800 px-6 h-16 flex items-center justify-between bg-gray-950">
        <div className="flex items-center gap-4">
          <Link
  href="/"
  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
  style={{
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
  }}
>
  <span className="text-blue-400">←</span>
  <span>Back</span>
</Link>
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="OPS" width={28} height={28} className="object-contain" />
            <span className="text-base font-medium text-white">OPS</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 hidden md:block">
            {user?.firstName ?? "Welcome"} ☀️
          </span>
          <button
            onClick={() => {
              const isDark = document.documentElement.classList.contains("dark");
              if (isDark) {
                document.documentElement.classList.remove("dark");
                localStorage.setItem("theme", "light");
              } else {
                document.documentElement.classList.add("dark");
                localStorage.setItem("theme", "dark");
              }
            }}
            className="p-2 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 text-sm"
          >
            🌙
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace("/login");
            }}
            className="px-3 py-2 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 text-sm"
          >
            Log out
          </button>
        </div>
      </nav>

      {/* Hero — Animated Solar Globe */}
      <div className="relative flex flex-col items-center justify-center pt-10 pb-8 overflow-hidden">

        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{ width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)" }} />
        </div>

        {/* Greeting */}
        <div className="mb-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-950 border border-blue-800 text-blue-300 text-xs px-4 py-1.5 rounded-full mb-3">
            ✦ Live system — Mumbai, Maharashtra
          </div>
          <h1 className="text-2xl md:text-3xl font-medium text-white mb-1">
            Good morning, {user?.firstName ?? "there"}
          </h1>
          <p className="text-sm text-gray-400">Your solar system is performing excellently today</p>
        </div>

        {/* Canvas Globe */}
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          className="my-2"
        />

        {/* Stats around globe */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl px-6 mt-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center hover:border-blue-700 transition-colors"
              style={{ boxShadow: "0 0 20px rgba(59,130,246,0.05)" }}
            >
              <div className="text-xs text-gray-500 mb-1">{s.label}</div>
              <div className="text-xl font-medium text-white">
                {s.label === "Saved" ? `₹${counter.toLocaleString()}` : `${s.value} ${s.unit}`}
              </div>
              <div className="text-xs text-blue-400 mt-1">{s.change}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-5xl mx-auto px-6 mb-8">
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${isAdmin ? "lg:grid-cols-3" : ""} gap-4`}>
          <Link
            href="/crm"
            className="group bg-gray-900 border border-gray-800 hover:border-blue-700 rounded-2xl p-6 flex items-center justify-between transition-colors"
            style={{ boxShadow: "0 0 20px rgba(59,130,246,0.05)" }}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <h3 className="text-sm font-medium text-white">CRM</h3>
              </div>
              <p className="text-xs text-gray-500">Manage leads, calls, and follow-ups</p>
            </div>
            <span className="text-blue-400 group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <Link
            href="/quote"
            className="group bg-gray-900 border border-gray-800 hover:border-yellow-600 rounded-2xl p-6 flex items-center justify-between transition-colors"
            style={{ boxShadow: "0 0 20px rgba(251,191,36,0.05)" }}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <h3 className="text-sm font-medium text-white">Get Quote</h3>
              </div>
              <p className="text-xs text-gray-500">Generate a new solar proposal</p>
            </div>
            <span className="text-yellow-400 group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          {isAdmin && (
            <Link
              href="/admin/users"
              className="group bg-gray-900 border border-gray-800 hover:border-purple-600 rounded-2xl p-6 flex items-center justify-between transition-colors"
              style={{ boxShadow: "0 0 20px rgba(168,85,247,0.05)" }}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <h3 className="text-sm font-medium text-white">Admin</h3>
                </div>
                <p className="text-xs text-gray-500">Track signups and last logins</p>
              </div>
              <span className="text-purple-400 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          )}
        </div>
      </div>

      {/* AI Advisor + Calculator */}
      <div className="max-w-5xl mx-auto px-6 pb-12 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* AI Advisor */}
        <div
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
          style={{ boxShadow: "0 0 30px rgba(59,130,246,0.07)" }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <h2 className="text-sm font-medium text-white">AI Solar Advisor</h2>
          </div>
          <p className="text-xs text-gray-500 mb-4">Powered by Claude AI</p>

          <div className="flex flex-col gap-3 mb-4 h-56 overflow-y-auto pr-1">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-xs px-4 py-3 rounded-xl max-w-xs leading-relaxed ${
                  m.role === "assistant"
                    ? "bg-blue-950 border border-blue-900 text-blue-200 self-start"
                    : "bg-gray-800 text-gray-200 self-end"
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="bg-blue-950 border border-blue-900 text-blue-300 text-xs px-4 py-3 rounded-xl self-start">
                Thinking...
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about your solar system..."
              className="flex-1 px-4 py-2.5 text-sm border border-gray-700 rounded-xl bg-gray-800 text-white outline-none focus:border-blue-500 placeholder-gray-600"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              Ask
            </button>
          </div>
        </div>

        {/* Solar Calculator */}
        <div
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
          style={{ boxShadow: "0 0 30px rgba(251,191,36,0.05)" }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <h2 className="text-sm font-medium text-white">Solar Savings Calculator</h2>
          </div>
          <p className="text-xs text-gray-500 mb-5">Estimate your savings instantly</p>

          <SolarCalculator />
        </div>

      </div>
    </div>
  );
}

function SolarCalculator() {
  const [bill, setBill] = useState(3000);
  const [units, setUnits] = useState(300);
  const [result, setResult] = useState<null | {
    panels: number;
    savings: number;
    payback: number;
    co2: number;
  }>(null);

  const calculate = () => {
    const panels = Math.ceil(units / 30);
    const savings = Math.round(bill * 0.8);
    const systemCost = panels * 30000;
    const payback = Math.round(systemCost / (savings * 12) * 10) / 10;
    const co2 = Math.round(units * 0.82 * 12);
    setResult({ panels, savings, payback, co2 });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs text-gray-400 mb-1.5 block">Monthly electricity bill (₹)</label>
        <input
          type="number"
          value={bill}
          onChange={(e) => setBill(Number(e.target.value))}
          className="w-full px-4 py-2.5 text-sm border border-gray-700 rounded-xl bg-gray-800 text-white outline-none focus:border-yellow-500 placeholder-gray-600"
          placeholder="3000"
        />
      </div>
      <div>
        <label className="text-xs text-gray-400 mb-1.5 block">Monthly units consumed (kWh)</label>
        <input
          type="number"
          value={units}
          onChange={(e) => setUnits(Number(e.target.value))}
          className="w-full px-4 py-2.5 text-sm border border-gray-700 rounded-xl bg-gray-800 text-white outline-none focus:border-yellow-500 placeholder-gray-600"
          placeholder="300"
        />
      </div>
      <button
        onClick={calculate}
        className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-950 text-sm font-medium py-3 rounded-xl transition-colors"
      >
        Calculate my savings
      </button>

      {result && (
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <div className="text-lg font-medium text-yellow-400">{result.panels}</div>
            <div className="text-xs text-gray-500 mt-1">Panels needed</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <div className="text-lg font-medium text-green-400">₹{result.savings.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">Monthly savings</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <div className="text-lg font-medium text-blue-400">{result.payback} yrs</div>
            <div className="text-xs text-gray-500 mt-1">Payback period</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <div className="text-lg font-medium text-purple-400">{result.co2} kg</div>
            <div className="text-xs text-gray-500 mt-1">CO₂ saved/year</div>
          </div>
        </div>
      )}
    </div>
  );
}