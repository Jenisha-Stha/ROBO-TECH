import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  UserCog,
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

interface UserType {
  id: string;
  name: string;
}

interface User {
  id: string;
  full_name: string;
  user_types?: UserType;
  created_at: string;
  updated_at: string;
}


export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    full_name: "",
    user_type_id: ""
  });

  const resetForm = () => {
    setFormData({
      full_name: "",
      user_type_id: ""
    });
    setEditingUser(null);
  };

  const fetchData = async () => {
    try {
      // Fetch user types
      const { data: userTypesData, error: userTypesError } = await supabase
        .from('user_types')
        .select('id, name')
        .order('name');
      
      if (userTypesError) throw userTypesError;

      // Fetch profiles with user types
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          created_at,
          updated_at,
          user_types (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (usersError) throw usersError;

      setUserTypes(userTypesData || []);
      setUsers(usersData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load user data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editingUser) {
        // Update existing user
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: formData.full_name,
            user_type_id: formData.user_type_id || null
          })
          .eq('id', editingUser.id);
          
        if (error) throw error;
        
        toast({
          title: "User Updated",
          description: "User information has been successfully updated.",
        });
      } else {
        toast({
          title: "Info",
          description: "New users are created through the authentication system. You can only edit existing users here.",
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
      await fetchData();
    } catch (error: any) {
      console.error('Error saving user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save user.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      full_name: user.full_name || "",
      user_type_id: user.user_types?.id || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // Just delete the profile, not the auth user
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "User Profile Deleted",
        description: "User profile has been removed from the system.",
        variant: "destructive"
      });
      
      await fetchData();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user.",
        variant: "destructive"
      });
    }
  };

  const getRoleBadge = (userType?: UserType) => {
    if (!userType) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <UserCog className="w-3 h-3" />
          No Role
        </Badge>
      );
    }

    const getVariant = (name: string) => {
      switch (name.toLowerCase()) {
        case 'admin':
        case 'administrator':
          return "destructive" as const;
        case 'instructor':
          return "default" as const;
        default:
          return "secondary" as const;
      }
    };

    return (
      <Badge variant={getVariant(userType.name)} className="flex items-center gap-1">
        <UserCog className="w-3 h-3" />
        {userType.name}
      </Badge>
    );
  };

  const getUserEmail = (userId: string) => {
    return 'Email not available';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getUserEmail(user.id).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === "all" || user.user_types?.id === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const stats = {
    total: users.length,
    withRoles: users.filter(u => u.user_types).length,
    withoutRoles: users.filter(u => !u.user_types).length
  };

  if (isLoading) {
    return (
      <AdminLayout title="User Management" subtitle="Manage system users and their roles">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="User Management" 
      subtitle="Manage system users and their roles"
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-card border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.withRoles}</div>
                <p className="text-xs text-muted-foreground">With Roles</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">{stats.withoutRoles}</div>
                <p className="text-xs text-muted-foreground">Without Roles</p>
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
                placeholder="Search users..." 
                className="pl-10 bg-background border-border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {userTypes.map(userType => (
                  <SelectItem key={userType.id} value={userType.id}>{userType.name}</SelectItem>
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
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card border-border">
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? "Edit User" : "Add New User"}
                </DialogTitle>
                <DialogDescription>
                  {editingUser 
                    ? "Update the user information below."
                    : "Users are created through authentication. You can only edit existing users here."
                  }
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="e.g., John Smith"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="user_type_id">Role</Label>
                  <Select 
                    value={formData.user_type_id} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, user_type_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Role</SelectItem>
                      {userTypes.map(userType => (
                        <SelectItem key={userType.id} value={userType.id}>{userType.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    disabled={isSubmitting || !editingUser}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update User"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Users Table */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="w-5 h-5 text-primary" />
              Users ({filteredUsers.length})
            </CardTitle>
            <CardDescription>
              Manage user accounts and their permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted/50">
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <UserCog className="w-8 h-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No users found</p>
                          <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                              <span className="text-xs font-medium text-white">
                                {getInitials(user.full_name)}
                              </span>
                            </div>
                            <div className="font-medium">{user.full_name || 'Unnamed User'}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">{getUserEmail(user.id)}</div>
                        </TableCell>
                        <TableCell>
                          {getRoleBadge(user.user_types)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString()}
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
                              <DropdownMenuItem onClick={() => handleEdit(user)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDelete(user.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Profile
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