import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StoryCreator } from "@/components/admin/StoryCreator";
import { ContentImporter } from "@/components/admin/ContentImporter";
import { StoryLibrary } from "@/components/admin/StoryLibrary";
import { Settings } from "@/components/admin/Settings";
import { Dashboard } from "@/components/admin/Dashboard";
import { NotificationCenter } from "@/components/ui/notification-center";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useCredentials } from "@/contexts/AppContext";
import {
  BarChart3,
  Users,
  CreditCard,
  Bell,
  Settings as SettingsIcon,
  Database,
  Shield,
  AlertTriangle,
  BookOpen,
  Upload,
  Archive,
  TrendingUp,
  Menu,
  X,
  Home,
  Zap,
  Globe,
  Sparkles,
  Target,
  Clock,
  Activity,
  ChevronDown,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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

// Mock User List Component
function ClerkUserList() {
  const [users] = useState([
    {
      id: "1",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.j@example.com",
      imageUrl: "/avatars/user1.jpg",
      createdAt: "2024-01-10T10:30:00Z",
      lastActive: "2024-01-20T14:25:00Z",
      subscription: { status: "premium", plan: "Pro", expiresAt: "2024-02-10" },
      engagement: { storiesRead: 23, avgTime: "18m", favoriteGenre: "drama" },
    },
    {
      id: "2",
      firstName: "Mike",
      lastName: "Chen",
      email: "mike.chen@example.com",
      imageUrl: "/avatars/user2.jpg",
      createdAt: "2024-01-08T15:45:00Z",
      lastActive: "2024-01-20T09:15:00Z",
      subscription: { status: "free" },
      engagement: { storiesRead: 8, avgTime: "12m", favoriteGenre: "mystery" },
    },
    {
      id: "3",
      firstName: "Emma",
      lastName: "Davis",
      email: "emma.davis@example.com",
      imageUrl: "/avatars/user3.jpg",
      createdAt: "2024-01-05T09:20:00Z",
      lastActive: "2024-01-19T16:30:00Z",
      subscription: {
        status: "premium",
        plan: "Premium",
        expiresAt: "2024-03-05",
      },
      engagement: { storiesRead: 45, avgTime: "24m", favoriteGenre: "family" },
    },
  ]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

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
              placeholder="Search users..."
              className="pl-9 bg-gray-800 border-gray-600"
            />
          </div>
          <Button variant="outline" className="border-gray-600">
            Export Users
          </Button>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {users.length}
            </div>
            <div className="text-sm text-gray-400">Total Users</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {users.filter((u) => u.subscription.status === "premium").length}
            </div>
            <div className="text-sm text-gray-400">Premium Users</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {Math.round(
                users.reduce(
                  (acc, u) => acc + (u.engagement?.storiesRead || 0),
                  0,
                ) / users.length,
              )}
            </div>
            <div className="text-sm text-gray-400">Avg Stories Read</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">
              {
                users.filter(
                  (u) =>
                    new Date(u.lastActive).getTime() >
                    Date.now() - 24 * 60 * 60 * 1000,
                ).length
              }
            </div>
            <div className="text-sm text-gray-400">Active Today</div>
          </CardContent>
        </Card>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-500/30 p-4 rounded-xl text-red-300">
          {error}
        </div>
      )}

      {users.length > 0 && (
        <div className="grid gap-4">
          {users.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 border border-gray-700 p-6 rounded-xl hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.firstName}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-white">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-gray-400">{user.email}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge
                        className={
                          user.subscription.status === "premium"
                            ? "bg-gold-500/20 text-yellow-400"
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
                      {user.engagement.storiesRead}
                    </div>
                    <div className="text-xs text-gray-400">Stories Read</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-400">
                      {user.engagement.avgTime}
                    </div>
                    <div className="text-xs text-gray-400">Avg Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-400 capitalize">
                      {user.engagement.favoriteGenre}
                    </div>
                    <div className="text-xs text-gray-400">Favorite Genre</div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div className="text-gray-400 text-center p-8">
          <Users size={48} className="mx-auto mb-4 opacity-50" />
          <p>No users found</p>
        </div>
      )}
    </div>
  );
}

// PayPal Billing Component
function PayPalBilling() {
  const [subscriptionStatus, setSubscriptionStatus] = useState("inactive");
  const credentials = useCredentials();

  const isPayPalConfigured =
    credentials.paypal.enabled && credentials.paypal.clientId !== "";

  const createSubscription = (data: any, actions: any) => {
    return actions.subscription.create({
      plan_id: credentials.paypal.planId || "demo-plan-id",
    });
  };

  const onApprove = (data: any) => {
    setSubscriptionStatus("active");
    console.log("Subscription approved:", data);
  };

  if (!isPayPalConfigured) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">💳 Billing & Subscriptions</h2>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <CreditCard
                size={48}
                className="mx-auto mb-4 text-gray-400 opacity-50"
              />
              <h3 className="text-xl font-semibold mb-2">
                PayPal Configuration Required
              </h3>
              <p className="text-gray-400 mb-4">
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

        {/* Billing Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">$12,847</div>
              <div className="text-sm text-gray-400">Monthly Revenue</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">1,247</div>
              <div className="text-sm text-gray-400">Active Subscribers</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">8.7%</div>
              <div className="text-sm text-gray-400">Churn Rate</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">$10.30</div>
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
                    <div>• Unlimited story access</div>
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
                <h4 className="font-medium mb-4">Current Status</h4>
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

  // Filter sections based on search
  const filteredSections = sections.filter(
    (s) =>
      s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -288 }}
            animate={{ x: 0 }}
            exit={{ x: -288 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-72 bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 flex flex-col min-h-screen shadow-xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Sparkles size={18} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">ChatLure</h1>
                    <p className="text-xs text-gray-400">Admin Console</p>
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
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sections..."
                  className="pl-9 bg-gray-800 border-gray-600 text-sm"
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
                        ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25"
                        : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/70 hover:text-white"
                    }`}
                    onClick={() => setSection(s.key)}
                  >
                    <IconComponent
                      size={18}
                      className={isActive ? "text-white" : s.color}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{s.label}</div>
                      <div className="text-xs text-gray-400 group-hover:text-gray-300">
                        {s.description}
                      </div>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>

            {/* Footer Stats */}
            <div className="p-4 border-t border-gray-700">
              <Card className="bg-gray-800/50 border-gray-600">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold text-purple-400 mb-3 flex items-center">
                    <Activity size={14} className="mr-2" />
                    Quick Stats
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Active Stories:</span>
                      <span className="text-green-400 font-bold">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Views:</span>
                      <span className="text-blue-400 font-bold">1.2M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Viral Score:</span>
                      <span className="text-orange-400 font-bold">87%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Revenue:</span>
                      <span className="text-purple-400 font-bold">$12.8k</span>
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
        <div className="bg-gray-900/50 border-b border-gray-700 p-4 flex items-center justify-between">
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
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-400">
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
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>System Online</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-gray-900 via-black to-gray-900">
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
              {section === "users" && <ClerkUserList />}
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
