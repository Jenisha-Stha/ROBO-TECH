import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  TrendingUp,
  Award,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle
} from "lucide-react";

const statsCards = [
  {
    title: "Total Courses Taken",
    value: "24",
    change: "+3 this month",
    icon: BookOpen,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  {
    title: "Active Users",
    value: "1,847",
    change: "+12% from last month",
    icon: Users,
    color: "text-green-500",
    bgColor: "bg-green-500/10"
  },
  {
    title: "Completion Rate",
    value: "89.2%",
    change: "+5.1% improvement",
    icon: Award,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10"
  },
  {
    title: "New Signups (7d)",
    value: "147",
    change: "+23% from previous week",
    icon: TrendingUp,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10"
  }
];

const recentActivities = [
  {
    id: 1,
    user: "Sarah Johnson",
    action: "completed",
    course: "Advanced React Patterns",
    time: "2 hours ago",
    type: "completion"
  },
  {
    id: 2,
    user: "Mike Chen",
    action: "enrolled in",
    course: "JavaScript Fundamentals",
    time: "4 hours ago",
    type: "enrollment"
  },
  {
    id: 3,
    user: "Emily Davis",
    action: "started lesson",
    course: "UI/UX Design Principles",
    time: "6 hours ago",
    type: "progress"
  },
  {
    id: 4,
    user: "Alex Rodriguez",
    action: "completed quiz in",
    course: "Python for Beginners",
    time: "8 hours ago",
    type: "quiz"
  },
  {
    id: 5,
    user: "Lisa Wang",
    action: "earned certificate for",
    course: "Data Structures & Algorithms",
    time: "1 day ago",
    type: "certificate"
  }
];

const popularCourses = [
  {
    id: 1,
    title: "React.js Complete Guide",
    students: 432,
    completion: 92,
    type: "paid",
    thumbnail: "🚀"
  },
  {
    id: 2,
    title: "JavaScript ES6+ Features",
    students: 387,
    completion: 88,
    type: "free",
    thumbnail: "⚡"
  },
  {
    id: 3,
    title: "Node.js Backend Development",
    students: 299,
    completion: 76,
    type: "paid",
    thumbnail: "🛠️"
  },
  {
    id: 4,
    title: "CSS Grid & Flexbox",
    students: 256,
    completion: 94,
    type: "free",
    thumbnail: "🎨"
  }
];

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
          <p className="text-muted-foreground">Monitor your learning management system</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="bg-gradient-card border-border hover:shadow-elevated transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        {/* <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest user actions and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{activity.user}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>{" "}
                      <span className="font-medium">{activity.course}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  {activity.type === "completion" && (
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}

        {/* Popular Courses */}
        {/* <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Popular Courses
            </CardTitle>
            <CardDescription>Top performing courses by enrollment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularCourses.map((course) => (
                <div key={course.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">
                    {course.thumbnail}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {course.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {course.students} students
                      </span>
                      <Badge
                        variant={course.type === "paid" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {course.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{course.completion}%</p>
                    <p className="text-xs text-muted-foreground">completion</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}