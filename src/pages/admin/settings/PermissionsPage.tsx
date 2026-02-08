import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Search, 
  MoreHorizontal,
  Edit,
  Trash2,
  Key,
  Lock,
  Unlock,
  Loader2
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Permission {
  id: string;
  name: string;
  slug: string;
  description: string;
  resource: string;
  action: string;
  created_at: string;
  updated_at: string;
}

const actions = ["view", "create", "edit", "delete", "manage"];

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState<string>("all");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    resource: "",
    action: ""
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      resource: "",
      action: ""
    });
    setEditingPermission(null);
  };

  const generateSlug = (resource: string, action: string) => {
    if (!resource || !action) return "";
    return `${resource.toLowerCase()}.${action.toLowerCase()}`;
  };

  const fetchPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('resource', { ascending: true })
        .order('action', { ascending: true });
      
      if (error) throw error;
      setPermissions(data || []);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast({
        title: "Error",
        description: "Failed to load permissions.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const slug = formData.slug || generateSlug(formData.resource, formData.action);
      
      if (editingPermission) {
        // Update existing permission
        const { error } = await supabase
          .from('permissions')
          .update({
            name: formData.name,
            slug,
            description: formData.description,
            resource: formData.resource,
            action: formData.action
          })
          .eq('id', editingPermission.id);
          
        if (error) throw error;
        
        toast({
          title: "Permission Updated",
          description: "Permission has been successfully updated.",
        });
      } else {
        // Create new permission
        const { error } = await supabase
          .from('permissions')
          .insert({
            name: formData.name,
            slug,
            description: formData.description,
            resource: formData.resource,
            action: formData.action
          });
          
        if (error) throw error;
        
        toast({
          title: "Permission Created",
          description: "New permission has been successfully created.",
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
      await fetchPermissions();
    } catch (error: any) {
      console.error('Error saving permission:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save permission.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission);
    setFormData({
      name: permission.name,
      slug: permission.slug,
      description: permission.description,
      resource: permission.resource,
      action: permission.action
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('permissions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Permission Deleted",
        description: "Permission has been removed from the system.",
        variant: "destructive"
      });
      
      await fetchPermissions();
    } catch (error: any) {
      console.error('Error deleting permission:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete permission.",
        variant: "destructive"
      });
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "view": return <Unlock className="w-3 h-3" />;
      case "create": return <Plus className="w-3 h-3" />;
      case "edit": return <Edit className="w-3 h-3" />;
      case "delete": return <Trash2 className="w-3 h-3" />;
      case "manage": return <Lock className="w-3 h-3" />;
      default: return <Key className="w-3 h-3" />;
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

  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.slug.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = filterAction === "all" || permission.action === filterAction;
    
    return matchesSearch && matchesAction;
  });

  const stats = {
    total: permissions.length,
    resources: new Set(permissions.map(p => p.resource)).size,
    actions: new Set(permissions.map(p => p.action)).size
  };

  if (isLoading) {
    return (
      <AdminLayout title="Permissions Management" subtitle="Define and manage system permissions and access controls">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Permissions Management" 
      subtitle="Define and manage system permissions and access controls"
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-card border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Total Permissions</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.resources}</div>
                <p className="text-xs text-muted-foreground">Resources</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{stats.actions}</div>
                <p className="text-xs text-muted-foreground">Actions</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search permissions..." 
                className="pl-10 bg-background border-border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {actions.map(action => (
                  <SelectItem key={action} value={action}>{action}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-primary hover:opacity-90 transition-opacity"
                onClick={resetForm}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Permission
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-card border-border">
              <DialogHeader>
                <DialogTitle>
                  {editingPermission ? "Edit Permission" : "Add New Permission"}
                </DialogTitle>
                <DialogDescription>
                  {editingPermission 
                    ? "Update the permission details below."
                    : "Create a new permission for the system."
                  }
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Permission Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., View Users"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="resource">Resource *</Label>
                    <Input
                      id="resource"
                      value={formData.resource}
                      onChange={(e) => {
                        const resource = e.target.value;
                        setFormData(prev => ({ 
                          ...prev, 
                          resource,
                          slug: generateSlug(resource, prev.action)
                        }));
                      }}
                      placeholder="e.g., users"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="action">Action *</Label>
                    <Select 
                      value={formData.action} 
                      onValueChange={(value) => {
                        setFormData(prev => ({ 
                          ...prev, 
                          action: value,
                          slug: generateSlug(prev.resource, value)
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                      <SelectContent>
                        {actions.map(action => (
                          <SelectItem key={action} value={action}>{action}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="e.g., users.view"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this permission allows..."
                    required
                    rows={3}
                  />
                </div>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-gradient-primary hover:opacity-90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {editingPermission ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      `${editingPermission ? "Update" : "Create"} Permission`
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Permissions Table */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              Permissions ({filteredPermissions.length})
            </CardTitle>
            <CardDescription>
              Manage system permissions and access controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted/50">
                    <TableHead>Permission</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPermissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Key className="w-8 h-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No permissions found</p>
                          <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPermissions.map((permission) => (
                      <TableRow key={permission.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div>
                            <div className="font-medium">{permission.name}</div>
                            <div className="text-xs text-muted-foreground font-mono">{permission.slug}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {permission.resource}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getActionColor(permission.action)}>
                            {getActionIcon(permission.action)}
                            <span className="ml-1">{permission.action}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground max-w-xs truncate">
                            {permission.description}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover border-border">
                              <DropdownMenuItem onClick={() => handleEdit(permission)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDelete(permission.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}