import { createClient } from '@supabase/supabase-js'
 
// Replace these with your actual Supabase project values
const supabaseUrl = 'https://ulgcfvvtxqzpodlzpdth.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZ2NmdnZ0eHF6cG9kbHpwZHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwNzk3MDQsImV4cCI6MjA5OTY1NTcwNH0.xKL-tl_PxPPCEB1d0TSAJKougCfBro7pB9Ia-07j95w'
 
export const supabase = createClient(supabaseUrl, supabaseAnonKey)


    