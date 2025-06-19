import { motion } from "framer-motion";
import {
  Phone,
  MessageCircle,
  Settings,
  Camera,
  Calculator,
  Inbox,
  Timer,
  Compass,
  Volume2,
  ImageIcon,
  Search,
  CalendarDays,
  Power,
} from "lucide-react";

interface AppIconProps {
  icon: React.ReactNode;
  name: string;
  color: string;
  onClick?: () => void;
  delay?: number;
  isSponsored?: boolean;
}

function AppIcon({
  icon,
  name,
  color,
  onClick,
  delay = 0,
  isSponsored = false,
}: AppIconProps) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.3, ease: "backOut" }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="flex flex-col items-center space-y-1 group relative"
    >
      <div
        className={`w-14 h-14 rounded-app flex items-center justify-center text-white shadow-lg transform group-active:scale-95 transition-transform overflow-hidden ${
          isSponsored ? "ring-1 ring-white/20" : ""
        }`}
        style={{ backgroundColor: name === "ChatLure" ? "transparent" : color }}
      >
        {name === "ChatLure" ? (
          <img
            src="https://cdn.builder.io/api/v1/assets/9af82e6ddd6549809662cfc01aa22662/favico-c760c4?format=webp&width=800"
            alt="ChatLure"
            className="w-full h-full object-cover rounded-app"
          />
        ) : typeof icon === "string" && icon.startsWith("http") ? (
          <img
            src={icon}
            alt={name}
            className="w-full h-full object-cover rounded-app"
          />
        ) : (
          <span className="text-xl">{icon}</span>
        )}
      </div>
      {isSponsored && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✨</span>
        </div>
      )}
      <span className="text-white text-xs text-center leading-none font-medium">
        {name}
      </span>
    </motion.button>
  );
}

interface HomeScreenProps {
  onAppSelect: (appId: string) => void;
}

