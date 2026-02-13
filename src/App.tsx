import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { useSupabaseConnection } from "@/hooks/useSupabaseConnection";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CoursesPage from "./pages/admin/CoursesPage";
import RecentCoursesPage from "./pages/admin/RecentCoursesPage";
import CourseViewPage from "./pages/admin/CourseViewPage";
import LessonsPage from "./pages/admin/LessonsPage";
import QuestionsPage from "./pages/admin/QuestionsPage";
import TagTypesPage from "./pages/admin/settings/TagTypesPage";
import TagsPage from "./pages/admin/settings/TagsPage";
import UsersPage from "./pages/admin/settings/UsersPage";
import UserTypesPage from "./pages/admin/settings/UserTypesPage";
import PermissionsPage from "./pages/admin/settings/PermissionsPage";
import RolePermissionsPage from "./pages/admin/settings/RolePermissionsPage";
import CoursesPlay from "./pages/admin/courses/play/CoursesPlay";
import CoursesQuiz from "./pages/admin/courses/quiz/CoursesQuiz";
import QuestionsPlay from "./pages/admin/courses/lessons/questions/QuestionsPlay";
import InitialSetup from "./pages/admin/InitialSetup";
import Instructions from "./pages/admin/courses/lessons/instructions/Instructions";
import Profile from "./pages/admin/Profile";
import EnrolledCoursesPage from "./pages/admin/EnrolledCoursesPage";
import HomePage from "./pages/HomePage";
import OurCourses from "./pages/OurCourses";
import ViewCourse from "./pages/our-courses/[id]/view-course";
import CompletedCoursesPage from "./pages/admin/CompletedCoursesPage";
import LessonDetails from "./pages/admin/LessonDetails";
import AboutUs from "./pages/AboutUs";
import BecomeOurPartnerSchool from "./pages/become-our-partner-school";
import RegistrationTypePage from './pages/RegistrationTypePage';
import IndividualRegistrationPage from './pages/IndividualRegistrationPage';
import SchoolRegistrationPage from './pages/SchoolRegistrationPage';
import { useSessionRefresh } from "./hooks/useSessionRefresh";
import Certificates from "./pages/admin/Certificates";
import ViewCertificate from "./pages/admin/ViewCertificate";
import Rank from "./pages/admin/rank/Rank";
import Assessments from "./pages/admin/assessments/Assessment";
import Notifications from "./pages/admin/notifications/Notifications";
import ScrollToTop from "./components/layout/ScrollToTop";

