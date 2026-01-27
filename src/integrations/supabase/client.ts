import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  const hint = typeof window !== 'undefined'
    ? 'Copy .env.example to .env and add your Supabase URL and anon key from Project Settings > API.'
    : 'Copy .env.example to .env and add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from Supabase Dashboard > Project Settings > API.';
  throw new Error(`Missing Supabase env vars. ${hint}`);
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);