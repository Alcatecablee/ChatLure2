import { useState, useEffect } from "react";
import { StoryCreator } from "@/components/admin/StoryCreator";
import { ContentImporter } from "@/components/admin/ContentImporter";
import { StoryLibrary } from "@/components/admin/StoryLibrary";
import { useAuth } from "@clerk/clerk-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
  BarChart3,
  Users,
  CreditCard,
  Bell,
  Settings,
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
  { key: "users", label: "👥 User Management", icon: Users },
  { key: "billing", label: "💳 Subscription & Billing", icon: CreditCard },
  { key: "notifications", label: "🔔 Notifications", icon: Bell },
  { key: "content", label: "⚙️ Content Preferences", icon: Settings },
  { key: "data", label: "📈 Data Usage", icon: Database },
  { key: "privacy", label: "🛡️ Privacy & Safety", icon: Shield },
  { key: "analytics", label: "📊 Analytics", icon: TrendingUp },
  { key: "danger", label: "⚠️ Danger Zone", icon: AlertTriangle },
];

// Clerk User List Component
function ClerkUserList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if Clerk is available
  let getToken: (() => Promise<string | null>) | null = null;
  try {
    const auth = useAuth();
    getToken = auth.getToken;
  } catch (clerkError) {
    // Clerk provider not available
  }

  useEffect(() => {
    if (!getToken) {
      setError("Clerk authentication not configured");
      return;
    }

    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken!();
        const response = await fetch("/api/clerk-users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
      } catch (e: any) {
        setError(e.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [getToken]);

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

  const createSubscription = (data: any, actions: any) => {
    return actions.subscription.create({
      plan_id: import.meta.env.VITE_PAYPAL_PLAN_ID, // your subscription plan ID
    });
  };

  const onApprove = (data: any) => {
    // Handle successful subscription
    setSubscriptionStatus("active");
    console.log("Subscription approved:", data);
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || "",
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
          <h1 className="text-2xl font-bold text-purple-400">ChatLure Admin</h1>
          <p className="text-sm text-gray-400 mt-1">Story Management Hub</p>
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
        {section === "dashboard" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">📊 ChatLure Dashboard</h2>
              <p className="text-gray-300">
                Overview of your viral story empire
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-500/20 p-3 rounded-lg">
                    <BookOpen className="text-blue-400" size={24} />
                  </div>
                  <span className="text-2xl font-bold text-blue-400">23</span>
                </div>
                <h3 className="font-semibold text-white">Active Stories</h3>
                <p className="text-sm text-gray-400">+3 this week</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-500/20 p-3 rounded-lg">
                    <Users className="text-green-400" size={24} />
                  </div>
                  <span className="text-2xl font-bold text-green-400">
                    1.2M
                  </span>
                </div>
                <h3 className="font-semibold text-white">Total Views</h3>
                <p className="text-sm text-gray-400">+15% this month</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-orange-500/20 p-3 rounded-lg">
                    <TrendingUp className="text-orange-400" size={24} />
                  </div>
                  <span className="text-2xl font-bold text-orange-400">
                    87%
                  </span>
                </div>
                <h3 className="font-semibold text-white">Avg Viral Score</h3>
                <p className="text-sm text-gray-400">Above industry avg</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-500/20 p-3 rounded-lg">
                    <BarChart3 className="text-purple-400" size={24} />
                  </div>
                  <span className="text-2xl font-bold text-purple-400">
                    73%
                  </span>
                </div>
                <h3 className="font-semibold text-white">Completion Rate</h3>
                <p className="text-sm text-gray-400">+8% improvement</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">
                  🔥 Top Performing Stories
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-semibold text-white">
                        Mom Saw the Texts
                      </div>
                      <div className="text-sm text-gray-400">
                        125K views • 95% viral
                      </div>
                    </div>
                    <div className="text-green-400 font-bold">🔥</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-semibold text-white">
                        The Affair Exposed
                      </div>
                      <div className="text-sm text-gray-400">
                        287K views • 98% viral
                      </div>
                    </div>
                    <div className="text-green-400 font-bold">🔥</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-semibold text-white">
                        Inheritance War
                      </div>
                      <div className="text-sm text-gray-400">
                        45K views • 88% viral
                      </div>
                    </div>
                    <div className="text-orange-400 font-bold">📈</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">
                  ⚡ Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setSection("story")}
                    className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-lg text-left transition-colors"
                  >
                    <div className="font-semibold">✨ Create New Story</div>
                    <div className="text-sm text-purple-200">
                      Start building your next viral hit
                    </div>
                  </button>
                  <button
                    onClick={() => setSection("import")}
                    className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-left transition-colors"
                  >
                    <div className="font-semibold">📥 Import from Reddit</div>
                    <div className="text-sm text-blue-200">
                      Source viral content automatically
                    </div>
                  </button>
                  <button
                    onClick={() => setSection("library")}
                    className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg text-left transition-colors"
                  >
                    <div className="font-semibold">📚 Manage Library</div>
                    <div className="text-sm text-green-200">
                      Organize and analyze your stories
                    </div>
                  </button>
                </div>
              </div>
            </div>
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
        {section === "data" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Data Usage</h2>
            <p className="text-gray-300 mb-2">
              Set or restrict data usage modes for users.
            </p>
            <div className="bg-gray-800 p-6 rounded-xl text-gray-400">
              Data usage controls placeholder.
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
      </main>
    </div>
  );
};

export default Admin;
