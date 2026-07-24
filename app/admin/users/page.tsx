"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

// Must match the email checked in app/api/admin/users/route.ts.
const ADMIN_EMAIL = "omkarpowersolutions16@gmail.com";

interface AdminUser {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  provider: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        router.replace("/login");
        return;
      }

      if (session.user.email !== ADMIN_EMAIL) {
        router.replace("/dashboard");
        return;
      }

      setChecking(false);

      try {
        const res = await fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) {
          throw new Error("Failed to load users");
        }
        const json = await res.json();
        setUsers(json.users);
      } catch {
        setError("Could not load users.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  const fmt = (d: string | null) => {
    if (!d) return "Never";
    return new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 h-16 flex items-center justify-between bg-gray-950">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white px-4 py-2 rounded-xl transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <span className="text-blue-400">←</span>
            <span>Dashboard</span>
          </Link>
          <span className="text-base font-medium text-white">User Tracking</span>
        </div>
        <span className="text-xs text-gray-500">{users.length} total users</span>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-left text-gray-400">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Phone</th>
                  <th className="px-5 py-3 font-medium">Signed up</th>
                  <th className="px-5 py-3 font-medium">Last login</th>
                  <th className="px-5 py-3 font-medium">Via</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-800/60 hover:bg-gray-800/40">
                    <td className="px-5 py-3">{u.full_name ?? "—"}</td>
                    <td className="px-5 py-3 text-gray-300">{u.email ?? "—"}</td>
                    <td className="px-5 py-3 text-gray-300">{u.phone ?? "—"}</td>
                    <td className="px-5 py-3 text-gray-500">{fmt(u.created_at)}</td>
                    <td className="px-5 py-3">
                      {u.last_sign_in_at ? (
                        <span className="text-green-400">{fmt(u.last_sign_in_at)}</span>
                      ) : (
                        <span className="text-gray-600">Never logged in</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-500 capitalize">{u.provider}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-gray-500">
                      No users yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}