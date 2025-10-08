import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StoryCreator } from "@/components/admin/StoryCreator";
import { ContentImporter } from "@/components/admin/ContentImporter";
import { StoryLibrary } from "@/components/admin/StoryLibrary";
import { Settings } from "@/components/admin/Settings";
import { Dashboard } from "@/components/admin/Dashboard";
import AIStoryGenerator from "@/components/admin/AIStoryGenerator";
import { NotificationCenter } from "@/components/ui/notification-center";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
  useCredentials,
  useUsers,
  useApp,
  useLoading,
  useAppConfig,
} from "@/contexts/AppContext";
import {
  BarChart3,
  Users,
  CreditCard,
  Bell,
  Settings as SettingsIcon,
  AlertTriangle,
  BookOpen,
  Upload,
  Download,
  Archive,
  TrendingUp,
  Menu,
  X,
  Sparkles,
  Search,
  Activity,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APIClient } from "@/lib/api-client";

const sections = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: BarChart3,
    color: "text-blue-400",
    description: "Overview and analytics",
  },
  {
    key: "library",
    label: "Story Library",
    icon: Archive,
    color: "text-purple-400",
    description: "Manage your stories",
  },
  {
    key: "ai-generator",
    label: "AI Story Generator",
    icon: Sparkles,
    color: "text-purple-400",
    description: "Generate stories with AI",
  },
  {
    key: "story",
    label: "Story Creator",
    icon: BookOpen,
    color: "text-green-400",
    description: "Create new content",
  },
  {
    key: "import",
    label: "Content Import",
    icon: Upload,
    color: "text-cyan-400",
    description: "Import from Reddit",
  },
  {
    key: "settings",
    label: "API Settings",
    icon: SettingsIcon,
    color: "text-gray-400",
    description: "Configure integrations",
  },
  {
    key: "app-settings",
    label: "App Settings",
    icon: Sparkles,
    color: "text-purple-400",
    description: "Branding, icons & configuration",
  },
  {
    key: "users",
    label: "User Management",
    icon: Users,
    color: "text-emerald-400",
    description: "Manage subscribers",
  },
  {
    key: "billing",
    label: "Billing",
    icon: CreditCard,
    color: "text-yellow-400",
    description: "Subscription management",
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: Bell,
    color: "text-red-400",
    description: "System alerts",
  },
  {
    key: "analytics",
    label: "Advanced Analytics",
    icon: TrendingUp,
    color: "text-orange-400",
    description: "Deep insights",
  },
  {
    key: "danger",
    label: "System Controls",
    icon: AlertTriangle,
    color: "text-red-500",
    description: "Advanced operations",
  },
];

