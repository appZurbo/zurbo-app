import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use environment variables if available, fallback to hardcoded values for development
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://mbzxifrkabfnufliawzo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ienhpZnJrYWJmbnVmbGlhd3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzODA4NDQsImV4cCI6MjA2NTk1Njg0NH0.4xYcJE1QLgSUibpYWX0T_3JR2k5R8hQbxhrhre6WByg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);