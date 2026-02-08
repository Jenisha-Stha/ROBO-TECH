import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { supabaseAdmin } from '@/integrations/supabase/adminClient';
import { useToast } from '@/hooks/use-toast';

export interface UserType {
    id: string;
    name: string;
}

export interface User {
    id: string;
    email?: string;
    full_name: string;
    avatar_url?: string;
    user_type_id?: string;
    school_name?: string;
    tag_id?: string;
    alias_name?: string;
    is_erased: boolean;
    is_active: boolean;
    created_by?: string;
    updated_by?: string;
    created_at: string;
    updated_at: string;
    user_types?: UserType;
    tags?: {
        id: string;
        title: string;
    };
}

export interface CreateUserData {
    email: string;
    password: string;
    full_name: string;
    avatar_url?: string;
    user_type_id?: string;
    school_name?: string;
    tag_id?: string;
    alias_name?: string;
}

export interface UpdateUserData {
    full_name: string;
    avatar_url?: string;
    user_type_id?: string;
    school_name?: string;
    tag_id?: string;
    alias_name?: string;
    is_active?: boolean;
}

// Query keys
export const usersKeys = {
    all: ['users'] as const,
    lists: () => [...usersKeys.all, 'list'] as const,
    list: (filters: string) => [...usersKeys.lists(), { filters }] as const,
    details: () => [...usersKeys.all, 'detail'] as const,
    detail: (id: string) => [...usersKeys.details(), id] as const,
};

export const userTypesKeys = {
    all: ['userTypes'] as const,
    lists: () => [...userTypesKeys.all, 'list'] as const,
};

// Helper function to fetch user emails from auth.users
const fetchUserEmails = async (userIds: string[]): Promise<Record<string, string>> => {
    if (userIds.length === 0) return {};

    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
        console.warn('Failed to fetch user emails:', error.message);
        return {};
    }

    const emailMap: Record<string, string> = {};
    data.users.forEach(user => {
        if (userIds.includes(user.id) && user.email) {
            emailMap[user.id] = user.email;
        }
    });

    return emailMap;
};

// Fetch users from Supabase
const fetchUsers = async (): Promise<User[]> => {
    const { data, error } = await supabase
        .from('profiles')
        .select(`
      id,
      full_name,
      avatar_url,
      user_type_id,
      school_name,
      tag_id,
      alias_name,
      is_erased,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at,
      user_types (
        id,
        name
      ),
      tags (
        id,
        title
      )
    `)
        .eq('is_erased', false)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    // Get user IDs to fetch emails
    const userIds = (data || []).map(user => user.id);
    const emailMap = await fetchUserEmails(userIds);

    // Transform the data to match our User interface
    const transformedData = (data || []).map(user => ({
        ...user,
        email: emailMap[user.id],
        user_types: user.user_types && user.user_types,
        tags: user.tags && user.tags
    })) as unknown as User[];

    return transformedData;
};

// Fetch user types from Supabase
const fetchUserTypes = async (): Promise<UserType[]> => {
    const { data, error } = await supabase
        .from('user_types')
        .select('id, name')
        .order('name');

    if (error) {
        throw new Error(error.message);
    }

    return data || [];
};

