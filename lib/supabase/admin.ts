import { createClient } from "@supabase/supabase-js";

// SERVER ONLY. Uses the service role key which bypasses RLS.
// Never import this file into a "use client" component.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);