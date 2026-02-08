// Debug script to check OAuth configuration
const SUPABASE_URL = 'https://enjcslafqdwytxbtfync.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuamNzbGFmcWR3eXR4YnRmeW5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNDk3MjUsImV4cCI6MjA2ODgyNTcyNX0.blhte8pAPgSMd2uFxYt9fkMnWB34Y7JMfufy4fBtKQ4';

console.log('=== OAuth Debug Information ===');
console.log('Supabase URL:', SUPABASE_URL);
console.log('Current Origin:', typeof window !== 'undefined' ? window.location.origin : 'Server side');
console.log('Expected Redirect URL:', `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8081'}/auth/callback`);

// Check if we're in a browser environment
if (typeof window !== 'undefined') {
  console.log('Current URL:', window.location.href);
  console.log('URL Hash:', window.location.hash);
  console.log('URL Search:', window.location.search);
  
  // Check for OAuth parameters
  const urlParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  
  console.log('URL Parameters:', Object.fromEntries(urlParams));
  console.log('Hash Parameters:', Object.fromEntries(hashParams));
}

console.log('\n=== Configuration Checklist ===');
console.log('1. Google OAuth provider enabled in Supabase: ❓ (Check Supabase Dashboard)');
console.log('2. Google OAuth credentials configured: ❓ (Check Supabase Dashboard)');
console.log('3. Redirect URL configured in Supabase: ❓ (Should be http://localhost:8081/auth/callback)');
console.log('4. Redirect URL configured in Google Console: ❓ (Should include http://localhost:8081/auth/callback)');
console.log('5. Database migration applied: ❓ (Run: supabase db push)');

console.log('\n=== Next Steps ===');
console.log('1. Go to Supabase Dashboard > Authentication > Providers > Google');
console.log('2. Ensure Google provider is enabled');
console.log('3. Add your Google OAuth Client ID and Secret');
console.log('4. Go to Authentication > Settings');
console.log('5. Set Site URL to: http://localhost:8081');
console.log('6. Add redirect URL: http://localhost:8081/auth/callback');
console.log('7. Run: supabase db push');
console.log('8. Test the OAuth flow');
