import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useApp,
  useStories,
  useCredentials,
  useUsers,
} from "@/contexts/AppContext";
import { APIClient } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Users,
  TrendingUp,
  BarChart3,
  Zap,
  Globe,
  CreditCard,
  Shield,
  CheckCircle,
  AlertTriangle,
  Settings,
  Eye,
  Share2,
  MessageSquare,
  Clock,
  Activity,
  Target,
  Flame,
  Calendar,
  Filter,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Download,
  Play,
  Pause,
} from "lucide-react";

interface DashboardProps {
  onNavigate: (section: string) => void;
}

interface PerformanceMetric {
  label: string;
  value: number;
  change: number;
  trend: "up" | "down" | "stable";
  format: "number" | "percentage" | "currency" | "time";
}

interface RealtimeData {
  activeUsers: number;
  storiesBeingRead: number;
  engagementRate: number;
  newSubscriptions: number;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { addNotification } = useApp();
  const stories = useStories();
  const credentials = useCredentials();
  const users = useUsers();

  const [timeRange, setTimeRange] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("views");
  const [realtimeData, setRealtimeData] = useState<RealtimeData>({
    activeUsers: 0,
    storiesBeingRead: 0,
    engagementRate: 0,
    newSubscriptions: 0,
  });
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<
    PerformanceMetric[]
  >([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Update realtime data with real database queries
  useEffect(() => {
    if (!isLiveMode) return;

    const fetchRealtimeData = async () => {
      try {
        const data = await APIClient.getDashboardMetrics();

        // Calculate active stories being read (popular stories with good engagement)
        const activeStoriesBeingRead =
          stories.filter(
            (story) => story.stats?.views > 100 && story.viralScore > 50,
          ).length || Math.min(stories.length, 2); // Show at least 2 if available

        // Calculate current engagement rate from real rating data
        const engagementRate = data.avgRating
          ? (data.avgRating / 5.0) * 100
          : 0;

        // Estimate new subscriptions based on premium users
        const premiumUsers = users.filter(
          (user) => user.subscription?.status === "premium",
        ).length;

        setRealtimeData({
          activeUsers: data.totalUsers,
          storiesBeingRead: activeStoriesBeingRead,
          engagementRate: engagementRate,
          newSubscriptions: premiumUsers,
        });
      } catch (error) {
        console.error("Failed to fetch realtime data:", error);
        // Keep existing data if fetch fails
      }
    };

    // Fetch immediately
    fetchRealtimeData();

    // Then fetch every 5 seconds for real updates
    const interval = setInterval(fetchRealtimeData, 5000);

    return () => clearInterval(interval);
  }, [isLiveMode, stories, users]);

  // Fetch real dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await APIClient.getDashboardMetrics();
        setDashboardData(data);

        // Calculate active stories being read (popular stories with good engagement)
        const activeStoriesBeingRead =
          stories.filter(
            (story) => story.stats?.views > 100 && story.viralScore > 50,
          ).length || Math.min(stories.length, 2); // Show at least 2 if available

        // Calculate current engagement rate from real rating data
        const engagementRate = data.avgRating
          ? (data.avgRating / 5.0) * 100
          : 0;

        // Estimate new subscriptions based on premium users
        const premiumUsers = users.filter(
          (user) => user.subscription?.status === "premium",
        ).length;

        // Update realtime data with real values
        setRealtimeData({
          activeUsers: data.totalUsers,
          storiesBeingRead: activeStoriesBeingRead,
          engagementRate: engagementRate,
          newSubscriptions: premiumUsers,
        });

        // Create real performance metrics from API data
        const realMetrics: PerformanceMetric[] = [
          {
            label: "Total Stories",
            value: data.totalStories,
            change: 0, // We don't have historical data yet
            trend: "stable",
            format: "number",
          },
          {
            label: "Active Users",
            value: data.totalUsers,
            change: 0,
            trend: "stable",
            format: "number",
          },
          {
            label: "Recent Views",
            value: data.recentViews,
            change: 0,
            trend: "stable",
            format: "number",
          },
          {
            label: "Average Rating",
            value: data.avgRating,
            change: 0,
            trend: "stable",
            format: "rating",
          },
        ];

        setPerformanceMetrics(realMetrics);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Keep using local stories data as fallback
      }
    };

