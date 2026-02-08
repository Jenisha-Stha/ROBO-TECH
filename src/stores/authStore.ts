import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { userService } from '@/services/userService';
import { connectionService } from '@/services/connectionService';


interface User {
    id: string;
    email: string;
    full_name?: string;
    user_type?: {
        id: string;
        name: string;
    };
    alias_name?: string;
    school_name?: string;
    mobile?: string;
    address?: string;
    parents_name?: string;
    tag_id?: string;
    tag?: {
        id: string;
        title: string;
        slug: string;
    };
    permissions?: string[];
    is_first_login?: boolean;
    avatar_url?: string;
}

interface AuthState {
    // State
    user: User | null;
    session: Session | null;
    permissions: string[];
    isLoading: boolean;
    isInitialized: boolean; // Track if auth has been initialized

    // Actions
    setUser: (user: User | null) => void;
    setSession: (session: Session | null) => void;
    setPermissions: (permissions: string[]) => void;
    setIsLoading: (isLoading: boolean) => void;
    setIsInitialized: (isInitialized: boolean) => void;

    // Permission checks
    hasPermission: (permissionSlug: string) => boolean;
    hasAnyPermission: (permissionSlugs: string[]) => boolean;
    hasAllPermissions: (permissionSlugs: string[]) => boolean;
    canAccess: (resource: string, action: string) => boolean;
    getUserPermissions: () => string[];

    // Auth actions
    loadUserData: (supabaseUser: SupabaseUser, profileData?: any) => Promise<void>;
    signOut: () => Promise<void>;
    initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // Initial state
            user: null,
            session: null,
            permissions: [],
            isLoading: true, // Start with loading true
            isInitialized: false,

            // State setters
            setUser: (user) => set({ user }),
            setSession: (session) => set({ session }),
            setPermissions: (permissions) => set({ permissions }),
            setIsLoading: (isLoading) => set({ isLoading }),
            setIsInitialized: (isInitialized) => set({ isInitialized }),

            // Permission check methods
            hasPermission: (permissionSlug: string) => {
                const { permissions } = get();
                return permissions.includes(permissionSlug);
            },

            hasAnyPermission: (permissionSlugs: string[]) => {
                const { hasPermission } = get();
                return permissionSlugs.some(slug => hasPermission(slug));
            },

            hasAllPermissions: (permissionSlugs: string[]) => {
                const { hasPermission } = get();
                return permissionSlugs.every(slug => hasPermission(slug));
            },

            canAccess: (resource: string, action: string) => {
                const { hasPermission } = get();
                const permissionSlug = `${resource}.${action}`;
                return hasPermission(permissionSlug);
            },

            getUserPermissions: () => {
                const { permissions } = get();
                return permissions;
            },


            // Load user data from Supabase
            loadUserData: async (supabaseUser: SupabaseUser, profileData?: any) => {


                try {
                    // Get current user to preserve existing is_first_login if profileData doesn't have it
                    const currentUser = get().user;

                    // Get is_first_login value from profileData, or preserve existing value, or default to false
                    const isFirstLogin = profileData?.is_first_login !== undefined
                        ? profileData.is_first_login
                        : (currentUser?.is_first_login ?? false);

                    console.log({
                        isFirstLogin,
                        fromProfileData: profileData?.is_first_login,
                        fromCurrentUser: currentUser?.is_first_login,
                        profileDataExists: !!profileData
                    });

                    // Create basic user data from Supabase user
                    const userData: User = {
                        id: supabaseUser.id,
                        email: supabaseUser.email || '',
                        full_name: profileData?.full_name ||
                            supabaseUser.user_metadata?.full_name ||
                            supabaseUser.user_metadata?.name ||
                            supabaseUser.user_metadata?.display_name || undefined,
                        user_type: profileData?.user_type || undefined,
                        alias_name: profileData?.alias_name || undefined,
                        school_name: profileData?.school_name || undefined,
                        tag_id: profileData?.tag_id || undefined,
                        tag: profileData?.tag || undefined,
                        mobile: profileData?.mobile || undefined,
                        address: profileData?.address || undefined,
                        parents_name: profileData?.parents_name || undefined,
                        permissions: profileData?.permissions || [],
                        is_first_login: isFirstLogin,
                        avatar_url: profileData?.avatar_url || undefined,
                    };
                    // Set the user data and permissions
                    // The persist middleware will automatically save this to localStorage under 'auth-storage'
                    set({ user: userData, permissions: userData.permissions || [] });

                    // Force a small delay to ensure persistence
                    setTimeout(() => {
                        console.log("Auth store state after delay:");
                    }, 100);

                } catch (error) {
                    console.error('Error loading user data:', error);
                }
            },

