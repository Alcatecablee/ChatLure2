import { motion } from "framer-motion";
import {
  Phone,
  MessageCircle,
  Settings,
  Camera,
  Calculator,
  Mail,
  Clock,
  Map,
  Music,
  Image,
  Globe,
  Calendar,
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

  const apps = [
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
      id: "photos",
      icon: <Image size={24} />,
      name: "Photos",
      color: "#FF9500",
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
    { id: "mail", icon: <Mail size={24} />, name: "Mail", color: "#007AFF" },
    {
      id: "power",
      icon: <Power size={24} />,
      name: "Power",
      color: "#FF3B30",
      onClick: handlePowerOff,
    },
    { id: "clock", icon: <Clock size={24} />, name: "Clock", color: "#2C2C2E" },
    { id: "maps", icon: <Map size={24} />, name: "Maps", color: "#007AFF" },
    { id: "music", icon: <Music size={24} />, name: "Music", color: "#FF2D92" },
    {
      id: "safari",
      icon: <Globe size={24} />,
      name: "Safari",
      color: "#007AFF",
    },
    {
      id: "calendar",
      icon: <Calendar size={24} />,
      name: "Calendar",
      color: "#FF3B30",
    },
  ];

  const dockApps = apps.slice(0, 4);
  const homeApps = apps.slice(4);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-900 pt-16">
      {/* Home Screen Apps Grid */}
      <div className="px-6 pt-12 pb-32 overflow-y-auto flex-1">
        <div className="grid grid-cols-4 gap-6 auto-rows-max">
          {homeApps.map((app, index) => (
            <AppIcon
              key={app.id}
              icon={app.icon}
              name={app.name}
              color={app.color}
              onClick={app.onClick || (() => onAppSelect(app.id))}
              delay={index * 0.1}
            />
          ))}
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
                onClick={app.onClick || (() => onAppSelect(app.id))}
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
