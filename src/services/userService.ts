import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
    id: string;
    email: string;
    full_name?: string;
    user_type?: {
        id: string;
        name: string;
    };
    permissions?: string[];
    school_name?: string;
    tag_id?: string;
    tag?: {
        id: string;
        title: string;
        slug: string;
    };
    alias_name?: string;
    mobile?: string;
    address?: string;
    parents_name?: string;
    is_first_login?: boolean;
    avatar_url?: string;
}

interface ProfileData {
    id: string;
    full_name?: string;
    avatar_url?: string;
    user_type_id?: string;
    user_types?: {
        id: string;
        name: string;
    };
    school_name?: string;
    tag_id?: string;
    tags?: {
        id: string;
        title: string;
        slug: string;
    };
    alias_name?: string;
    mobile?: string;
    address?: string;
    parents_name?: string;
    is_first_login?: boolean;

}

export const userService = {
    // Fetch user profile data from profiles table
    async fetchUserProfile(supabaseUser: any): Promise<UserProfile | null> {
        try {
            // Query the profiles table with user type and tag information
            const { data: profile, error } = await supabase
                .from('profiles')
                .select(`
                    id,
                    full_name,
                    avatar_url,
                    user_type_id,
                    user_types (
                        id,
                        name
                    ),
                    school_name,
                    tag_id,
                    tags (
                        id,
                        title,
                        slug
                    ),
                    alias_name,
                    mobile,
                    address,
                    parents_name,
                    is_first_login,
                    avatar_url
                `)
                .eq('id', supabaseUser.id)
                .single() as { data: ProfileData | null; error: any };

            if (error) {
                console.error('Error fetching profile:', error);
                return null;
            }

            if (profile) {
                // Fetch user permissions using the RPC function
                // const { data: permissionsData, error: permissionsError } = await supabase
                //     .rpc('get_user_permissions', {
                //         _user_id: supabaseUser.id
                //     });

                // if (permissionsError) {
                //     console.error('Error fetching permissions:', permissionsError);
                // }

                // // Extract permission slugs from the result
                // const permissions = permissionsData?.map((p: any) => p.permission_slug) || [];

                // Create user data with profile information and permissions
                const userData: UserProfile = {
                    id: profile.id,
                    email: supabaseUser.email || '',
                    full_name: profile.full_name || undefined,
                    user_type: profile.user_types ? {
                        id: profile.user_types.id,
                        name: profile.user_types.name
                    } : undefined,
                    // permissions: permissions,
                    school_name: profile.school_name || undefined,
                    tag_id: profile.tag_id || undefined,
                    tag: profile.tags ? {
                        id: profile.tags.id,
                        title: profile.tags.title,
                        slug: profile.tags.slug
                    } : undefined,
                    alias_name: profile.alias_name || undefined,
                    mobile: profile.mobile || undefined,
                    address: profile.address || undefined,
                    parents_name: profile.parents_name || undefined,
                    is_first_login: profile.is_first_login || false,
                    avatar_url: profile.avatar_url || undefined
                };
                return userData;
            } else {
                // console.log('No profile found for user:', supabaseUser.id);
                return null;
            }
        } catch (error) {
            console.error('Error in fetchUserProfile:', error);
            return null;
        }
    },

    // Create or update user profile (useful for Google users)
    async createOrUpdateProfile(supabaseUser: any): Promise<UserProfile | null> {
        try {
            // Get student user type ID
            const { data: studentType, error: typeError } = await supabase
                .from('user_types')
                .select('id, name')
                .eq('name', 'Student')
                .single();

            if (typeError) {
                console.error('Error fetching student user type:', typeError);
                return null;
            }

            // Prepare profile data
            const profileData = {
                id: supabaseUser.id,
                full_name: supabaseUser.user_metadata?.full_name ||
                    supabaseUser.user_metadata?.name ||
                    supabaseUser.user_metadata?.display_name,
                avatar_url: supabaseUser.user_metadata?.avatar_url,
                user_type_id: studentType.id
            };

            // Upsert profile
            const { data: profile, error } = await supabase
                .from('profiles')
                .upsert(profileData, {
                    onConflict: 'id',
                    ignoreDuplicates: false
                })
                .select(`
                    id,
                    full_name,
                    avatar_url,
                    user_type_id,
                    user_types (
                        id,
                        name
                    )
                `)
                .single();

            if (error) {
                console.error('Error creating/updating profile:', error);
                return null;
            }

            // Return the profile data
            return {
                id: profile.id,
                email: supabaseUser.email || '',
                full_name: profile.full_name || undefined,
                user_type: profile.user_types ? {
                    id: profile.user_types.id,
                    name: profile.user_types.name
                } : undefined,
                permissions: [] // New users start with no permissions
            };
        } catch (error) {
            console.error('Error in createOrUpdateProfile:', error);
            return null;
        }
    }
}; 