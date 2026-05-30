"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  function signIn(arg0: string, arg1: { callbackUrl: string; }): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="min-h-screen bg-gray-950 relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[30%] right-[30%] w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="absolute inset-0 pointer-events-none" suppressHydrationWarning>
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              // eslint-disable-next-line react-hooks/purity
              width: Math.random() * 2 + 1,
              // eslint-disable-next-line react-hooks/purity
              height: Math.random() * 2 + 1,
              // eslint-disable-next-line react-hooks/purity
              top: `${Math.random() * 100}%`,
              // eslint-disable-next-line react-hooks/purity
              left: `${Math.random() * 100}%`,
              // eslint-disable-next-line react-hooks/purity
              opacity: Math.random() * 0.5 + 0.1,
            }}
          />
        ))}
      </div>

      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-purple-500/50 to-transparent" />

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
            Join 12,000+ <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-cyan-400">
              homeowners
            </span>
            <br /> saving with solar
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-sm">
            Create your free account and get your personalized solar savings report in minutes.
          </p>

          <div className="flex flex-col gap-4">
            {[
              { icon: "☀️", text: "Free solar savings estimate instantly" },
              { icon: "💰", text: "AI finds every subsidy you qualify for" },
              { icon: "📱", text: "Monitor your system from anywhere" },
              { icon: "🔒", text: "Cancel or delete your account anytime" },
            ].map((perk) => (
              <div key={perk.text} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                  style={{
                    background: "rgba(139,92,246,0.15)",
                    border: "1px solid rgba(139,92,246,0.3)",
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
            <h2 className="text-xl font-medium text-white mb-1">Create your account</h2>
            <p className="text-sm text-gray-400 mb-6">Free forever — no credit card required</p>

            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone number</label>
                <div className="flex gap-2">
                  <div className="px-3 py-2.5 text-sm rounded-xl bg-gray-800 border border-gray-700 text-gray-400">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="flex-1 px-4 py-2.5 text-sm rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 placeholder-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 placeholder-gray-600"
                />
              </div>

              <label className="flex items-start gap-2 text-xs text-gray-400">
                <input type="checkbox" required className="accent-purple-600 mt-0.5" />
                I agree to the{" "}
                <Link href="#" className="text-purple-400 hover:underline">Terms</Link>
                {" "}and{" "}
                <Link href="#" className="text-purple-400 hover:underline">Privacy Policy</Link>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-medium py-3 rounded-xl transition-colors"
              >
                {loading ? "Creating account..." : "Create free account"}
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
              Already have an account?{" "}
              <Link href="/login" className="text-purple-400 font-medium hover:text-purple-300">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}