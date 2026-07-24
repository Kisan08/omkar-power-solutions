"use client";
import ScrollReveal from "@/components/ScrollReveal";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: "🤖",
    title: "Aryan — AI Solar Advisor",
    desc: "Chat with Aryan, your personal AI solar expert. Available 24/7 for recommendations, comparisons, and guidance.",
    href: "/chat",
    cta: "Chat with Aryan",
    glow: "rgba(139,92,246,0.15)",
    border: "rgba(139,92,246,0.3)",
    iconBg: "rgba(139,92,246,0.2)",
  },
];

export default function Features() {
  const router = useRouter();

  return (
    <section id="features" className="relative z-10 px-6 py-24">
      <ScrollReveal>
        <div className="text-center mb-16">
          <p className="text-xs font-medium text-blue-400 tracking-widest mb-3">FEATURES</p>
          <h2 className="text-3xl md:text-4xl font-medium text-white mb-4">
            Everything solar, powered by AI
          </h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
            From estimation to monitoring — one platform handles your entire solar journey.
          </p>
        </div>
      </ScrollReveal>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((f, i) => (
          <ScrollReveal key={f.title} delay={i * 0.15}>
            <div
              onClick={() => router.push(f.href)}
              className="relative cursor-pointer group rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid ${f.border}`,
                boxShadow: `0 8px 32px ${f.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
              }}
            >
              {/* Glow effect on hover */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${f.glow} 0%, transparent 70%)`,
                }}
              />

              {/* Top shine line */}
              <div
                className="absolute top-0 left-8 right-8 h-px rounded-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${f.border}, transparent)`,
                }}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: f.iconBg,
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${f.border}`,
                    boxShadow: `0 4px 20px ${f.glow}`,
                  }}
                >
                  {f.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-medium text-white mb-3">
                  {f.title}
                </h3>

                {/* Desc */}
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {f.desc}
                </p>

                {/* CTA */}
                <div
                  className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-300 group-hover:gap-3"
                  style={{
                    background: f.iconBg,
                    border: `1px solid ${f.border}`,
                    color: "white",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {f.cta}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}