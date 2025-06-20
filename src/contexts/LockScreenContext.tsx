import React, { createContext, useContext, useState, useEffect } from "react";

export interface LockScreenSettings {
  enabled: boolean;
  wallpaper: string;
  showNotifications: boolean;
  autoLockTime: number; // minutes
  requirePasscode: boolean;
  passcode?: string;
}

interface LockScreenContextType {
  settings: LockScreenSettings;
  isLocked: boolean;
  updateSettings: (newSettings: Partial<LockScreenSettings>) => void;
  lock: () => void;
  unlock: () => void;
  setWallpaper: (wallpaper: string) => void;
}

const defaultSettings: LockScreenSettings = {
  enabled: true,
  wallpaper: "", // Will use default gradient if empty
  showNotifications: true,
  autoLockTime: 5, // 5 minutes
  requirePasscode: false,
};

const LockScreenContext = createContext<LockScreenContextType | undefined>(
  undefined,
);

export function LockScreenProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = React.useState<LockScreenSettings>(() => {
    const saved = localStorage.getItem("chatlure-lockscreen-settings");
    return saved
      ? { ...defaultSettings, ...JSON.parse(saved) }
      : defaultSettings;
  });

  const [isLocked, setIsLocked] = React.useState(false);
  const [lastActivity, setLastActivity] = React.useState(Date.now());

  // Save settings to localStorage when they change
  React.useEffect(() => {
    localStorage.setItem(
      "chatlure-lockscreen-settings",
      JSON.stringify(settings),
    );
  }, [settings]);

  // Auto-lock functionality
  useEffect(() => {
    if (!settings.enabled || settings.autoLockTime <= 0) return;

    const checkAutoLock = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;
      const autoLockMs = settings.autoLockTime * 60 * 1000;

      if (timeSinceLastActivity >= autoLockMs && !isLocked) {
        setIsLocked(true);
      }
    };

    const interval = setInterval(checkAutoLock, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [settings.enabled, settings.autoLockTime, lastActivity, isLocked]);

  // Track user activity
  useEffect(() => {
    const updateActivity = () => {
      setLastActivity(Date.now());
    };

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];
    events.forEach((event) => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, []);

  const updateSettings = (newSettings: Partial<LockScreenSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const lock = () => {
    if (settings.enabled) {
      setIsLocked(true);
    }
  };

  const unlock = () => {
    setIsLocked(false);
    setLastActivity(Date.now());
  };

  const setWallpaper = (wallpaper: string) => {
    updateSettings({ wallpaper });
  };

  const value = {
    settings,
    isLocked,
    updateSettings,
    lock,
    unlock,
    setWallpaper,
  };

  return (
    <LockScreenContext.Provider value={value}>
      {children}
    </LockScreenContext.Provider>
  );
}

export function useLockScreen() {
  const context = useContext(LockScreenContext);
  if (!context) {
    throw new Error("useLockScreen must be used within a LockScreenProvider");
  }
  return context;
}

// Predefined wallpapers
export const WALLPAPERS = [
  {
    id: "gradient1",
    name: "Purple Gradient",
    url: "",
    preview: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: "gradient2",
    name: "Ocean Gradient",
    url: "",
    preview: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
  },
  {
    id: "gradient3",
    name: "Sunset Gradient",
    url: "",
    preview: "linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)",
  },
  {
    id: "gradient4",
    name: "Forest Gradient",
    url: "",
    preview: "linear-gradient(135deg, #00b894 0%, #00a085 100%)",
  },
  {
    id: "dark",
    name: "Dark Pattern",
    url: "",
    preview: "linear-gradient(135deg, #2d3436 0%, #636e72 100%)",
  },
  {
    id: "city",
    name: "City Night",
    url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400",
    preview: "",
  },
  {
    id: "nature",
    name: "Mountain View",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    preview: "",
  },
  {
    id: "abstract",
    name: "Abstract",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400",
    preview: "",
  },
];
