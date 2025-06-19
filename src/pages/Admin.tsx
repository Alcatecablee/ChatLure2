import { useState, useEffect } from "react";
import { StoryCreator } from "@/components/admin/StoryCreator";
import { ContentImporter } from "@/components/admin/ContentImporter";
import { useAuth } from "@clerk/clerk-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const sections = [
  { key: "dashboard", label: "Dashboard" },
  { key: "users", label: "User Management" },
  { key: "billing", label: "Subscription & Billing" },
  { key: "notifications", label: "Notifications" },
  { key: "content", label: "Content Preferences" },
  { key: "data", label: "Data Usage" },
  { key: "privacy", label: "Privacy & Safety" },
  { key: "danger", label: "Danger Zone" },
  { key: "story", label: "Story Management" },
  { key: "import", label: "Content Import" },
  { key: "analytics", label: "App Info & Analytics" },
];

// Clerk User List Component
function ClerkUserList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const response = await fetch('/api/clerk-users', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
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
            <div key={user.id} className="bg-gray-800 p-4 rounded-xl flex items-center space-x-4">
              {user.imageUrl && (
                <img src={user.imageUrl} alt={user.firstName} className="w-10 h-10 rounded-full" />
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
        <div className="text-gray-400 text-center p-4">
          No users found
        </div>
      )}
    </div>
  );
}

// PayPal Billing Component
function PayPalBilling() {
  const [subscriptionStatus, setSubscriptionStatus] = useState('inactive');

  const createSubscription = (data: any, actions: any) => {
    return actions.subscription.create({
      'plan_id': process.env.VITE_PAYPAL_PLAN_ID // your subscription plan ID
    });
  };

  const onApprove = (data: any) => {
    // Handle successful subscription
    setSubscriptionStatus('active');
    console.log('Subscription approved:', data);
  };

  return (
    <PayPalScriptProvider options={{ 
      "client-id": process.env.VITE_PAYPAL_CLIENT_ID || "",
      "vault": true,
      "intent": "subscription"
    }}>
      <div className="space-y-6">
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Subscription Management</h3>
          
          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-2">Current Status</div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
              subscriptionStatus === 'active' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
            }`}>
              {subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-gray-700 rounded-lg">
              <h4 className="font-medium mb-2">Premium Plan</h4>
              <p className="text-sm text-gray-400 mb-4">Access to all premium features</p>
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
  const [section, setSection] = useState('dashboard');

  return (
    <div className="w-full min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col py-8 px-4 min-h-screen">
        <h1 className="text-2xl font-bold mb-8 text-center">Admin Panel</h1>
        <nav className="flex flex-col space-y-2">
          {sections.map((s) => (
            <button
              key={s.key}
              className={`text-left px-4 py-2 rounded-lg font-semibold transition-colors ${section === s.key ? 'bg-purple-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setSection(s.key)}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {section === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <p className="text-gray-300">Overview, stats, and quick actions will appear here.</p>
          </div>
        )}
        {section === 'users' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <ClerkUserList />
          </div>
        )}
        {section === 'billing' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Subscription & Billing</h2>
            <PayPalBilling />
          </div>
        )}
        {section === 'notifications' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Notifications</h2>
            <p className="text-gray-300 mb-2">Send announcements or manage notification settings.</p>
            <div className="bg-gray-800 p-6 rounded-xl text-gray-400">Notification controls placeholder.</div>
          </div>
        )}
        {section === 'content' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Content Preferences</h2>
            <p className="text-gray-300 mb-2">Set global content filters and manage categories.</p>
            <div className="bg-gray-800 p-6 rounded-xl text-gray-400">Content preferences controls placeholder.</div>
          </div>
        )}
        {section === 'data' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Data Usage</h2>
            <p className="text-gray-300 mb-2">Set or restrict data usage modes for users.</p>
            <div className="bg-gray-800 p-6 rounded-xl text-gray-400">Data usage controls placeholder.</div>
          </div>
        )}
        {section === 'privacy' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Privacy & Safety</h2>
            <p className="text-gray-300 mb-2">Manage privacy settings and moderate flagged content.</p>
            <div className="bg-gray-800 p-6 rounded-xl text-gray-400">Privacy and safety controls placeholder.</div>
          </div>
        )}
        {section === 'danger' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Danger Zone</h2>
            <p className="text-gray-300 mb-2">Perform global resets, clear histories, or mass delete actions.</p>
            <div className="bg-red-900/30 border border-red-500/30 p-6 rounded-xl text-red-300">Danger zone controls placeholder.</div>
          </div>
        )}
        {section === 'story' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Story Management</h2>
            <StoryCreator onSave={(story) => { console.log('Story saved:', story); }} />
          </div>
        )}
        {section === 'import' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Content Import</h2>
            <ContentImporter onImport={(stories) => { console.log('Stories imported:', stories); }} />
          </div>
        )}
        {section === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">App Info & Analytics</h2>
            <p className="text-gray-300 mb-2">View app version, usage stats, and analytics.</p>
            <div className="bg-gray-800 p-6 rounded-xl text-gray-400">Analytics and info placeholder.</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin; 