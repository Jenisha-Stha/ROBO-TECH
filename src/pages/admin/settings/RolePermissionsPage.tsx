import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield,
  Key,
  Users,
  Save,
  RotateCcw,
  Loader2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserType {
  id: string;
  name: string;
  description: string;
}

interface Permission {
  id: string;
  name: string;
  slug: string;
  description: string;
  resource: string;
  action: string;
}

interface RolePermission {
  user_type_id: string;
  permission_id: string;
}

export default function RolePermissionsPage() {
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      // Fetch user types
      const { data: userTypesData, error: userTypesError } = await supabase
        .from('user_types')
        .select('id, name, description')
        .order('name');
      
      if (userTypesError) throw userTypesError;

      // Fetch permissions
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('permissions')
        .select('id, name, slug, description, resource, action')
        .order('resource', { ascending: true })
        .order('action', { ascending: true });
      
      if (permissionsError) throw permissionsError;

      // Fetch role permissions
      const { data: rolePermissionsData, error: rolePermissionsError } = await supabase
        .from('role_permissions')
        .select('user_type_id, permission_id');
      
      if (rolePermissionsError) throw rolePermissionsError;

      setUserTypes(userTypesData || []);
      setPermissions(permissionsData || []);
      setRolePermissions(rolePermissionsData || []);
      
      // Set default selected role to first one
      if (userTypesData && userTypesData.length > 0 && !selectedRole) {
        setSelectedRole(userTypesData[0].id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "view": return "👁️";
      case "create": return "➕";
      case "edit": return "✏️";
      case "delete": return "🗑️";
      case "manage": return "⚙️";
      default: return "🔑";
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "view": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "create": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "edit": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "delete": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "manage": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const isPermissionGranted = (userTypeId: string, permissionId: string): boolean => {
    return rolePermissions.some(rp => rp.user_type_id === userTypeId && rp.permission_id === permissionId);
  };

  const togglePermission = (permissionId: string) => {
    if (!selectedRole) return;

    const existingIndex = rolePermissions.findIndex(
      rp => rp.user_type_id === selectedRole && rp.permission_id === permissionId
    );
    
    if (existingIndex >= 0) {
      // Remove permission
      setRolePermissions(prev => prev.filter((_, index) => index !== existingIndex));
    } else {
      // Add permission
      setRolePermissions(prev => [...prev, {
        user_type_id: selectedRole,
        permission_id: permissionId
      }]);
    }
    
    setHasChanges(true);
  };

  const saveChanges = async () => {
    if (!selectedRole) return;
    
    setIsSaving(true);
    try {
      // Delete existing permissions for this role
      await supabase
        .from('role_permissions')
        .delete()
        .eq('user_type_id', selectedRole);

      // Insert new permissions for this role
      const roleSpecificPermissions = rolePermissions.filter(rp => rp.user_type_id === selectedRole);
      
      if (roleSpecificPermissions.length > 0) {
        const { error } = await supabase
          .from('role_permissions')
          .insert(roleSpecificPermissions);
        
        if (error) throw error;
      }

      toast({
        title: "Permissions Updated",
        description: "Role permissions have been successfully saved.",
      });
      setHasChanges(false);
    } catch (error: any) {
      console.error('Error saving permissions:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save permissions.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetChanges = async () => {
    await fetchData();
    setHasChanges(false);
    toast({
      title: "Changes Reset",
      description: "All changes have been reset to the last saved state.",
    });
  };

  const selectedRoleData = userTypes.find(role => role.id === selectedRole);
  const groupedPermissions = permissions.reduce((groups, permission) => {
    const resource = permission.resource;
    if (!groups[resource]) {
      groups[resource] = [];
    }
    groups[resource].push(permission);
    return groups;
  }, {} as Record<string, Permission[]>);

  const roleStats = {
    total: permissions.length,
    granted: permissions.filter(p => isPermissionGranted(selectedRole, p.id)).length
  };

  if (isLoading) {
    return (
      <AdminLayout title="Role Permissions" subtitle="Configure permissions for each user role">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Role Permissions" 
      subtitle="Configure permissions for each user role"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Role</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {userTypes.map(role => (
                    <SelectItem key={role.id} value={role.id}>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        {role.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedRoleData && (
              <Card className="bg-gradient-card border-border">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{selectedRoleData.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {roleStats.granted}/{roleStats.total} permissions
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex items-center gap-2">
            {hasChanges && (
              <Button 
                variant="outline" 
                onClick={resetChanges}
                className="flex items-center gap-2"
                disabled={isSaving}
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            )}
            <Button 
              onClick={saveChanges}
              disabled={!hasChanges || isSaving}
              className="bg-gradient-primary hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Permissions Grid */}
        {selectedRole && (
          <div className="space-y-6">
            {Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => (
              <Card key={resource} className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-primary" />
                    {resource.charAt(0).toUpperCase() + resource.slice(1)} Permissions
                  </CardTitle>
                  <CardDescription>
                    Configure {resource} permissions for {selectedRoleData?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {resourcePermissions.map((permission) => {
                      const isGranted = isPermissionGranted(selectedRole, permission.id);
                      
                      return (
                        <div 
                          key={permission.id}
                          className={`p-4 rounded-lg border transition-all ${
                            isGranted 
                              ? 'border-primary/50 bg-primary/5' 
                              : 'border-border hover:border-primary/30 bg-background'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getActionColor(permission.action)}`}
                                >
                                  {getActionIcon(permission.action)} {permission.action}
                                </Badge>
                              </div>
                              <div className="font-medium text-sm mb-1">{permission.name}</div>
                              <div className="text-xs text-muted-foreground line-clamp-2">
                                {permission.description}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 font-mono">
                                {permission.slug}
                              </div>
                            </div>
                            
                            <Switch
                              checked={isGranted}
                              onCheckedChange={() => togglePermission(permission.id)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary */}
        {selectedRole && (
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Permission Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {selectedRoleData?.name} has <span className="font-medium text-foreground">{roleStats.granted}</span> out of <span className="font-medium text-foreground">{roleStats.total}</span> permissions granted.
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-primary transition-all duration-300"
                      style={{ width: `${(roleStats.granted / roleStats.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round((roleStats.granted / roleStats.total) * 100)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}