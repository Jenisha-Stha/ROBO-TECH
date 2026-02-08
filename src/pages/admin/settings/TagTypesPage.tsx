import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Tags,
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

interface TagType {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export default function TagTypesPage() {
  const [tagTypes, setTagTypes] = useState<TagType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTagType, setEditingTagType] = useState<TagType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  // Fetch tag types from Supabase
  const fetchTagTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('tag_types')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTagTypes(data || []);
    } catch (error) {
      console.error('Error fetching tag types:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tag types. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchTagTypes();
      setLoading(false);
    };
    loadData();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      description: ""
    });
    setEditingTagType(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingTagType) {
        // Update existing tag type
        const { error } = await supabase
          .from('tag_types')
          .update({
            name: formData.name,
            description: formData.description || null
          })
          .eq('id', editingTagType.id);

        if (error) throw error;

        toast({
          title: "Tag Type Updated",
          description: "Tag type has been successfully updated.",
        });
      } else {
        // Create new tag type
        const { error } = await supabase
          .from('tag_types')
          .insert({
            name: formData.name,
            description: formData.description || null
          });

        if (error) throw error;

        toast({
          title: "Tag Type Created",
          description: "New tag type has been successfully created.",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchTagTypes();
    } catch (error: any) {
      console.error('Error submitting tag type:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save tag type. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (tagType: TagType) => {
    setEditingTagType(tagType);
    setFormData({
      name: tagType.name,
      description: tagType.description || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // Check if tag type is being used by any tags
      const { data: tagsUsingType, error: checkError } = await supabase
        .from('tags')
        .select('id')
        .eq('tagtype_id', id)
        .limit(1);

      if (checkError) throw checkError;

      if (tagsUsingType && tagsUsingType.length > 0) {
        toast({
          title: "Cannot Delete",
          description: "This tag type is being used by existing tags. Please remove or reassign the tags first.",
          variant: "destructive"
        });
        return;
      }

      // Delete the tag type
      const { error } = await supabase
        .from('tag_types')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Tag Type Deleted",
        description: "Tag type has been successfully deleted.",
      });

      fetchTagTypes();
    } catch (error: any) {
      console.error('Error deleting tag type:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete tag type. Please try again.",
        variant: "destructive"
      });
    }
  };

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const filteredTagTypes = tagTypes.filter(tt =>
    tt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tt.description && tt.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <AdminLayout
        title="Tag Types Management"
        subtitle="Manage tag categories and their configurations"
      >
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading tag types...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Tag Types Management"
      subtitle="Manage tag categories and their configurations"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tag types..."
                className="pl-10 bg-background border-border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-gradient-primary hover:opacity-90 transition-opacity"
                onClick={resetForm}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Tag Type
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] bg-card border-border">
              <DialogHeader>
                <DialogTitle>
                  {editingTagType ? "Edit Tag Type" : "Create New Tag Type"}
                </DialogTitle>
                <DialogDescription>
                  {editingTagType
                    ? "Update the tag type information below."
                    : "Create a new tag type category for organizing tags."
                  }
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tag Type Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Programming Languages"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this tag type category..."
                    rows={3}
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-primary hover:opacity-90"
                    disabled={submitting}
                  >
                    {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {editingTagType ? "Update" : "Create"} Tag Type
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tag Types Table */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tags className="w-5 h-5 text-primary" />
              Tag Types ({filteredTagTypes.length})
            </CardTitle>
            <CardDescription>
              Manage tag type categories that will be used to organize individual tags
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted/50">
                    <TableHead>Tag Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTagTypes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Tags className="w-8 h-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No tag types found</p>
                          <p className="text-sm text-muted-foreground">Create your first tag type to get started</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTagTypes.map((tagType) => (
                      <TableRow key={tagType.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="font-medium">{tagType.name}</div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate text-muted-foreground">
                            {tagType.description || "No description"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {new Date(tagType.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {new Date(tagType.updated_at).toLocaleDateString()}
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
                              <DropdownMenuItem onClick={() => handleEdit(tagType)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Tags
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(tagType.id)}
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