import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const OAuthTest = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        // console.log('Session check:', { data, error });
        setSession(data.session);
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // console.log('Auth state change:', event, session);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      // console.log('Google sign in result:', { data, error });
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>OAuth Test</CardTitle>
        <CardDescription>Debug OAuth authentication</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>Session:</strong>
          <pre className="text-xs mt-2 p-2 bg-gray-100 rounded">
            {session ? JSON.stringify(session, null, 2) : 'No session'}
          </pre>
        </div>

        <Button onClick={handleGoogleSignIn} className="w-full">
          Test Google Sign In
        </Button>

        <div className="text-xs text-gray-600">
          <p>Current URL: {window.location.href}</p>
          <p>URL Hash: {window.location.hash}</p>
          <p>URL Search: {window.location.search}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OAuthTest;
