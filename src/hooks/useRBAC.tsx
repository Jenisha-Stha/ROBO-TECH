import { useAuth } from '@/hooks/useAuth';

// Re-export the hook from context for convenience
export { useAuth as useRBAC } from '@/hooks/useAuth';

// Additional utility hooks for common permission checks
export const useCanAccess = (resource: string, action: string) => {
  const { canAccess } = useAuth();
  return canAccess(resource, action);
};

export const useHasPermission = (permissionSlug: string) => {
  const { hasPermission } = useAuth();
  return hasPermission(permissionSlug);
};

export const useHasAnyPermission = (permissionSlugs: string[]) => {
  const { hasAnyPermission } = useAuth();
  return hasAnyPermission(permissionSlugs);
};

export const useHasAllPermissions = (permissionSlugs: string[]) => {
  const { hasAllPermissions } = useAuth();
  return hasAllPermissions(permissionSlugs);
};

export const useUserPermissions = () => {
  const { getUserPermissions } = useAuth();
  return getUserPermissions();
};