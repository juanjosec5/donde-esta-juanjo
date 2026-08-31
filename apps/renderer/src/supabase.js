import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && anon ? createClient(url, anon) : null;

/**
 * Load a published page's config by slug. Returns null when there is no such
 * published page (or it has expired), throws when Supabase isn't reachable.
 */
export async function fetchPageConfig(slug) {
  if (!supabase) throw new Error("Supabase is not configured");

  const { data, error } = await supabase
    .from("pages")
    .select("config, expires_at")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  if (data.expires_at && new Date(data.expires_at) < new Date()) return null;
  return data.config;
}
