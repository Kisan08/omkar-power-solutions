"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isSignedIn = false;

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      setDark(true);
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newDark = !dark;
    setDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-6">
      <div className={`max-w-5xl mx-auto h-14 flex items-center justify-between px-6 rounded-2xl transition-all duration-500 ${
        scrolled
          ? "bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-black/40"
          : "bg-gray-900/70 backdrop-blur-md border border-gray-700/30 shadow-lg shadow-black/20"
      }`}>
      {/* Top glow line */}
      <div className="absolute top-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-blue-500 to-transparent opacity-40 rounded-full" />

        {/* Logo */}
        <div className="relative group">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative">
             <Image
                src="/logo.png"
                alt="OPS Logo"
                width={36}
                height={36}
                className="object-contain drop-shadow-lg"
              />
              {/* Glow behind logo */}
              <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300 rounded-full" />
            </div>
            <span className="text-base font-medium text-white tracking-wide">
              OPS
            </span>
          </Link>
          {/* Hover tooltip */}
          <div className="absolute left-0 top-12 bg-gray-900/95 backdrop-blur-sm border border-gray-700 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-xl">
            ✦ Omkar Power Solutions
          </div>
        </div>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-1">
          {["Features", "How it works", "Pricing"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="relative px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors duration-200 group"
            >
              {item}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-blue-500 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm"
          >
            {dark ? "☀️" : "🌙"}
          </button>

          {/* Signed out */}
          {!isSignedIn && (
            <>
              <Link
                href="/login"
                className="hidden md:block text-sm font-medium text-gray-300 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden md:flex items-center gap-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40"
              >
                Get started free
                <span className="text-blue-300">→</span>
              </Link>
            </>
          )}

          {/* Signed in */}
          {isSignedIn && (
            <>
              <Link
                href="/dashboard"
                className="hidden md:block text-sm font-medium text-gray-300 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                Dashboard
              </Link>
            </>
          )}

          {/* Mobile menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl px-6 py-4 flex flex-col gap-3 shadow-2xl">
          {["Features", "How it works", "Pricing"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="text-sm text-gray-400 hover:text-white transition-colors py-1"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          <div className="flex gap-2 pt-2 border-t border-gray-800">
            {!isSignedIn && (
              <>
                <Link href="/login" className="flex-1 text-center text-sm font-medium text-gray-300 border border-gray-700 px-4 py-2 rounded-lg hover:bg-white/10 transition-all">
                  Sign in
                </Link>
                <Link href="/signup" className="flex-1 text-center text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all">
                  Get started
                </Link>
              </>
            )}
            {isSignedIn && (
              <Link href="/dashboard" className="flex-1 text-center text-sm font-medium text-gray-300 border border-gray-700 px-4 py-2 rounded-lg">
                Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}