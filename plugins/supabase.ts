import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin((nuxtApp) => {
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
    };
    const supabase = createClient(useRuntimeConfig().public.supabaseUrl, useRuntimeConfig().public.supabaseAnonKey, options)

    return {
        provide: {
            supabase: supabase
        }
    }
});
