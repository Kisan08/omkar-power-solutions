import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-950 relative flex items-center justify-center overflow-hidden">

      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[30%] right-[30%] w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Star particles */}
      <div className="absolute inset-0 pointer-events-none">
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

      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        {/* Left Panel */}
        <div className="flex flex-col justify-center">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-12 group w-fit relative">
            <div className="relative">
              <Image src="/logo.png" alt="OPS" width={36} height={36} className="object-contain drop-shadow-lg" />
              <div className="absolute inset-0 bg-blue-500 blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-full" />
            </div>
            <span className="text-white font-medium">OPS</span>
            <div className="absolute left-0 top-10 bg-gray-900 border border-gray-700 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
              ✦ Omkar Power Solutions
            </div>
          </Link>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-medium text-white leading-tight mb-4">
            Join 12,000+ <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              homeowners
            </span>
            <br /> saving with solar
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-sm">
            Create your free account and get your personalized solar savings report in minutes.
          </p>

          {/* Perks */}
          <div className="flex flex-col gap-4">
            {[
              { icon: "☀️", text: "Free solar savings estimate instantly" },
              { icon: "💰", text: "AI finds every subsidy you qualify for" },
              { icon: "📱", text: "Monitor your system from anywhere" },
              { icon: "🔒", text: "Cancel or delete your account anytime" },
            ].map((perk) => (
              <div key={perk.text} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
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

        {/* Right Panel — Clerk SignUp */}
        <div className="flex items-center justify-center">
          <SignUp
            appearance={{
              variables: {
                colorBackground: "#111827",
                colorInputBackground: "#1f2937",
                colorInputText: "#ffffff",
                colorText: "#ffffff",
                colorTextSecondary: "#9ca3af",
                colorPrimary: "#7c3aed",
                borderRadius: "0.75rem",
              },
              elements: {
                rootBox: "w-full",
                card: "shadow-2xl border border-gray-700/50 w-full",
                formButtonPrimary: "bg-purple-600 hover:bg-purple-500",
                footerActionLink: "text-purple-400",
              },
            }}
          />
        </div>

      </div>
    </div>
  );
}