import { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Globe,
  CreditCard,
  Shield,
  RefreshCw,
  TestTube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDatabase } from "@/contexts/DatabaseContext";

export function Settings() {
  const { currentUser, updateUser } = useDatabase();
  const [settings, setSettings] = useState({
    // API Settings
    openaiApiKey: "",
    redditClientId: "",
    redditClientSecret: "",
    paypalClientId: "",
    paypalPlanId: "",

    // App Settings
    maxStoriesPerUser: 10,
    autoModeration: true,
    allowAnonymous: false,
    enableLocation: true,
    enableNotifications: true,

    // Content Settings
    contentFiltering: true,
    explicitContent: false,
    minReadingTime: 5,
    maxReadingTime: 60,

    // Privacy Settings
    publicProfiles: true,
    shareAnalytics: false,
    allowDataExport: true,

    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: true,
  });

  const [showApiKeys, setShowApiKeys] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [testingConnection, setTestingConnection] = useState<string | null>(
    null,
  );

  useEffect(() => {
    // Load settings from user preferences and localStorage
    loadSettings();
  }, [currentUser]);

  const loadSettings = () => {
    // Load from localStorage (simulating app-wide settings)
    const savedSettings = localStorage.getItem("chatlure-admin-settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    }

    // Load user-specific settings
    if (currentUser?.preferences) {
      setSettings((prev) => ({
        ...prev,
        enableNotifications: currentUser.preferences.notifications,
        // Add other user preference mappings
      }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save to localStorage (app-wide settings)
      localStorage.setItem("chatlure-admin-settings", JSON.stringify(settings));

      // Update user preferences in database
      if (currentUser) {
        await updateUser({
          preferences: {
            ...currentUser.preferences,
            notifications: settings.enableNotifications,
            soundEnabled: true, // Keep existing
            theme: currentUser.preferences.theme, // Keep existing
            autoPlay: true, // Keep existing
          },
        });
      }

      setLastSaved(new Date());

      // Show success feedback
      setTimeout(() => setSaving(false), 1000);
    } catch (error) {
      console.error("Failed to save settings:", error);
      setSaving(false);
    }
  };

  const testConnection = async (service: string) => {
    setTestingConnection(service);

    // Simulate API testing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setTestingConnection(null);

    // In a real app, you'd test the actual API connection here
    return Math.random() > 0.3; // 70% success rate for demo
  };

  const resetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to defaults?")) {
      localStorage.removeItem("chatlure-admin-settings");
      loadSettings();
    }
  };

  const ConnectionStatus = ({ isConnected }: { isConnected: boolean }) => (
    <div className="flex items-center space-x-2">
      {isConnected ? (
        <>
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-green-400 text-sm">Connected</span>
        </>
      ) : (
        <>
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-red-400 text-sm">Not configured</span>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <SettingsIcon className="w-6 h-6" />
            <span>Settings & Configuration</span>
          </h2>
          <p className="text-gray-400 mt-1">
            Configure API keys, app behavior, and system preferences
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {lastSaved && (
            <div className="text-sm text-gray-400">
              Last saved: {lastSaved.toLocaleTimeString()}
            </div>
          )}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>

      {/* API Configuration */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>API Configuration</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowApiKeys(!showApiKeys)}
              className="text-gray-400 hover:text-white"
            >
              {showApiKeys ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                OpenAI API Key
              </label>
              <div className="flex space-x-2">
                <Input
                  type={showApiKeys ? "text" : "password"}
                  value={settings.openaiApiKey}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      openaiApiKey: e.target.value,
                    }))
                  }
                  placeholder="sk-..."
                  className="bg-gray-800 border-gray-600 text-white"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testConnection("openai")}
                  disabled={testingConnection === "openai"}
                  className="border-gray-600"
                >
                  {testingConnection === "openai" ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <TestTube className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <ConnectionStatus isConnected={!!settings.openaiApiKey} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reddit Client ID
              </label>
              <div className="flex space-x-2">
                <Input
                  type={showApiKeys ? "text" : "password"}
                  value={settings.redditClientId}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      redditClientId: e.target.value,
                    }))
                  }
                  placeholder="Enter Reddit client ID"
                  className="bg-gray-800 border-gray-600 text-white"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testConnection("reddit")}
                  disabled={testingConnection === "reddit"}
                  className="border-gray-600"
                >
                  {testingConnection === "reddit" ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <TestTube className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <ConnectionStatus isConnected={!!settings.redditClientId} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                PayPal Client ID
              </label>
              <Input
                type={showApiKeys ? "text" : "password"}
                value={settings.paypalClientId}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    paypalClientId: e.target.value,
                  }))
                }
                placeholder="Enter PayPal client ID"
                className="bg-gray-800 border-gray-600 text-white"
              />
              <ConnectionStatus isConnected={!!settings.paypalClientId} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                PayPal Plan ID
              </label>
              <Input
                value={settings.paypalPlanId}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    paypalPlanId: e.target.value,
                  }))
                }
                placeholder="Enter PayPal subscription plan ID"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Configuration */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5" />
            <span>App Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Stories Per User
                </label>
                <Input
                  type="number"
                  value={settings.maxStoriesPerUser}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      maxStoriesPerUser: parseInt(e.target.value),
                    }))
                  }
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Min Reading Time (minutes)
                </label>
                <Input
                  type="number"
                  value={settings.minReadingTime}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      minReadingTime: parseInt(e.target.value),
                    }))
                  }
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Auto Moderation
                  </label>
                  <p className="text-xs text-gray-500">
                    Automatically moderate content
                  </p>
                </div>
                <Switch
                  checked={settings.autoModeration}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      autoModeration: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Allow Anonymous
                  </label>
                  <p className="text-xs text-gray-500">
                    Allow anonymous story posting
                  </p>
                </div>
                <Switch
                  checked={settings.allowAnonymous}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      allowAnonymous: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Enable Location
                  </label>
                  <p className="text-xs text-gray-500">
                    Enable location-based features
                  </p>
                </div>
                <Switch
                  checked={settings.enableLocation}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      enableLocation: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Enable Notifications
                  </label>
                  <p className="text-xs text-gray-500">
                    Enable push notifications
                  </p>
                </div>
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      enableNotifications: checked,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Safety */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Privacy & Safety</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Content Filtering
                  </label>
                  <p className="text-xs text-gray-500">
                    Enable content filtering
                  </p>
                </div>
                <Switch
                  checked={settings.contentFiltering}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      contentFiltering: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Allow Explicit Content
                  </label>
                  <p className="text-xs text-gray-500">
                    Allow explicit content
                  </p>
                </div>
                <Switch
                  checked={settings.explicitContent}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      explicitContent: checked,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Public Profiles
                  </label>
                  <p className="text-xs text-gray-500">
                    Allow public user profiles
                  </p>
                </div>
                <Switch
                  checked={settings.publicProfiles}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      publicProfiles: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Share Analytics
                  </label>
                  <p className="text-xs text-gray-500">
                    Share anonymous analytics
                  </p>
                </div>
                <Switch
                  checked={settings.shareAnalytics}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      shareAnalytics: checked,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700">
        <div>
          <h3 className="text-white font-medium">Reset Settings</h3>
          <p className="text-gray-400 text-sm">
            Reset all settings to default values
          </p>
        </div>
        <Button
          variant="outline"
          onClick={resetSettings}
          className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
        >
          Reset to Defaults
        </Button>
      </div>

      {/* Status */}
      <div className="flex items-center space-x-4 text-sm text-gray-400">
        <Badge variant="outline" className="border-green-600 text-green-400">
          <CheckCircle className="w-3 h-3 mr-1" />
          Settings Active
        </Badge>
        <span>Configuration saved to local storage</span>
      </div>
    </div>
  );
}
