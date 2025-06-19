import { useApp, useStories, useCredentials } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

interface DashboardProps {
  onNavigate: (section: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { addNotification } = useApp();
  const stories = useStories();
  const credentials = useCredentials();

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
    .slice(0, 3);

  const getConnectionStatus = () => {
    const connections = {
      reddit: credentials.reddit.enabled && credentials.reddit.clientId !== "",
      clerk:
        credentials.clerk.enabled && credentials.clerk.publishableKey !== "",
      paypal: credentials.paypal.enabled && credentials.paypal.clientId !== "",
    };

    const connected = Object.values(connections).filter(Boolean).length;
    const total = Object.keys(connections).length;

    return { connected, total, connections };
  };

  const connectionStatus = getConnectionStatus();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">📊 ChatLure Dashboard</h2>
        <p className="text-gray-300">Overview of your viral story empire</p>
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
                  {connectionStatus.total} services need configuration.
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <BookOpen className="text-blue-400" size={24} />
              </div>
              <span className="text-2xl font-bold text-blue-400">
                {activeStories.length}
              </span>
            </div>
            <h3 className="font-semibold text-white">Active Stories</h3>
            <p className="text-sm text-gray-400">
              {stories.length - activeStories.length} inactive
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <Users className="text-green-400" size={24} />
              </div>
              <span className="text-2xl font-bold text-green-400">
                {totalViews.toLocaleString()}
              </span>
            </div>
            <h3 className="font-semibold text-white">Total Views</h3>
            <p className="text-sm text-gray-400">Across all stories</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-500/20 p-3 rounded-lg">
                <TrendingUp className="text-orange-400" size={24} />
              </div>
              <span className="text-2xl font-bold text-orange-400">
                {avgViralScore}%
              </span>
            </div>
            <h3 className="font-semibold text-white">Avg Viral Score</h3>
            <p className="text-sm text-gray-400">
              {avgViralScore >= 80
                ? "Excellent"
                : avgViralScore >= 60
                  ? "Good"
                  : "Needs work"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <BarChart3 className="text-purple-400" size={24} />
              </div>
              <span className="text-2xl font-bold text-purple-400">
                {avgCompletionRate}%
              </span>
            </div>
            <h3 className="font-semibold text-white">Completion Rate</h3>
            <p className="text-sm text-gray-400">Users finishing stories</p>
          </CardContent>
        </Card>
      </div>

      {/* API Status Grid */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>🔌 API Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
              <Globe className="text-orange-400" size={20} />
              <div className="flex-1">
                <div className="font-medium">Reddit API</div>
                <div className="text-sm text-gray-400">Content Import</div>
              </div>
              {connectionStatus.connections.reddit ? (
                <Badge className="bg-green-500/20 text-green-400">
                  <CheckCircle size={12} className="mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline" className="text-gray-400">
                  Not configured
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
              <Shield className="text-green-400" size={20} />
              <div className="flex-1">
                <div className="font-medium">Clerk Auth</div>
                <div className="text-sm text-gray-400">User Management</div>
              </div>
              {connectionStatus.connections.clerk ? (
                <Badge className="bg-green-500/20 text-green-400">
                  <CheckCircle size={12} className="mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline" className="text-gray-400">
                  Not configured
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
              <CreditCard className="text-yellow-400" size={20} />
              <div className="flex-1">
                <div className="font-medium">PayPal</div>
                <div className="text-sm text-gray-400">Payments</div>
              </div>
              {connectionStatus.connections.paypal ? (
                <Badge className="bg-green-500/20 text-green-400">
                  <CheckCircle size={12} className="mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline" className="text-gray-400">
                  Not configured
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Stories */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>🔥 Top Performing Stories</CardTitle>
          </CardHeader>
          <CardContent>
            {topStories.length > 0 ? (
              <div className="space-y-3">
                {topStories.map((story, index) => (
                  <div
                    key={story.id}
                    className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                  >
                    <div>
                      <div className="font-semibold text-white">
                        {story.title}
                      </div>
                      <div className="text-sm text-gray-400">
                        {(story.stats?.views || 0).toLocaleString()} views •{" "}
                        {story.viralScore}% viral
                      </div>
                    </div>
                    <div className="text-2xl">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-6">
                <BookOpen size={32} className="mx-auto mb-2 opacity-50" />
                <p>No stories created yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate("story")}
                  className="mt-2"
                >
                  Create Your First Story
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>⚡ Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                onClick={() => onNavigate("story")}
                className="w-full bg-purple-600 hover:bg-purple-700 justify-start"
              >
                <Zap size={16} className="mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Create New Story</div>
                  <div className="text-sm text-purple-200">
                    Start building your next viral hit
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => onNavigate("import")}
                className="w-full bg-blue-600 hover:bg-blue-700 justify-start"
                disabled={!connectionStatus.connections.reddit}
              >
                <Globe size={16} className="mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Import from Reddit</div>
                  <div className="text-sm text-blue-200">
                    {connectionStatus.connections.reddit
                      ? "Source viral content automatically"
                      : "Configure Reddit API first"}
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => onNavigate("library")}
                className="w-full bg-green-600 hover:bg-green-700 justify-start"
              >
                <BookOpen size={16} className="mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Manage Library</div>
                  <div className="text-sm text-green-200">
                    Organize and analyze your stories
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
                    <div className="text-sm">
                      Configure remaining API connections
                    </div>
                  </div>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