const queryClient = new QueryClient();
// Auth wrapper using Supabase
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { session, user, isLoading } = useAuth();
  // Initialize session refresh for authenticated users
  useSessionRefresh();
  // console.log('RequireAuth state:', { session: !!session, user: !!user, isLoading });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return session && user ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => {
  // Initialize connection monitoring
  // useSupabaseConnection();

  useEffect(() => {
    const clickSound = new Audio('/sounds/clicking.mp3');
    clickSound.volume = 0.4;

    const handleGlobalClick = () => {
      clickSound.currentTime = 0;
      clickSound.play().catch(err => console.debug('Audio play failed:', err));
    };

    window.addEventListener('click', handleGlobalClick, true);
    return () => window.removeEventListener('click', handleGlobalClick, true);
  }, []);

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* <Route path="/" element={<Index />} /> */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/our-courses" element={<OurCourses />} />
              <Route path="/become-our-partner-school" element={<BecomeOurPartnerSchool />} />
              <Route path="/our-courses/:courseId" element={<ViewCourse />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<RegistrationTypePage />} />
              <Route path="/register/individual" element={<IndividualRegistrationPage />} />
              <Route path="/register/school" element={<SchoolRegistrationPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/admin/my-rank" element={<Rank />} />
              <Route path="/admin/assessments" element={<Assessments />} />
              <Route path="/admin/notifications" element={<Notifications />} />

              {/* Admin Dashboard */}
              <Route path="/admin" element={
                <RequireAuth>
                  <AdminDashboard />
                </RequireAuth>
              } />

              {/* Admin Dashboard */}
              <Route path="/admin/initial-setup" element={
                <RequireAuth>
                  <InitialSetup />
                </RequireAuth>
              } />

              {/* Course Management */}
              <Route path="/admin/courses" element={
                <RequireAuth>
                  {/* <ProtectedRoute> */}
                  <CoursesPage />
                  {/* </ProtectedRoute> */}
                </RequireAuth>
              } />
              <Route path="/admin/courses/new" element={
                <RequireAuth>
                  {/* <ProtectedRoute> */}
                  <RecentCoursesPage />
                  {/* </ProtectedRoute> */}
                </RequireAuth>
              } />
              {/*Enrolled Courses */}
              <Route path="/admin/enrolled-courses" element={
                <>

                  {/* <ProtectedRoute> */}
                  <EnrolledCoursesPage />
                  {/* </ProtectedRoute> */}

                </>
              } />
              {/*Certificates */}
              <Route path="/admin/certificates" element={
                <>

                  {/* <ProtectedRoute> */}
                  <Certificates />
                  {/* </ProtectedRoute> */}

                </>
              } />
              {/*View Certificates */}
              <Route path="/admin/certificates/:courseId" element={
                <>

                  {/* <ProtectedRoute> */}
                  <ViewCertificate />
                  {/* </ProtectedRoute> */}

                </>
              } />
              <Route path="/admin/lessons/:courseId" element={
                <RequireAuth>
                  {/* <ProtectedRoute> */}
                  <LessonsPage />
                  {/* </ProtectedRoute> */}
                </RequireAuth>
              } />
              <Route path="/admin/lesson-detail/:lessonId" element={
                <RequireAuth>
                  <ProtectedRoute>
                    <LessonDetails />
                  </ProtectedRoute>
                </RequireAuth>
              } />
              {/*Completed Courses */}
              <Route path="/admin/completed-courses" element={
                <RequireAuth>
                  <ProtectedRoute>
                    <CompletedCoursesPage />
                  </ProtectedRoute>
                </RequireAuth>
              } />
              {/* Course Management */}
              <Route path="/admin/profile" element={
                <RequireAuth>
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                </RequireAuth>
              } />
              <Route path="/admin/courses/:courseId" element={
                <RequireAuth>
                  <ProtectedRoute>
                    <CourseViewPage />
                  </ProtectedRoute>
                </RequireAuth>
              } />
              <Route path="/admin/courses/:courseId/play" element={
                <RequireAuth>
                  <ProtectedRoute>
                    <CoursesPlay />
                  </ProtectedRoute>
                </RequireAuth>
              } />
              <Route path="/admin/courses/:courseId/quiz" element={
                <RequireAuth>
                  <ProtectedRoute>
                    <CoursesQuiz />
                  </ProtectedRoute>
                </RequireAuth>
              } />
              <Route path="/admin/courses/:courseId/lessons" element={
                <RequireAuth>
                  <ProtectedRoute
                  // requiredPermission="view_lessons"
                  >
                    <LessonsPage />
                  </ProtectedRoute>
                </RequireAuth>
              } />
              <Route path="/admin/courses/:courseId/lessons/:lessonId/questions" element={
                <RequireAuth>
                  <ProtectedRoute
                  // requiredPermission="view_lessons"
                  >
                    <QuestionsPlay />
                    {/* <QuestionsPage /> */}
                  </ProtectedRoute>
                </RequireAuth>
              } />

              <Route path="/admin/courses/:courseId/lessons/:lessonId/instructions" element={
                <RequireAuth>
                  <ProtectedRoute
                  // requiredPermission="view_lessons"
                  >
                    <Instructions />
                  </ProtectedRoute>
                </RequireAuth>
              } />
              {/* Settings - General */}
              <Route path="/admin/settings/tag-types" element={
                <RequireAuth>
                  <ProtectedRoute
                  // requiredPermission="manage_tag_types"
                  >
                    <TagTypesPage />
                  </ProtectedRoute>
                </RequireAuth>
              } />
              <Route path="/admin/settings/tags" element={
                <RequireAuth>
                  <ProtectedRoute
                  // requiredPermission="manage_tags"
                  >
                    <TagsPage />
                  </ProtectedRoute>
                </RequireAuth>
              } />

              {/* Settings - User Management */}
              <Route path="/admin/settings/users" element={
                <RequireAuth>
                  <ProtectedRoute
                  // requiredPermission="view_users"
                  >
                    <UsersPage />
                  </ProtectedRoute>
                </RequireAuth>
              } />
              <Route path="/admin/settings/user-types" element={
                <RequireAuth>
                  <ProtectedRoute
                  // requiredPermission="manage_user_types"
                  >
                    <UserTypesPage />
                  </ProtectedRoute>
                </RequireAuth>
              } />

              {/* Settings - RBAC */}
              <Route path="/admin/settings/permissions" element={
                <RequireAuth>
                  <ProtectedRoute
                  // requiredPermission="manage_permissions"
                  >
                    <PermissionsPage />
                  </ProtectedRoute>
                </RequireAuth>
              } />
              <Route path="/admin/settings/role-permissions" element={
                <RequireAuth>
                  <ProtectedRoute
                  // requiredPermission="manage_role_permissions"
                  >
                    <RolePermissionsPage />
                  </ProtectedRoute>
                </RequireAuth>
              } />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
};

export default App;
