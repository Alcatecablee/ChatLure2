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
import { Inbox } from "../apps/Inbox";
import { StoryTimer } from "../apps/StoryTimer";
import { Discover } from "../apps/Discover";
import { Soundtrack } from "../apps/Soundtrack";
import { Browse } from "../apps/Browse";
import { Schedule } from "../apps/Schedule";
import { Gallery } from "../apps/Gallery";
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
        return <Inbox onBack={goHome} />;
      case "story-timer":
        return <StoryTimer onBack={goHome} />;
      case "discover":
        return <Discover onBack={goHome} />;
      case "soundtrack":
        return <Soundtrack onBack={goHome} />;
      case "browse":
        return <Browse onBack={goHome} />;
      case "schedule":
        return <Schedule onBack={goHome} />;
      case "gallery":
        return <Gallery onBack={goHome} />;
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
