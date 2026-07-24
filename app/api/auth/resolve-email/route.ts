import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// Normalizes a phone string to digits only, keeping a leading country code if present.
function normalizePhone(raw: string): string {
  return raw.replace(/[^\d]/g, "");
}

export async function POST(req: Request) {
  const { phone } = await req.json();

  if (!phone || typeof phone !== "string") {
    return NextResponse.json({ error: "Phone number required" }, { status: 400 });
  }

  const digits = normalizePhone(phone);

  // Try matching last 10 digits so it works whether the user stored
  // "9876543210" or "+919876543210".
  const last10 = digits.slice(-10);

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("email")
    .or(`phone.eq.${digits},phone.ilike.%${last10}`)
    .limit(1)
    .maybeSingle();

  if (error || !data?.email) {
    // Deliberately vague — don't reveal whether the phone exists.
    return NextResponse.json({ error: "No account found" }, { status: 404 });
  }

  return NextResponse.json({ email: data.email });
}