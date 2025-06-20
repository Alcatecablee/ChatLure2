import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { RefreshCw, Database, Users, BookOpen, BarChart3 } from "lucide-react";

interface HealthStats {
  health: {
    status: string;
    database: string;
    test: boolean;
  };
  stats: {
    totalUsers: number;
    totalStories: number;
    activeStories: number;
    recentViews: number;
    avgRating: number;
    usersWithPremium: number;
    usersFree: number;
  };
  sampleData: {
    latestStory: any;
    latestUser: any;
  };
}

export default function DatabaseManager() {
  const [stats, setStats] = useState<HealthStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/health?action=stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch database stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      setTesting(true);
      const response = await fetch("/api/health?action=test-connection", {
        method: "POST",
      });
      const data = await response.json();
      setTestResults(data);
    } catch (error) {
      console.error("Database test failed:", error);
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Database className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Database Manager</h2>
        </div>
        <div className="text-center py-8">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading database information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Database Manager</h2>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchStats} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={testConnection}
            variant="outline"
            size="sm"
            disabled={testing}
          >
            {testing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <BarChart3 className="w-4 h-4 mr-2" />
            )}
            Test Connection
          </Button>
        </div>
      </div>

      {/* Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge
              variant={
                stats?.health.status === "healthy" ? "default" : "destructive"
              }
            >
              {stats?.health.status || "Unknown"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Connection: {stats?.health.database || "Unknown"}
            </span>
            <span className="text-sm text-muted-foreground">
              Test Query: {stats?.health.test ? "✅ Passed" : "❌ Failed"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stories</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.stats.totalStories}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.stats.activeStories} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.stats.usersWithPremium} premium
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Views</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.stats.recentViews}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.stats.avgRating || "0"}
            </div>
            <p className="text-xs text-muted-foreground">Out of 5.0</p>
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle>Connection Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Read Operations:</span>
                <Badge
                  variant={testResults.results.read ? "default" : "destructive"}
                >
                  {testResults.results.read ? "✅ Passed" : "❌ Failed"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Write Operations:</span>
                <Badge
                  variant={
                    testResults.results.write ? "default" : "destructive"
                  }
                >
                  {testResults.results.write ? "✅ Passed" : "❌ Failed"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Delete Operations:</span>
                <Badge
                  variant={
                    testResults.results.delete ? "default" : "destructive"
                  }
                >
                  {testResults.results.delete ? "✅ Passed" : "❌ Failed"}
                </Badge>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Overall Status:</span>
                <Badge
                  variant={testResults.allPassed ? "default" : "destructive"}
                >
                  {testResults.allPassed
                    ? "✅ All Tests Passed"
                    : "❌ Some Tests Failed"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sample Data */}
      {stats?.sampleData && (
        <Card>
          <CardHeader>
            <CardTitle>Sample Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.sampleData.latestStory && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Latest Story:</h4>
                  <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                    <p>
                      <strong>{stats.sampleData.latestStory.title}</strong> (
                      {stats.sampleData.latestStory.genre})
                    </p>
                    <p>{stats.sampleData.latestStory.description}</p>
                    <p className="text-xs mt-1">
                      ID: {stats.sampleData.latestStory.id} | Views:{" "}
                      {stats.sampleData.latestStory.stats?.views || 0}
                    </p>
                  </div>
                </div>
              )}

              {stats.sampleData.latestUser && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Latest User:</h4>
                  <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                    <p>
                      <strong>
                        {stats.sampleData.latestUser.firstName}{" "}
                        {stats.sampleData.latestUser.lastName}
                      </strong>
                    </p>
                    <p>{stats.sampleData.latestUser.email}</p>
                    <p className="text-xs mt-1">
                      ID: {stats.sampleData.latestUser.id} | Subscription:{" "}
                      {stats.sampleData.latestUser.subscription?.status ||
                        "free"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("/api/stories", "_blank")}
            >
              View Stories API
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("/api/users", "_blank")}
            >
              View Users API
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                window.open("/api/analytics?action=dashboard", "_blank")
              }
            >
              View Analytics API
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("/api/health", "_blank")}
            >
              View Health API
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
