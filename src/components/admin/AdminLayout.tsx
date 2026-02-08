import { ReactNode, useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Bell, FileQuestion, FileQuestionIcon, MailQuestion, Search, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {

  const navigate = useNavigate();
  const extractYouTubeId = (url: string): string | null => {
    if (!url) return null;

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11) ? match[2] : null;
  };
  const { user, signOut, session, isLoading, isInitialized } = useAuth();
  const { loadUserData } = useAuthStore();



  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Update video modal state when user data is loaded
  useEffect(() => {
    if (user?.is_first_login === true) {
      setIsVideoModalOpen(true);
    }
  }, [user?.is_first_login]);

  // Use react query to get settings
  const { data: settings, isLoading: isSettingsLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => fetchSettings(),
  });

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();
    return data;
  };


  const openVideoModal = () => {
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = async () => {
    setIsVideoModalOpen(false);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          is_first_login: false,
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

      // Refresh the auth store with updated user data
      if (data && session?.user) {
        // Transform the data to match the expected structure
        const userType = Array.isArray(data.user_types) ? data.user_types[0] : data.user_types;
        const tag = Array.isArray(data.tags) ? data.tags[0] : data.tags;

        const transformedData = {
          ...data,
          is_first_login: data.is_first_login,
          user_type: userType ? {
            id: userType.id,
            name: userType.name
          } : undefined,
          tag: tag ? {
            id: tag.id,
            title: tag.title,
            slug: tag.slug
          } : undefined,
        };
        await loadUserData(session.user, transformedData);
      }

      toast({
        title: "Congratulations",
        description: "You can watch this video anytime you want by clicking the question button on the top right.",
        variant: "default",
      });

    } catch (error) {
      console.error("Error saving profile:", error);
    }

  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVideoModalOpen) {
        closeVideoModal();
      }
    };

    if (isVideoModalOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isVideoModalOpen]);

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AdminSidebar />

          <div className="flex-1 flex flex-col">
            {/* Top Header */}
            <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
              <div className="flex items-center justify-between h-full px-6">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="lg:hidden" />
                  {title && (
                    <div className="flex flex-col">
                      <h1 className="text-xl font-bold text-foreground">{title}</h1>
                      {subtitle && (
                        <p className="text-sm text-muted-foreground">{subtitle}</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  {/* <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      className="pl-10 w-64 bg-background border-border"
                    />
                  </div> */}


                  <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/admin/notifications')}>
                    <Bell className="w-5 h-5" />
                    {/* <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-xs flex items-center justify-center text-white">
                      3
                    </span> */}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={openVideoModal}
                  >
                    <FileQuestionIcon className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </header>

            {/* Main content */}
            <main className="flex-1 p-6 bg-gradient-subtle">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>

        {/* Video Modal */}
        {isVideoModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={closeVideoModal}
          >
            <div
              className="relative w-full max-w-4xl mx-4 bg-white rounded-lg shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Welcome Video
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeVideoModal}
                  className="rounded-full text-gray-900 hover:bg-gray-700"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Video Content */}
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${extractYouTubeId(settings?.url)}?autoplay=1&rel=0&modestbranding=1`}
                  title="Welcome Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-600 text-center">
                  You can watch this video anytime you want by clicking the question button on the top right.
                </p>
              </div>
            </div>
          </div>
        )}
      </SidebarProvider>
    </div>
  );
}