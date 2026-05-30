"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
type Message = {
  role: "user" | "assistant";
  text: string;
};

const suggestions = [
  "How much can I save with solar?",
  "What subsidies am I eligible for?",
  "How many panels do I need?",
  "How does solar monitoring work?",
];

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi! I'm OPS's AI advisor. I can help you with solar savings, subsidies, panel recommendations, and anything solar-related. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [angle, setAngle] = useState(0);
  const animRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const animate = () => {
      frame++;
      setAngle(frame * 0.2);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

    // Stars
    for (let i = 0; i < 80; i++) {
      const x = (Math.sin(i * 127.1 + angle * 0.01) * 0.5 + 0.5) * W;
      const y = (Math.sin(i * 311.7 + angle * 0.008) * 0.5 + 0.5) * H;
      const r = Math.sin(i + angle * 0.05) * 0.5 + 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.2 + Math.sin(i + angle * 0.1) * 0.15})`;
      ctx.fill();
    }

    // Outer rings
    for (let i = 3; i > 0; i--) {
      ctx.beginPath();
      ctx.arc(cx, cy, 55 + i * 14, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(59,130,246,${0.07 * i})`;
      ctx.lineWidth = 10;
      ctx.stroke();
    }

    // Rotating orbit 1
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.beginPath();
    ctx.arc(0, 0, 80, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(59,130,246,0.2)";
    ctx.lineWidth = 0.8;
    ctx.setLineDash([5, 7]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(80, 0, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#60a5fa";
    ctx.shadowColor = "#60a5fa";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();

    // Rotating orbit 2
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((-angle * 0.5 * Math.PI) / 180);
    ctx.beginPath();
    ctx.arc(0, 0, 100, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(99,102,241,0.15)";
    ctx.lineWidth = 0.8;
    ctx.setLineDash([3, 9]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(100, 0, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#818cf8";
    ctx.shadowColor = "#818cf8";
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();

    // Sun glow
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 50);
    grad.addColorStop(0, "rgba(251,191,36,0.95)");
    grad.addColorStop(0.4, "rgba(245,158,11,0.75)");
    grad.addColorStop(0.7, "rgba(234,88,12,0.3)");
    grad.addColorStop(1, "rgba(234,88,12,0)");
    ctx.beginPath();
    ctx.arc(cx, cy, 50, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 30;
    ctx.fill();

    // Sun core
    ctx.beginPath();
    ctx.arc(cx, cy, 36, 0, Math.PI * 2);
    ctx.fillStyle = "#fbbf24";
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 20;
    ctx.fill();

    // Rays
    for (let i = 0; i < 8; i++) {
      const a = ((angle + i * 45) * Math.PI) / 180;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(a);
      ctx.beginPath();
      ctx.moveTo(39, 0);
      ctx.lineTo(48, 0);
      ctx.strokeStyle = "rgba(251,191,36,0.6)";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();
    }

  }, [angle]);

  const sendMessage = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    const userMsg: Message = { role: "user", text: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, something went wrong. Please try again." },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">

      {/* Navbar */}
      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 h-16 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
         <button
  onClick={() => router.back()}
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
</button>
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="OPS" width={28} height={28} className="object-contain" />
            <span className="text-base font-medium text-white">OPS AI Advisor</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-gray-400">Aryan is online</span>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">

        {/* Left Panel — Animated Globe */}
        <div className="hidden md:flex w-80 border-r border-gray-800 flex-col items-center justify-center p-8 bg-gray-950 shrink-0">
          <canvas ref={canvasRef} width={240} height={240} className="mb-6" />
          <h2 className="text-white font-medium text-center mb-2">AI Solar Advisor</h2>
          <p className="text-xs text-gray-500 text-center leading-relaxed mb-6">
            Powered by Claude AI — ask me anything about solar energy, savings, subsidies, and more.
          </p>

          {/* Suggestion pills */}
          <div className="flex flex-col gap-2 w-full">
            <p className="text-xs text-gray-600 mb-1">Try asking:</p>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-left text-xs text-gray-400 hover:text-white bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-600 px-4 py-2.5 rounded-xl transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel — Chat */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4">

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm ${
                    m.role === "assistant"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {m.role === "assistant" ? "☀" : "U"}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-lg text-sm px-5 py-3.5 rounded-2xl leading-relaxed ${
                    m.role === "assistant"
                      ? "bg-gray-900 border border-gray-800 text-gray-200 rounded-tl-sm"
                      : "bg-blue-600 text-white rounded-tr-sm"
                  }`}
                  style={
                    m.role === "assistant"
                      ? { boxShadow: "0 0 20px rgba(59,130,246,0.05)" }
                      : {}
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm text-white shrink-0">
                  ☀
                </div>
                <div className="bg-gray-900 border border-gray-800 px-5 py-3.5 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Mobile suggestions */}
          <div className="md:hidden px-4 py-2 flex gap-2 overflow-x-auto">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="shrink-0 text-xs text-gray-400 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full hover:border-gray-600 transition-all"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-gray-800 px-6 py-4 flex gap-3 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask anything about solar..."
              className="flex-1 px-5 py-3 text-sm border border-gray-700 rounded-xl bg-gray-900 text-white outline-none focus:border-blue-500 placeholder-gray-600 transition-colors"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm px-6 py-3 rounded-xl transition-colors font-medium"
            >
              Send
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}