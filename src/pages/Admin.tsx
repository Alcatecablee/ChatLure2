import { useState, useEffect } from "react";
import { StoryCreator } from "@/components/admin/StoryCreator";
import { ContentImporter } from "@/components/admin/ContentImporter";
import { StoryLibrary } from "@/components/admin/StoryLibrary";
import { Settings } from "@/components/admin/Settings";
import { Dashboard } from "@/components/admin/Dashboard";
import { NotificationCenter } from "@/components/ui/notification-center";
// import { useAuth } from "@clerk/clerk-react"; // Commented out until ClerkProvider is set up
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
} from "lucide-react";

const sections = [
  { key: "dashboard", label: "📊 Dashboard", icon: BarChart3 },
  { key: "library", label: "📚 Story Library", icon: Archive },
  { key: "story", label: "✨ Story Creator", icon: BookOpen },
  { key: "import", label: "📥 Content Import", icon: Upload },
  { key: "monetization", label: "💰 Creator Monetization", icon: CreditCard },
  { key: "subscriptions", label: "👑 Premium Tiers", icon: Users },
  { key: "payouts", label: "💸 Creator Payouts", icon: TrendingUp },
  { key: "settings", label: "⚙️ API Settings", icon: SettingsIcon },
  { key: "users", label: "👥 User Management", icon: Users },
  { key: "billing", label: "💳 Subscription & Billing", icon: CreditCard },
  { key: "notifications", label: "🔔 Notifications", icon: Bell },
  { key: "content", label: "🎯 Content Preferences", icon: Database },
  { key: "privacy", label: "🛡️ Privacy & Safety", icon: Shield },
  { key: "analytics", label: "📊 Analytics", icon: TrendingUp },
  { key: "danger", label: "⚠️ Danger Zone", icon: AlertTriangle },
];

