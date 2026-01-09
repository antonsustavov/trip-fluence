import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

let supabase
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  // Missing envs; warn so dev server doesn't crash before user adds .env
  // Using console.warn instead of throwing keeps the app bootable.
  // Any code that relies on supabase should handle the undefined case until envs are set.
  // eslint-disable-next-line no-console
  console.warn(
    'Supabase env vars are missing. Add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY to .env.'
  )
}

export { supabase }


