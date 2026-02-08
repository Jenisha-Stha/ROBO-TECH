import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Tag,
  CheckCircle,
  Clock,
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

interface TagData {
  id: string;
  tagtype_id: string;
  title: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  tag_type?: {
    id: string;
    name: string;
  };
}

interface TagType {
  id: string;
  name: string;
  description?: string;
}

export default function TagsPage() {
  const [tags, setTags] = useState<TagData[]>([]);
  const [tagTypes, setTagTypes] = useState<TagType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTagType, setFilterTagType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    tagtype_id: "",
    title: "",
    is_approved: true
  });

  // Fetch tags from Supabase
  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select(`
          *,
          tag_type:tag_types (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tags. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Fetch tag types from Supabase
  const fetchTagTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('tag_types')
        .select('*')
        .order('name');

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
      await Promise.all([fetchTags(), fetchTagTypes()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const resetForm = () => {
    setFormData({
      tagtype_id: "",
      title: "",
      is_approved: true
    });
    setEditingTag(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingTag) {
        // Update existing tag
        const { error } = await supabase
          .from('tags')
          .update({
            tagtype_id: formData.tagtype_id,
            title: formData.title,
            is_approved: formData.is_approved
          })
          .eq('id', editingTag.id);

        if (error) throw error;

        toast({
          title: "Tag Updated",
          description: "Tag has been successfully updated.",
        });
      } else {
        // Create new tag
        const { error } = await supabase
          .from('tags')
          .insert({
            tagtype_id: formData.tagtype_id,
            title: formData.title,
            is_approved: formData.is_approved
          });

        if (error) throw error;

        toast({
          title: "Tag Created",
          description: "New tag has been successfully created.",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchTags();
    } catch (error) {
      console.error('Error submitting tag:', error);
      toast({
        title: "Error",
        description: "Failed to save tag. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (tag: TagData) => {
    setEditingTag(tag);
    setFormData({
      tagtype_id: tag.tagtype_id,
      title: tag.title,
      is_approved: tag.is_approved
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Tag Deleted",
        description: "Tag has been permanently deleted.",
        variant: "destructive"
      });

      fetchTags();
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast({
        title: "Error",
        description: "Failed to delete tag. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleApproval = async (id: string, is_approved: boolean) => {
    try {
      const { error } = await supabase
        .from('tags')
        .update({ is_approved })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: is_approved ? "Tag Approved" : "Tag Unapproved",
        description: `Tag has been ${is_approved ? "approved" : "unapproved"}.`,
      });

      fetchTags();
    } catch (error) {
      console.error('Error updating tag approval:', error);
      toast({
        title: "Error",
        description: "Failed to update tag approval. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getTagTypeName = (tagtype_id: string) => {
    return tagTypes.find(tt => tt.id === tagtype_id)?.name || "Unknown";
  };

  const filteredTags = tags.filter(tag => {
    const matchesSearch = tag.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTagType = filterTagType === "all" || tag.tagtype_id === filterTagType;

    const matchesStatus = filterStatus === "all" ||
      (filterStatus === "approved" && tag.is_approved) ||
      (filterStatus === "pending" && !tag.is_approved);

    return matchesSearch && matchesTagType && matchesStatus;
  });

  const pendingCount = tags.filter(tag => !tag.is_approved).length;

  // if (loading) {
  //   return (
  //     <AdminLayout title="Tags Management" subtitle="Loading tags...">
  //       <div className="flex items-center justify-center py-8">
  //         <Loader2 className="w-8 h-8 animate-spin text-primary" />
  //       </div>
  //     </AdminLayout>
  //   );
  // }

  return (
    <AdminLayout
      title="Tags Management"
      subtitle="Manage individual tags and their approval status"
    >
      <div className="space-y-6">
        {/* Stats */}
        {pendingCount > 0 && (
          <Card className="bg-warning/10 border-warning/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-warning" />
                <div>
                  <p className="text-sm font-medium">Pending Approval</p>
                  <p className="text-xs text-muted-foreground">
                    {pendingCount} tag{pendingCount !== 1 ? 's' : ''} waiting for approval
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tags..."
                className="pl-10 bg-background border-border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={filterTagType} onValueChange={setFilterTagType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tag Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {tagTypes.map(tagType => (
                  <SelectItem key={tagType.id} value={tagType.id}>
                    {tagType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
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
                Create Tag
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] bg-card border-border">
              <DialogHeader>
                <DialogTitle>
                  {editingTag ? "Edit Tag" : "Create New Tag"}
                </DialogTitle>
                <DialogDescription>
                  {editingTag
                    ? "Update the tag information below."
                    : "Create a new tag for categorizing courses."
                  }
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tagtype_id">Tag Type *</Label>
                  <Select
                    value={formData.tagtype_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, tagtype_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tag type" />
                    </SelectTrigger>
                    <SelectContent>
                      {tagTypes.map(tagType => (
                        <SelectItem key={tagType.id} value={tagType.id}>
                          {tagType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Tag Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., JavaScript"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_approved"
                    checked={formData.is_approved}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_approved: checked }))}
                  />
                  <Label htmlFor="is_approved">Approved</Label>
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
                  <Button type="submit" className="bg-gradient-primary hover:opacity-90" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {editingTag ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        {editingTag ? "Update" : "Create"} Tag
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tags Table */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-primary" />
              Tags ({filteredTags.length})
            </CardTitle>
            <CardDescription>
              Manage individual tags that can be assigned to courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted/50">
                    <TableHead>Tag</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTags.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Tag className="w-8 h-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No tags found</p>
                          <p className="text-sm text-muted-foreground">Create your first tag to get started</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTags.map((tag) => (
                      <TableRow key={tag.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="font-medium">{tag.title}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {tag.tag_type?.name || getTagTypeName(tag.tagtype_id)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {tag.is_approved ? (
                              <Badge variant="default" className="bg-success text-success-foreground">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Approved
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {new Date(tag.created_at).toLocaleDateString()}
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
                              <DropdownMenuItem onClick={() => handleEdit(tag)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleApproval(tag.id, !tag.is_approved)}
                              >
                                {tag.is_approved ? (
                                  <>
                                    <Clock className="w-4 h-4 mr-2" />
                                    Unapprove
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Approve
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Courses
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(tag.id)}
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