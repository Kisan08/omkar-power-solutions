"use client";
import { useState } from "react";
import Link from "next/link";

const cards = [
  {
    id: "customer",
    title: "Solar Customers",
    desc: "Find qualified solar professionals near you for tailored quotes for your home or business.",
    cta: "Find Solar Pros",
    href: "/signup",
    bg: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1600&q=80",
    avatar: "🏠",
  },
  {
    id: "professional",
    title: "Solar Professionals",
    desc: "Use OPS's free AI-powered software to design, sell and manage solar projects.",
    cta: "Explore OPS",
    href: "/signup",
    bg: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&q=80",
    avatar: "⚡",
  },
  {
    id: "partner",
    title: "Solar Partners",
    desc: "Partner with OPS to present your products and services and connect with solar pros.",
    cta: "Partner with us",
    href: "/signup",
    bg: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=1600&q=80",
    avatar: "🤝",
  },
];

const defaultBg = "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&q=80";

export default function Hero() {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  return (
    <section className="relative min-h-screen flex flex-col justify-between overflow-hidden pt-24">

      {/* Background Image */}
      {cards.map((c) => (
        <div
          key={c.id}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: `url(${c.bg})`,
            opacity: activeCard === c.id ? 1 : 0,
          }}
        />
      ))}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
        style={{
          backgroundImage: `url(${defaultBg})`,
          opacity: activeCard === null ? 1 : 0,
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 justify-between px-6 md:px-16 py-20">

        {/* Headline */}
        <div className="flex-1 flex items-center justify-center text-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              ✦ AI-powered solar platform for India
            </div>
            <h1 className="text-4xl md:text-6xl font-medium text-white leading-tight mb-6">
              Let&apos;s build a{" "}
              <span className="text-yellow-400">solar electrified</span>{" "}
              world
            </h1>
            <p className="text-base md:text-lg text-white/70 max-w-xl mx-auto leading-relaxed mb-8">
              OPS uses AI to calculate your savings, find subsidies, and monitor your system — built for Indian homeowners.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                href="/signup"
                className="bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-sm font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Get started free
              </Link>
              <Link
                href="/login"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium px-8 py-3 rounded-lg backdrop-blur-sm transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          {cards.map((c) => (
            <Link
              href={c.href}
              key={c.id}
              onMouseEnter={() => {
                setActiveCard(c.id);
              }}
              onMouseLeave={() => {
                setActiveCard(null);
              }}
              className="group relative bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/40 rounded-2xl p-6 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Card glow on hover */}
              <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

              <div className="relative z-10">
                <div className="text-4xl mb-4">{c.avatar}</div>
                <h3 className="text-lg font-medium text-white mb-2">{c.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed mb-6">{c.desc}</p>
                <div className="flex items-center gap-2 text-sm font-medium text-white group-hover:gap-3 transition-all">
                  {c.cta}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}