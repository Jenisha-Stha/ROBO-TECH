import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, Users, BarChart3, ArrowRight, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import UserProfile from "@/components/UserProfile";
import OAuthTest from "@/components/OAuthTest";

const Index = () => {
  const navigate = useNavigate();
  const { user, session } = useAuth();

  // If user is logged in, show their profile
  if (user && session) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary shadow-glow">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
            </div>

            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Welcome to LMS
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              You are successfully logged in. Here's your profile information:
            </p>
          </div>

          <UserProfile />

          <div className="flex justify-center gap-4">
            <Button
              className="bg-gradient-primary hover:opacity-90 transition-opacity"
              onClick={() => navigate('/admin')}
            >
              Go to Admin Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate('/login')}
            >
              Back to Auth
            </Button>
          </div>

          {/* Debug OAuth Test */}
          <div className="mt-8">
            <OAuthTest />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary shadow-glow">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            LMS Admin Portal
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Powerful learning management system with course creation, user management,
            analytics, and comprehensive admin controls.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="bg-gradient-card border-border hover:shadow-elevated transition-all duration-300 group">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-blue-500" />
              </div>
              <CardTitle>Course Management</CardTitle>
              <CardDescription>
                Create, edit, and organize courses with lessons, quizzes, and multimedia content
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-card border-border hover:shadow-elevated transition-all duration-300 group">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <CardTitle>User Administration</CardTitle>
              <CardDescription>
                Manage students, instructors, and administrators with role-based permissions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-card border-border hover:shadow-elevated transition-all duration-300 group">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-purple-500" />
              </div>
              <CardTitle>Analytics & Insights</CardTitle>
              <CardDescription>
                Track course performance, user engagement, and completion rates
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Admin Access */}
        <Card className="bg-gradient-card border-border max-w-md mx-auto mt-12">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-warning">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Admin Access Only</span>
            </div>

            <p className="text-sm text-muted-foreground">
              This portal requires administrator privileges. Only authorized users can access the dashboard.
            </p>

            <div className="space-y-2">
              <Button
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                onClick={() => navigate('/admin')}
              >
                Enter Admin Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/login')}
              >
                Sign In / Register
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground mt-8">
          Built with React, TypeScript, Tailwind CSS, and shadcn/ui
        </p>
      </div>
    </div>
  );
};

export default Index;
