import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  Users,
  BookOpen,
  Bell,
  ArrowUpRight,
  Clock,
  MapPin,
} from "lucide-react";
import { useDatabase } from "@/contexts/DatabaseContext";

interface DashboardStats {
  totalStories: number;
  totalViews: number;
  totalUsers: number;
  activeStories: number;
  trendingStories: any[];
  recentActivity: any[];
}

export default function Dashboard() {
  const { getTrendingStories, notifications, currentUser, isInitialized } =
    useDatabase();

  const [stats, setStats] = useState<DashboardStats>({
    totalStories: 0,
    totalViews: 0,
    totalUsers: 0,
    activeStories: 0,
    trendingStories: [],
    recentActivity: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isInitialized) return;

    loadDashboardStats();
  }, [isInitialized]);

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true);

      // Get trending stories from database
      const trendingStories = await getTrendingStories();

      // Calculate stats from real data
      const totalViews = trendingStories.reduce(
        (sum, story) => sum + (story.stats?.views || 0),
        0,
      );
      const activeStories = trendingStories.filter(
        (story) => story.status === "published",
      ).length;

      // Get recent activity from notifications
      const recentActivity = notifications.slice(0, 5).map((notification) => ({
        id: notification.id,
        type: notification.type,
        message: notification.message,
        time: notification.createdAt,
        user: currentUser?.username || "Unknown User",
      }));

      setStats({
        totalStories: trendingStories.length,
        totalViews,
        totalUsers: 1, // For now, just current user
        activeStories,
        trendingStories: trendingStories.slice(0, 5),
        recentActivity,
      });
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string | Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="h-8 bg-gray-700 rounded mb-2"></div>
                <div className="h-6 bg-gray-700 rounded w-16"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Total Stories
                </p>
                <p className="text-2xl font-bold text-white">
                  {stats.totalStories.toLocaleString()}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Views</p>
                <p className="text-2xl font-bold text-white">
                  {stats.totalViews.toLocaleString()}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Active Users
                </p>
                <p className="text-2xl font-bold text-white">
                  {stats.totalUsers.toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Active Stories
                </p>
                <p className="text-2xl font-bold text-white">
                  {stats.activeStories.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Stories */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-400" />
              Trending Stories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.trendingStories.length === 0 ? (
                <p className="text-gray-400 text-center py-4">
                  No trending stories yet
                </p>
              ) : (
                stats.trendingStories.map((story) => (
                  <div
                    key={story.id}
                    className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">
                        {story.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">
                        {story.category} • {formatTimeAgo(story.createdAt)}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-400">
                            {story.stats?.views || 0}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-400">
                            {story.stats?.likes || 0}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-400">
                            {story.stats?.comments || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {story.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-400" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.length === 0 ? (
                <p className="text-gray-400 text-center py-4">
                  No recent activity
                </p>
              ) : (
                stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.user}`}
                      />
                      <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{activity.message}</p>
                      <p className="text-xs text-gray-400 flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimeAgo(activity.time)}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        activity.type === "story_update"
                          ? "text-green-400"
                          : activity.type === "system"
                            ? "text-blue-400"
                            : "text-gray-400"
                      }`}
                    >
                      {activity.type}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <BookOpen className="h-6 w-6" />
              <span>Create Story</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <TrendingUp className="h-6 w-6" />
              <span>View Analytics</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Users className="h-6 w-6" />
              <span>Manage Users</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Database</span>
              <Badge className="bg-green-500/20 text-green-400">
                {isInitialized ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Current User</span>
              <Badge className="bg-blue-500/20 text-blue-400">
                {currentUser?.username || "Not logged in"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Notifications</span>
              <Badge className="bg-purple-500/20 text-purple-400">
                {notifications.length} total
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
