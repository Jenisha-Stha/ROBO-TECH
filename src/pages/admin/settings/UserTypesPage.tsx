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
  Shield,
  UserCheck,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserType {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export default function UserTypesPage() {
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUserType, setEditingUserType] = useState<UserType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: ""
    });
    setEditingUserType(null);
  };

  const fetchUserTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('user_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setUserTypes(data || []);
    } catch (error) {
      console.error('Error fetching user types:', error);
      toast({
        title: "Error",
        description: "Failed to load user types.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editingUserType) {
        // Update existing user type
        const { error } = await supabase
          .from('user_types')
          .update({
            name: formData.name,
            description: formData.description
          })
          .eq('id', editingUserType.id);
          
        if (error) throw error;
        
        toast({
          title: "User Type Updated",
          description: "User type has been successfully updated.",
        });
      } else {
        // Create new user type
        const { error } = await supabase
          .from('user_types')
          .insert({
            name: formData.name,
            description: formData.description
          });
          
        if (error) throw error;
        
        toast({
          title: "User Type Created",
          description: "New user type has been successfully created.",
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
      await fetchUserTypes();
    } catch (error: any) {
      console.error('Error saving user type:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save user type.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (userType: UserType) => {
    setEditingUserType(userType);
    setFormData({
      name: userType.name,
      description: userType.description || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_types')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "User Type Deleted",
        description: "User type has been removed from the system.",
        variant: "destructive"
      });
      
      await fetchUserTypes();
    } catch (error: any) {
      console.error('Error deleting user type:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user type.",
        variant: "destructive"
      });
    }
  };

  const filteredUserTypes = userTypes.filter(userType => {
    const matchesSearch = userType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (userType.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    total: userTypes.length,
    active: userTypes.length // All are active since we don't have isActive field
  };

  if (isLoading) {
    return (
      <AdminLayout title="User Types Management" subtitle="Define and manage user roles and permission levels">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="User Types Management" 
      subtitle="Define and manage user roles and permission levels"
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gradient-card border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Total Types</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{stats.active}</div>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search user types..." 
              className="pl-10 bg-background border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-primary hover:opacity-90 transition-opacity"
                onClick={resetForm}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add User Type
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-card border-border">
              <DialogHeader>
                <DialogTitle>
                  {editingUserType ? "Edit User Type" : "Add New User Type"}
                </DialogTitle>
                <DialogDescription>
                  {editingUserType 
                    ? "Update the user type information below."
                    : "Create a new user type with specific permissions level."
                  }
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Manager"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the role and its responsibilities..."
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
                        {editingUserType ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      `${editingUserType ? "Update" : "Create"} User Type`
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* User Types Table */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              User Types ({filteredUserTypes.length})
            </CardTitle>
            <CardDescription>
              Manage user role types and their permission levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted/50">
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUserTypes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Shield className="w-8 h-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No user types found</p>
                          <p className="text-sm text-muted-foreground">Try adjusting your search terms</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUserTypes.map((userType) => (
                      <TableRow key={userType.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10">
                              <UserCheck className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{userType.name}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground max-w-xs truncate">
                            {userType.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {new Date(userType.created_at).toLocaleDateString()}
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
                              <DropdownMenuItem onClick={() => handleEdit(userType)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDelete(userType.id)}
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