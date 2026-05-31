"use client";
import { useEffect, useState } from "react";

interface Particle {
  width: number;
  height: number;
  top: string;
  left: string;
  opacity: number;
}

export default function StarParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(
      [...Array(40)].map(() => ({
        width: Math.random() * 2 + 1,
        height: Math.random() * 2 + 1,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.5 + 0.1,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: p.width,
            height: p.height,
            top: p.top,
            left: p.left,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}