    fetchDashboardData();
  }, [stories, users]);

  // Generate real activity data from stories and users
  useEffect(() => {
    if (stories.length > 0 || users.length > 0) {
      const activities: any[] = [];

      // Add recent stories as activities
      const recentStories = stories
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 2);

      recentStories.forEach((story, index) => {
        activities.push({
          id: `story_${story.id}`,
          type: "story_created",
          title: `New story created: "${story.title}"`,
          time: formatTimeAgo(story.createdAt),
          icon: BookOpen,
          color: "text-green-400",
        });
      });

      // Add high-performing stories
      const topStories = stories
        .filter((story) => story.stats?.views > 500)
        .sort((a, b) => b.stats.views - a.stats.views)
        .slice(0, 1);

      topStories.forEach((story) => {
        activities.push({
          id: `viral_${story.id}`,
          type: "viral_alert",
          title: `Story "${story.title}" hit ${story.stats.views.toLocaleString()}+ views!`,
          time: "Recent",
          icon: Flame,
          color: "text-orange-400",
        });
      });

      // Add user milestones
      const premiumUsers = users.filter(
        (user) => user.subscription?.status === "premium",
      );
      if (premiumUsers.length > 0) {
        activities.push({
          id: "users_premium",
          type: "subscription",
          title: `${premiumUsers.length} premium subscribers active`,
          time: "Today",
          icon: CreditCard,
          color: "text-purple-400",
        });
      }

      // Add engagement data
      if (dashboardData?.avgRating > 4.0) {
        activities.push({
          id: "rating_high",
          type: "engagement",
          title: `High user satisfaction: ${dashboardData.avgRating.toFixed(1)}/5.0 average rating`,
          time: "This week",
          icon: TrendingUp,
          color: "text-blue-400",
        });
      }

      // Add user milestone
      if (users.length >= 4) {
        activities.push({
          id: "user_milestone",
          type: "user_milestone",
          title: `Reached ${users.length} active users`,
          time: "Current",
          icon: Users,
          color: "text-cyan-400",
        });
      }

      setRecentActivity(activities.slice(0, 5)); // Limit to 5 activities
    }
  }, [stories, users, dashboardData]);

  // Helper function to format time ago
  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Calculate connection status based on real credentials
  const connectionStatus = {
    connections: {
      reddit:
        credentials?.reddit?.enabled && credentials?.reddit?.clientId !== "",
      clerk:
        credentials?.clerk?.enabled &&
        credentials?.clerk?.publishableKey !== "",
      paypal:
        credentials?.paypal?.enabled && credentials?.paypal?.clientId !== "",
    },
    connected: 0,
    total: 3,
  };

  connectionStatus.connected = Object.values(
    connectionStatus.connections,
  ).filter(Boolean).length;

  // Calculate real story statistics
  const activeStories = stories.filter((story) => story.isActive);
  const totalViews = stories.reduce(
    (sum, story) => sum + (story.stats?.views || 0),
    0,
  );
  const avgViralScore =
    stories.length > 0
      ? Math.round(
          stories.reduce((sum, story) => sum + story.viralScore, 0) /
            stories.length,
        )
      : 0;
  const avgCompletionRate =
    stories.length > 0
      ? Math.round(
          stories.reduce(
            (sum, story) => sum + (story.stats?.completions || 0),
            0,
          ) / stories.length,
        )
      : 0;

  // Get top performing stories
  const topStories = stories
    .sort((a, b) => (b.stats?.views || 0) - (a.stats?.views || 0))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">📊 ChatLure Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time insights into your viral story empire
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${isLiveMode ? "bg-green-400 animate-pulse" : "bg-muted-foreground"}`}
            />
            <span className="text-sm text-muted-foreground">
              {isLiveMode ? "Live" : "Static"}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLiveMode(!isLiveMode)}
            className="border-border"
          >
            {isLiveMode ? (
              <>
                <Pause size={14} className="mr-1" />
                Pause Live
              </>
            ) : (
              <>
                <Play size={14} className="mr-1" />
                Go Live
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" className="border-border">
            <Download size={14} className="mr-1" />
            Export
          </Button>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-24 bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">1D</SelectItem>
              <SelectItem value="7d">7D</SelectItem>
              <SelectItem value="30d">30D</SelectItem>
              <SelectItem value="90d">90D</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Connection Status Alert */}
      {connectionStatus.connected < connectionStatus.total && (
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="text-orange-400" size={20} />
              <div className="flex-1">
                <h4 className="font-medium text-foreground">
                  API Configuration Needed
                </h4>
                <p className="text-sm text-muted-foreground">
                  {connectionStatus.total - connectionStatus.connected} of{" "}
                  {connectionStatus.total} services need configuration to unlock
                  full potential.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate("settings")}
                className="border-border"
              >
                <Settings size={14} className="mr-1" />
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real-time Metrics */}
      <AnimatePresence>
        {isLiveMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Active Users
                    </p>
                    <motion.p
                      key={realtimeData.activeUsers}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-bold text-foreground"
                    >
                      {realtimeData.activeUsers.toLocaleString()}
                    </motion.p>
                  </div>
                  <Activity className="text-muted-foreground" size={20} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Reading Stories
                    </p>
                    <motion.p
                      key={realtimeData.storiesBeingRead}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-bold text-foreground"
                    >
                      {realtimeData.storiesBeingRead}
                    </motion.p>
                  </div>
                  <BookOpen className="text-muted-foreground" size={20} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Engagement Rate
                    </p>
                    <motion.p
                      key={Math.round(realtimeData.engagementRate)}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-bold text-foreground"
                    >
                      {realtimeData.engagementRate.toFixed(1)}%
                    </motion.p>
                  </div>
                  <Target className="text-muted-foreground" size={20} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      New Subscriptions
                    </p>
                    <motion.p
                      key={realtimeData.newSubscriptions}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-bold text-foreground"
                    >
                      +{realtimeData.newSubscriptions}
                    </motion.p>
                  </div>
                  <CreditCard className="text-muted-foreground" size={20} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Performance Metrics */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="text-primary" />
            <span>Performance Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">
                    {metric.label}
                  </p>
                  <div className="flex items-center space-x-1">
                    {metric.trend === "up" && (
                      <ArrowUp size={12} className="text-green-400" />
                    )}
                    {metric.trend === "down" && (
                      <ArrowDown
                        size={12}
                        className={
                          metric.change > 0 ? "text-green-400" : "text-red-400"
                        }
                      />
                    )}
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {metric.format === "percentage"
                    ? `${metric.value}%`
                    : metric.format === "currency"
                      ? `$${metric.value.toLocaleString()}`
                      : metric.format === "rating"
                        ? `${metric.value.toFixed(1)}/5.0`
                        : metric.value.toLocaleString()}
                </div>
                <Progress value={(metric.value / 100) * 100} className="mt-2" />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Story Overview */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="text-primary" />
                <span>Story Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-6 text-center">
                <div className="text-center">
                  <div className="bg-muted/20 p-3 rounded-lg mb-2 mx-auto w-fit">
                    <BookOpen className="text-muted-foreground" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {activeStories.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Active Stories
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stories.length - activeStories.length} inactive
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-muted/20 p-3 rounded-lg mb-2 mx-auto w-fit">
                    <Eye className="text-muted-foreground" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {totalViews.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Views
                  </div>
                  <div className="text-xs text-muted-foreground">All time</div>
                </div>

                <div className="text-center">
                  <div className="bg-muted/20 p-3 rounded-lg mb-2 mx-auto w-fit">
                    <Flame className="text-muted-foreground" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {avgViralScore}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Avg Viral Score
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {avgViralScore >= 80
                      ? "🔥 Excellent"
                      : avgViralScore >= 60
                        ? "👍 Good"
                        : "📈 Improving"}
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-muted/20 p-3 rounded-lg mb-2 mx-auto w-fit">
                    <Target className="text-muted-foreground" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {avgCompletionRate}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Completion Rate
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Users finishing
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Stories */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="text-primary" />
                <span>Top Performing Stories</span>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate("library")}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {topStories.length > 0 ? (
                <div className="space-y-3">
                  {topStories.map((story, index) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-accent/50 rounded-lg hover:bg-accent/70 transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-xl">
                          {index === 0
                            ? "🥇"
                            : index === 1
                              ? "🥈"
                              : index === 2
                                ? "🥉"
                                : "🏆"}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {story.title}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center space-x-2">
                            <span>
                              {(story.stats?.views || 0).toLocaleString()} views
                            </span>
                            <span>•</span>
                            <span>{story.viralScore}% viral</span>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">
                              {story.genre}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm">
                          <Eye size={14} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 size={14} />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <BookOpen size={32} className="mx-auto mb-3 opacity-50" />
                  <p className="mb-2">No stories created yet</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate("story")}
                    className="border-border"
                  >
                    Create Your First Story
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* API Status */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">🔌 System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-accent/50 rounded">
                <div className="flex items-center space-x-2">
                  <Globe className="text-muted-foreground" size={16} />
                  <span className="text-sm">Reddit API</span>
                </div>
                {connectionStatus.connections.reddit ? (
                  <Badge className="bg-green-500/20 text-green-400 text-xs">
                    <CheckCircle size={10} className="mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-muted-foreground text-xs cursor-pointer"
                    onClick={() => onNavigate("settings")}
                  >
                    Setup Required
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between p-2 bg-accent/50 rounded">
                <div className="flex items-center space-x-2">
                  <Shield className="text-primary" size={16} />
                  <span className="text-sm">Clerk Auth</span>
                </div>
                {connectionStatus.connections.clerk ? (
                  <Badge className="bg-green-500/20 text-green-400 text-xs">
                    <CheckCircle size={10} className="mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-muted-foreground text-xs cursor-pointer"
                    onClick={() => onNavigate("settings")}
                  >
                    Setup Required
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between p-2 bg-accent/50 rounded">
                <div className="flex items-center space-x-2">
                  <CreditCard className="text-primary" size={16} />
                  <span className="text-sm">PayPal</span>
                </div>
                {connectionStatus.connections.paypal ? (
                  <Badge className="bg-green-500/20 text-green-400 text-xs">
                    <CheckCircle size={10} className="mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-muted-foreground text-xs cursor-pointer"
                    onClick={() => onNavigate("settings")}
                  >
                    Setup Required
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">⚡ Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => onNavigate("story")}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 justify-start"
              >
                <Zap size={16} className="mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Create Story</div>
                  <div className="text-sm opacity-90">
                    Build your next viral hit
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => onNavigate("import")}
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 justify-start"
                disabled={!connectionStatus.connections.reddit}
              >
                <Globe size={16} className="mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Import from Reddit</div>
                  <div className="text-sm opacity-90">
                    {connectionStatus.connections.reddit
                      ? "Auto-source viral content"
                      : "Configure Reddit API first"}
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => onNavigate("library")}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/80 justify-start"
              >
                <BookOpen size={16} className="mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Manage Library</div>
                  <div className="text-sm opacity-90">
                    Organize your collection
                  </div>
                </div>
              </Button>

              {connectionStatus.connected < connectionStatus.total && (
                <Button
                  onClick={() => onNavigate("settings")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Settings size={16} className="mr-2" />
                  <div className="text-left">
                    <div className="font-semibold">Complete Setup</div>
                    <div className="text-sm">Configure remaining APIs</div>
                  </div>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">📈 Recent Activity</CardTitle>
              <Button variant="ghost" size="sm">
                <RefreshCw size={14} />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3 p-2 hover:bg-accent/30 rounded transition-colors"
                    >
                      <div className={`p-1 rounded ${activity.color}`}>
                        <activity.icon size={12} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Activity size={32} className="mx-auto mb-3 opacity-50" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
