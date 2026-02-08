import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { googleAuthService } from '@/services/googleAuthService';
import { useAuthStore } from '@/stores/authStore';
import { userService } from '@/services/userService';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { loadUserData } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus('loading');
        setMessage('Processing authentication...');

        // Debug: Log the current URL and hash
        // console.log('Current URL:', window.location.href);
        // console.log('URL Hash:', window.location.hash);
        // console.log('URL Search:', window.location.search);

        // Wait a bit for the session to be established
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Try to get session from Supabase
        const { data, error } = await supabase.auth.getSession();
        // console.log({ data })

        if (error) {
          console.error('Session error:', error);
        }

        if (data?.session?.user) {
          setMessage('Authentication successful! Loading your profile...');

          // Try to fetch existing profile first
          let profileData = await userService.fetchUserProfile(data.session.user);

          // If no profile exists, create one (this should be handled by the trigger, but just in case)
          if (!profileData) {
            profileData = await userService.createOrUpdateProfile(data.session.user);
          }

          // console.log({ profileData })

          // Load user data into the auth store
          await loadUserData(data.session.user, profileData);

          setStatus('success');
          setMessage('Welcome! Redirecting to dashboard...');

          // Redirect to admin dashboard
          setTimeout(() => {
            navigate('/admin');
          }, 1500);
        } else {
          // Try to get session from URL parameters
          const urlParams = new URLSearchParams(window.location.search);
          const hashParams = new URLSearchParams(window.location.hash.substring(1));

          // console.log('URL Params:', Object.fromEntries(urlParams));
          // console.log('Hash Params:', Object.fromEntries(hashParams));

          // Check for tokens in URL parameters
          const accessToken = urlParams.get('access_token') || hashParams.get('access_token');
          const refreshToken = urlParams.get('refresh_token') || hashParams.get('refresh_token');

          if (accessToken) {
            // console.log('Found access token in URL');

            // Set the session manually
            const { data: { session: newSession }, error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });

            if (setSessionError) {
              console.error('Set session error:', setSessionError);
              throw setSessionError;
            }

            if (newSession?.user) {
              setMessage('Authentication successful! Loading your profile...');

              // Try to fetch existing profile first
              let profileData = await userService.fetchUserProfile(newSession.user);

              // If no profile exists, create one
              if (!profileData) {
                profileData = await userService.createOrUpdateProfile(newSession.user);
              }

              // Load user data into the auth store
              await loadUserData(newSession.user, profileData);

              setStatus('success');
              setMessage('Welcome! Redirecting to dashboard...');

              // Redirect to admin dashboard
              setTimeout(() => {
                navigate('/admin');
              }, 1500);
            } else {
              throw new Error('Failed to establish session');
            }
          } else {
            // If no tokens found, try to listen for auth state changes
            // console.log('No tokens found, waiting for auth state change...');

            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
              // console.log('Auth state change:', event, session);

              if (event === 'SIGNED_IN' && session?.user) {
                setMessage('Authentication successful! Loading your profile...');

                // Try to fetch existing profile first
                let profileData = await userService.fetchUserProfile(session.user);

                // If no profile exists, create one
                if (!profileData) {
                  profileData = await userService.createOrUpdateProfile(session.user);
                }

                // Load user data into the auth store
                await loadUserData(session.user, profileData);

                setStatus('success');
                setMessage('Welcome! Redirecting to dashboard...');

                // Redirect to admin dashboard
                setTimeout(() => {
                  navigate('/admin');
                }, 1500);

                subscription.unsubscribe();
              }
            });

            // Wait for auth state change or timeout
            setTimeout(() => {
              subscription.unsubscribe();
              if (status === 'loading') {
                throw new Error('Authentication timeout - no session established');
              }
            }, 10000);
          }
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage(error.message || 'Authentication failed. Please try again.');

        // Redirect back to auth page after error
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, loadUserData]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-8 w-8 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'error':
        return <XCircle className="h-8 w-8 text-red-500" />;
      default:
        return <Loader2 className="h-8 w-8 animate-spin text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className={`text-xl font-bold ${getStatusColor()}`}>
            {status === 'loading' && 'Processing Authentication'}
            {status === 'success' && 'Authentication Successful'}
            {status === 'error' && 'Authentication Failed'}
          </CardTitle>
          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'error' && (
            <Alert variant="destructive">
              <AlertDescription>
                {message}
              </AlertDescription>
            </Alert>
          )}

          {status === 'loading' && (
            <div className="text-center text-sm text-muted-foreground">
              Please wait while we complete your authentication...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