export function HomeScreen({ onAppSelect }: HomeScreenProps) {
  const handlePowerOff = () => {
    // Clear all stored data and restart app
    localStorage.clear();
    window.location.reload();
  };

  // Function to handle sponsored app clicks
  const handleSponsoredApp = (
    appName: string,
    packageName: string,
    appStoreUrl: string,
  ) => {
    // Try to open the app directly (deep link)
    const deepLink = `intent://${packageName}#Intent;scheme=android-app;package=${packageName};end`;
    const iOSScheme = appName.toLowerCase() + "://";

    // Create a temporary link to try opening the app
    const tryOpenApp = () => {
      // For iOS
      if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        window.location.href = iOSScheme;
        // If app doesn't open, redirect to App Store after a delay
        setTimeout(() => {
          window.open(appStoreUrl, "_blank");
        }, 2000);
      } else {
        // For Android
        window.location.href = deepLink;
        // If app doesn't open, redirect to Play Store after a delay
        setTimeout(() => {
          window.open(appStoreUrl, "_blank");
        }, 2000);
      }
    };

    tryOpenApp();
  };

  // Core ChatLure apps (functional within the simulator)
  const coreApps = [
    { id: "phone", icon: <Phone size={24} />, name: "Phone", color: "#34C759" },
    {
      id: "messages",
      icon: <MessageCircle size={24} />,
      name: "ChatLure",
      color: "#000000",
    },
    {
      id: "camera",
      icon: <Camera size={24} />,
      name: "Camera",
      color: "#636366",
    },
    {
      id: "settings",
      icon: <Settings size={24} />,
      name: "Settings",
      color: "#8E8E93",
    },
    {
      id: "calculator",
      icon: <Calculator size={24} />,
      name: "Calculator",
      color: "#2C2C2E",
    },
    {
      id: "power",
      icon: <Power size={24} />,
      name: "Power",
      color: "#FF3B30",
      onClick: handlePowerOff,
    },
  ];

  // Sponsored apps (external links to real apps) - Revenue generating placements!
  const sponsoredApps = [
    {
      name: "Airbnb",
      icon: "https://cdn.builder.io/api/v1/image/assets%2F4fad96d56bab4dd5bf3f69370c695246%2F90c0c4a0e1c84b8ab4a4e0dd5da1a4a4",
      color: "#FF5A5F",
      packageName: "com.airbnb.android",
      appStoreUrl: "https://apps.apple.com/app/airbnb/id401626263",
      playStoreUrl:
        "https://play.google.com/store/apps/details?id=com.airbnb.android",
    },
    {
      name: "Spotify",
      icon: "🎵",
      color: "#1DB954",
      packageName: "com.spotify.music",
      appStoreUrl: "https://apps.apple.com/app/spotify/id324684580",
      playStoreUrl:
        "https://play.google.com/store/apps/details?id=com.spotify.music",
    },
    {
      name: "Uber",
      icon: "🚗",
      color: "#000000",
      packageName: "com.ubercab",
      appStoreUrl: "https://apps.apple.com/app/uber/id368677368",
      playStoreUrl: "https://play.google.com/store/apps/details?id=com.ubercab",
    },
    {
      name: "DoorDash",
      icon: "🍔",
      color: "#FF3008",
      packageName: "com.dd.doordash",
      appStoreUrl: "https://apps.apple.com/app/doordash/id719972451",
      playStoreUrl:
        "https://play.google.com/store/apps/details?id=com.dd.doordash",
    },
    {
      name: "Netflix",
      icon: "📺",
      color: "#E50914",
      packageName: "com.netflix.mediaclient",
      appStoreUrl: "https://apps.apple.com/app/netflix/id363590051",
      playStoreUrl:
        "https://play.google.com/store/apps/details?id=com.netflix.mediaclient",
    },
    {
      name: "Instagram",
      icon: "📷",
      color: "#E4405F",
      packageName: "com.instagram.android",
      appStoreUrl: "https://apps.apple.com/app/instagram/id389801252",
      playStoreUrl:
        "https://play.google.com/store/apps/details?id=com.instagram.android",
    },
    {
      name: "TikTok",
      icon: "🎬",
      color: "#000000",
      packageName: "com.zhiliaoapp.musically",
      appStoreUrl: "https://apps.apple.com/app/tiktok/id835599320",
      playStoreUrl:
        "https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically",
    },
  ];

  // Combine core apps with sponsored apps for display
  const allApps = [...coreApps, ...sponsoredApps];

  const dockApps = coreApps.slice(0, 4); // Keep dock as core ChatLure apps
  const homeApps = [...coreApps.slice(4), ...sponsoredApps]; // Mix core + sponsored in main area

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-900 pt-16">
      {/* Home Screen Apps Grid */}
      <div className="px-6 pt-12 pb-32 overflow-y-auto flex-1">
        <div className="grid grid-cols-4 gap-6 auto-rows-max">
          {homeApps.map((app, index) => {
            // Check if this is a sponsored app (has packageName property)
            const isSponsored = "packageName" in app;

            return (
              <AppIcon
                key={isSponsored ? app.name : app.id}
                icon={isSponsored ? app.icon : app.icon}
                name={app.name}
                color={app.color}
                onClick={
                  isSponsored
                    ? () =>
                        handleSponsoredApp(
                          app.name,
                          app.packageName,
                          /iPhone|iPad|iPod/.test(navigator.userAgent)
                            ? app.appStoreUrl
                            : app.playStoreUrl,
                        )
                    : app.onClick || (() => onAppSelect(app.id))
                }
                delay={index * 0.1}
                isSponsored={isSponsored}
              />
            );
          })}
        </div>
      </div>

      {/* Dock */}
      <div className="absolute bottom-8 left-4 right-4">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="bg-white/10 backdrop-blur-ios rounded-2xl p-4"
        >
          <div className="flex justify-around items-center">
            {dockApps.map((app, index) => (
              <AppIcon
                key={app.id}
                icon={app.icon}
                name={app.name}
                color={app.color}
                onClick={() => onAppSelect(app.id)}
                delay={0.6 + index * 0.1}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/60 rounded-full"></div>
    </div>
  );
}
