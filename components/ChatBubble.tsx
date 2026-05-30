"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ChatBubble() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
    const pulseTimer = setTimeout(() => setPulse(false), 5000);
    return () => {
      clearTimeout(timer);
      clearTimeout(pulseTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* Tooltip */}
      <div
        className="bg-gray-900 border border-gray-700 text-white text-xs px-4 py-2.5 rounded-xl max-w-48 text-center leading-relaxed animate-bounce"
        style={{ animationDuration: "2s" }}
      >
        ✦ Ask our AI solar advisor anything!
        <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-gray-900 border-r border-b border-gray-700 rotate-45" />
      </div>

      {/* Bubble button */}
      <button
        onClick={() => router.push("/chat")}
        className="relative w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{ boxShadow: "0 0 30px rgba(59,130,246,0.5)" }}
      >
        {/* Pulse ring */}
        {pulse && (
          <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-30" />
        )}
        <span className="text-2xl">☀</span>
      </button>

    </div>
  );
}