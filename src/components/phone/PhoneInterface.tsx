import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HomeScreen } from "./HomeScreen";
import { StatusBar } from "./StatusBar";
import { LockScreen } from "./LockScreen";
import { useLockScreen } from "@/contexts/LockScreenContext";
import { useBattery } from "@/contexts/BatteryContext";

// App imports - only existing apps
import { ChatLureApp as ChatLure } from "../apps/ChatLure";
import { ChatLurePremium } from "../apps/ChatLurePremium";
import { Inbox } from "../apps/Inbox";
import { StoryTimer } from "../apps/StoryTimer";
import { Discover } from "../apps/Discover";
import { Soundtrack } from "../apps/Soundtrack";
import { Browse } from "../apps/Browse";
import { Schedule } from "../apps/Schedule";
import { Gallery } from "../apps/Gallery";
import { SettingsApp as Settings } from "../apps/Settings";
import { CalculatorApp as Calculator } from "../apps/Calculator";
import { CameraApp as Camera } from "../apps/Camera";

export function PhoneInterface() {
  const [currentApp, setCurrentApp] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [previousApp, setPreviousApp] = useState<string | null>(null);
  const { battery } = useBattery();
  const { isLocked, unlock, settings } = useLockScreen();

  const handleAppClick = (appId: string) => {
    if (isLocked || isAnimating || battery.isDead) return;

    setIsAnimating(true);
    setPreviousApp(currentApp);
    setCurrentApp(appId);
  };

  const handleBackClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentApp(null);
  };

  const renderApp = () => {
    if (!currentApp) return null;

    const appProps = {
      onBack: handleBackClick,
      onNavigate: handleAppClick,
    };

    switch (currentApp) {
      case "chatlure":
        return <ChatLure {...appProps} />;
      case "chatlure-premium":
        return <ChatLurePremium {...appProps} />;
      case "inbox":
        return <Inbox {...appProps} />;
      case "story-timer":
        return <StoryTimer {...appProps} />;
      case "discover":
        return <Discover {...appProps} />;
      case "soundtrack":
        return <Soundtrack {...appProps} />;
      case "browse":
        return <Browse {...appProps} />;
      case "schedule":
        return <Schedule {...appProps} />;
      case "gallery":
        return <Gallery {...appProps} />;
      case "settings":
        return <Settings {...appProps} />;
      case "calculator":
        return <Calculator {...appProps} />;
      case "camera":
        return <Camera {...appProps} />;
      default:
        return null;
    }
  };

  if (battery.isDead) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-2 border-red-500 rounded flex items-center justify-center">
            <span className="text-red-500 text-xs">🔋</span>
          </div>
          <p className="text-white text-sm">Battery Dead</p>
          <p className="text-gray-400 text-xs">Connect to charger</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black flex flex-col relative">
      {/* Status Bar */}
      <StatusBar />

      {/* Main Screen Area */}
      <div className="flex-1 relative bg-black overflow-hidden">
        <AnimatePresence
          mode="wait"
          onExitComplete={() => setIsAnimating(false)}
        >
          {currentApp ? (
            <motion.div
              key={currentApp}
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0"
            >
              {renderApp()}
            </motion.div>
          ) : (
            <motion.div
              key="home"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                opacity: { duration: 0.15 },
              }}
              className="absolute inset-0"
            >
              <HomeScreen onAppClick={handleAppClick} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lock Screen Overlay */}
        {settings.enabled && (
          <LockScreen
            isLocked={isLocked}
            onUnlock={unlock}
            wallpaper={settings.wallpaper}
          />
        )}
      </div>
    </div>
  );
}
