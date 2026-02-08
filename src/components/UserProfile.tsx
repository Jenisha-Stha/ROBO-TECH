import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, User, Mail, Shield, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast, useToast } from "@/hooks/use-toast";

const UserProfile = () => {
  const { user, session } = useAuth();
  const { signOut } = useAuthStore();
  const { toast } = useToast();

  const [aliasName, setAliasName] = useState(user?.alias_name || "");
  const [schoolName, setSchoolName] = useState(user?.school_name || "");
  const [courseTagId, setCourseTagId] = useState(user?.tag_id || null);
  const [courses, setCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState("-");
  const [mobileNumber, setMobileNumber] = useState(user?.mobile || "");
  const [address, setAddress] = useState(user?.address || "");
  const [parentName, setParentName] = useState(user?.parents_name || "");
  const [password, setPassword] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase.from("tags").select("*").eq('is_erased', false).eq('is_active', true);
      // .eq('tag_id', user?.tag_id);
      if (error) {
        console.error("Error fetching courses:", error);
      } else {
        setCourses(data);
        // console.log(data);
      }
    };
    fetchCourses();
    // console.log(courses?.find((c) => c.id == courseTagId)?.title);
    setCurrentCourse(courses?.find((c) => c.id == courseTagId)?.title);
  }, []);

  if (!user || !session) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSave = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          alias_name: aliasName,
          school_name: schoolName,
          tag_id: courseTagId,
          mobile: mobileNumber,
          address: address,
          parents_name: parentName,
        })
        .eq("id", user.id)
        .select(`
          id,
          full_name,
          avatar_url,
          user_type_id,
          school_name,
          tag_id,
          alias_name,
          mobile,
          address,
          parents_name,
          is_first_login,
          avatar_url,
          user_types (
            id,
            name
          ),
          tags (
            id,
            title,
            slug
          )
        `)
        .single();

      if (error) {
        console.error("Error updating profile:", error);
        return;
      }

      // Update local state
      setAliasName(data?.alias_name || "");
      setSchoolName(data?.school_name || "");
      setMobileNumber(data?.mobile || "");
      setAddress(data?.address || "");
      setParentName(data?.parents_name || "");
      setCurrentCourse(courses?.find((c) => c.id == courseTagId)?.title);

      // Refresh the auth store with updated user data
      const { loadUserData } = useAuthStore.getState();

      // Transform the data to match the expected structure
      const transformedData = {
        ...data,
        user_type: data.user_types ? {
          id: (data.user_types as any).id,
          name: (data.user_types as any).name
        } : undefined,
        tag: data.tags ? {
          id: (data.tags as any).id,
          title: (data.tags as any).title,
          slug: (data.tags as any).slug
        } : undefined,
        permissions: [] // Add empty permissions array
      };


      await loadUserData(session.user, transformedData);

      // Show success message
      // toast({
      //   title: "Profile updated successfully!",
      //   variant: "default",
      // });

      toast({
        title: "Profile updated successfully!",
        description: "Changes have been saved to your session.",
        variant: "default",
      });


      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };
  // console.log({ session })
  return (
    <Card className="w-full max-w-md mx-auto border border-gray-500/30 shadow-lg shadow-gray-500/25 p-4">
      {/* Header */}
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={session.user.user_metadata?.picture || session.user.user_metadata?.avatar_url}
              alt={user.full_name || "User"}
            />
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-xl">{user.full_name || "User"}</CardTitle>
        <CardDescription className="flex items-center justify-center gap-2 mt-2">
          <Mail className="h-4 w-4" />
          {user.email}
        </CardDescription>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-4">
        {/* Role (read-only) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Role:</span>
          </div>
          <Badge
            variant={
              user.user_type?.name === "admin" ? "destructive" : "secondary"
            }
          >
            {user.user_type?.name || "Student"}
          </Badge>
        </div>

        {/* Editable Fields */}
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="alias">Alias Name</Label>
              <Input
                id="alias"
                value={aliasName}
                onChange={(e) => setAliasName(e.target.value)}
                placeholder="Enter your alias name"
              />
            </div>

            <div>
              <Label htmlFor="school">School Name</Label>
              <Input
                id="school"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Enter your school name"
              />
            </div>
            <div>
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter your mobile number"
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
              />
            </div>

            <div>
              <Label htmlFor="parent">Parent's Name</Label>
              <Input
                id="parent"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Enter parent's name"
              />
            </div>

            <div>
              <Label htmlFor="course">Class</Label>
              <select
                id="course"
                value={courseTagId}
                onChange={(e) => setCourseTagId(e.target.value)}
                className="mt-1 block w-full rounded border bg-black px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
                {
                  courses?.map((course) => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))
                }

              </select>
            </div>

            {/* <div>
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div> */}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Student Name:</span>
              <Badge variant="secondary">{aliasName || "-"}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">School's Name</span>
              <Badge variant="secondary">{schoolName || "-"}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Mobile Number:</span>
              <Badge variant="secondary">{mobileNumber || "-"}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Address:</span>
              <Badge variant="secondary">{address || "-"}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Grades:</span>
              <Badge variant="secondary">{user?.tag?.title || "-"}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Parent's Name:</span>
              <Badge variant="secondary">{parentName || "-"}</Badge>
            </div>
          </>
        )}

        {/* Buttons */}
        <div className="flex gap-2 pt-4">
          {isEditing ? (
            <>
              <Button className="w-full" onClick={handleSave}>
                Save Changes
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>

        <div className="pt-2">
          <Button
            onClick={handleSignOut}
            variant="destructive"
            className="w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
