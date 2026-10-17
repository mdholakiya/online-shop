// Reads the two Supabase env vars and fails with a clear message if missing.
// The key can be named either NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (new name
// shown in Supabase's "Connect" dialog) or NEXT_PUBLIC_SUPABASE_ANON_KEY.
// Note: each NEXT_PUBLIC_ var is written out in full so Next can inline it.
export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Add them to .env.local (or Vercel env vars)."
    );
  }
  return { url, anonKey };
}
