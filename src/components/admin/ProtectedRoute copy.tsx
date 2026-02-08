import React from 'react';
import { Navigate } from 'react-router';
import { useRBAC } from '@/contexts/RBACContext';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Lock } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
  requireAll?: boolean; // If true, user needs ALL permissions. If false, user needs ANY permission
  fallbackPath?: string;
  showForbidden?: boolean; // If true, shows forbidden message instead of redirecting
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredPermissions = [],
  requireAll = false,
  fallbackPath = '/login',
  showForbidden = false
}) => {
  const { user, hasPermission, hasAnyPermission, hasAllPermissions, isLoading } = useRBAC();
  // console.log({ user, children, requiredPermission, requiredPermissions, requireAll, fallbackPath, showForbidden });

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if user is authenticated
  // if (!user) {
  //   return <Navigate to={fallbackPath} replace />;
  // }

  // Build permissions array
  const permissionsToCheck = requiredPermission
    ? [requiredPermission, ...requiredPermissions]
    : requiredPermissions;

  // Check permissions
  let hasAccess = true;

  if (permissionsToCheck.length > 0) {
    if (requireAll) {
      hasAccess = hasAllPermissions(permissionsToCheck);
    } else {
      hasAccess = hasAnyPermission(permissionsToCheck);
    }
  }

  // Handle access denied
  if (!hasAccess) {
    if (showForbidden) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground mb-4">
                You don't have permission to access this page.
              </p>
              <div className="text-sm text-muted-foreground">
                Required permissions:
                <ul className="mt-2 space-y-1">
                  {permissionsToCheck.map(permission => (
                    <li key={permission} className="font-mono text-xs bg-muted p-1 rounded">
                      {permission}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <div className="flex items-center gap-2 text-yellow-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Contact your administrator to request access
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return <Navigate to="/admin" replace />;
  }

  // User has access, render the protected content
  return <>{children}</>;
};

// Utility component for protecting individual UI elements
interface ProtectedComponentProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  children,
  requiredPermission,
  requiredPermissions = [],
  requireAll = false,
  fallback = null
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useRBAC();

  // Build permissions array
  const permissionsToCheck = requiredPermission
    ? [requiredPermission, ...requiredPermissions]
    : requiredPermissions;

  // Check permissions
  let hasAccess = true;

  if (permissionsToCheck.length > 0) {
    if (requireAll) {
      hasAccess = hasAllPermissions(permissionsToCheck);
    } else {
      hasAccess = hasAnyPermission(permissionsToCheck);
    }
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};