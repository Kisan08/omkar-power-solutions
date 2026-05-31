import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Steps from "@/components/Steps";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import Link from "next/link";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <main className="relative bg-gray-950">
      <ParticleBackground />
      <Navbar />
      <Hero />

      {/* Stats Section */}
      <section className="relative z-10 border-t border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto grid grid-cols-3 divide-x divide-gray-800">
          <div className="py-10 text-center">
            <ScrollReveal delay={0}>
              <div className="text-3xl font-medium text-blue-400 mb-1">
                <AnimatedCounter target={12000} suffix="+" />
              </div>
              <div className="text-sm text-gray-500">Homes powered</div>
            </ScrollReveal>
          </div>
          <div className="py-10 text-center">
            <ScrollReveal delay={0.1}>
              <div className="text-3xl font-medium text-yellow-400 mb-1">
                ₹<AnimatedCounter target={24000} suffix="+" />
              </div>
              <div className="text-sm text-gray-500">Avg. annual savings</div>
            </ScrollReveal>
          </div>
          <div className="py-10 text-center">
            <ScrollReveal delay={0.2}>
              <div className="text-3xl font-medium text-green-400 mb-1">
                <AnimatedCounter target={98} suffix="%" />
              </div>
              <div className="text-sm text-gray-500">Customer satisfaction</div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Features />
      <Steps />

      {/* CTA Banner */}
      <section className="relative z-10 bg-blue-600 px-6 py-20 text-center">
        <ScrollReveal>
          <h2 className="text-3xl font-medium text-white mb-3">
            Ready to cut your electricity bill?
          </h2>
          <p className="text-sm text-blue-200 mb-8 max-w-md mx-auto leading-relaxed">
            Join 12,000+ homeowners saving with solar every month. Get your free
            savings report in minutes.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/signup"
              className="bg-white text-blue-600 hover:bg-blue-50 text-sm font-medium px-8 py-3 rounded-lg transition-colors"
            >
              Create free account
            </Link>
            <Link
              href="/login"
              className="border border-white text-white hover:bg-blue-700 text-sm font-medium px-8 py-3 rounded-lg transition-colors"
            >
              Sign in
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}