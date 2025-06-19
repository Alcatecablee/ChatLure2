import { AnimatePresence } from "framer-motion";
import { usePhoneNavigation } from "@/hooks/usePhoneNavigation";
import { useBatteryContext } from "@/contexts/BatteryContext";
import { useOnboarding } from "@/hooks/useOnboarding";
import { StatusBar } from "./StatusBar";
import { HomeScreen } from "./HomeScreen";
import { PhoneShutdown } from "./PhoneShutdown";
import { PhoneApp } from "../apps/Phone";
import { ChatLureApp } from "../apps/ChatLure";
import { SettingsApp } from "../apps/Settings";
import { CameraApp } from "../apps/Camera";
import { CalculatorApp } from "../apps/Calculator";
import { ChatLurePremium } from "../apps/ChatLurePremium";
import { useState, useEffect, useCallback } from "react";

export function PhoneInterface() {
  const { currentApp, navigateToApp, goHome } = usePhoneNavigation();
  const { battery, instantCharge } = useBatteryContext();
  const { skipOnboarding } = useOnboarding();
  const [showPremiumUpgrade, setShowPremiumUpgrade] = useState(false);

  // Skip onboarding immediately on mount
  useEffect(() => {
    skipOnboarding();
  }, [skipOnboarding]);

  // Check if phone should be dead due to battery
  if (battery.isDead) {
    return (
      <div className="relative w-full h-full overflow-hidden">
        <StatusBar />
        <PhoneShutdown onPremiumUpgrade={() => setShowPremiumUpgrade(true)} />
        {showPremiumUpgrade && (
          <div className="absolute inset-0 z-50">
            <ChatLurePremium
              onBack={() => setShowPremiumUpgrade(false)}
              onUpgrade={() => {
                instantCharge();
                setShowPremiumUpgrade(false);
              }}
            />
          </div>
        )}
      </div>
    );
  }

  const renderCurrentApp = () => {
    switch (currentApp) {
      case "home":
        return <HomeScreen onAppSelect={navigateToApp} />;
      case "phone":
        return <PhoneApp onBack={goHome} />;
      case "messages":
        return <ChatLureApp onBack={goHome} />;
      case "settings":
        return <SettingsApp onBack={goHome} />;
      case "camera":
        return <CameraApp onBack={goHome} />;
      case "calculator":
        return <CalculatorApp onBack={goHome} />;
      case "inbox":
        return (
          <div className="w-full h-full bg-gradient-to-b from-blue-900 to-blue-700 flex flex-col">
            <div className="flex items-center justify-between p-4 text-white">
              <button onClick={goHome} className="text-blue-400">
                ‹ Back
              </button>
              <h1 className="text-lg font-semibold">Inbox</h1>
              <div></div>
            </div>
            <div className="flex-1 px-4">
              <div className="bg-blue-800/50 rounded-lg p-4 mb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-xs">
                    📩
                  </div>
                  <div>
                    <p className="text-white font-medium">New Story Alert</p>
                    <p className="text-blue-300 text-sm">
                      2 new drama stories available
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-800/50 rounded-lg p-4 mb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-xs">
                    🔥
                  </div>
                  <div>
                    <p className="text-white font-medium">Trending Now</p>
                    <p className="text-blue-300 text-sm">
                      "Office Betrayal" is viral!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "timer":
        return (
          <div className="w-full h-full bg-gradient-to-b from-orange-900 to-red-700 flex flex-col">
            <div className="flex items-center justify-between p-4 text-white">
              <button onClick={goHome} className="text-orange-400">
                ‹ Back
              </button>
              <h1 className="text-lg font-semibold">Story Timer</h1>
              <div></div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">⏰</div>
                <h2 className="text-white text-2xl mb-2">
                  Next Story Drops In
                </h2>
                <div className="text-4xl font-mono text-orange-300 mb-4">
                  02:34:17
                </div>
                <p className="text-orange-200">"College Scandal Part 3"</p>
              </div>
            </div>
          </div>
        );
      case "discover":
        return (
          <div className="w-full h-full bg-gradient-to-b from-purple-900 to-pink-700 flex flex-col">
            <div className="flex items-center justify-between p-4 text-white">
              <button onClick={goHome} className="text-purple-400">
                ‹ Back
              </button>
              <h1 className="text-lg font-semibold">Discover</h1>
              <div></div>
            </div>
            <div className="flex-1 px-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🏫</div>
                  <p className="text-white font-medium">Campus Drama</p>
                  <p className="text-purple-300 text-xs">12 stories</p>
                </div>
                <div className="bg-purple-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">💼</div>
                  <p className="text-white font-medium">Office Secrets</p>
                  <p className="text-purple-300 text-xs">8 stories</p>
                </div>
                <div className="bg-purple-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">💕</div>
                  <p className="text-white font-medium">Love Triangles</p>
                  <p className="text-purple-300 text-xs">15 stories</p>
                </div>
                <div className="bg-purple-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🏠</div>
                  <p className="text-white font-medium">Family Drama</p>
                  <p className="text-purple-300 text-xs">6 stories</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "soundtrack":
        return (
          <div className="w-full h-full bg-gradient-to-b from-pink-900 to-purple-700 flex flex-col">
            <div className="flex items-center justify-between p-4 text-white">
              <button onClick={goHome} className="text-pink-400">
                ‹ Back
              </button>
              <h1 className="text-lg font-semibold">Sounds</h1>
              <div></div>
            </div>
            <div className="flex-1 px-4">
              <div className="space-y-3">
                <div className="bg-pink-800/50 rounded-lg p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center">
                    🎵
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Dramatic Tension</p>
                    <p className="text-pink-300 text-sm">
                      Perfect for intense conversations
                    </p>
                  </div>
                  <button className="text-pink-400">▶️</button>
                </div>
                <div className="bg-pink-800/50 rounded-lg p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center">
                    💔
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Heartbreak Vibes</p>
                    <p className="text-pink-300 text-sm">
                      For emotional story moments
                    </p>
                  </div>
                  <button className="text-pink-400">▶️</button>
                </div>
              </div>
            </div>
          </div>
        );
      case "browse":
        return (
          <div className="w-full h-full bg-gradient-to-b from-blue-900 to-indigo-700 flex flex-col">
            <div className="flex items-center justify-between p-4 text-white">
              <button onClick={goHome} className="text-blue-400">
                ‹ Back
              </button>
              <h1 className="text-lg font-semibold">Browse</h1>
              <div></div>
            </div>
            <div className="flex-1 px-4">
              <div className="bg-blue-800/50 rounded-lg p-3 mb-4">
                <input
                  type="text"
                  placeholder="Search viral drama..."
                  className="w-full bg-transparent text-white placeholder-blue-300 outline-none"
                />
              </div>
              <div className="space-y-3">
                <div className="bg-blue-800/50 rounded-lg p-4">
                  <p className="text-white font-medium mb-1">
                    🔥 Trending on Reddit
                  </p>
                  <p className="text-blue-300 text-sm">
                    "AITA for exposing my roommate's secret?"
                  </p>
                </div>
                <div className="bg-blue-800/50 rounded-lg p-4">
                  <p className="text-white font-medium mb-1">📱 TikTok Drama</p>
                  <p className="text-blue-300 text-sm">
                    "College friendship betrayal goes viral"
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case "schedule":
        return (
          <div className="w-full h-full bg-gradient-to-b from-red-900 to-orange-700 flex flex-col">
            <div className="flex items-center justify-between p-4 text-white">
              <button onClick={goHome} className="text-red-400">
                ‹ Back
              </button>
              <h1 className="text-lg font-semibold">Schedule</h1>
              <div></div>
            </div>
            <div className="flex-1 px-4">
              <div className="space-y-3">
                <div className="bg-red-800/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-white font-medium">Today</p>
                    <span className="text-red-300 text-sm">3 stories</span>
                  </div>
                  <p className="text-red-300 text-sm">
                    • "Office Betrayal" Part 4 - 9:00 PM
                  </p>
                </div>
                <div className="bg-red-800/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-white font-medium">Tomorrow</p>
                    <span className="text-red-300 text-sm">2 stories</span>
                  </div>
                  <p className="text-red-300 text-sm">
                    • "College Scandal" Finale - 8:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case "gallery":
        return (
          <div className="w-full h-full bg-gradient-to-b from-yellow-900 to-orange-700 flex flex-col">
            <div className="flex items-center justify-between p-4 text-white">
              <button onClick={goHome} className="text-yellow-400">
                ‹ Back
              </button>
              <h1 className="text-lg font-semibold">Gallery</h1>
              <div></div>
            </div>
            <div className="flex-1 px-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-square bg-yellow-800/50 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📸</span>
                </div>
                <div className="aspect-square bg-yellow-800/50 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <div className="aspect-square bg-yellow-800/50 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
              </div>
              <p className="text-yellow-300 text-center mt-4 text-sm">
                Save your favorite story moments
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-full bg-black flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-white text-xl mb-2">App Coming Soon</h2>
              <button
                onClick={goHome}
                className="text-ios-blue hover:text-ios-blue/80"
              >
                Go Home
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <StatusBar />
      <AnimatePresence mode="wait">{renderCurrentApp()}</AnimatePresence>
    </div>
  );
}
