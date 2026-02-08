import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  BookOpen,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  UserCog,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";

const navigationItems = [
  {
    title: "Profile",
    url: "/admin/profile",
    icon: UserCog,
  },
  {
    title: "Home",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Courses",
    url: "/admin/courses",
    icon: BookOpen,
  },
  {
    title: "Enrolled Courses",
    url: "/admin/enrolled-courses",
    icon: BookOpen,
  },
  {
    title: "Completed Courses",
    url: "/admin/completed-courses",
    icon: BookOpen,
  },
  {
    title: "Certificates",
    url: "/admin/certificates",
    icon: UserCog,
  },
  {
    title: "My Rank",
    url: "/admin/my-rank",
    icon: UserCog,
  },
  {
    title: "Assessments",
    url: "/admin/assessments",
    icon: UserCog,
  },

  // {
  //   title: "Settings",
  //   url: "/admin/settings",
  //   icon: Settings,
  //   description: "System Configuration",
  //   subItems: [
  //     {
  //       title: "Tag Types",
  //       url: "/admin/settings/tag-types",
  //       icon: Tags,
  //       description: "Manage Tag Categories"
  //     },
  //     {
  //       title: "Tags",
  //       url: "/admin/settings/tags",
  //       icon: Tag,
  //       description: "Manage Individual Tags"
  //     },
  //     {
  //       title: "User Types",
  //       url: "/admin/settings/user-types",
  //       icon: UserCog,
  //       description: "Manage User Roles"
  //     },
  //     {
  //       title: "Users",
  //       url: "/admin/settings/users",
  //       icon: Users,
  //       description: "User Management"
  //     },
  //     {
  //       title: "Permissions",
  //       url: "/admin/settings/permissions",
  //       icon: Key,
  //       description: "Manage Permissions"
  //     },
  //     {
  //       title: "Role Permissions",
  //       url: "/admin/settings/role-permissions",
  //       icon: Shield,
  //       description: "Assign Permissions to Roles"
  //     }
  //   ]
  // }
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const [expandedItems, setExpandedItems] = useState<string[]>(["Settings"]);
  const { user, signOut, session, isLoading, isInitialized } = useAuth();


  const navigate = useNavigate();

  // Don't render until auth is initialized
  if (!isInitialized || isLoading) {
    return (
      <Sidebar>
        <SidebarContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  const isActive = (path: string) => {
    if (path === "/admin") {
      return currentPath === "/admin";
    }
    return currentPath.startsWith(path);
  };

  const getNavClass = (path: string, isSubItem: boolean = false) => {
    const active = isActive(path);
    return `
      group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
      ${isSubItem ? "ml-4 pl-8" : ""}
      ${active
        ? "bg-gradient-primary text-white shadow-glow"
        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      }
    `;
  };

  const toggleExpanded = (itemTitle: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemTitle)
        ? prev.filter((item) => item !== itemTitle)
        : [...prev, itemTitle]
    );
  };

  if (
    user?.alias_name === undefined ||
    user?.tag_id === undefined ||
    user?.school_name === undefined
  ) {
    navigate("/admin/initial-setup");
  }
  return (
    <>
      {/* <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center">
        <div className="w-[70%] h-[70%]">
          <h2 className="text-2xl font-bold mb-4"> How To Use </h2>
          <div className="w-full h-full rounded-lg bg-white">
            <img src="/images/robo-tech.jpg" alt="logo" className="w-full h-full object-contain" />
          </div>
        </div>
      </div> */}
      <Sidebar
        className={`border-r border-sidebar-border transition-all duration-300 ${collapsed ? "w-16" : "w-64"
          }`}
      >
        <SidebarContent className="bg-sidebar">
          {/* Header */}
          <div className="flex items-center justify-center gap-3 p-2 border-b border-sidebar-border bg-white">
            <Link to="/" className="px-1">
              <img
                src="/images/robo-tech.jpg"
                alt="logo"
                className="w-24 h-full object-contain"
              />
            </Link>
            {/* <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-primary">
            <GraduationCap className="w-5 h-5 text-white" />
          </div> */}
            {!collapsed && (
              <div className="flex flex-col">
                {/* <span className="text-sm font-bold text-sidebar-foreground"> Dashboard </span> */}
                {/* <span className="text-xs text-muted-foreground">Learning Management</span> */}
              </div>
            )}
          </div>

          <Link
            to="/admin/profile"
            className="flex flex-col items-center gap-3 mb-0  hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer px-1 pt-2 pb-4 border-b border-sidebar-border"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center overflow-hidden">
              {/* <span className="text-xl font-medium text-white">
                {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}

              </span> */}
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={
                    session.user.user_metadata?.picture ||
                    session.user.user_metadata?.avatar_url
                  }
                  alt={user.full_name || "User"}
                />
                {/* <AvatarFallback>
                  <span className="text-xl font-medium text-white">
                    {user?.full_name?.charAt(0) ||
                      user?.email?.charAt(0) ||
                      "U"}
                  </span>
                </AvatarFallback> */}
              </Avatar>
            </div>
            {!collapsed && (
              <div className="flex flex-col flex-1 justify-center items-center">
                <span className="text-sm font-bold text-sidebar-foreground">
                  {user?.alias_name || "User"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {user?.school_name} | {user?.tag?.title}
                </span>
              </div>
            )}
          </Link>

          {/* Navigation */}
          <SidebarGroup className="flex-1 p-4">
            {/* <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
            {!collapsed && "Main Navigation"}
          </SidebarGroupLabel> */}

            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {navigationItems.map((item) => (
                  <div key={item.title}>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        {item.subItems ? (
                          <div
                            className={getNavClass(item.url)}
                            onClick={() =>
                              !collapsed && toggleExpanded(item.title)
                            }
                          >
                            <item.icon
                              className={`w-5 h-5 flex-shrink-0 ${isActive(item.url) ? "text-white" : ""
                                }`}
                            />
                            {!collapsed && (
                              <>
                                <div className="flex flex-col flex-1">
                                  <span className="text-sm">{item.title}</span>
                                  <span className="text-xs opacity-70">
                                    {item.description}
                                  </span>
                                </div>
                                <ChevronDown
                                  className={`w-4 h-4 transition-transform ${expandedItems.includes(item.title)
                                    ? "rotate-180"
                                    : ""
                                    }`}
                                />
                              </>
                            )}
                          </div>
                        ) : (
                          <NavLink
                            to={item.url}
                            className={getNavClass(item.url)}
                          >
                            <item.icon
                              className={`w-5 h-5 flex-shrink-0 ${isActive(item.url) ? "text-white" : ""
                                }`}
                            />
                            {!collapsed && (
                              <div className="flex flex-col">
                                <span className="text-sm">{item.title}</span>
                                <span className="text-xs opacity-70">
                                  {item.description}
                                </span>
                              </div>
                            )}
                            {isActive(item.url) && (
                              <div className="absolute right-0 w-1 h-8 bg-white rounded-l-full" />
                            )}
                          </NavLink>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Sub Items */}
                    {item.subItems &&
                      !collapsed &&
                      expandedItems.includes(item.title) && (
                        <div className="ml-4 mt-2 space-y-1">
                          {item.subItems.map((subItem) => (
                            <SidebarMenuItem key={subItem.title}>
                              <SidebarMenuButton asChild>
                                <NavLink
                                  to={subItem.url}
                                  className={getNavClass(subItem.url, true)}
                                >
                                  <subItem.icon
                                    className={`w-4 h-4 flex-shrink-0 ${isActive(subItem.url) ? "text-white" : ""
                                      }`}
                                  />
                                  <div className="flex flex-col">
                                    <span className="text-xs">
                                      {subItem.title}
                                    </span>
                                  </div>
                                  {isActive(subItem.url) && (
                                    <div className="absolute right-0 w-1 h-6 bg-white rounded-l-full" />
                                  )}
                                </NavLink>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* User info at bottom */}
          <div className="p-4 border-t border-sidebar-border">
            {!collapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            )}
          </div>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
