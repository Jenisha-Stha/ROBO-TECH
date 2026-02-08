import { supabase } from '@/integrations/supabase/client';
import { Provider } from '@supabase/supabase-js';

export interface GoogleAuthConfig {
  redirectTo?: string;
}

export const googleAuthService = {
  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(config?: GoogleAuthConfig) {
    try {
      const redirectTo = config?.redirectTo || `${window.location.origin}/auth/callback`;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { data: null, error };
    }
  },

  /**
   * Handle OAuth callback
   */
  async handleAuthCallback() {
    try {
      // Wait a bit for the session to be established
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Auth callback error:', error);
      return { data: null, error };
    }
  },

  /**
   * Sign out from Google and Supabase
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  },

  /**
   * Get current session
   */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Get session error:', error);
      return { data: null, error };
    }
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated() {
    try {
      const { data } = await supabase.auth.getSession();
      return !!data.session;
    } catch (error) {
      console.error('Check authentication error:', error);
      return false;
    }
  }
};
