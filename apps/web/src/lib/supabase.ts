import "server-only";
import {
	createClient as createSupabaseClient,
	type SupabaseClient,
} from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

type AnyDb = Database;

const SUPABASE_URL = process.env.SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY as string | undefined;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as
	| string
	| undefined;

function assertEnv(name: string, value: string | undefined) {
	if (!value) throw new Error(`Missing required env var: ${name}`);
}

export function createServerClient(): SupabaseClient<AnyDb> {
	assertEnv("SUPABASE_URL", SUPABASE_URL);
	const key = SUPABASE_SERVICE_ROLE_KEY ?? SUPABASE_ANON_KEY;
	assertEnv("SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY", key);
	return createSupabaseClient<AnyDb>(SUPABASE_URL, key, {
		auth: { persistSession: false, autoRefreshToken: false },
	});
}

export function createBrowserClient(): SupabaseClient<AnyDb> {
	assertEnv("SUPABASE_URL", SUPABASE_URL);
	assertEnv("SUPABASE_ANON_KEY", SUPABASE_ANON_KEY);
	return createSupabaseClient<AnyDb>(SUPABASE_URL, SUPABASE_ANON_KEY);
}
