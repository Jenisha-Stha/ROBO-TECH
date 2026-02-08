# Migration from React Context to Zustand

This document outlines the migration from React Context-based state management to Zustand for the LMS application.

## Changes Made

### 1. New Zustand Store (`src/stores/authStore.ts`)

Created a new Zustand store that replaces the RBAC context with the following features:

- **State Management**: User, session, permissions, and loading state
- **Permission Checks**: `hasPermission`, `hasAnyPermission`, `hasAllPermissions`, `canAccess`
- **Auth Actions**: `loadUserData`, `signOut`, `initializeAuth`
- **TypeScript Support**: Full type safety with proper interfaces

### 2. New Custom Hook (`src/hooks/useAuth.ts`)

Created a custom hook that provides the same interface as the old `useRBAC` hook:

```typescript
import { useAuth } from "@/hooks/useAuth";

const { user, session, permissions, isLoading, hasPermission, signOut } =
  useAuth();
```

### 3. Updated Components

The following components have been updated to use the new Zustand store:

- `src/App.tsx` - Removed RBACProvider wrapper
- `src/components/admin/ProtectedRoute.tsx` - Updated to use `useAuth`
- `src/components/admin/AdminSidebar.tsx` - Updated to use `useAuth`
- `src/pages/AuthPage.tsx` - Updated to use `useAuth`
- `src/hooks/useRBAC.tsx` - Updated to re-export from new hook

## Usage

### Basic Usage

```typescript
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { user, session, isLoading, hasPermission } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {user && <p>Welcome, {user.full_name}!</p>}
      {hasPermission("courses.view") && <p>You can view courses</p>}
    </div>
  );
}
```

### Permission Checks

```typescript
import { useAuth } from "@/hooks/useAuth";

function ProtectedComponent() {
  const { hasPermission, hasAnyPermission, hasAllPermissions, canAccess } =
    useAuth();

  // Check single permission
  const canViewCourses = hasPermission("courses.view");

  // Check any of multiple permissions
  const canManageContent = hasAnyPermission(["courses.edit", "lessons.edit"]);

  // Check all permissions
  const isAdmin = hasAllPermissions(["admin.access", "users.manage"]);

  // Check resource and action
  const canCreateCourses = canAccess("courses", "create");
}
```

### Direct Store Access

You can also access the store directly without the hook:

```typescript
import { useAuthStore } from "@/stores/authStore";

function DirectAccess() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  return <button onClick={signOut}>Sign Out</button>;
}
```

## Benefits of Zustand

1. **Simpler Setup**: No need for providers wrapping the entire app
2. **Better Performance**: Automatic memoization and selective re-renders
3. **TypeScript Support**: Better type inference and safety
4. **DevTools**: Built-in Redux DevTools support
5. **Bundle Size**: Smaller bundle size compared to Context + useReducer
6. **Testing**: Easier to test individual store functions

## Migration Checklist

- [x] Install Zustand
- [x] Create auth store
- [x] Create useAuth hook
- [x] Update App.tsx
- [x] Update ProtectedRoute component
- [x] Update AdminSidebar component
- [x] Update AuthPage
- [x] Update utility hooks
- [x] Remove RBACProvider wrapper
- [x] Test TypeScript compilation
- [x] Test authentication flow

## Backward Compatibility

The migration maintains backward compatibility by:

1. Providing the same hook interface (`useAuth` with same return values)
2. Keeping the same permission check methods
3. Maintaining the same authentication flow
4. Re-exporting `useRBAC` as an alias to `useAuth`

## Next Steps

1. Test the authentication flow thoroughly
2. Verify all permission checks work correctly
3. Test protected routes and components
4. Monitor performance improvements
5. Consider migrating other state management to Zustand if needed

## Troubleshooting

If you encounter issues:

1. **TypeScript Errors**: Ensure all imports are updated to use `@/hooks/useAuth`
2. **Authentication Issues**: Check that the store is properly initialized
3. **Permission Issues**: Verify that the user profile and permissions are loading correctly
4. **Performance Issues**: Use React DevTools to check for unnecessary re-renders
