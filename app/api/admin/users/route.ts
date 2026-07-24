import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// Only this email can pull the user list. Checked server-side against the
// caller's verified token — never trust a client-supplied email.
const ADMIN_EMAIL = "omkarpowersolutions16@gmail.com";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);

  if (userError || !userData.user || userData.user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const users = data.users
    .map((u) => ({
      id: u.id,
      email: u.email ?? null,
      phone: (u.user_metadata?.phone as string | undefined) ?? u.phone ?? null,
      full_name: (u.user_metadata?.full_name as string | undefined) ?? null,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
      provider: u.app_metadata?.provider ?? "email",
    }))
    .sort(
      (a, b) =>
        new Date(b.last_sign_in_at ?? 0).getTime() -
        new Date(a.last_sign_in_at ?? 0).getTime()
    );

  return NextResponse.json({ users });
}