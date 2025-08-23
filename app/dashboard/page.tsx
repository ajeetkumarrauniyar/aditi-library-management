"use client";

import { ProtectedRoute } from "@/components/auth";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Users,
  Building2,
  Activity,
  TrendingUp,
  TrendingDown,
  Download,
  MoreHorizontal,
  Plus,
  CalendarDays,
  DollarSign,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  // Mock data for super admin dashboard
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      trend: "up",
      icon: DollarSign,
      description: "from last month",
    },
    {
      title: "Organizations",
      value: "2,350",
      change: "+180.1%",
      trend: "up",
      icon: Building2,
      description: "from last month",
    },
    {
      title: "Total Users",
      value: "+12,234",
      change: "+19%",
      trend: "up",
      icon: Users,
      description: "from last month",
    },
    {
      title: "Active Now",
      value: "+573",
      change: "+201",
      trend: "up",
      icon: Activity,
      description: "since last hour",
    },
  ];

  const recentOrganizations = [
    {
      id: 1,
      name: "Acme University Library",
      domain: "acme-uni.library.com",
      status: "Active",
      users: 1234,
      books: 45678,
      createdAt: "2024-01-15",
      plan: "Enterprise",
    },
    {
      id: 2,
      name: "City Public Library",
      domain: "city-public.library.com",
      status: "Active",
      users: 856,
      books: 23456,
      createdAt: "2024-01-10",
      plan: "Professional",
    },
    {
      id: 3,
      name: "Tech Institute Library",
      domain: "tech-inst.library.com",
      status: "Pending",
      users: 234,
      books: 12345,
      createdAt: "2024-01-20",
      plan: "Basic",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      user: "Sarah Johnson",
      action: "Created new organization",
      target: "Downtown Library",
      time: "2 minutes ago",
      avatar: "SJ",
    },
    {
      id: 2,
      user: "Mike Chen",
      action: "Updated user permissions",
      target: "University Library",
      time: "5 minutes ago",
      avatar: "MC",
    },
    {
      id: 3,
      user: "Emma Davis",
      action: "Exported analytics report",
      target: "System Analytics",
      time: "10 minutes ago",
      avatar: "ED",
    },
    {
      id: 4,
      user: "Alex Rodriguez",
      action: "Suspended organization",
      target: "Old Town Library",
      time: "15 minutes ago",
      avatar: "AR",
    },
  ];

  return (
    <ProtectedRoute>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Super Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.firstName || "Super Admin"}! Here&apos;s what&apos;s happening
              with your library system.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Organization
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-muted-foreground flex items-center text-xs">
                      {stat.trend === "up" ? (
                        <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                      )}
                      {stat.change} {stat.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts and Activity */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue across all organizations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground flex h-[300px] items-center justify-center rounded-lg border-2 border-dashed">
                    <div className="text-center">
                      <CalendarDays className="mx-auto mb-4 h-12 w-12" />
                      <p>Revenue Chart</p>
                      <p className="text-sm">Integrate with your preferred charting library</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system activities and changes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-4">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{activity.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{activity.user}</p>
                          <p className="text-muted-foreground text-xs">
                            {activity.action} • {activity.target}
                          </p>
                          <p className="text-muted-foreground text-xs">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Organizations Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Organizations</CardTitle>
                    <CardDescription>Latest organizations added to the system</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organization</TableHead>
                      <TableHead>Domain</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Books</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrganizations.map((org) => (
                      <TableRow key={org.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{org.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{org.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{org.domain}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{org.plan}</Badge>
                        </TableCell>
                        <TableCell>{org.users.toLocaleString()}</TableCell>
                        <TableCell>{org.books.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={org.status === "Active" ? "default" : "secondary"}
                            className={org.status === "Active" ? "bg-green-100 text-green-800" : ""}
                          >
                            {org.status === "Active" && <CheckCircle className="mr-1 h-3 w-3" />}
                            {org.status === "Pending" && <Clock className="mr-1 h-3 w-3" />}
                            {org.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{org.createdAt}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organizations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Organization Management</CardTitle>
                <CardDescription>Manage all library organizations in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-12 text-center">
                  <Building2 className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                  <h3 className="mb-2 text-lg font-semibold">Organizations Management</h3>
                  <p className="text-muted-foreground mb-4">
                    This section will contain comprehensive organization management tools
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Organization
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage users across all organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-12 text-center">
                  <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                  <h3 className="mb-2 text-lg font-semibold">User Management</h3>
                  <p className="text-muted-foreground mb-4">
                    This section will contain comprehensive user management tools
                  </p>
                  <Button>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Manage Users
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Analytics</CardTitle>
                <CardDescription>Comprehensive analytics across all organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-12 text-center">
                  <Activity className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                  <h3 className="mb-2 text-lg font-semibold">Analytics Dashboard</h3>
                  <p className="text-muted-foreground mb-4">
                    This section will contain detailed analytics and reporting tools
                  </p>
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Management</CardTitle>
                <CardDescription>System settings, security, and maintenance tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-12 text-center">
                  <AlertTriangle className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                  <h3 className="mb-2 text-lg font-semibold">System Tools</h3>
                  <p className="text-muted-foreground mb-4">
                    This section will contain system administration and maintenance tools
                  </p>
                  <Button variant="outline">Access System Tools</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
