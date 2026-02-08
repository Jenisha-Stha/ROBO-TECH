// Admin client for server-side operations that require elevated privileges
import { createClient, SupabaseClient } from '@supabase/supabase-js';


// IMPORTANT: Never expose your service role key in frontend code!
// This should only be used in server-side environments or with proper security measures
// For production, use environment variables and server-side API routes

//test db service role key
const SUPABASE_URL = 'https://fzieqxoggawjvyqnfjbg.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6aWVxeG9nZ2F3anZ5cW5mamJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTgxNjQ2OSwiZXhwIjoyMDg1MzkyNDY5fQ.lOghzEy74rh2MxP87fCGstQ-AoCwtU0-vGsDMWhZuGo";
// const DB_PASSWORD="se6gAQcojfe9ES06"


// Option 1: Use environment variable (recommended for production)
// const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuamNzbGFmcWR3eXR4YnRmeW5jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzI0OTcyNSwiZXhwIjoyMDY4ODI1NzI1fQ._xt2Qd0IS5E_AIOnIS5Pyi1hgYBL8eIJgjxNuI8UI0w";
// const SUPABASE_URL = 'https://enjcslafqdwytxbtfync.supabase.co';

// Option 2: If you must use it in frontend (NOT RECOMMENDED for production)
// Replace with your actual service role key from Supabase dashboard
// const SUPABASE_SERVICE_ROLE_KEY = 'YOUR_SERVICE_ROLE_KEY_HERE';

if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('Service role key not found. Admin operations will not work.');
}

// Create admin client with service role key
const supabaseAdmin: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

export { supabaseAdmin };