// Update user
const updateUser = async ({ id, ...userData }: { id: string } & UpdateUserData): Promise<User> => {
    const { data, error } = await supabase
        .from('profiles')
        .update({
            full_name: userData.full_name,
            avatar_url: userData.avatar_url,
            user_type_id: userData.user_type_id || null,
            school_name: userData.school_name,
            tag_id: userData.tag_id || null,
            alias_name: userData.alias_name,
            is_active: userData.is_active,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
      id,
      full_name,
      avatar_url,
      user_type_id,
      school_name,
      tag_id,
      alias_name,
      is_erased,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at,
      user_types (
        id,
        name
      ),
      tags (
        id,
        title
      )
    `)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    // Transform the data to match our User interface
    const transformedData = {
        ...data,
        user_types: data.user_types && data.user_types.length > 0 ? data.user_types[0] : undefined,
        tags: data.tags && data.tags.length > 0 ? data.tags[0] : undefined
    };

    return transformedData as User;
};

// Create new user with auth and profile
const createUser = async (userData: CreateUserData): Promise<User> => {

    // Step 1: Create auth user using admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
            display_name: userData.full_name,
        }
    });


    if (authError) {
        throw new Error(authError.message);
    }

    if (!authData.user) {
        throw new Error('Failed to create user account');
    }

    // Step 2: Create profile manually (since trigger was removed)
    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
            id: authData.user.id,
            full_name: userData.full_name,
            avatar_url: userData.avatar_url,
            user_type_id: userData.user_type_id || null,
            school_name: userData.school_name,
            tag_id: userData.tag_id || null,
            alias_name: userData.alias_name,
            is_erased: false,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
        .select(`
            id,
            full_name,
            avatar_url,
            user_type_id,
            school_name,
            tag_id,
            alias_name,
            is_erased,
            is_active,
            created_by,
            updated_by,
            created_at,
            updated_at,
            user_types (
                id,
                name
            ),
            tags (
                id,
                title
            )
        `)
        .single();


    if (profileError) {
        // If profile creation fails, we should clean up the auth user
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        throw new Error(`Failed to create user profile: ${profileError.message}`);
    }

    // Transform the data to match our User interface
    const transformedData = {
        ...profileData,
        email: userData.email, // Include the email from the input data
        user_types: profileData.user_types && profileData.user_types.length > 0 ? profileData.user_types[0] : undefined,
        tags: profileData.tags && profileData.tags.length > 0 ? profileData.tags[0] : undefined
    };

    return transformedData as User;
};

// Delete user profile and auth user
const deleteUser = async (id: string): Promise<void> => {
    // First delete the profile
    const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

    if (profileError) {
        throw new Error(profileError.message);
    }

    // Then delete the auth user
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (authError) {
        console.warn('Failed to delete auth user:', authError.message);
        // Don't throw here as the profile is already deleted
    }
};

// Hook for fetching users
export const useUsers = () => {
    return useQuery({
        queryKey: usersKeys.lists(),
        queryFn: fetchUsers,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};

// Hook for fetching user types
export const useUserTypes = () => {
    return useQuery({
        queryKey: userTypesKeys.lists(),
        queryFn: fetchUserTypes,
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 15 * 60 * 1000, // 15 minutes
    });
};

// Hook for creating user with optimistic updates
export const useCreateUser = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: createUser,
        onMutate: async (newUserData) => {

            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: usersKeys.lists() });

            // Snapshot the previous value
            const previousUsers = queryClient.getQueryData<User[]>(usersKeys.lists());
            // Optimistically add the new user (we'll use a temporary ID)
            const tempUser: User = {
                id: 'temp-' + Date.now(),
                full_name: newUserData.full_name,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                is_erased: false,
                is_active: true,
                user_types: newUserData.user_type_id ? {
                    id: newUserData.user_type_id,
                    name: 'Loading...'
                } : undefined
            };


            queryClient.setQueryData<User[]>(usersKeys.lists(), (oldData) => {
                return oldData ? [tempUser, ...oldData] : [tempUser];
            });

            return { previousUsers };
        },
        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousUsers) {
                queryClient.setQueryData(usersKeys.lists(), context.previousUsers);
            }
            toast({
                title: "Error",
                description: err.message || "Failed to create user. Please try again.",
                variant: "destructive"
            });
        },
        onSuccess: (newUser) => {
            // Update the cache with the real data
            queryClient.setQueryData<User[]>(usersKeys.lists(), (oldData) => {
                return oldData?.map(user =>
                    user.id.startsWith('temp-') ? newUser : user
                ) || [newUser];
            });

            // Also set the individual user cache
            queryClient.setQueryData(usersKeys.detail(newUser.id), newUser);

            toast({
                title: "User Created",
                description: `User ${newUser.full_name} has been successfully created.`,
            });
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
        },
    });
};

// Hook for updating user with optimistic updates
export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: updateUser,
        onMutate: async ({ id, ...updateData }) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: usersKeys.lists() });

            // Snapshot the previous value
            const previousUsers = queryClient.getQueryData<User[]>(usersKeys.lists());

            // Optimistically update to the new value
            queryClient.setQueryData<User[]>(usersKeys.lists(), (oldData) => {
                return oldData?.map(user =>
                    user.id === id
                        ? {
                            ...user,
                            full_name: updateData.full_name,
                            user_types: updateData.user_type_id ? {
                                id: updateData.user_type_id,
                                name: 'Loading...' // Will be updated when we refetch
                            } : undefined,
                            updated_at: new Date().toISOString()
                        }
                        : user
                );
            });

            return { previousUsers };
        },
        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousUsers) {
                queryClient.setQueryData(usersKeys.lists(), context.previousUsers);
            }
            toast({
                title: "Error",
                description: err.message || "Failed to update user. Please try again.",
                variant: "destructive"
            });
        },
        onSuccess: (updatedUser) => {
            // Update the cache with the real data
            queryClient.setQueryData<User[]>(usersKeys.lists(), (oldData) => {
                return oldData?.map(user =>
                    user.id === updatedUser.id ? updatedUser : user
                );
            });

            // Also update the individual user cache
            queryClient.setQueryData(usersKeys.detail(updatedUser.id), updatedUser);

            toast({
                title: "User Updated",
                description: "User information has been successfully updated.",
            });
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
        },
    });
};

// Hook for deleting user with optimistic updates
export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: deleteUser,
        onMutate: async (id) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: usersKeys.lists() });

            // Snapshot the previous value
            const previousUsers = queryClient.getQueryData<User[]>(usersKeys.lists());

            // Optimistically remove the user
            queryClient.setQueryData<User[]>(usersKeys.lists(), (oldData) => {
                return oldData?.filter(user => user.id !== id);
            });

            return { previousUsers };
        },
        onError: (err, id, context) => {
            // Rollback on error
            if (context?.previousUsers) {
                queryClient.setQueryData(usersKeys.lists(), context.previousUsers);
            }
            toast({
                title: "Error",
                description: err.message || "Failed to delete user. Please try again.",
                variant: "destructive"
            });
        },
        onSuccess: (_, deletedId) => {
            // Remove individual user cache
            queryClient.removeQueries({ queryKey: usersKeys.detail(deletedId) });

            toast({
                title: "User Profile Deleted",
                description: "User profile has been removed from the system.",
                variant: "destructive"
            });
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
        },
    });
};

// Hook for getting a single user
export const useUser = (id: string) => {
    return useQuery({
        queryKey: usersKeys.detail(id),
        queryFn: async (): Promise<User> => {
            const { data, error } = await supabase
                .from('profiles')
                .select(`
          id,
          full_name,
          avatar_url,
          user_type_id,
          school_name,
          tag_id,
          alias_name,
          is_erased,
          is_active,
          created_by,
          updated_by,
          created_at,
          updated_at,
          user_types (
            id,
            name
          ),
          tags (
            id,
            title
          )
        `)
                .eq('id', id)
                .eq('is_erased', false)
                .single();

            if (error) {
                throw new Error(error.message);
            }

            // Fetch email for this specific user
            const emailMap = await fetchUserEmails([id]);

            // Transform the data to match our User interface
            const transformedData = {
                ...data,
                email: emailMap[id],
                user_types: data.user_types && data.user_types.length > 0 ? data.user_types[0] : undefined,
                tags: data.tags && data.tags.length > 0 ? data.tags[0] : undefined
            };

            return transformedData as User;
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};

// Utility hook for users with search/filtering
export const useUsersWithFilter = (searchTerm: string = '', filterRole: string = 'all') => {
    const { data: users = [], isLoading, error } = useUsers();

    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.school_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.alias_name || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = filterRole === "all" || user.user_types?.id === filterRole;

        return matchesSearch && matchesRole;
    });

    const stats = {
        total: users.length,
        withRoles: users.filter(u => u.user_types).length,
        withoutRoles: users.filter(u => !u.user_types).length
    };


    return {
        users: filteredUsers,
        allUsers: users,
        stats,
        isLoading,
        error,
    };
};
