import { useState, useEffect } from "react";
import { StoryCreator } from "@/components/admin/StoryCreator";
import { CreatorContentImporter } from "@/components/creator/CreatorContentImporter";
import { StoryLibrary } from "@/components/admin/StoryLibrary";
import { NotificationCenter } from "@/components/ui/notification-center";
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
  DollarSign,
  Star,
  Eye,
  MessageSquare,
  Crown,
  Target,
  Heart,
  Share2,
} from "lucide-react";

const creatorSections = [
  { key: "dashboard", label: "📊 Creator Dashboard", icon: BarChart3 },
  { key: "library", label: "📚 My Stories", icon: Archive },
  { key: "create", label: "✨ Create Story", icon: BookOpen },
  { key: "import", label: "📥 Import Content", icon: Upload },
  { key: "earnings", label: "💰 Earnings", icon: DollarSign },
  { key: "subscribers", label: "👑 My Subscribers", icon: Users },
  { key: "analytics", label: "📈 Analytics", icon: TrendingUp },
  { key: "engagement", label: "💬 Fan Interactions", icon: MessageSquare },
  { key: "profile", label: "⚙️ Profile Settings", icon: SettingsIcon },
  { key: "payouts", label: "💸 Payouts", icon: CreditCard },
];

// Creator Stats Component
function CreatorStats() {
  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-r from-purple-600 to-purple-400 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Monthly Earnings</h3>
            <p className="text-3xl font-bold">$2,547</p>
            <p className="text-sm opacity-80">+23% from last month</p>
          </div>
          <DollarSign size={32} className="opacity-80" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Subscribers</h3>
            <p className="text-3xl font-bold">1,847</p>
            <p className="text-sm opacity-80">+156 this month</p>
          </div>
          <Crown size={32} className="opacity-80" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-600 to-green-400 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Story Views</h3>
            <p className="text-3xl font-bold">47.2K</p>
            <p className="text-sm opacity-80">+12% this week</p>
          </div>
          <Eye size={32} className="opacity-80" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-pink-600 to-pink-400 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Engagement Rate</h3>
            <p className="text-3xl font-bold">94%</p>
            <p className="text-sm opacity-80">Above average</p>
          </div>
          <Heart size={32} className="opacity-80" />
        </div>
      </div>
    </div>
  );
}

