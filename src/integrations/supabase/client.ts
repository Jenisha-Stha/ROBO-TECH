import { createClient, SupabaseClient } from '@supabase/supabase-js';


// test db
// const SUPABASE_URL = 'https://fzieqxoggawjvyqnfjbg.supabase.co';
// const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6aWVxeG9nZ2F3anZ5cW5mamJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MTY0NjksImV4cCI6MjA4NTM5MjQ2OX0.nbOzvK95rnVZEffZRMw36J57k-M7dQOhPD2QQewrhsU';

//test db anon key
const SUPABASE_URL = 'https://fzieqxoggawjvyqnfjbg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6aWVxeG9nZ2F3anZ5cW5mamJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MTY0NjksImV4cCI6MjA4NTM5MjQ2OX0.nbOzvK95rnVZEffZRMw36J57k-M7dQOhPD2QQewrhsU';


//production db
// const SUPABASE_URL = 'https://enjcslafqdwytxbtfync.supabase.co';
// const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuamNzbGFmcWR3eXR4YnRmeW5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNDk3MjUsImV4cCI6MjA2ODgyNTcyNX0.blhte8pAPgSMd2uFxYt9fkMnWB34Y7JMfufy4fBtKQ4';

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // flowType: 'pkce',
    // debug: false, // Disable debug mode for better performance
    // refreshTokenRetryAttempts: 3, // Retry token refresh up to 3 times
    // refreshTokenRetryInterval: 2000 // Wait 2 seconds between retries
  },
  // global: {
  //   headers: {
  //     'X-Client-Info': 'supabase-js-web/2.52.0'
  //   }
  // },
  // db: {
  //   schema: 'public'
  // },
  // realtime: {
  //   params: {
  //     eventsPerSecond: 10
  //   }
  // }
});

export { supabase };

// export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
//   auth: {
//     storage: localStorage,
//     persistSession: true,
//     autoRefreshToken: true,
//     detectSessionInUrl: false,
//     flowType: 'pkce'
//   },
//   global: {
//     headers: {
//       'X-Client-Info': 'supabase-js-web/2.52.0'
//     }
//   }
// });