            // Sign out
            signOut: async () => {
                try {
                    // Clean up auth state
                    // The persist middleware will automatically update localStorage
                    set({ user: null, session: null, permissions: [], isLoading: false });

                    // Sign out from Supabase
                    await supabase.auth.signOut({ scope: 'global' });

                    // Navigate to home page
                    window.location.href = '/';
                } catch (error) {
                    console.error('Error signing out:', error);
                    // Even if there's an error, still redirect to home
                    window.location.href = '/';
                }
            },

            // Initialize auth state
            initializeAuth: async () => {
                const { isInitialized } = get();

                // Prevent multiple initializations
                if (isInitialized) {
                    return;
                }

                set({ isLoading: true, isInitialized: true });

                // Check for existing session first
                try {
                    const { data: { session } } = await supabase.auth.getSession();

                    if (session?.user) {
                        set({ session });

                        // Only fetch profile data if user data is not already loaded
                        const currentUser = get().user;
                        if (!currentUser || !currentUser.alias_name) {
                            try {
                                const profileData = await userService.fetchUserProfile(session.user);
                                if (profileData) {
                                    await get().loadUserData(session.user, profileData);
                                } else {
                                    await get().loadUserData(session.user);
                                }
                            } catch (error) {
                                console.error('Error fetching profile data:', error);
                                await get().loadUserData(session.user);
                            }
                        } else {
                        }
                    } else {
                        // No valid session found, clear any persisted data
                        set({ session: null, user: null, permissions: [] });
                    }
                } catch (error) {
                    console.error('Error getting session:', error);
                    // Clear any persisted data on error
                    set({ session: null, user: null, permissions: [] });
                } finally {
                    set({ isLoading: false });
                }

                // Set up auth state listener for future changes
                const { data: { subscription } } = supabase.auth.onAuthStateChange(
                    async (event, session) => {
                        set({ session });
                        if (session?.user) {
                            // Only fetch profile data if user data is not already loaded
                            const currentUser = get().user;
                            if (!currentUser || !currentUser.alias_name) {
                                try {
                                    const profileData = userService.fetchUserProfile(session.user);
                                    console.log({ profileData })
                                    if (profileData) {
                                        get().loadUserData(session.user, profileData);
                                    } else {
                                        get().loadUserData(session.user);
                                    }
                                } catch (error) {
                                    console.error('Error fetching profile data:', error);
                                    get().loadUserData(session.user);
                                }
                            } else {
                            }
                        } else {
                            set({ user: null, permissions: [] });
                        }

                        // Handle session refresh events
                        if (event === 'TOKEN_REFRESHED') {
                            // Force reconnection check
                            connectionService.forceReconnect();
                        }
                    }
                );
            },
        }),
        {
            name: 'auth-storage', // unique name for localStorage key
            partialize: (state) => ({
                // Only persist these fields
                user: state.user,
                session: state.session,
                permissions: state.permissions,
            }),
            onRehydrateStorage: () => (state) => {
                // This runs after the store is rehydrated from localStorage
                if (state) {
                    console.log('Auth store rehydrated from localStorage:');
                }
            },
        }
    )
); 