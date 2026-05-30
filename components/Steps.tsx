"use client";
import ScrollReveal from "@/components/ScrollReveal";

const steps = [
  {
    num: "1",
    title: "Enter your details",
    desc: "Share your address and monthly electricity bill to get started.",
  },
  {
    num: "2",
    title: "Get your AI report",
    desc: "We analyse your rooftop, sunlight data, and local electricity rates.",
  },
  {
    num: "3",
    title: "Connect with installers",
    desc: "Get matched with verified, rated solar installers near you.",
  },
  {
    num: "4",
    title: "Monitor & earn",
    desc: "Track savings live and export surplus energy back to the grid.",
  },
];

export default function Steps() {
  return (
    <section id="how" className="relative z-10 bg-gray-900/50 backdrop-blur-sm px-6 py-20">
      <ScrollReveal>
        <div className="text-center mb-12">
          <p className="text-xs font-medium text-blue-400 tracking-widest mb-2">HOW IT WORKS</p>
          <h2 className="text-2xl md:text-3xl font-medium text-white">
            Go solar in 4 simple steps
          </h2>
        </div>
      </ScrollReveal>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {steps.map((s, i) => (
          <ScrollReveal key={s.num} delay={i * 0.15} direction="up">
            <div className="bg-gray-900 border border-gray-800 hover:border-blue-700 rounded-xl p-6 text-center transition-all duration-300 group">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-medium flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-blue-500 transition-all duration-300"
                style={{ boxShadow: "0 0 20px rgba(59,130,246,0.3)" }}
              >
                {s.num}
              </div>
              <h4 className="text-sm font-medium text-white mb-2">{s.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}