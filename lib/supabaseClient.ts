
import { createClient } from '@supabase/supabase-js'

// Used environment variables from .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials missing!', {
        url: !!supabaseUrl,
        key: !!supabaseAnonKey
    })
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