// Real User Management Component
function UserManagement() {
  const users = useUsers();
  const { loadUsers, addNotification } = useApp();
  const isLoading = useLoading();
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadUsers();
      addNotification({
        type: "success",
        title: "Users Refreshed",
        message: "User data has been refreshed successfully.",
      });
    } catch (error) {
      addNotification({
        type: "error",
        title: "Refresh Failed",
        message: "Failed to refresh user data.",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const premiumUsers = users.filter(
    (user) => user.subscription.status === "premium",
  );
  const activeToday = users.filter(
    (user) =>
      new Date(user.lastActive).getTime() > Date.now() - 24 * 60 * 60 * 1000,
  );
  const avgStoriesRead = users.length
    ? Math.round(
        users.reduce((acc, u) => acc + (u.engagement?.storiesRead || 0), 0) /
          users.length,
      )
    : 0;

  if (isLoading && users.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">👥 User Management</h2>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="ml-3 text-gray-400">Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">👥 User Management</h2>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="pl-9 bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="border-border"
            disabled={isRefreshing}
          >
            <RefreshCw
              size={16}
              className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {users.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {premiumUsers.length}
            </div>
            <div className="text-sm text-muted-foreground">Premium Users</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {avgStoriesRead}
            </div>
            <div className="text-sm text-muted-foreground">
              Avg Stories Read
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {activeToday.length}
            </div>
            <div className="text-sm text-muted-foreground">Active Today</div>
          </CardContent>
        </Card>
      </div>

      {filteredUsers.length > 0 ? (
        <div className="grid gap-4">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card border border-border p-6 rounded-xl hover:border-border/80 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-foreground font-bold border border-border">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-foreground">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge
                        className={
                          user.subscription.status === "premium"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-gray-600/20 text-gray-400"
                        }
                      >
                        {user.subscription.status}
                      </Badge>
                      {user.subscription.plan && (
                        <Badge variant="outline" className="text-xs">
                          {user.subscription.plan}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right text-sm text-gray-400">
                  <div>
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    Last active:{" "}
                    {new Date(user.lastActive).toLocaleDateString()}
                  </div>
                  {user.subscription.expiresAt && (
                    <div>
                      Expires:{" "}
                      {new Date(
                        user.subscription.expiresAt,
                      ).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              {user.engagement && (
                <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-400">
                      {user.engagement.storiesRead || 0}
                    </div>
                    <div className="text-xs text-gray-400">Stories Read</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-400">
                      {user.engagement.avgTime || "0m"}
                    </div>
                    <div className="text-xs text-gray-400">Avg Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-400 capitalize">
                      {user.engagement.favoriteGenre || "unknown"}
                    </div>
                    <div className="text-xs text-gray-400">Favorite Genre</div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-gray-400 text-center p-8">
          <Users size={48} className="mx-auto mb-4 opacity-50" />
          <p>
            {searchQuery
              ? "No users found matching your search"
              : "No users found"}
          </p>
          {searchQuery && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSearchQuery("")}
            >
              Clear Search
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// App Settings Component for Branding and Configuration
function AppSettings() {
  const { addNotification, updateAppConfig } = useApp();
  const appConfig = useAppConfig();

  const [activeTab, setActiveTab] = useState("branding");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateAppConfig(appConfig);
    } catch (error) {
      // Error handling is done in updateAppConfig
    } finally {
      setIsSaving(false);
    }
  };

  const handleIconUpdate = async (
    category: string,
    key: string,
    value: string,
  ) => {
    if (category === "phone") {
      await updateAppConfig({
        phoneIcons: {
          ...appConfig.phoneIcons,
          [key]: value,
        },
      });
    } else if (category === "sponsored") {
      await updateAppConfig({
        sponsoredApps: {
          ...appConfig.sponsoredApps,
          [key]: value,
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">⚙️ App Settings</h2>
          <p className="text-muted-foreground">
            Configure your app's branding, icons, and general settings
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isSaving ? (
            <>
              <RefreshCw size={16} className="mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <SettingsIcon size={16} className="mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="branding">🎨 Branding</TabsTrigger>
          <TabsTrigger value="phone-icons">📱 Phone Icons</TabsTrigger>
          <TabsTrigger value="sponsored-apps">🌟 Sponsored Apps</TabsTrigger>
          <TabsTrigger value="general">⚙️ General</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>App Branding</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage your app's logo, name, and visual identity
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    App Name
                  </label>
                  <Input
                    value={appConfig.appName}
                    onChange={(e) =>
                      updateAppConfig({ appName: e.target.value })
                    }
                    className="bg-input border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tagline
                  </label>
                  <Input
                    value={appConfig.tagline}
                    onChange={(e) =>
                      updateAppConfig({ tagline: e.target.value })
                    }
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Logo URL
                  </label>
                  <div className="space-y-3">
                    <Input
                      value={appConfig.logo}
                      onChange={(e) =>
                        updateAppConfig({ logo: e.target.value })
                      }
                      className="bg-input border-border"
                      placeholder="https://example.com/logo.png"
                    />
                    <div className="flex items-center space-x-3 p-3 bg-accent/50 rounded-lg">
                      <img
                        src={appConfig.logo}
                        alt="Logo Preview"
                        className="w-8 h-8 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%23666'/%3E%3Ctext x='12' y='12' text-anchor='middle' dy='.3em' fill='white' font-size='10'%3E?%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      <span className="text-sm text-muted-foreground">
                        Logo Preview
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Favicon URL
                  </label>
                  <div className="space-y-3">
                    <Input
                      value={appConfig.favicon}
                      onChange={(e) =>
                        updateAppConfig({ favicon: e.target.value })
                      }
                      className="bg-input border-border"
                      placeholder="https://example.com/favicon.ico"
                    />
                    <div className="flex items-center space-x-3 p-3 bg-accent/50 rounded-lg">
                      <img
                        src={appConfig.favicon}
                        alt="Favicon Preview"
                        className="w-4 h-4 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%23666'/%3E%3Ctext x='12' y='12' text-anchor='middle' dy='.3em' fill='white' font-size='10'%3E?%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      <span className="text-sm text-muted-foreground">
                        Favicon Preview
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phone-icons" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Phone App Icons</CardTitle>
              <p className="text-sm text-muted-foreground">
                Customize the icons that appear on the phone home screen
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(appConfig.phoneIcons).map(([key, icon]) => (
                  <div key={key} className="p-4 bg-accent/50 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        {key === "chatLure" ? (
                          <img
                            src={icon}
                            alt={key}
                            className="w-6 h-6 object-cover"
                          />
                        ) : (
                          <span className="text-lg">{icon}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium capitalize text-foreground">
                          {key === "chatLure" ? "ChatLure" : key}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {key === "chatLure" ? "Main App" : "System App"}
                        </div>
                      </div>
                    </div>
                    <Input
                      value={icon}
                      onChange={(e) =>
                        handleIconUpdate("phone", key, e.target.value)
                      }
                      className="bg-input border-border text-sm"
                      placeholder={
                        key === "chatLure" ? "Image URL" : "Emoji or URL"
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sponsored-apps" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Sponsored Apps</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure the sponsored app icons shown on the phone
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(appConfig.sponsoredApps).map(([key, icon]) => (
                  <div key={key} className="p-4 bg-accent/50 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <span className="text-lg">{icon}</span>
                      </div>
                      <div>
                        <div className="font-medium capitalize text-foreground">
                          {key}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Sponsored
                        </div>
                      </div>
                    </div>
                    <Input
                      value={icon}
                      onChange={(e) =>
                        handleIconUpdate("sponsored", key, e.target.value)
                      }
                      className="bg-input border-border text-sm"
                      placeholder="Emoji or URL"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure general app behavior and preferences
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <Input
                      type="color"
                      value={appConfig.theme.primaryColor}
                      onChange={(e) =>
                        setAppConfig((prev) => ({
                          ...prev,
                          theme: {
                            ...prev.theme,
                            primaryColor: e.target.value,
                          },
                        }))
                      }
                      className="w-16 h-10 p-1 bg-input border-border"
                    />
                    <Input
                      value={appConfig.theme.primaryColor}
                      onChange={(e) =>
                        setAppConfig((prev) => ({
                          ...prev,
                          theme: {
                            ...prev.theme,
                            primaryColor: e.target.value,
                          },
                        }))
                      }
                      className="bg-input border-border"
                      placeholder="#9333EA"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Background Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <Input
                      type="color"
                      value={appConfig.theme.backgroundColor}
                      onChange={(e) =>
                        setAppConfig((prev) => ({
                          ...prev,
                          theme: {
                            ...prev.theme,
                            backgroundColor: e.target.value,
                          },
                        }))
                      }
                      className="w-16 h-10 p-1 bg-input border-border"
                    />
                    <Input
                      value={appConfig.theme.backgroundColor}
                      onChange={(e) =>
                        setAppConfig((prev) => ({
                          ...prev,
                          theme: {
                            ...prev.theme,
                            backgroundColor: e.target.value,
                          },
                        }))
                      }
                      className="bg-input border-border"
                      placeholder="#141414"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">App Information</h4>
                <div className="grid grid-cols-3 gap-4 p-4 bg-accent/50 rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">Version</div>
                    <div className="font-mono text-sm">1.0.0</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Build</div>
                    <div className="font-mono text-sm">2024.1</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Environment
                    </div>
                    <div className="font-mono text-sm">Development</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Quick Actions</h4>
                <div className="flex space-x-3">
                  <Button variant="outline" className="flex-1">
                    <RefreshCw size={16} className="mr-2" />
                    Reset to Defaults
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download size={16} className="mr-2" />
                    Export Config
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Upload size={16} className="mr-2" />
                    Import Config
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Real PayPal Billing Component
function PayPalBilling() {
  const [subscriptionStatus, setSubscriptionStatus] = useState("inactive");
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    activeSubscribers: 0,
    churnRate: 0,
    avgRevenue: 0,
  });
  const credentials = useCredentials();
  const { addNotification } = useApp();

  const isPayPalConfigured =
    credentials.paypal.enabled && credentials.paypal.clientId !== "";

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const dashboardMetrics = await APIClient.getDashboardMetrics();
        setMetrics({
          totalRevenue: dashboardMetrics.totalRevenue || 0,
          activeSubscribers: dashboardMetrics.activeSubscribers || 0,
          churnRate: dashboardMetrics.churnRate || 0,
          avgRevenue: dashboardMetrics.avgRevenue || 0,
        });
      } catch (error) {
        console.error("Failed to load billing metrics:", error);
      }
    };

    loadMetrics();
  }, []);

  const createSubscription = (data: any, actions: any) => {
    return actions.subscription.create({
      plan_id: credentials.paypal.planId || "demo-plan-id",
    });
  };

  const onApprove = async (data: any) => {
    setSubscriptionStatus("active");
    addNotification({
      type: "success",
      title: "Subscription Created",
      message: "PayPal subscription has been created successfully.",
    });

    // Track the subscription
    await APIClient.trackMetric("subscriptions_created", 1);
  };

  if (!isPayPalConfigured) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">💳 Billing & Subscriptions</h2>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <CreditCard
                size={48}
                className="mx-auto mb-4 text-muted-foreground opacity-50"
              />
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                PayPal Configuration Required
              </h3>
              <p className="text-muted-foreground mb-4">
                Configure your PayPal credentials to enable subscription
                management and billing features.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Configure PayPal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        "client-id": credentials.paypal.clientId,
        vault: true,
        intent: "subscription",
      }}
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">💳 Billing & Subscriptions</h2>

        {/* Real Billing Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                ${metrics.totalRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Total Revenue</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {metrics.activeSubscribers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Active Subscribers</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {metrics.churnRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">Churn Rate</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">
                ${metrics.avgRevenue.toFixed(2)}
              </div>
              <div className="text-sm text-gray-400">Avg Revenue/User</div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">
              Subscription Management
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 border border-gray-600 rounded-lg">
                  <h4 className="font-medium mb-2">Basic Plan - $4.99/month</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Access to premium stories and ad-free experience
                  </p>
                  <div className="text-sm text-gray-300">
                    <div>��� Unlimited story access</div>
                    <div>• Ad-free reading</div>
                    <div>• Early access to new content</div>
                  </div>
                </div>

                <div className="p-4 border border-purple-500 rounded-lg bg-purple-500/10">
                  <h4 className="font-medium mb-2">
                    Premium Plan - $9.99/month
                  </h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Everything in Basic plus exclusive features
                  </p>
                  <div className="text-sm text-gray-300">
                    <div>• All Basic features</div>
                    <div>• Exclusive premium stories</div>
                    <div>• Story customization</div>
                    <div>• Priority support</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="font-medium mb-4">Test Subscription</h4>
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm mb-4 ${
                    subscriptionStatus === "active"
                      ? "bg-green-900/30 text-green-400"
                      : "bg-yellow-900/30 text-yellow-400"
                  }`}
                >
                  {subscriptionStatus === "active" ? "✓ Active" : "⏸ Inactive"}
                </div>

                <PayPalButtons
                  createSubscription={createSubscription}
                  onApprove={onApprove}
                  style={{ layout: "horizontal" }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PayPalScriptProvider>
  );
}

const Admin = () => {
  const [section, setSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { state } = useApp();

  // Filter sections based on search
  const filteredSections = sections.filter(
    (s) =>
      s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -288 }}
            animate={{ x: 0 }}
            exit={{ x: -288 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col min-h-screen shadow-xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-sidebar-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-card rounded-lg border border-border flex items-center justify-center overflow-hidden">
                    <img
                      src="https://cdn.builder.io/api/v1/assets/890476fbb754497cbf35f5a7e20b5494/default-12-7008ca?format=webp&width=800"
                      alt="ChatLure"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-sidebar-foreground">
                      ChatLure
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      Admin Console
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <NotificationCenter />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sections..."
                  className="pl-9 bg-sidebar-accent border-sidebar-border text-sm text-sidebar-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {filteredSections.map((s) => {
                const IconComponent = s.icon;
                const isActive = section === s.key;

                return (
                  <motion.button
                    key={s.key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center space-x-3 group ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-foreground"
                    }`}
                    onClick={() => setSection(s.key)}
                  >
                    <IconComponent
                      size={18}
                      className={isActive ? "text-primary-foreground" : s.color}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{s.label}</div>
                      <div className="text-xs text-muted-foreground group-hover:text-sidebar-foreground">
                        {s.description}
                      </div>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="w-2 h-2 bg-primary-foreground rounded-full"
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>

            {/* Footer Stats */}
            <div className="p-4 border-t border-sidebar-border">
              <Card className="bg-sidebar-accent/50 border-sidebar-border">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold text-primary mb-3 flex items-center">
                    <Activity size={14} className="mr-2" />
                    Live Stats
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stories:</span>
                      <span className="text-green-400 font-bold">
                        {state.stories.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Users:</span>
                      <span className="text-blue-400 font-bold">
                        {state.users.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active:</span>
                      <span className="text-orange-400 font-bold">
                        {state.stories.filter((s) => s.isActive).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span
                        className={`font-bold ${
                          state.isLoading
                            ? "text-yellow-400"
                            : state.error
                              ? "text-red-400"
                              : "text-green-400"
                        }`}
                      >
                        {state.isLoading
                          ? "Loading"
                          : state.error
                            ? "Error"
                            : "Online"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <div className="bg-card/50 border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {!sidebarOpen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={16} />
              </Button>
            )}
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {sections.find((s) => s.key === section)?.label}
              </Badge>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div
                className={`w-2 h-2 rounded-full ${
                  state.isLoading
                    ? "bg-yellow-400 animate-pulse"
                    : state.error
                      ? "bg-red-400"
                      : "bg-green-400 animate-pulse"
                }`}
              />
              <span>
                {state.isLoading
                  ? "Loading..."
                  : state.error
                    ? "Error"
                    : "System Online"}
              </span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-background via-background to-card">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {section === "dashboard" && <Dashboard onNavigate={setSection} />}
              {section === "library" && <StoryLibrary />}
              {section === "ai-generator" && <AIStoryGenerator />}
              {section === "story" && (
                <StoryCreator
                  onSave={(story) => {
                    console.log("Story saved:", story);
                  }}
                />
              )}
              {section === "import" && (
                <ContentImporter
                  onImport={(stories) => {
                    console.log("Stories imported:", stories);
                  }}
                />
              )}
              {section === "settings" && <Settings />}
              {section === "app-settings" && <AppSettings />}
              {section === "users" && <UserManagement />}
              {section === "billing" && <PayPalBilling />}
              {section === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">🔔 Notification Center</h2>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6 text-center">
                      <Bell
                        size={48}
                        className="mx-auto mb-4 text-gray-400 opacity-50"
                      />
                      <p className="text-lg">
                        Advanced notification system coming soon
                      </p>
                      <p className="text-sm text-gray-400">
                        Configure push notifications, email alerts, and system
                        announcements
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
              {section === "analytics" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">📊 Advanced Analytics</h2>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6 text-center">
                      <TrendingUp
                        size={48}
                        className="mx-auto mb-4 text-gray-400 opacity-50"
                      />
                      <p className="text-lg">
                        Deep analytics dashboard coming soon
                      </p>
                      <p className="text-sm text-gray-400">
                        Advanced metrics, user behavior analysis, and predictive
                        insights
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
              {section === "danger" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">⚠️ System Controls</h2>
                  <Card className="bg-red-900/20 border-red-500/30">
                    <CardContent className="p-6 text-center">
                      <AlertTriangle
                        size={48}
                        className="mx-auto mb-4 text-red-400 opacity-50"
                      />
                      <p className="text-lg">Advanced system controls</p>
                      <p className="text-sm text-gray-400">
                        Bulk operations, data management, and system maintenance
                        tools
                      </p>
                      <Button variant="destructive" className="mt-4" disabled>
                        Access Restricted
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Admin;
