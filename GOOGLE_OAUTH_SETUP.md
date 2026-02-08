# Google OAuth Setup Guide for Supabase

This guide will help you set up Google OAuth authentication with your Supabase project.

## Prerequisites

- A Supabase project
- A Google Cloud Console account
- Your application domain

## Step 1: Google Cloud Console Setup

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if not already enabled)

### 1.2 Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type (unless you have a Google Workspace)
3. Fill in the required information:
   - **App name**: Your application name
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Add scopes:
   - `openid`
   - `email`
   - `profile`
5. Add test users (if in testing mode)

### 1.3 Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Set the following:
   - **Name**: Your app name
   - **Authorized JavaScript origins**:
     - `http://localhost:5173` (for development)
     - `https://yourdomain.com` (for production)
   - **Authorized redirect URIs**:
     - `http://localhost:5173/auth/callback` (for development)
     - `https://yourdomain.com/auth/callback` (for production)
     - `https://enjcslafqdwytxbtfync.supabase.co/auth/v1/callback` (Supabase callback)
5. Click **Create**
6. **Save the Client ID and Client Secret** - you'll need these for Supabase

## Step 2: Supabase Configuration

### 2.1 Enable Google Provider

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Providers**
3. Find **Google** and click **Enable**
4. Enter your Google OAuth credentials:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
5. Save the configuration

### 2.2 Configure Site URL

1. Go to **Authentication** > **Settings**
2. Set **Site URL** to your application URL:
   - Development: `http://localhost:5173`
   - Production: `https://yourdomain.com`

### 2.3 Configure Redirect URLs

1. In **Authentication** > **Settings**
2. Add redirect URLs:
   - `http://localhost:5173/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)

## Step 3: Database Migration

Run the migration to set up the database schema:

```bash
# Apply the migration
supabase db push
```

This migration will:
- Create a default "Student" user type
- Set up automatic profile creation for new users
- Configure proper RLS policies

## Step 4: Environment Variables

Add these to your `.env` file:

```env
VITE_SUPABASE_URL=https://enjcslafqdwytxbtfync.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 5: Testing

### 5.1 Development Testing

1. Start your development server: `npm run dev`
2. Navigate to `/auth`
3. Click "Continue with Google"
4. Complete the OAuth flow
5. Verify you're redirected to the callback page
6. Check that a profile is created in the database

### 5.2 Production Testing

1. Deploy your application
2. Test the OAuth flow with your production domain
3. Verify redirects work correctly
4. Check user profile creation

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Ensure all redirect URIs are properly configured in both Google Console and Supabase
   - Check for trailing slashes or protocol mismatches

2. **Profile not created automatically**
   - Verify the database trigger is working
   - Check the migration was applied successfully
   - Review Supabase logs for errors

3. **CORS errors**
   - Ensure your domain is added to authorized origins in Google Console
   - Check Supabase site URL configuration

4. **"Client ID not found" error**
   - Verify the Client ID is correct in Supabase
   - Ensure the OAuth consent screen is properly configured

### Debug Steps

1. Check browser console for errors
2. Review Supabase authentication logs
3. Verify database triggers are working
4. Test with a fresh browser session

## Security Considerations

1. **HTTPS Only**: Always use HTTPS in production
2. **Domain Validation**: Only allow your verified domains
3. **Secret Management**: Never expose Client Secret in client-side code
4. **Session Management**: Implement proper session handling
5. **Rate Limiting**: Consider implementing rate limiting for auth endpoints

## Additional Configuration

### Custom Claims

You can add custom claims to the JWT token by modifying the `handle_new_user()` function in the migration.

### User Role Assignment

The current setup assigns all Google users the "Student" role. To modify this:

1. Update the `handle_new_user()` function in the migration
2. Add logic to determine user role based on email domain or other criteria

### Profile Customization

To add more fields to user profiles:

1. Modify the `profiles` table schema
2. Update the `handle_new_user()` function
3. Update the frontend components to handle new fields

## Support

If you encounter issues:

1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Review [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
3. Check Supabase community forums
4. Review application logs for detailed error messages
