"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StarParticles from "@/components/StarParticles";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  function signIn(arg0: string, arg1: { callbackUrl: string; }): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="min-h-screen bg-gray-950 relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[40%] left-[40%] w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <StarParticles />

      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        {/* Left Panel */}
        <div className="flex flex-col justify-center">
          <Link href="/" className="flex items-center gap-2.5 mb-12 group w-fit relative">
            <div className="relative">
              <Image src="/logo.png" alt="OPS" width={36} height={36} className="object-contain drop-shadow-lg" />
              <div className="absolute inset-0 bg-blue-500 blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-full" />
            </div>
            <span className="text-white font-medium">OPS</span>
          </Link>

          <h1 className="text-4xl md:text-5xl font-medium text-white leading-tight mb-4">
            Your solar <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-400">
              journey starts
            </span>
            <br /> here
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-sm">
            Sign in to access your dashboard, savings report, and AI solar advisor.
          </p>

          <div className="flex flex-col gap-4">
            {[
              { icon: "⚡", text: "₹2.4 lakh average savings over 5 years" },
              { icon: "🌍", text: "Works across all Indian states with local data" },
              { icon: "🤖", text: "AI advisor Aryan available 24/7, no waiting" },
              { icon: "🔒", text: "Secure & private — your data stays yours" },
            ].map((perk) => (
              <div key={perk.text} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                  style={{
                    background: "rgba(59,130,246,0.15)",
                    border: "1px solid rgba(59,130,246,0.3)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {perk.icon}
                </div>
                <span className="text-sm text-gray-400">{perk.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex items-center justify-center">
          <div
            className="w-full rounded-3xl p-8"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <h2 className="text-xl font-medium text-white mb-1">Welcome back</h2>
            <p className="text-sm text-gray-400 mb-6">Sign in to your OPS account</p>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-gray-400">
                  <input type="checkbox" className="accent-blue-600" />
                  Remember me
                </label>
                <a href="#" className="text-xs text-blue-400 hover:text-blue-300">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium py-3 rounded-xl transition-colors"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-700" />
                <span className="text-xs text-gray-500">or</span>
                <div className="flex-1 h-px bg-gray-700" />
              </div>

              <button
                  type="button"
                  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                  className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
              </button>
            </form>

            <p className="text-center text-xs text-gray-500 mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-blue-400 font-medium hover:text-blue-300">
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}