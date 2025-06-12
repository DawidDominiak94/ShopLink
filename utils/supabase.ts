import { createClient } from '@supabase/supabase-js'
const options = {
  db: {
    schema: 'public',
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 'x-my-custom-header': 'ShopLinkApp' },
  },
}
export const supabase = createClient("https://ecbreclldwkuelbpasqn.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjYnJlY2xsZHdrdWVsYnBhc3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNzQ5NjMsImV4cCI6MjA2NDk1MDk2M30.9QLru0z6rjlXK9QnWQPdZ4X09ckw24LkszgZ0oTCm3Y", options)