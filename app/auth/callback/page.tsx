"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

// Google redirects here after the user approves sign-in.
// supabase-js (browser client) auto-detects the auth code in the URL
// and exchanges it for a session — we just wait for that to happen
// and then send the user on to the dashboard.
export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.replace("/");
      }
    });

    // Fallback: if a session already exists by the time this mounts
    // (can happen depending on timing), just redirect immediately.
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (sessionError) {
        setError(true);
        return;
      }
      if (data.session) {
        router.replace("/");
      }
    });

    // Safety timeout — if nothing resolves in 6s, show an error instead
    // of hanging forever.
    const timeout = setTimeout(() => setError(true), 6000);

    return () => {
      listener.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <>
            <p className="text-red-400 text-sm mb-3">Sign-in didn&apos;t complete. Please try again.</p>
            <Link href="/login" className="text-blue-400 text-sm hover:underline">
              Back to login
            </Link>
          </>
        ) : (
          <>
            <div className="w-8 h-8 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Signing you in...</p>
          </>
        )}
      </div>
    </div>
  );
}