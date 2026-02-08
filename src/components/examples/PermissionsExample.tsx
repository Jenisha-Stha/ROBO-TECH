import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccess,
    getUserPermissions,
    getUserTypeName,
    isAdmin,
    isInstructor,
    isStudent
} from '@/lib/permissions';

export const PermissionsExample: React.FC = () => {
    const { user, permissions } = useAuthStore();

    if (!user) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Permissions Example</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Please sign in to see permissions information.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <strong>Email:</strong> {user.email}
                    </div>
                    <div>
                        <strong>Full Name:</strong> {user.full_name || 'Not set'}
                    </div>
                    <div>
                        <strong>User Type:</strong> {user.user_type?.name || 'Not assigned'}
                    </div>
                    <div>
                        <strong>Permission Count:</strong> {permissions.length}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>User Type Checks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Badge variant={isAdmin() ? "default" : "secondary"}>
                            {isAdmin() ? "✓ Admin" : "✗ Admin"}
                        </Badge>
                        <Badge variant={isInstructor() ? "default" : "secondary"}>
                            {isInstructor() ? "✓ Instructor" : "✗ Instructor"}
                        </Badge>
                        <Badge variant={isStudent() ? "default" : "secondary"}>
                            {isStudent() ? "✓ Student" : "✗ Student"}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>All Permissions</CardTitle>
                </CardHeader>
                <CardContent>
                    {permissions.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {permissions.map((permission) => (
                                <Badge key={permission} variant="outline">
                                    {permission}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No permissions assigned</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Permission Tests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <strong>courses.create:</strong>
                            <Badge variant={hasPermission('courses.create') ? "default" : "secondary"} className="ml-2">
                                {hasPermission('courses.create') ? "✓" : "✗"}
                            </Badge>
                        </div>
                        <div>
                            <strong>courses.edit:</strong>
                            <Badge variant={hasPermission('courses.edit') ? "default" : "secondary"} className="ml-2">
                                {hasPermission('courses.edit') ? "✓" : "✗"}
                            </Badge>
                        </div>
                        <div>
                            <strong>courses.delete:</strong>
                            <Badge variant={hasPermission('courses.delete') ? "default" : "secondary"} className="ml-2">
                                {hasPermission('courses.delete') ? "✓" : "✗"}
                            </Badge>
                        </div>
                        <div>
                            <strong>users.manage:</strong>
                            <Badge variant={hasPermission('users.manage') ? "default" : "secondary"} className="ml-2">
                                {hasPermission('users.manage') ? "✓" : "✗"}
                            </Badge>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <strong>Can access courses.create:</strong>
                        <Badge variant={canAccess('courses', 'create') ? "default" : "secondary"} className="ml-2">
                            {canAccess('courses', 'create') ? "✓" : "✗"}
                        </Badge>
                    </div>

                    <div>
                        <strong>Has any course permission:</strong>
                        <Badge variant={hasAnyPermission(['courses.create', 'courses.edit', 'courses.delete']) ? "default" : "secondary"} className="ml-2">
                            {hasAnyPermission(['courses.create', 'courses.edit', 'courses.delete']) ? "✓" : "✗"}
                        </Badge>
                    </div>

                    <div>
                        <strong>Has all course permissions:</strong>
                        <Badge variant={hasAllPermissions(['courses.create', 'courses.edit', 'courses.delete']) ? "default" : "secondary"} className="ml-2">
                            {hasAllPermissions(['courses.create', 'courses.edit', 'courses.delete']) ? "✓" : "✗"}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Debug Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <details className="space-y-2">
                        <summary className="cursor-pointer font-medium">Show raw data</summary>
                        <div className="bg-muted p-4 rounded text-sm">
                            <pre>{JSON.stringify({ user, permissions }, null, 2)}</pre>
                        </div>
                    </details>
                </CardContent>
            </Card>
        </div>
    );
}; 