import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase.types'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY)

export default function useSupabase() {
	return supabase
}
