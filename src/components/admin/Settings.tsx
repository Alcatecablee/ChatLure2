import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Key,
  Globe,
  CreditCard,
  Shield,
  RefreshCw,
  TestTube,
} from "lucide-react";
import { useApp, useCredentials } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface ApiCredentials {
  reddit: {
    clientId: string;
    clientSecret: string;
    userAgent: string;
    enabled: boolean;
  };
  clerk: {
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
    enabled: boolean;
  };
  paypal: {
    clientId: string;
    clientSecret: string;
    planId: string;
    environment: "sandbox" | "production";
    enabled: boolean;
  };
}

export function Settings() {
  const { updateCredentials, addNotification } = useApp();
  const globalCredentials = useCredentials();
  const [credentials, setCredentials] = useState(globalCredentials);

  const [showSecrets, setShowSecrets] = useState({
    reddit: false,
    clerk: false,
    paypal: false,
  });

  const [connectionStatus, setConnectionStatus] = useState({
    reddit: "untested",
    clerk: "untested",
    paypal: "untested",
  });

  const [isLoading, setIsLoading] = useState({
    reddit: false,
    clerk: false,
    paypal: false,
  });

  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Update local state when global credentials change
  useEffect(() => {
    setCredentials(globalCredentials);
  }, [globalCredentials]);

  const saveCredentials = async () => {
    try {
      console.log("Starting to save credentials...");
      console.log("Reddit credentials:", credentials.reddit);

      // Save each service's credentials
      console.log("Saving Reddit credentials...");
      await updateCredentials("reddit", credentials.reddit);

      console.log("Saving Clerk credentials...");
      await updateCredentials("clerk", credentials.clerk);

      console.log("Saving PayPal credentials...");
      await updateCredentials("paypal", credentials.paypal);

      setLastSaved(new Date());

      addNotification({
        type: "success",
        title: "Settings Saved",
        message: "All API credentials have been saved successfully.",
      });

      console.log("All credentials saved successfully!");
    } catch (error) {
      console.error("Failed to save credentials:", error);
      addNotification({
        type: "error",
        title: "Save Failed",
        message: `Failed to save credentials: ${error.message}`,
      });
    }
  };

  const testConnection = async (service: keyof typeof connectionStatus) => {
    setIsLoading((prev) => ({ ...prev, [service]: true }));

    try {
      // Validate credentials before testing
      if (service === "reddit") {
        if (!credentials.reddit.clientId || !credentials.reddit.clientSecret) {
          throw new Error("Client ID and Secret are required");
        }
        if (!credentials.reddit.userAgent) {
          throw new Error("User Agent is required");
        }
      }

      // Test actual API connections
      const response = await fetch(`/api/test-connection/${service}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials[service]),
      });

      const result = await response.json();

      if (response.ok) {
        setConnectionStatus((prev) => ({ ...prev, [service]: "connected" }));
        addNotification({
          type: "success",
          title: "Connection Successful",
          message:
            service === "reddit"
              ? `Reddit API connected! Ready to scan viral content from ${result.availableSubreddits || "all"} subreddits.`
              : `${service} API connection tested successfully.`,
        });
      } else {
        setConnectionStatus((prev) => ({ ...prev, [service]: "error" }));
        addNotification({
          type: "error",
          title: "Connection Failed",
          message:
            result.error ||
            `Failed to connect to ${service} API. Check your credentials.`,
        });
      }
    } catch (error) {
      setConnectionStatus((prev) => ({ ...prev, [service]: "error" }));
      addNotification({
        type: "error",
        title: "Connection Error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, [service]: false }));
    }
  };

  const getStatusBadge = (status: string, isLoading: boolean) => {
    if (isLoading) {
      return (
        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
          <RefreshCw size={12} className="mr-1 animate-spin" />
          Testing...
        </Badge>
      );
    }

    switch (status) {
      case "connected":
        return (
          <Badge className="bg-green-500/20 text-green-400">
            <CheckCircle size={12} className="mr-1" />
            Connected
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive" className="bg-red-500/20 text-red-400">
            <AlertCircle size={12} className="mr-1" />
            Error
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-gray-400">
            <TestTube size={12} className="mr-1" />
            Untested
          </Badge>
        );
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gray-900 text-white rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-3">
            <SettingsIcon className="text-blue-400" />
            <span>API Settings</span>
          </h1>
          <p className="text-gray-400 mt-1">
            Configure your API credentials for Reddit, Clerk, and PayPal
            integration
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {lastSaved && (
            <span className="text-sm text-gray-400">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <Button
            onClick={saveCredentials}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save size={16} className="mr-2" />
            Save All Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="reddit" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="reddit" className="flex items-center space-x-2">
            <Globe size={16} />
            <span>Reddit API</span>
          </TabsTrigger>
          <TabsTrigger value="clerk" className="flex items-center space-x-2">
            <Shield size={16} />
            <span>Clerk Auth</span>
          </TabsTrigger>
          <TabsTrigger value="paypal" className="flex items-center space-x-2">
            <CreditCard size={16} />
            <span>PayPal</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reddit" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="text-orange-400" />
                  <span>Reddit API Configuration</span>
                </CardTitle>
                <p className="text-sm text-gray-400 mt-1">
                  Configure Reddit API to automatically import viral content
                  from subreddits
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {getStatusBadge(connectionStatus.reddit, isLoading.reddit)}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testConnection("reddit")}
                  disabled={isLoading.reddit}
                  className="border-gray-600"
                >
                  <TestTube size={14} className="mr-1" />
                  Test Connection
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Switch
                  checked={credentials?.reddit?.enabled || false}
                  onCheckedChange={(enabled) =>
                    setCredentials((prev) => ({
                      ...prev,
                      reddit: { ...prev.reddit, enabled },
                    }))
                  }
                />
                <Label>Enable Reddit Integration</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reddit-client-id">Client ID</Label>
                  <Input
                    id="reddit-client-id"
                    type={showSecrets.reddit ? "text" : "password"}
                    value={credentials?.reddit?.clientId || ""}
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        reddit: { ...prev.reddit, clientId: e.target.value },
                      }))
                    }
                    placeholder="Enter Reddit app client ID"
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <Label htmlFor="reddit-client-secret">Client Secret</Label>
                  <div className="relative">
                    <Input
                      id="reddit-client-secret"
                      type={showSecrets.reddit ? "text" : "password"}
                      value={credentials?.reddit?.clientSecret || ""}
                      onChange={(e) =>
                        setCredentials((prev) => ({
                          ...prev,
                          reddit: {
                            ...prev.reddit,
                            clientSecret: e.target.value,
                          },
                        }))
                      }
                      placeholder="Enter Reddit app client secret"
                      className="bg-gray-700 border-gray-600 pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() =>
                        setShowSecrets((prev) => ({
                          ...prev,
                          reddit: !prev.reddit,
                        }))
                      }
                    >
                      {showSecrets.reddit ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="reddit-user-agent">User Agent</Label>
                <Input
                  id="reddit-user-agent"
                  value={credentials?.reddit?.userAgent || ""}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      reddit: { ...prev.reddit, userAgent: e.target.value },
                    }))
                  }
                  placeholder="e.g., ChatLure:v1.0"
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                <h4 className="font-medium text-blue-400 mb-2">
                  📋 Setup Instructions
                </h4>
                <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                  <li>
                    Go to{" "}
                    <a
                      href="https://www.reddit.com/prefs/apps"
                      target="_blank"
                      className="text-blue-400 underline hover:text-blue-300"
                    >
                      Reddit App Preferences
                    </a>
                  </li>
                  <li>
                    Click "Create App" and select <strong>"script"</strong> type
                  </li>
                  <li>
                    Set redirect URI to:{" "}
                    <code className="bg-gray-700 px-2 py-1 rounded text-green-400">
                      http://localhost:8080/auth/reddit
                    </code>
                  </li>
                  <li>Copy the client ID and secret to the fields above</li>
                  <li>Test the connection to verify it's working</li>
                </ol>

                <div className="mt-4 pt-4 border-t border-blue-500/20">
                  <h5 className="font-medium text-blue-300 mb-2">
                    🔥 Content Sources
                  </h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-blue-300">• r/insaneparents</span> -
                      Family drama
                    </div>
                    <div>
                      <span className="text-blue-300">
                        • r/relationship_advice
                      </span>{" "}
                      - Romance drama
                    </div>
                    <div>
                      <span className="text-blue-300">• r/AmItheAsshole</span> -
                      Moral conflicts
                    </div>
                    <div>
                      <span className="text-blue-300">• r/ChoosingBeggars</span>{" "}
                      - Entitled behavior
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-blue-500/20">
                  <h5 className="font-medium text-blue-300 mb-1">💡 Pro Tip</h5>
                  <p className="text-xs text-gray-400">
                    Reddit posts with 5K+ upvotes typically convert to viral
                    ChatLure stories. The content scanner will automatically
                    identify high-potential posts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clerk" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="text-green-400" />
                  <span>Clerk Authentication</span>
                </CardTitle>
                <p className="text-sm text-gray-400 mt-1">
                  Configure Clerk for user authentication and management
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {getStatusBadge(connectionStatus.clerk, isLoading.clerk)}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testConnection("clerk")}
                  disabled={isLoading.clerk}
                  className="border-gray-600"
                >
                  <TestTube size={14} className="mr-1" />
                  Test Connection
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Switch
                  checked={credentials?.clerk?.enabled || false}
                  onCheckedChange={(enabled) =>
                    setCredentials((prev) => ({
                      ...prev,
                      clerk: { ...prev.clerk, enabled },
                    }))
                  }
                />
                <Label>Enable Clerk Authentication</Label>
              </div>

              <div>
                <Label htmlFor="clerk-publishable">Publishable Key</Label>
                <Input
                  id="clerk-publishable"
                  value={credentials?.clerk?.publishableKey || ""}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      clerk: { ...prev.clerk, publishableKey: e.target.value },
                    }))
                  }
                  placeholder="pk_test_..."
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div>
                <Label htmlFor="clerk-secret">Secret Key</Label>
                <div className="relative">
                  <Input
                    id="clerk-secret"
                    type={showSecrets.clerk ? "text" : "password"}
                    value={credentials?.clerk?.secretKey || ""}
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        clerk: { ...prev.clerk, secretKey: e.target.value },
                      }))
                    }
                    placeholder="sk_test_..."
                    className="bg-gray-700 border-gray-600 pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() =>
                      setShowSecrets((prev) => ({
                        ...prev,
                        clerk: !prev.clerk,
                      }))
                    }
                  >
                    {showSecrets.clerk ? (
                      <EyeOff size={14} />
                    ) : (
                      <Eye size={14} />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="clerk-webhook">Webhook Secret</Label>
                <Input
                  id="clerk-webhook"
                  type={showSecrets.clerk ? "text" : "password"}
                  value={credentials?.clerk?.webhookSecret || ""}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      clerk: { ...prev.clerk, webhookSecret: e.target.value },
                    }))
                  }
                  placeholder="whsec_..."
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg">
                <h4 className="font-medium text-green-400 mb-2">
                  🔑 Setup Instructions
                </h4>
                <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                  <li>
                    Create a Clerk application at{" "}
                    <a
                      href="https://clerk.com"
                      target="_blank"
                      className="text-green-400 underline"
                    >
                      clerk.com
                    </a>
                  </li>
                  <li>Copy the publishable key from your Clerk dashboard</li>
                  <li>Copy the secret key (keep this secure!)</li>
                  <li>Set up webhooks for user events</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paypal" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="text-yellow-400" />
                  <span>PayPal Integration</span>
                </CardTitle>
                <p className="text-sm text-gray-400 mt-1">
                  Configure PayPal for subscription payments and billing
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {getStatusBadge(connectionStatus.paypal, isLoading.paypal)}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testConnection("paypal")}
                  disabled={isLoading.paypal}
                  className="border-gray-600"
                >
                  <TestTube size={14} className="mr-1" />
                  Test Connection
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Switch
                  checked={credentials?.paypal?.enabled || false}
                  onCheckedChange={(enabled) =>
                    setCredentials((prev) => ({
                      ...prev,
                      paypal: { ...prev.paypal, enabled },
                    }))
                  }
                />
                <Label>Enable PayPal Payments</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paypal-client-id">Client ID</Label>
                  <Input
                    id="paypal-client-id"
                    value={credentials?.paypal?.clientId || ""}
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        paypal: { ...prev.paypal, clientId: e.target.value },
                      }))
                    }
                    placeholder="Enter PayPal client ID"
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <Label htmlFor="paypal-client-secret">Client Secret</Label>
                  <div className="relative">
                    <Input
                      id="paypal-client-secret"
                      type={showSecrets.paypal ? "text" : "password"}
                      value={credentials?.paypal?.clientSecret || ""}
                      onChange={(e) =>
                        setCredentials((prev) => ({
                          ...prev,
                          paypal: {
                            ...prev.paypal,
                            clientSecret: e.target.value,
                          },
                        }))
                      }
                      placeholder="Enter PayPal client secret"
                      className="bg-gray-700 border-gray-600 pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() =>
                        setShowSecrets((prev) => ({
                          ...prev,
                          paypal: !prev.paypal,
                        }))
                      }
                    >
                      {showSecrets.paypal ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="paypal-plan-id">Subscription Plan ID</Label>
                <Input
                  id="paypal-plan-id"
                  value={credentials?.paypal?.planId || ""}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      paypal: { ...prev.paypal, planId: e.target.value },
                    }))
                  }
                  placeholder="P-xxxxxxxxxxxxxxxxxxxxx"
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div>
                <Label>Environment</Label>
                <div className="flex space-x-4 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={credentials.paypal.environment === "sandbox"}
                      onChange={() =>
                        setCredentials((prev) => ({
                          ...prev,
                          paypal: { ...prev.paypal, environment: "sandbox" },
                        }))
                      }
                      className="text-yellow-500"
                    />
                    <span>Sandbox (Testing)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={credentials.paypal.environment === "production"}
                      onChange={() =>
                        setCredentials((prev) => ({
                          ...prev,
                          paypal: { ...prev.paypal, environment: "production" },
                        }))
                      }
                      className="text-yellow-500"
                    />
                    <span>Production (Live)</span>
                  </label>
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-400 mb-2">
                  💰 Setup Instructions
                </h4>
                <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                  <li>
                    Create a PayPal Developer account at{" "}
                    <a
                      href="https://developer.paypal.com"
                      target="_blank"
                      className="text-yellow-400 underline"
                    >
                      developer.paypal.com
                    </a>
                  </li>
                  <li>Create a new app in your PayPal dashboard</li>
                  <li>Copy the client ID and secret</li>
                  <li>Create a subscription plan and copy the plan ID</li>
                  <li>
                    Start with sandbox for testing, switch to production when
                    ready
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
