import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * Example component demonstrating Zustand store usage
 * This shows both the hook-based approach and direct store access
 */
export const AuthExample: React.FC = () => {
    // Hook-based approach (recommended)
    const {
        user,
        session,
        permissions,
        isLoading,
        hasPermission,
        hasAnyPermission,
        signOut,
        profile
    } = useAuth();

    // Direct store access (alternative approach)
    const userFromStore = useAuthStore(state => state.user);
    const signOutFromStore = useAuthStore(state => state.signOut);

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-2">Loading authentication...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!user) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Authentication Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Not authenticated</p>
                    <Button onClick={() => window.location.href = '/login'}>
                        Sign In
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* User Information */}
            <Card>
                <CardHeader>
                    <CardTitle>User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Name:</span>
                        <span>{user.full_name || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Email:</span>
                        <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">User Type:</span>
                        <Badge variant="secondary">
                            {user.user_type?.name || 'Not assigned'}
                        </Badge>
                    </div>
                    {profile && (
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                            <h4 className="font-medium mb-2">Profile Data:</h4>
                            <pre className="text-xs overflow-auto">
                                {JSON.stringify(profile, null, 2)}
                            </pre>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Permissions */}
            <Card>
                <CardHeader>
                    <CardTitle>Permissions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                            {permissions.map(permission => (
                                <Badge key={permission} variant="outline">
                                    {permission}
                                </Badge>
                            ))}
                        </div>

                        {/* Permission Checks */}
                        <div className="mt-4 space-y-2">
                            <h4 className="font-medium">Permission Checks:</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <span>Can view courses:</span>
                                    <Badge variant={hasPermission('courses.view') ? 'default' : 'destructive'}>
                                        {hasPermission('courses.view') ? 'Yes' : 'No'}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>Can manage users:</span>
                                    <Badge variant={hasPermission('users.manage') ? 'default' : 'destructive'}>
                                        {hasPermission('users.manage') ? 'Yes' : 'No'}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>Can access settings:</span>
                                    <Badge variant={hasAnyPermission(['settings.manage', 'admin.access']) ? 'default' : 'destructive'}>
                                        {hasAnyPermission(['settings.manage', 'admin.access']) ? 'Yes' : 'No'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Session Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Session Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Session ID:</span>
                            <code className="text-xs bg-muted p-1 rounded">
                                {session?.access_token?.slice(0, 20)}...
                            </code>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Expires:</span>
                            <span>
                                {session?.expires_at
                                    ? new Date(session.expires_at * 1000).toLocaleString()
                                    : 'Unknown'
                                }
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-x-2">
                    <Button onClick={signOut} variant="destructive">
                        Sign Out (Hook)
                    </Button>
                    <Button onClick={signOutFromStore} variant="outline">
                        Sign Out (Direct Store)
                    </Button>
                </CardContent>
            </Card>

            {/* Store State Comparison */}
            <Card>
                <CardHeader>
                    <CardTitle>Store State Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">User from hook:</span>
                            <span>{user?.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">User from store:</span>
                            <span>{userFromStore?.id}</span>
                        </div>
                        <div className="text-muted-foreground">
                            Both should be identical - demonstrating that the hook and direct store access work the same way.
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}; 