// Top Stories Performance
function TopStoriesPerformance() {
  const topStories = [
    {
      title: "Office Affair Part 3",
      views: "12.4K",
      earnings: "$456",
      engagement: "97%",
    },
    {
      title: "Best Friend Betrayal",
      views: "9.8K",
      earnings: "$342",
      engagement: "94%",
    },
    {
      title: "Toxic Family Drama",
      views: "8.1K",
      earnings: "$298",
      engagement: "91%",
    },
    {
      title: "College Roommate Scandal",
      views: "6.7K",
      earnings: "$234",
      engagement: "89%",
    },
  ];

  return (
    <div className="bg-gray-800 p-6 rounded-xl">
      <h3 className="text-xl font-semibold text-purple-400 mb-4">
        🔥 Top Performing Stories
      </h3>
      <div className="space-y-4">
        {topStories.map((story, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
          >
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1">{story.title}</h4>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className="flex items-center">
                  <Eye size={14} className="mr-1" />
                  {story.views}
                </span>
                <span className="flex items-center">
                  <Heart size={14} className="mr-1" />
                  {story.engagement}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-green-400 font-semibold">{story.earnings}</p>
              <p className="text-xs text-gray-400">This month</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Subscriber Insights
function SubscriberInsights() {
  return (
    <div className="bg-gray-800 p-6 rounded-xl">
      <h3 className="text-xl font-semibold text-blue-400 mb-4">
        👑 Subscriber Breakdown
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
          <div>
            <p className="font-semibold text-white">Free Followers</p>
            <p className="text-sm text-gray-400">Can view free content</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-300">3,247</p>
            <p className="text-xs text-gray-400">+89 this week</p>
          </div>
        </div>

        <div className="flex justify-between items-center p-4 bg-blue-800/50 rounded-lg">
          <div>
            <p className="font-semibold text-blue-300">Premium Subscribers</p>
            <p className="text-sm text-blue-400">$14.99/month</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-300">1,456</p>
            <p className="text-xs text-blue-400">+67 this week</p>
          </div>
        </div>

        <div className="flex justify-between items-center p-4 bg-yellow-800/50 rounded-lg">
          <div>
            <p className="font-semibold text-yellow-300">VIP Members</p>
            <p className="text-sm text-yellow-400">$29.99/month</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-yellow-300">391</p>
            <p className="text-xs text-yellow-400">+12 this week</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Recent Fan Messages
function FanInteractions() {
  const recentMessages = [
    {
      user: "DramaLover_23",
      message: "OMG your latest story had me crying! 😭 When's part 4?",
      tip: "$5",
      time: "2 hours ago",
    },
    {
      user: "StoryAddict_99",
      message: "Best creator on ChatLure! Your stories are so addictive 🔥",
      tip: "$10",
      time: "4 hours ago",
    },
    {
      user: "SecretFan_77",
      message: "Can you write more office drama? I'm obsessed!",
      tip: "$3",
      time: "6 hours ago",
    },
    {
      user: "VIPMember_12",
      message: "Love the exclusive content! Worth every penny 💰",
      tip: "$25",
      time: "1 day ago",
    },
  ];

  return (
    <div className="bg-gray-800 p-6 rounded-xl">
      <h3 className="text-xl font-semibold text-pink-400 mb-4">
        💬 Recent Fan Messages
      </h3>
      <div className="space-y-4">
        {recentMessages.map((msg, index) => (
          <div key={index} className="p-4 bg-gray-700 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {msg.user[0]}
                </div>
                <span className="font-semibold text-white">{msg.user}</span>
                {msg.tip && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    +{msg.tip}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">{msg.time}</span>
            </div>
            <p className="text-gray-300 text-sm">{msg.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Creator Dashboard now uses the custom CreatorContentImporter component

const Creator = () => {
  const [section, setSection] = useState("dashboard");

  return (
    <div className="w-full min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col py-8 px-4 min-h-screen">
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-purple-400">
              Creator Studio
            </h1>
            <NotificationCenter />
          </div>
          <p className="text-sm text-gray-400">Your Content Hub</p>
        </div>

        <nav className="flex flex-col space-y-1">
          {creatorSections.map((s) => {
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
              💰 Quick Stats
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">This Month:</span>
                <span className="text-green-400 font-bold">$2,547</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Subscribers:</span>
                <span className="text-blue-400 font-bold">1,847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Stories Published:</span>
                <span className="text-purple-400 font-bold">23</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {section === "dashboard" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Creator Dashboard</h2>
            <CreatorStats />

            <div className="grid grid-cols-2 gap-6 mb-8">
              <TopStoriesPerformance />
              <SubscriberInsights />
            </div>

            <FanInteractions />
          </div>
        )}

        {section === "library" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">📚 My Stories</h2>
            <StoryLibrary />
          </div>
        )}

        {section === "create" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">✨ Create New Story</h2>
            <StoryCreator
              onSave={(story) => {
                console.log("Story saved:", story);
              }}
            />
          </div>
        )}

        {section === "import" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">📥 Import Content</h2>
            <p className="text-gray-400 mb-6">
              Transform your real conversations into viral ChatLure stories
            </p>
            <CreatorContentImporter
              onImport={(stories) => {
                console.log("Stories imported:", stories);
              }}
            />
          </div>
        )}

        {section === "earnings" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">💰 Earnings Dashboard</h2>
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-green-800 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-green-300 mb-2">
                  Total Earnings
                </h3>
                <p className="text-3xl font-bold text-white">$18,456</p>
                <p className="text-sm text-green-200">All time</p>
              </div>
              <div className="bg-blue-800 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-blue-300 mb-2">
                  This Month
                </h3>
                <p className="text-3xl font-bold text-white">$2,547</p>
                <p className="text-sm text-blue-200">+23% vs last month</p>
              </div>
              <div className="bg-purple-800 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-purple-300 mb-2">
                  Pending Payout
                </h3>
                <p className="text-3xl font-bold text-white">$847</p>
                <p className="text-sm text-purple-200">Available Jan 15</p>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-yellow-400 mb-4">
                💸 Revenue Sources
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-700 rounded">
                  <span>Premium Subscriptions</span>
                  <span className="text-green-400 font-semibold">
                    $1,890 (74%)
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-700 rounded">
                  <span>VIP Subscriptions</span>
                  <span className="text-green-400 font-semibold">
                    $465 (18%)
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-700 rounded">
                  <span>Tips & Donations</span>
                  <span className="text-green-400 font-semibold">
                    $156 (6%)
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-700 rounded">
                  <span>Private Requests</span>
                  <span className="text-green-400 font-semibold">$36 (2%)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {section === "subscribers" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">👑 My Subscribers</h2>
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-800 p-4 rounded-xl text-center">
                <h3 className="text-lg font-semibold text-gray-300">
                  Free Followers
                </h3>
                <p className="text-2xl font-bold text-white">3,247</p>
                <p className="text-sm text-gray-400">+89 this week</p>
              </div>
              <div className="bg-blue-800 p-4 rounded-xl text-center">
                <h3 className="text-lg font-semibold text-blue-300">
                  Premium ($14.99)
                </h3>
                <p className="text-2xl font-bold text-white">1,456</p>
                <p className="text-sm text-blue-200">+67 this week</p>
              </div>
              <div className="bg-yellow-800 p-4 rounded-xl text-center">
                <h3 className="text-lg font-semibold text-yellow-300">
                  VIP ($29.99)
                </h3>
                <p className="text-2xl font-bold text-white">391</p>
                <p className="text-sm text-yellow-200">+12 this week</p>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-purple-400 mb-4">
                🌟 Top Supporters
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-gray-700 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-semibold">
                      V
                    </div>
                    <div>
                      <p className="font-semibold">VIPFan_Diamond</p>
                      <p className="text-sm text-gray-400">
                        VIP Member • $150 total tips
                      </p>
                    </div>
                  </div>
                  <span className="text-yellow-400">👑 VIP</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-700 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      S
                    </div>
                    <div>
                      <p className="font-semibold">StoryLover_Sara</p>
                      <p className="text-sm text-gray-400">
                        Premium Member • $87 total tips
                      </p>
                    </div>
                  </div>
                  <span className="text-purple-400">💎 Premium</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {section === "analytics" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">📈 Analytics</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-green-400 mb-4">
                  📊 Performance Metrics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Story Views</span>
                    <span className="font-semibold">47.2K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Engagement Rate</span>
                    <span className="font-semibold text-green-400">94%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stories Published</span>
                    <span className="font-semibold">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subscriber Growth</span>
                    <span className="font-semibold text-blue-400">+8.5%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-blue-400 mb-4">
                  🎯 Audience Insights
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Top Genre</span>
                    <span className="font-semibold">Relationship Drama</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Peak Activity</span>
                    <span className="font-semibold">8-10 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. Read Time</span>
                    <span className="font-semibold">12 mins</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completion Rate</span>
                    <span className="font-semibold text-green-400">89%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {section === "engagement" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">💬 Fan Interactions</h2>
            <FanInteractions />
          </div>
        )}

        {section === "profile" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">⚙️ Profile Settings</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-purple-400 mb-4">
                  👤 Creator Profile
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Creator Name
                    </label>
                    <input
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                      value="StoryQueen_Sarah"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Bio
                    </label>
                    <textarea
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 h-24"
                      value="Creating the most addictive relationship drama stories on ChatLure. New episodes every Tuesday & Friday! 💕"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Subscription Price
                    </label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2">
                      <option>$14.99/month</option>
                      <option>$9.99/month</option>
                      <option>$19.99/month</option>
                      <option>$24.99/month</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-blue-400 mb-4">
                  🔧 Creator Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Auto-publish new stories</span>
                    <input type="checkbox" className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Allow tips</span>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Private message requests</span>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Story collaboration invites</span>
                    <input type="checkbox" className="toggle" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {section === "payouts" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">💸 Payouts</h2>
            <div className="bg-gray-800 p-6 rounded-xl mb-6">
              <h3 className="text-xl font-semibold text-green-400 mb-4">
                💰 Payout Information
              </h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">$847</p>
                  <p className="text-sm text-gray-400">Available for Payout</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">$2,547</p>
                  <p className="text-sm text-gray-400">This Month Earnings</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-400">Jan 15</p>
                  <p className="text-sm text-gray-400">Next Payout Date</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                  <span>December 2024</span>
                  <span className="text-green-400 font-semibold">
                    $2,234 - Paid
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                  <span>November 2024</span>
                  <span className="text-green-400 font-semibold">
                    $1,987 - Paid
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                  <span>October 2024</span>
                  <span className="text-green-400 font-semibold">
                    $1,756 - Paid
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Creator;