// Mock User List Component (replace with real Clerk integration when ClerkProvider is set up)
function ClerkUserList() {
  const [users] = useState([
    {
      id: "1",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.j@example.com",
      imageUrl: "/avatars/user1.jpg",
      createdAt: "2024-01-10T10:30:00Z",
    },
    {
      id: "2",
      firstName: "Mike",
      lastName: "Chen",
      email: "mike.chen@example.com",
      imageUrl: "/avatars/user2.jpg",
      createdAt: "2024-01-08T15:45:00Z",
    },
    {
      id: "3",
      firstName: "Emma",
      lastName: "Davis",
      email: "emma.davis@example.com",
      imageUrl: "/avatars/user3.jpg",
      createdAt: "2024-01-05T09:20:00Z",
    },
  ]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {loading && (
        <div className="flex items-center justify-center p-4">
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
            <div
              key={user.id}
              className="bg-gray-800 p-4 rounded-xl flex items-center space-x-4"
            >
              {user.imageUrl && (
                <img
                  src={user.imageUrl}
                  alt={user.firstName}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div className="flex-1">
                <div className="font-semibold">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-sm text-gray-400">{user.email}</div>
                <div className="text-xs text-gray-500">
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div className="text-gray-400 text-center p-4">No users found</div>
      )}
    </div>
  );
}

// PayPal Billing Component
function PayPalBilling() {
  const [subscriptionStatus, setSubscriptionStatus] = useState("inactive");
  const credentials = useCredentials();

  // Check if PayPal credentials are configured
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

  // Show configuration placeholder if PayPal is not set up
  if (!isPayPalConfigured) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">
            💳 Subscription Management
          </h3>

          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-2">Current Status</div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-900/30 text-yellow-400">
              Configuration Required
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-lg mb-4">
            <h4 className="font-medium text-yellow-400 mb-2">
              ⚠️ PayPal Configuration Required
            </h4>
            <p className="text-sm text-gray-300 mb-3">
              To enable subscription management, please configure your PayPal
              credentials:
            </p>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>
                • Set{" "}
                <code className="bg-gray-700 px-1 rounded">
                  VITE_PAYPAL_CLIENT_ID
                </code>{" "}
                environment variable
              </li>
              <li>
                • Set{" "}
                <code className="bg-gray-700 px-1 rounded">
                  VITE_PAYPAL_PLAN_ID
                </code>{" "}
                environment variable
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-gray-700 rounded-lg opacity-50">
              <h4 className="font-medium mb-2">Premium Plan</h4>
              <p className="text-sm text-gray-400 mb-4">
                Access to all premium features
              </p>
              <div className="bg-gray-700 p-3 rounded text-center text-gray-400">
                PayPal Integration Disabled
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Configure PayPal credentials to enable subscription management
        </div>
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
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">
            Subscription Management
          </h3>

          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-2">Current Status</div>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                subscriptionStatus === "active"
                  ? "bg-green-900/30 text-green-400"
                  : "bg-yellow-900/30 text-yellow-400"
              }`}
            >
              {subscriptionStatus === "active" ? "Active" : "Inactive"}
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-gray-700 rounded-lg">
              <h4 className="font-medium mb-2">Premium Plan</h4>
              <p className="text-sm text-gray-400 mb-4">
                Access to all premium features
              </p>
              <PayPalButtons
                createSubscription={createSubscription}
                onApprove={onApprove}
                style={{ layout: "horizontal" }}
              />
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Need help? Contact support for billing assistance
        </div>
      </div>
    </PayPalScriptProvider>
  );
}

const Admin = () => {
  const [section, setSection] = useState("dashboard");

  return (
    <div className="w-full min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col py-8 px-4 min-h-screen">
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-purple-400">
              ChatLure Admin
            </h1>
            <NotificationCenter />
          </div>
          <p className="text-sm text-gray-400">Story Management Hub</p>
        </div>
        <nav className="flex flex-col space-y-1">
          {sections.map((s) => {
            const IconComponent = s.icon;
            return (
              <button
                key={s.key}
                className={`text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center space-x-3 ${
                  section === s.key
                    ? "bg-purple-700 text-white shadow-lg"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => setSection(s.key)}
              >
                <IconComponent size={18} />
                <span>{s.label.replace(/^[^\s]* /, "")}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-8 border-t border-gray-800">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-purple-400 mb-2">
              🔥 Quick Stats
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
                <span className="text-gray-400">Avg Viral Score:</span>
                <span className="text-orange-400 font-bold">87%</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {section === "dashboard" && <Dashboard onNavigate={setSection} />}
        {section === "library" && (
          <div>
            <StoryLibrary />
          </div>
        )}
        {section === "story" && (
          <div>
            <StoryCreator
              onSave={(story) => {
                console.log("Story saved:", story);
              }}
            />
          </div>
        )}
        {section === "import" && (
          <div>
            <ContentImporter
              onImport={(stories) => {
                console.log("Stories imported:", stories);
              }}
            />
          </div>
        )}
        {section === "monetization" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">💰 Creator Monetization</h2>
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-r from-green-600 to-green-400 p-6 rounded-xl text-white">
                <h3 className="text-lg font-semibold mb-2">Monthly Revenue</h3>
                <p className="text-3xl font-bold">$24,580</p>
                <p className="text-sm opacity-80">+18% from last month</p>
              </div>
              <div className="bg-gradient-to-r from-purple-600 to-purple-400 p-6 rounded-xl text-white">
                <h3 className="text-lg font-semibold mb-2">
                  Premium Subscribers
                </h3>
                <p className="text-3xl font-bold">1,247</p>
                <p className="text-sm opacity-80">+156 this month</p>
              </div>
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 rounded-xl text-white">
                <h3 className="text-lg font-semibold mb-2">
                  Avg. Revenue per User
                </h3>
                <p className="text-3xl font-bold">$19.70</p>
                <p className="text-sm opacity-80">+$2.40 vs last month</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-purple-400 mb-4">
                  🔥 Premium Story Performance
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                    <span>"Office Affair Part 3"</span>
                    <span className="text-green-400 font-semibold">$1,234</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                    <span>"Toxic Family Drama"</span>
                    <span className="text-green-400 font-semibold">$987</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                    <span>"Best Friend Betrayal"</span>
                    <span className="text-green-400 font-semibold">$756</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-blue-400 mb-4">
                  💎 Premium Features
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                    <span>Early Access Stories</span>
                    <span className="text-blue-400">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                    <span>Exclusive Content</span>
                    <span className="text-blue-400">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                    <span>Creator Tips</span>
                    <span className="text-blue-400">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                    <span>Private Messages</span>
                    <span className="text-green-400">Premium Only</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {section === "subscriptions" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              👑 Premium Subscription Tiers
            </h2>
            <div className="grid grid-cols-3 gap-6 mb-6">
              {/* Basic Tier */}
              <div className="bg-gray-800 border border-gray-600 p-6 rounded-xl">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold text-blue-400">Basic</h3>
                  <p className="text-3xl font-bold text-white mt-2">
                    $4.99<span className="text-sm text-gray-400">/month</span>
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>✓ Access to all free stories</li>
                  <li>✓ Basic chat features</li>
                  <li>✓ Standard resolution media</li>
                  <li>✓ Community features</li>
                </ul>
                <div className="mt-4 text-center">
                  <span className="text-blue-400 font-semibold">
                    847 subscribers
                  </span>
                </div>
              </div>

              {/* Premium Tier */}
              <div className="bg-gradient-to-br from-purple-800 to-purple-600 border border-purple-500 p-6 rounded-xl">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold text-white">Premium</h3>
                  <p className="text-3xl font-bold text-white mt-2">
                    $14.99
                    <span className="text-sm text-purple-200">/month</span>
                  </p>
                  <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">
                    POPULAR
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-purple-100">
                  <li>✓ All Basic features</li>
                  <li>✓ Early access to new stories</li>
                  <li>✓ Exclusive premium content</li>
                  <li>✓ HD media and animations</li>
                  <li>✓ Creator tip features</li>
                  <li>✓ Priority support</li>
                </ul>
                <div className="mt-4 text-center">
                  <span className="text-white font-semibold">
                    1,247 subscribers
                  </span>
                </div>
              </div>

              {/* VIP Tier */}
              <div className="bg-gradient-to-br from-yellow-600 to-yellow-400 border border-yellow-500 p-6 rounded-xl text-black">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold">VIP</h3>
                  <p className="text-3xl font-bold mt-2">
                    $29.99<span className="text-sm opacity-70">/month</span>
                  </p>
                  <span className="bg-black text-yellow-400 text-xs px-2 py-1 rounded-full">
                    EXCLUSIVE
                  </span>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>✓ All Premium features</li>
                  <li>✓ Private story requests</li>
                  <li>✓ Direct creator messaging</li>
                  <li>✓ Custom avatar & badges</li>
                  <li>✓ Exclusive VIP events</li>
                  <li>✓ Revenue sharing program</li>
                </ul>
                <div className="mt-4 text-center">
                  <span className="font-semibold">89 subscribers</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-green-400 mb-4">
                💰 Revenue Breakdown
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">$4,235</p>
                  <p className="text-sm text-gray-400">Basic Tier</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-400">$18,705</p>
                  <p className="text-sm text-gray-400">Premium Tier</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-400">$2,670</p>
                  <p className="text-sm text-gray-400">VIP Tier</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">$25,610</p>
                  <p className="text-sm text-gray-400">Total Monthly</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {section === "payouts" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">💸 Creator Payouts</h2>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-green-800 p-4 rounded-xl text-center">
                <h3 className="text-lg font-semibold text-green-300">
                  Total Payouts
                </h3>
                <p className="text-2xl font-bold text-white">$18,456</p>
                <p className="text-sm text-green-200">This month</p>
              </div>
              <div className="bg-blue-800 p-4 rounded-xl text-center">
                <h3 className="text-lg font-semibold text-blue-300">
                  Active Creators
                </h3>
                <p className="text-2xl font-bold text-white">67</p>
                <p className="text-sm text-blue-200">Earning revenue</p>
              </div>
              <div className="bg-purple-800 p-4 rounded-xl text-center">
                <h3 className="text-lg font-semibold text-purple-300">
                  Avg. Creator Earnings
                </h3>
                <p className="text-2xl font-bold text-white">$275</p>
                <p className="text-sm text-purple-200">Per month</p>
              </div>
              <div className="bg-yellow-800 p-4 rounded-xl text-center">
                <h3 className="text-lg font-semibold text-yellow-300">
                  Platform Fee
                </h3>
                <p className="text-2xl font-bold text-white">20%</p>
                <p className="text-sm text-yellow-200">Industry standard</p>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-yellow-400 mb-4">
                🏆 Top Earning Creators
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-gray-700 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      S
                    </div>
                    <div>
                      <p className="font-semibold">StoryQueen_Sarah</p>
                      <p className="text-sm text-gray-400">
                        Relationship Drama Specialist
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-semibold">$2,547</p>
                    <p className="text-sm text-gray-400">This month</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-700 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      D
                    </div>
                    <div>
                      <p className="font-semibold">DramaKing_Dave</p>
                      <p className="text-sm text-gray-400">
                        Office Politics Expert
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-semibold">$1,892</p>
                    <p className="text-sm text-gray-400">This month</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-700 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                      M
                    </div>
                    <div>
                      <p className="font-semibold">MessyMia_Stories</p>
                      <p className="text-sm text-gray-400">
                        Family Drama Creator
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-semibold">$1,634</p>
                    <p className="text-sm text-gray-400">This month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {section === "settings" && (
          <div>
            <Settings />
          </div>
        )}
        {section === "users" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <ClerkUserList />
          </div>
        )}
        {section === "billing" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Subscription & Billing</h2>
            <PayPalBilling />
          </div>
        )}
        {section === "notifications" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Notifications</h2>
            <p className="text-gray-300 mb-2">
              Send announcements or manage notification settings.
            </p>
            <div className="bg-gray-800 p-6 rounded-xl text-gray-400">
              Notification controls placeholder.
            </div>
          </div>
        )}
        {section === "content" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Content Preferences</h2>
            <p className="text-gray-300 mb-2">
              Set global content filters and manage categories.
            </p>
            <div className="bg-gray-800 p-6 rounded-xl text-gray-400">
              Content preferences controls placeholder.
            </div>
          </div>
        )}
        {section === "privacy" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Privacy & Safety</h2>
            <p className="text-gray-300 mb-2">
              Manage privacy settings and moderate flagged content.
            </p>
            <div className="bg-gray-800 p-6 rounded-xl text-gray-400">
              Privacy and safety controls placeholder.
            </div>
          </div>
        )}
        {section === "analytics" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">App Info & Analytics</h2>
            <p className="text-gray-300 mb-2">
              View app version, usage stats, and analytics.
            </p>
            <div className="bg-gray-800 p-6 rounded-xl text-gray-400">
              Analytics and info placeholder.
            </div>
          </div>
        )}
        {section === "danger" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Danger Zone</h2>
            <p className="text-gray-300 mb-2">
              Perform global resets, clear histories, or mass delete actions.
            </p>
            <div className="bg-red-900/30 border border-red-500/30 p-6 rounded-xl text-red-300">
              Danger zone controls placeholder.
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
