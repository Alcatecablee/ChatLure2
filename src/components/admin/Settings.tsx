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
import { redditAPI } from "@/utils/redditApi";

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

    // Lock Screen Settings
    lockScreenEnabled: true,
    lockScreenWallpaper: "",
    showNotificationsOnLock: true,
    autoLockTime: 5,
    requirePasscode: false,
  });

  const [showApiKeys, setShowApiKeys] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [testingConnection, setTestingConnection] = useState<string | null>(
    null,
  );

  useEffect(() => {
    loadSettings();
  }, [currentUser]);

  const loadSettings = () => {
    // Load from localStorage
    const saved = localStorage.getItem("chatlure-admin-settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
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
            soundEnabled: true,
            theme: currentUser.preferences.theme,
            autoPlay: true,
          },
        });
      }

      setLastSaved(new Date());
      setTimeout(() => setSaving(false), 1000);
    } catch (error) {
      console.error("Failed to save settings:", error);
      setSaving(false);
    }
  };

  const testConnection = async (service: string) => {
    setTestingConnection(service);

    try {
      if (service === "reddit") {
        const redditCreds = {
          clientId: settings.redditClientId,
          clientSecret: settings.redditClientSecret,
          userAgent: "ChatLure:v1.0 (by /u/chatlure)",
          enabled: true,
        };

        if (!redditCreds.clientId || !redditCreds.clientSecret) {
          alert("Please enter both Reddit Client ID and Client Secret first.");
          setTestingConnection(null);
          return false;
        }

        const success = await redditAPI.testConnection(redditCreds);

        if (success) {
          alert(
            "✅ Reddit API connection successful! You can now scan Reddit for viral content.",
          );
        } else {
          alert(
            "❌ Reddit API connection failed. Please check your credentials.",
          );
        }

        setTestingConnection(null);
        return success;
      } else {
        // For other services, simulate test for now
        await new Promise((resolve) => setTimeout(resolve, 2000));
        alert(`${service} connection testing is not yet implemented.`);
        setTestingConnection(null);
        return Math.random() > 0.3;
      }
    } catch (error) {
      alert(
        `Connection test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      setTestingConnection(null);
      return false;
    }
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
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>

      {/* API Configuration */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-blue-400" />
            <span>API Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">API Keys</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowApiKeys(!showApiKeys)}
            >
              {showApiKeys ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                OpenAI API Key
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  type={showApiKeys ? "text" : "password"}
                  value={settings.openaiApiKey}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      openaiApiKey: e.target.value,
                    }))
                  }
                  placeholder="Enter OpenAI API key"
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
              <div className="flex items-center space-x-2">
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
          </div>
        </CardContent>
      </Card>

      {/* App Settings */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>App Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    Enable Notifications
                  </label>
                  <p className="text-xs text-gray-500">
                    Allow push notifications
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

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Enable Lock Screen
                  </label>
                  <p className="text-xs text-gray-500">
                    Show lock screen with wallpaper
                  </p>
                </div>
                <Switch
                  checked={settings.lockScreenEnabled}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      lockScreenEnabled: checked,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Auto Lock Time (minutes)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.autoLockTime}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      autoLockTime: parseInt(e.target.value) || 5,
                    }))
                  }
                  className="bg-gray-700 border-gray-600 text-white"
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
