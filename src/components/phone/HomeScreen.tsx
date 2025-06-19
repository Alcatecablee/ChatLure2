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
  const handleSponsoredClick = () => {
    // Try to open external app or redirect to store
    const appUrls: Record<string, string> = {
      Spotify: "https://open.spotify.com",
      Netflix: "https://www.netflix.com",
      Uber: "https://www.uber.com",
      Airbnb: "https://www.airbnb.com",
      Instagram: "https://www.instagram.com",
      TikTok: "https://www.tiktok.com",
      DoorDash: "https://www.doordash.com",
      Maps: "https://maps.google.com",
    };

    const url = appUrls[name];
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.3, ease: "backOut" }}
      whileTap={{ scale: 0.9 }}
      onClick={isSponsored ? handleSponsoredClick : onClick}
      className="flex flex-col items-center space-y-1 group"
    >
      <div
        className={`w-16 h-16 rounded-app flex items-center justify-center text-white shadow-lg transform group-active:scale-95 transition-transform overflow-hidden`}
        style={{ backgroundColor: name === "ChatLure" ? "transparent" : color }}
      >
        {name === "ChatLure" ? (
          <img
            src="https://cdn.builder.io/api/v1/assets/9af82e6ddd6549809662cfc01aa22662/favico-c760c4?format=webp&width=800"
            alt="ChatLure"
            className="w-full h-full object-cover rounded-app"
          />
        ) : (
          icon
        )}
      </div>
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

  // ALL ORIGINAL APPS - keeping them ALL to look authentic!
  const originalApps = [
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

  // Sponsored apps - Real looking apps with proper branding
  const sponsoredApps = [
    {
      id: "spotify",
      icon: <div className="text-lg font-bold text-white">♪</div>,
      name: "Spotify",
      color: "#1DB954",
      isSponsored: true,
    },
    {
      id: "netflix",
      icon: <div className="text-lg font-bold">N</div>,
      name: "Netflix",
      color: "#E50914",
      isSponsored: true,
    },
    {
      id: "uber",
      icon: <div className="text-lg font-bold">U</div>,
      name: "Uber",
      color: "#000000",
      isSponsored: true,
    },
    {
      id: "airbnb",
      icon: <div className="text-lg font-bold">𝒜</div>,
      name: "Airbnb",
      color: "#FF5A5F",
      isSponsored: true,
    },
    {
      id: "instagram",
      icon: <div className="text-lg font-bold">📷</div>,
      name: "Instagram",
      color: "#E4405F",
      isSponsored: true,
    },
    {
      id: "tiktok",
      icon: <div className="text-lg font-bold">♫</div>,
      name: "TikTok",
      color: "#000000",
      isSponsored: true,
    },
    {
      id: "doordash",
      icon: <div className="text-lg font-bold">🍔</div>,
      name: "DoorDash",
      color: "#FF3008",
      isSponsored: true,
    },
    {
      id: "youtube",
      icon: <div className="text-lg font-bold">▶</div>,
      name: "YouTube",
      color: "#FF0000",
      isSponsored: true,
    },
  ];

  const dockApps = originalApps.slice(0, 4);
  const homeRow1 = originalApps.slice(4, 8); // Settings, Calculator, Mail, Clock
  const homeRow2 = originalApps.slice(8, 12); // Maps, Music, Safari, Calendar
  const sponsoredRow1 = sponsoredApps.slice(0, 4);
  const sponsoredRow2 = sponsoredApps.slice(4);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-900 pt-16">
      {/* Home Screen Apps - Full Height Distribution */}
      <div className="px-4 pt-8 flex-1 flex flex-col">
        {/* Top Section - Original Apps */}
        <div className="space-y-8 mb-8">
          {/* Original Apps - Row 1 */}
          <div className="grid grid-cols-4 gap-6">
            {homeRow1.map((app, index) => (
              <AppIcon
                key={app.id}
                icon={app.icon}
                name={app.name}
                color={app.color}
                onClick={() => onAppSelect(app.id)}
                delay={index * 0.1}
              />
            ))}
          </div>

          {/* Original Apps - Row 2 */}
          <div className="grid grid-cols-4 gap-6">
            {homeRow2.map((app, index) => (
              <AppIcon
                key={app.id}
                icon={app.icon}
                name={app.name}
                color={app.color}
                onClick={() => onAppSelect(app.id)}
                delay={0.4 + index * 0.1}
              />
            ))}
          </div>
        </div>

        {/* Flexible Spacer to push sponsored content down */}
        <div className="flex-1 min-h-8"></div>

        {/* Middle Section - Sponsored Header */}
        <div className="text-center py-4">
          <h3 className="text-white/70 text-sm font-medium tracking-wider uppercase">
            Sponsored
          </h3>
        </div>

        {/* Bottom Section - Sponsored Apps (pushed all the way down) */}
        <div className="space-y-8 mb-28">
          {/* Sponsored Apps - Row 1 */}
          <div className="grid grid-cols-4 gap-6">
            {sponsoredRow1.map((app, index) => (
              <AppIcon
                key={app.id}
                icon={app.icon}
                name={app.name}
                color={app.color}
                delay={1.0 + index * 0.1}
                isSponsored={true}
              />
            ))}
          </div>

          {/* Sponsored Apps - Row 2 */}
          <div className="grid grid-cols-4 gap-6">
            {sponsoredRow2.map((app, index) => (
              <AppIcon
                key={app.id}
                icon={app.icon}
                name={app.name}
                color={app.color}
                delay={1.4 + index * 0.1}
                isSponsored={true}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Dock */}
      <div className="absolute bottom-2 left-4 right-4">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="bg-white/10 backdrop-blur-ios rounded-2xl p-3"
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
