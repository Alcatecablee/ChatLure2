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
    activeUsers: 1247,
    storiesBeingRead: 89,
    engagementRate: 94.2,
    newSubscriptions: 23,
  });
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Update realtime data
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      setRealtimeData((prev) => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
        storiesBeingRead:
          prev.storiesBeingRead + Math.floor(Math.random() * 4) - 2,
        engagementRate: Math.max(
          0,
          Math.min(100, prev.engagementRate + (Math.random() - 0.5) * 2),
        ),
        newSubscriptions: prev.newSubscriptions + (Math.random() > 0.8 ? 1 : 0),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveMode]);

  // Fetch real dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await APIClient.getDashboardMetrics();
        setDashboardData(data);

        // Update realtime data with real values
        setRealtimeData({
          activeUsers: data.totalUsers,
          storiesBeingRead: data.activeStories,
          engagementRate: data.avgRating * 20, // Convert 5-point scale to percentage
          newSubscriptions: Math.floor(data.totalUsers * 0.1), // Estimate based on total users
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
  }, []);

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
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffHours > 0)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffMinutes > 0) return `${diffMinutes} min ago`;
    return "Just now";
  };

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
            (sum, story) => sum + (story.stats?.completionRate || 0),
            0,
          ) / stories.length,
        )
      : 0;

  const topStories = stories
    .sort((a, b) => (b.stats?.views || 0) - (a.stats?.views || 0))
    .slice(0, 5);

  const getConnectionStatus = () => {
    // Safely access credentials with fallbacks
    const connections = {
      reddit:
        credentials?.reddit?.enabled && credentials?.reddit?.clientId !== "",
      clerk:
        credentials?.clerk?.enabled &&
        credentials?.clerk?.publishableKey !== "",
      paypal:
        credentials?.paypal?.enabled && credentials?.paypal?.clientId !== "",
    };

    const connected = Object.values(connections).filter(Boolean).length;
    const total = Object.keys(connections).length;

    return { connected, total, connections };
  };

  const connectionStatus = getConnectionStatus();

  const [performanceMetrics, setPerformanceMetrics] = useState<
    PerformanceMetric[]
  >([]);

  const formatMetricValue = (value: number, format: string) => {
    switch (format) {
      case "currency":
        return `$${value.toLocaleString()}`;
      case "percentage":
        return `${value}%`;
      case "time":
        return `${value}m`;
      case "rating":
        return `${value.toFixed(1)}/5.0`;
      default:
        return value.toLocaleString();
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUp size={12} className="text-green-400" />;
      case "down":
        return <ArrowDown size={12} className="text-red-400" />;
      default:
        return <div className="w-3 h-3 bg-gray-400 rounded-full" />;
    }
  };

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Simulate some dynamic behavior for demo purposes
  useEffect(() => {
    // Add some randomness to make the mock data feel more realistic
    const updateMockData = () => {
      // Slightly vary the real-time data periodically
      if (isLiveMode) {
        setRealtimeData((prev) => ({
          activeUsers: Math.max(
            1000,
            prev.activeUsers + Math.floor(Math.random() * 20) - 10,
          ),
          storiesBeingRead: Math.max(
            50,
            prev.storiesBeingRead + Math.floor(Math.random() * 8) - 4,
          ),
          engagementRate: Math.max(
            80,
            Math.min(100, prev.engagementRate + (Math.random() - 0.5) * 2),
          ),
          newSubscriptions: Math.max(
            0,
            prev.newSubscriptions + (Math.random() > 0.7 ? 1 : 0),
          ),
        }));
      }
    };

    const interval = setInterval(updateMockData, 5000);
    return () => clearInterval(interval);
  }, [isLiveMode]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">📊 ChatLure Dashboard</h2>
          <p className="text-gray-300">
            Real-time insights into your viral story empire
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${isLiveMode ? "bg-green-400 animate-pulse" : "bg-gray-400"}`}
            />
            <span className="text-sm text-gray-400">
              {isLiveMode ? "Live" : "Static"}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLiveMode(!isLiveMode)}
            className="border-gray-600"
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
          <Button variant="outline" size="sm" className="border-gray-600">
            <Download size={14} className="mr-1" />
            Export
          </Button>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-24 bg-gray-800 border-gray-600">
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
        <Card className="bg-yellow-900/20 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="text-yellow-400" size={20} />
              <div className="flex-1">
                <h4 className="font-medium text-yellow-400">
                  API Configuration Needed
                </h4>
                <p className="text-sm text-gray-300">
                  {connectionStatus.total - connectionStatus.connected} of{" "}
                  {connectionStatus.total} services need configuration to unlock
                  full potential.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate("settings")}
                className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
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
            <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-300">Active Users</p>
                    <motion.p
                      key={realtimeData.activeUsers}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-bold text-blue-400"
                    >
                      {realtimeData.activeUsers.toLocaleString()}
                    </motion.p>
                  </div>
                  <Activity className="text-blue-400" size={20} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-300">Reading Stories</p>
                    <motion.p
                      key={realtimeData.storiesBeingRead}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-bold text-green-400"
                    >
                      {realtimeData.storiesBeingRead}
                    </motion.p>
                  </div>
                  <BookOpen className="text-green-400" size={20} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-300">Engagement Rate</p>
                    <motion.p
                      key={Math.round(realtimeData.engagementRate)}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-bold text-purple-400"
                    >
                      {realtimeData.engagementRate.toFixed(1)}%
                    </motion.p>
                  </div>
                  <Target className="text-purple-400" size={20} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border-orange-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-300">New Subscriptions</p>
                    <motion.p
                      key={realtimeData.newSubscriptions}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-bold text-orange-400"
                    >
                      +{realtimeData.newSubscriptions}
                    </motion.p>
                  </div>
                  <CreditCard className="text-orange-400" size={20} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-400">{metric.label}</p>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(metric.trend)}
                    <span
                      className={`text-xs ${
                        metric.trend === "up"
                          ? "text-green-400"
                          : metric.trend === "down"
                            ? "text-red-400"
                            : "text-gray-400"
                      }`}
                    >
                      {metric.change > 0 ? "+" : ""}
                      {metric.change}%
                    </span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatMetricValue(metric.value, metric.format)}
                </p>
                <Progress
                  value={Math.abs(metric.change) * 5}
                  className="mt-2 h-1"
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stories Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Core Stats */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="text-blue-400" />
                <span>Story Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="bg-blue-500/20 p-3 rounded-lg mb-2 mx-auto w-fit">
                    <BookOpen className="text-blue-400" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-blue-400">
                    {activeStories.length}
                  </div>
                  <div className="text-sm text-gray-400">Active Stories</div>
                  <div className="text-xs text-gray-500">
                    {stories.length - activeStories.length} inactive
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-green-500/20 p-3 rounded-lg mb-2 mx-auto w-fit">
                    <Eye className="text-green-400" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    {totalViews.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Total Views</div>
                  <div className="text-xs text-gray-500">All time</div>
                </div>

                <div className="text-center">
                  <div className="bg-orange-500/20 p-3 rounded-lg mb-2 mx-auto w-fit">
                    <Flame className="text-orange-400" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-orange-400">
                    {avgViralScore}%
                  </div>
                  <div className="text-sm text-gray-400">Avg Viral Score</div>
                  <div className="text-xs text-gray-500">
                    {avgViralScore >= 80
                      ? "🔥 Excellent"
                      : avgViralScore >= 60
                        ? "👍 Good"
                        : "📈 Improving"}
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-purple-500/20 p-3 rounded-lg mb-2 mx-auto w-fit">
                    <Target className="text-purple-400" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-purple-400">
                    {avgCompletionRate}%
                  </div>
                  <div className="text-sm text-gray-400">Completion Rate</div>
                  <div className="text-xs text-gray-500">Users finishing</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Stories */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="text-orange-400" />
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
                      className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors group"
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
                          <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {story.title}
                          </div>
                          <div className="text-sm text-gray-400 flex items-center space-x-2">
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
                <div className="text-center text-gray-400 py-8">
                  <BookOpen size={32} className="mx-auto mb-3 opacity-50" />
                  <p className="mb-2">No stories created yet</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate("story")}
                    className="border-gray-600"
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
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg">🔌 System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                <div className="flex items-center space-x-2">
                  <Globe className="text-orange-400" size={16} />
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
                    className="text-gray-400 text-xs cursor-pointer"
                    onClick={() => onNavigate("settings")}
                  >
                    Setup Required
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                <div className="flex items-center space-x-2">
                  <Shield className="text-green-400" size={16} />
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
                    className="text-gray-400 text-xs cursor-pointer"
                    onClick={() => onNavigate("settings")}
                  >
                    Setup Required
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                <div className="flex items-center space-x-2">
                  <CreditCard className="text-yellow-400" size={16} />
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
                    className="text-gray-400 text-xs cursor-pointer"
                    onClick={() => onNavigate("settings")}
                  >
                    Setup Required
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg">⚡ Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => onNavigate("story")}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 justify-start"
              >
                <Zap size={16} className="mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Create Story</div>
                  <div className="text-sm text-purple-200">
                    Build your next viral hit
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => onNavigate("import")}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 justify-start"
                disabled={!connectionStatus.connections.reddit}
              >
                <Globe size={16} className="mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Import from Reddit</div>
                  <div className="text-sm text-blue-200">
                    {connectionStatus.connections.reddit
                      ? "Auto-source viral content"
                      : "Configure Reddit API first"}
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => onNavigate("library")}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 justify-start"
              >
                <BookOpen size={16} className="mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Manage Library</div>
                  <div className="text-sm text-green-200">
                    Organize your collection
                  </div>
                </div>
              </Button>

              {connectionStatus.connected < connectionStatus.total && (
                <Button
                  onClick={() => onNavigate("settings")}
                  variant="outline"
                  className="w-full border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 justify-start"
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
          <Card className="bg-gray-800 border-gray-700">
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
                      className="flex items-start space-x-3 p-2 hover:bg-gray-700/30 rounded transition-colors"
                    >
                      <div className={`p-1 rounded ${activity.color}`}>
                        <activity.icon size={12} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <Activity size={32} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No recent activity</p>
                    <p className="text-xs">
                      Activity will appear as you use the platform
                    </p>
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
