import { createClient } from "@supabase/supabase-js";

// Public, safe to expose in the browser — RLS policies protect the data.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);