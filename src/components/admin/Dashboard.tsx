import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  BookOpen,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share,
  ArrowUp,
  ArrowDown,
  Activity,
  Calendar,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDatabase } from "@/contexts/DatabaseContext";

interface DashboardProps {
  onNavigate: (section: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const {
    getTrendingStories,
    getMyStories,
    notifications,
    unreadCount,
    currentUser,
    isInitialized,
  } = useDatabase();

  const [stats, setStats] = useState({
    totalStories: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    trendingStories: [] as any[],
    recentActivity: [] as any[],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isInitialized) {
      loadDashboardData();
    }
  }, [isInitialized]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load stories data
      const [trendingStories, myStories] = await Promise.all([
        getTrendingStories(),
        getMyStories(),
      ]);

      // Calculate stats
      const totalViews = myStories.reduce(
        (sum, story) => sum + story.stats.views,
        0,
      );
      const totalLikes = myStories.reduce(
        (sum, story) => sum + story.stats.likes,
        0,
      );
      const totalComments = myStories.reduce(
        (sum, story) => sum + story.stats.comments,
        0,
      );

      // Create recent activity from notifications
      const recentActivity = notifications.slice(0, 5).map((notification) => ({
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        time: new Date(notification.createdAt),
        isRead: notification.isRead,
      }));

      setStats({
        totalStories: myStories.length,
        totalViews,
        totalLikes,
        totalComments,
        trendingStories: trendingStories.slice(0, 3),
        recentActivity,
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      // Fallback to demo data
      setStats({
        totalStories: 5,
        totalViews: 12547,
        totalLikes: 1834,
        totalComments: 456,
        trendingStories: [],
        recentActivity: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    color = "text-blue-400",
    onClick,
  }: {
    title: string;
    value: number | string;
    icon: any;
    trend?: "up" | "down";
    trendValue?: string;
    color?: string;
    onClick?: () => void;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="bg-gray-900 border-gray-700 cursor-pointer hover:border-gray-600 transition-colors"
        onClick={onClick}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">{title}</p>
              <p className={`text-2xl font-bold ${color}`}>
                {typeof value === "number" ? value.toLocaleString() : value}
              </p>
              {trend && trendValue && (
                <div
                  className={`flex items-center mt-1 text-sm ${
                    trend === "up" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {trend === "up" ? (
                    <ArrowUp className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDown className="w-3 h-3 mr-1" />
                  )}
                  <span>{trendValue}</span>
                </div>
              )}
            </div>
            <Icon className={`w-8 h-8 ${color}`} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "story_update":
        return <BookOpen className="w-4 h-4" />;
      case "friend_request":
        return <Users className="w-4 h-4" />;
      case "like":
        return <Heart className="w-4 h-4" />;
      case "comment":
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Dashboard</h2>
          <p className="text-gray-400 mt-1">
            Welcome back, {currentUser?.username || "Admin"}! Here's your story
            overview.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="border-green-600 text-green-400">
            <Activity className="w-3 h-3 mr-1" />
            Live
          </Badge>
          <Button
            variant="outline"
            onClick={() => loadDashboardData()}
            className="border-gray-600"
          >
            <Clock className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Stories"
          value={stats.totalStories}
          icon={BookOpen}
          trend="up"
          trendValue="+12%"
          color="text-purple-400"
          onClick={() => onNavigate("library")}
        />

        <StatCard
          title="Total Views"
          value={stats.totalViews}
          icon={Eye}
          trend="up"
          trendValue="+23%"
          color="text-blue-400"
        />

        <StatCard
          title="Total Likes"
          value={stats.totalLikes}
          icon={Heart}
          trend="up"
          trendValue="+8%"
          color="text-red-400"
        />

        <StatCard
          title="Comments"
          value={stats.totalComments}
          icon={MessageCircle}
          trend="down"
          trendValue="-3%"
          color="text-green-400"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Stories */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              <span>Trending Stories</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.trendingStories.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No trending stories yet</p>
                <Button
                  variant="outline"
                  className="mt-2 border-gray-600"
                  onClick={() => onNavigate("story")}
                >
                  Create Your First Story
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.trendingStories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors cursor-pointer"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        #{index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">
                        {story.title}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {story.stats.views}
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {story.stats.likes}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-400" />
              <span>Recent Activity</span>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="bg-red-500">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentActivity.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity</p>
                <p className="text-sm">
                  Activity will appear here as users interact with your stories
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                      activity.isRead
                        ? "bg-gray-800"
                        : "bg-blue-900/20 border border-blue-500/30"
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-gray-300">
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-medium">
                        {activity.title}
                      </h4>
                      <p className="text-gray-400 text-sm truncate">
                        {activity.message}
                      </p>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(activity.time)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => onNavigate("story")}
              className="bg-purple-600 hover:bg-purple-700 h-12"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Create New Story
            </Button>

            <Button
              onClick={() => onNavigate("import")}
              variant="outline"
              className="border-gray-600 h-12"
            >
              <Share className="w-4 h-4 mr-2" />
              Import Content
            </Button>

            <Button
              onClick={() => onNavigate("library")}
              variant="outline"
              className="border-gray-600 h-12"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer Stats */}
      <div className="text-center text-sm text-gray-400">
        <p>Last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}
