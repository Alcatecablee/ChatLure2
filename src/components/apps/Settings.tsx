import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, Toggle } from "lucide-react";
import { useState } from "react";
import { StoryCreator } from "../admin/StoryCreator";
import { ContentImporter } from "../admin/ContentImporter";

interface SettingsAppProps {
  onBack: () => void;
}

export function SettingsApp({ onBack }: SettingsAppProps) {
  const [currentView, setCurrentView] = useState<
    "main" | "story-creator" | "content-importer"
  >("main");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [adultContent, setAdultContent] = useState(false);
  const [dataUsage, setDataUsage] = useState("wifi");

  const settingsItems = [
    { name: "Account & Profile", icon: "👤", type: "navigation" },
    { name: "Subscription & Billing", icon: "💳", type: "navigation" },
    { name: "Notifications", icon: "🔔", type: "navigation" },
    { name: "Privacy & Safety", icon: "🔒", type: "navigation" },
    { name: "Content Preferences", icon: "🎭", type: "navigation" },
    { name: "Data Usage", icon: "📊", type: "navigation" },
  ];

  const toggleSettings = [
    {
      name: "Notifications",
      description: "Receive push notifications",
      value: notificationsEnabled,
      onChange: setNotificationsEnabled,
    },
    {
      name: "Lock Screen",
      description: "Enable lock screen with wallpaper",
      value: true, // Will be connected to lock screen context
      onChange: () => {}, // Will be connected to lock screen context
    },
    {
      name: "Auto-play Videos",
      description: "Videos play automatically",
      value: autoPlay,
      onChange: setAutoPlay,
    },
    {
      name: "Adult Content",
      description: "Show mature/explicit content",
      value: adultContent,
      onChange: setAdultContent,
    },
  ];

  const handleItemClick = (item: any) => {
    // No admin tool logic needed anymore
  };

  // Render different views based on current state
  if (currentView === "story-creator" || currentView === "content-importer") {
    // Remove these views entirely
    return null;
  }

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className="w-full h-full bg-black text-white flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-16">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/50"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center space-x-2">
          <img
            src="https://cdn.builder.io/api/v1/assets/e980716d00e74498a7a36072ff1bc031/default-12-12ba5b?format=webp&width=800"
            alt="ChatLure Logo"
            className="w-6 h-6 rounded-full"
          />
          <h1 className="text-lg font-semibold">ChatLure Settings</h1>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Account Section */}
      <div className="flex-1 px-4 space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-2xl">
              👁️
            </div>
            <div>
              <h3 className="text-white font-semibold">Secret Voyeur</h3>
              <p className="text-gray-300 text-sm">Premium Member</p>
              <p className="text-purple-400 text-xs">Level 15 Stalker</p>
            </div>
          </div>
        </motion.div>

        {/* Main Settings */}
        <div className="bg-gray-900/50 rounded-xl overflow-hidden">
          {settingsItems.map((item, index) => (
            <motion.button
              key={item.name}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
              onClick={() => handleItemClick(item)}
              className={`w-full flex items-center justify-between p-4 border-b border-gray-800/50 last:border-b-0 hover:bg-gray-800/30 transition-colors ${
                item.special
                  ? "bg-purple-900/20 border border-purple-500/30"
                  : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <span
                    className={`${item.special ? "text-purple-400 font-semibold" : "text-white"}`}
                  >
                    {item.name}
                  </span>
                  {item.special && (
                    <div className="text-xs text-purple-300">Admin Tool</div>
                  )}
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </motion.button>
          ))}
        </div>

        {/* Toggle Settings */}
        <div className="bg-gray-900/50 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800/50">
            <h3 className="text-white font-semibold">Quick Settings</h3>
          </div>
          {toggleSettings.map((setting, index) => (
            <motion.div
              key={setting.name}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
              className="flex items-center justify-between p-4 border-b border-gray-800/50 last:border-b-0"
            >
              <div className="flex-1">
                <h4 className="text-white font-medium">{setting.name}</h4>
                <p className="text-gray-400 text-sm">{setting.description}</p>
              </div>
              <button
                onClick={() => setting.onChange(!setting.value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  setting.value ? "bg-ios-blue" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    setting.value ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Data Usage */}
        <div className="bg-gray-900/50 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3">Data Usage</h3>
          <div className="space-y-3">
            {["wifi", "cellular", "offline"].map((option) => (
              <button
                key={option}
                onClick={() => setDataUsage(option)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">
                    {option === "wifi"
                      ? "📶"
                      : option === "cellular"
                        ? "📱"
                        : "💾"}
                  </span>
                  <div className="text-left">
                    <p className="text-white capitalize">
                      {option === "wifi"
                        ? "Wi-Fi Only"
                        : option === "cellular"
                          ? "Cellular Data"
                          : "Offline Mode"}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {option === "wifi"
                        ? "Use Wi-Fi for stories"
                        : option === "cellular"
                          ? "Use mobile data"
                          : "Downloaded stories only"}
                    </p>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 ${dataUsage === option ? "bg-ios-blue border-ios-blue" : "border-gray-400"}`}
                ></div>
              </button>
            ))}
          </div>
        </div>

        {/* App Info */}
        <div className="bg-gray-900/50 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3">About ChatLure</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Version</span>
              <span className="text-white">2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Stories Watched</span>
              <span className="text-white">47</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Time Spent</span>
              <span className="text-white">12h 34m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Subscription</span>
              <span className="text-purple-400">Premium</span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
          <h3 className="text-red-400 font-semibold mb-3">Danger Zone</h3>
          <div className="space-y-2">
            <button className="w-full text-left text-red-400 hover:text-red-300 transition-colors">
              Clear Viewing History
            </button>
            <button className="w-full text-left text-red-400 hover:text-red-300 transition-colors">
              Reset All Settings
            </button>
            <button className="w-full text-left text-red-500 hover:text-red-400 transition-colors font-medium">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
