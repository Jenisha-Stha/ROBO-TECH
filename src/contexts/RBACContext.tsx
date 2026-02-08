import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  full_name?: string;
  user_type?: {
    id: string;
    name: string;
  };
}

interface Permission {
  id: string;
  name: string;
  slug: string;
  description: string;
  resource: string;
  action: string;
}

interface RBACContextType {
  user: User | null;
  session: Session | null;
  permissions: string[];
  isLoading: boolean;
  hasPermission: (permissionSlug: string) => boolean;
  hasAnyPermission: (permissionSlugs: string[]) => boolean;
  hasAllPermissions: (permissionSlugs: string[]) => boolean;
  canAccess: (resource: string, action: string) => boolean;
  getUserPermissions: () => string[];
  signOut: () => Promise<void>;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);


export const useRBAC = (): RBACContextType => {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};