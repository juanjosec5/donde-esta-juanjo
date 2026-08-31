import { defineStore } from "pinia";
import { supabase, isConfigured } from "./supabase.js";
import { blankConfig } from "./lib/blankConfig.js";

export const useAuth = defineStore("auth", {
  state: () => ({ user: null, ready: false }),
  actions: {
    async init() {
      if (!isConfigured) {
        this.ready = true;
        return;
      }
      const { data } = await supabase.auth.getSession();
      this.user = data.session?.user ?? null;
      supabase.auth.onAuthStateChange((_e, session) => {
        this.user = session?.user ?? null;
      });
      this.ready = true;
    },
    async signIn(email) {
      if (!isConfigured) throw new Error("Supabase is not configured");
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
    },
    async signOut() {
      await supabase?.auth.signOut();
      this.user = null;
    },
  },
});

export const usePages = defineStore("pages", {
  state: () => ({ list: [], loading: false }),
  actions: {
    async load() {
      if (!isConfigured) {
        this.list = [];
        return;
      }
      this.loading = true;
      const { data, error } = await supabase
        .from("pages")
        .select("id, slug, status, plan, target_at, updated_at, config")
        .order("updated_at", { ascending: false });
      this.loading = false;
      if (error) throw error;
      this.list = data ?? [];
    },
    async create() {
      const config = blankConfig();
      if (!isConfigured) {
        const local = { id: crypto.randomUUID(), slug: "", status: "draft", plan: "free", config };
        this.list.unshift(local);
        return local;
      }
      const { data, error } = await supabase
        .from("pages")
        .insert({ config, occasion: config.meta.occasion, locale: config.meta.locale })
        .select()
        .single();
      if (error) throw error;
      this.list.unshift(data);
      return data;
    },
    async save(id, config) {
      const patch = {
        config,
        occasion: config.meta.occasion,
        locale: config.meta.locale,
        target_at: config.target.at || null,
        updated_at: new Date().toISOString(),
      };
      const row = this.list.find((p) => p.id === id);
      if (row) Object.assign(row, patch);
      if (!isConfigured) return;
      const { error } = await supabase.from("pages").update(patch).eq("id", id);
      if (error) throw error;
    },
    // M0 stub: real flow goes through LemonSqueezy checkout + webhook.
    async publish(id, config) {
      const next = {
        ...config,
        meta: { ...config.meta, status: "published" },
      };
      await this.save(id, next);
      if (isConfigured) {
        await supabase
          .from("pages")
          .update({ status: "published", published_at: new Date().toISOString() })
          .eq("id", id);
      }
      return next;
    },
  },
});
