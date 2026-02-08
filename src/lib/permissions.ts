import { useAuthStore } from '@/stores/authStore';

/**
 * Utility functions for permission checking
 */

/**
 * Check if the current user has a specific permission
 * @param permissionSlug - The permission slug to check (e.g., "courses.create")
 * @returns boolean - True if user has the permission
 */
export const hasPermission = (permissionSlug: string): boolean => {
    const { permissions } = useAuthStore.getState();
    return permissions.includes(permissionSlug);
};

/**
 * Check if the current user has any of the specified permissions
 * @param permissionSlugs - Array of permission slugs to check
 * @returns boolean - True if user has at least one of the permissions
 */
export const hasAnyPermission = (permissionSlugs: string[]): boolean => {
    const { permissions } = useAuthStore.getState();
    return permissionSlugs.some(slug => permissions.includes(slug));
};

/**
 * Check if the current user has all of the specified permissions
 * @param permissionSlugs - Array of permission slugs to check
 * @returns boolean - True if user has all of the permissions
 */
export const hasAllPermissions = (permissionSlugs: string[]): boolean => {
    const { permissions } = useAuthStore.getState();
    return permissionSlugs.every(slug => permissions.includes(slug));
};

/**
 * Check if the current user can perform an action on a resource
 * @param resource - The resource name (e.g., "courses")
 * @param action - The action name (e.g., "create")
 * @returns boolean - True if user can perform the action
 */
export const canAccess = (resource: string, action: string): boolean => {
    const permissionSlug = `${resource}.${action}`;
    return hasPermission(permissionSlug);
};

/**
 * Get all permissions for the current user
 * @returns string[] - Array of permission slugs
 */
export const getUserPermissions = (): string[] => {
    const { permissions } = useAuthStore.getState();
    return permissions;
};

/**
 * Get the current user's user type name
 * @returns string | undefined - The user type name or undefined
 */
export const getUserTypeName = (): string | undefined => {
    const { user } = useAuthStore.getState();
    return user?.user_type?.name;
};

/**
 * Check if the current user is an admin
 * @returns boolean - True if user type is admin
 */
export const isAdmin = (): boolean => {
    const userTypeName = getUserTypeName();
    return userTypeName?.toLowerCase() === 'admin';
};

/**
 * Check if the current user is an instructor
 * @returns boolean - True if user type is instructor
 */
export const isInstructor = (): boolean => {
    const userTypeName = getUserTypeName();
    return userTypeName?.toLowerCase() === 'instructor';
};

/**
 * Check if the current user is a student
 * @returns boolean - True if user type is student
 */
export const isStudent = (): boolean => {
    const userTypeName = getUserTypeName();
    return userTypeName?.toLowerCase() === 'student';
}; 