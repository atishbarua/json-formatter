import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { MetricsCard } from "@/components/metrics-card";
import { VisitorChart } from "@/components/visitor-chart";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Users,
  Calendar,
  MousePointerClick,
  ArrowLeft,
  LogOut,
  Loader2,
  Lock,
  BarChart3,
} from "lucide-react";
import type { Analytics, DailyStats } from "@shared/schema";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const res = await apiRequest("POST", "/api/admin/login", credentials);
      return res.json();
    },
    onSuccess: () => {
      setIsLoggedIn(true);
      toast({
        title: "Welcome",
        description: "Successfully logged in to admin dashboard.",
      });
    },
    onError: () => {
      toast({
        title: "Login failed",
        description: "Invalid username or password.",
        variant: "destructive",
      });
    },
  });

  const { data: analytics, isLoading } = useQuery<Analytics>({
    queryKey: ["/api/admin/analytics"],
    enabled: isLoggedIn,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
  };

  const getDailyStats = (): DailyStats[] => {
    if (!analytics?.dailyVisitors) return [];
    
    const stats: DailyStats[] = Object.entries(analytics.dailyVisitors)
      .map(([date, visitors]) => ({ date, visitors }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-14);
    
    return stats;
  };

  const getTodayVisitors = (): number => {
    if (!analytics?.dailyVisitors) return 0;
    const today = new Date().toISOString().split("T")[0];
    return analytics.dailyVisitors[today] || 0;
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Enter your credentials to access the dashboard
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  data-testid="input-username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  data-testid="input-password"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
                data-testid="button-login"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link href="/">
                <Button variant="ghost" size="sm" data-testid="link-back-home">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to JSON Formatter
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="link-back-formatter">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to JSON Formatter
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <MetricsCard
                title="Total Visitors"
                value={analytics?.totalVisitors?.toLocaleString() || "0"}
                icon={Users}
                description="All-time page views"
              />
              <MetricsCard
                title="Today's Visitors"
                value={getTodayVisitors().toLocaleString()}
                icon={Calendar}
                description="Unique visits today"
              />
              <MetricsCard
                title="Ad Clicks"
                value={analytics?.adClicks?.toLocaleString() || "0"}
                icon={MousePointerClick}
                description="Total ad interactions"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VisitorChart
                data={getDailyStats()}
                title="Visitor Trend (Last 14 Days)"
                type="line"
              />
              <VisitorChart
                data={getDailyStats()}
                title="Daily Visitors"
                type="bar"
              />
            </div>

            {analytics?.lastUpdated && (
              <p className="text-sm text-muted-foreground text-center mt-8">
                Last updated: {new Date(analytics.lastUpdated).toLocaleString()}
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
