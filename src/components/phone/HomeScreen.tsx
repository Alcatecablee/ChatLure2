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
  Inbox,
  Timer,
  Compass,
  Headphones,
  Search,
  ImageIcon,
  BookOpen,
} from "lucide-react";

interface AppIconProps {
  icon: React.ReactNode;
  name: string;
  color: string;
  onClick?: () => void;
  delay?: number;
  isSponsored?: boolean;
  isSmartIcon?: boolean;
  glowEffect?: boolean;
}

function AppIcon({
  icon,
  name,
  color,
  onClick,
  delay = 0,
  isSponsored = false,
  isSmartIcon = false,
  glowEffect = false,
}: AppIconProps) {
  const handleSponsoredClick = () => {
    const appUrls: Record<string, string> = {
      Spotify: "https://open.spotify.com",
      Netflix: "https://www.netflix.com",
      Uber: "https://www.uber.com",
      Airbnb: "https://www.airbnb.com",
      Instagram: "https://www.instagram.com",
      TikTok: "https://www.tiktok.com",
      DoorDash: "https://www.doordash.com",
      YouTube: "https://www.youtube.com",
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
      whileHover={{ scale: 1.05 }}
      onClick={isSponsored ? handleSponsoredClick : onClick}
      className="flex flex-col items-center space-y-1 group relative"
    >
      <div
        className={`w-16 h-16 rounded-app flex items-center justify-center text-white shadow-lg transform group-active:scale-95 transition-all duration-200 overflow-hidden relative ${
          glowEffect ? "shadow-xl shadow-purple-500/30" : ""
        } ${isSmartIcon ? "ring-2 ring-white/20 ring-opacity-50" : ""}`}
        style={{ backgroundColor: name === "ChatLure" ? "transparent" : color }}
      >
        {/* Glow effect for smart icons */}
        {isSmartIcon && (
          <div className="absolute inset-0 rounded-app bg-gradient-to-br from-white/10 to-transparent"></div>
        )}

        {name === "ChatLure" ? (
          <img
            src="https://cdn.builder.io/api/v1/assets/9af82e6ddd6549809662cfc01aa22662/favico-c760c4?format=webp&width=800"
            alt="ChatLure"
            className="w-full h-full object-cover rounded-app"
          />
        ) : (
          <div className="relative z-10">{icon}</div>
        )}

        {/* Smart icon indicator */}
        {isSmartIcon && (
          <div className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
        )}
      </div>
      <span
        className={`text-white text-xs text-center leading-none font-medium ${
          isSmartIcon ? "text-purple-200" : ""
        }`}
      >
        {name}
      </span>
    </motion.button>
  );
}

interface HomeScreenProps {
  onAppSelect: (appId: string) => void;
}

export function HomeScreen({ onAppSelect }: HomeScreenProps) {
  // SMART ICON REPLACEMENTS - Your requested features
  const smartIcons = [
    {
      id: "inbox",
      icon: <Inbox size={24} />,
      name: "Inbox",
      color: "#007AFF",
      description: "Notifications, friend requests, story updates",
    },
    {
      id: "story-timer",
      icon: <Timer size={24} />,
      name: "Story Timer",
      color: "#FF9500",
      description: "Shows when new stories drop, reading progress",
    },
    {
      id: "discover",
      icon: <Compass size={24} />,
      name: "Discover",
      color: "#30D158",
      description: "Find trending stories by location/topic",
    },
    {
      id: "soundtrack",
      icon: <Headphones size={24} />,
      name: "Soundtrack",
      color: "#FF2D92",
      description: "Ambient sounds and music for immersive reading",
    },
    {
      id: "browse",
      icon: <Search size={24} />,
      name: "Browse",
      color: "#5856D6",
      description: "External drama sources, viral content feeds",
    },
    {
      id: "schedule",
      icon: <BookOpen size={24} />,
      name: "Schedule",
      color: "#FF3B30",
      description: "Story release calendar, events",
    },
    {
      id: "gallery",
      icon: <ImageIcon size={24} />,
      name: "Gallery",
      color: "#FF9500",
      description: "Screenshots of favorite story moments",
    },
  ];

  // Core system apps - keeping authentic phone feel
  const systemApps = [
    { id: "phone", icon: <Phone size={24} />, name: "Phone", color: "#34C759" },
    {
      id: "chatlure-premium",
      icon: (
        <div className="relative w-full h-full">
          <img
            src="https://cdn.builder.io/api/v1/assets/e980716d00e74498a7a36072ff1bc031/default-12-12ba5b?format=webp&width=800"
            alt="ChatLure Premium"
            className="w-full h-full rounded-xl object-cover"
          />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <span className="text-[10px] text-white font-bold">⭐</span>
          </div>
        </div>
      ),
      name: "ChatLure+",
      color: "#F59E0B",
    },
    {
      id: "settings",
      icon: <Settings size={24} />,
      name: "Settings",
      color: "#8E8E93",
    },
  ];

  // Popular sponsored apps for authenticity
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
      id: "youtube",
      icon: <div className="text-lg font-bold">▶</div>,
      name: "YouTube",
      color: "#FF0000",
      isSponsored: true,
    },
    {
      id: "uber",
      icon: <div className="text-lg font-bold">U</div>,
      name: "Uber",
      color: "#000000",
      isSponsored: true,
    },
  ];

  const dockApps = systemApps;
  const smartRow1 = smartIcons.slice(0, 4);
  const smartRow2 = smartIcons.slice(4);
  const sponsoredRow1 = sponsoredApps.slice(0, 3);
  const sponsoredRow2 = sponsoredApps.slice(3);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-900 pt-16 overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-40 right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Home Screen Apps */}
      <div className="px-4 pt-8 flex-1 flex flex-col relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          <h2 className="text-white/90 text-lg font-semibold tracking-wide">
            Smart Features
          </h2>
          <p className="text-white/60 text-sm">
            Enhanced storytelling experience
          </p>
        </motion.div>

        {/* Smart Icons Section */}
        <div className="space-y-6 mb-8">
          {/* Smart Icons - Row 1 */}
          <div className="grid grid-cols-4 gap-6">
            {smartRow1.map((app, index) => (
              <AppIcon
                key={app.id}
                icon={app.icon}
                name={app.name}
                color={app.color}
                onClick={() => onAppSelect(app.id)}
                delay={index * 0.1}
                isSmartIcon={true}
                glowEffect={true}
              />
            ))}
          </div>

          {/* Smart Icons - Row 2 */}
          <div className="grid grid-cols-3 gap-8 justify-center">
            {smartRow2.map((app, index) => (
              <AppIcon
                key={app.id}
                icon={app.icon}
                name={app.name}
                color={app.color}
                onClick={() => onAppSelect(app.id)}
                delay={0.4 + index * 0.1}
                isSmartIcon={true}
                glowEffect={true}
              />
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1 min-h-8"></div>

        {/* Sponsored Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center py-4"
        >
          <h3 className="text-white/50 text-xs font-medium tracking-wider uppercase">
            Recommended Apps
          </h3>
        </motion.div>

        {/* Sponsored Apps */}
        <div className="space-y-6 mb-32">
          {/* Sponsored Apps - Row 1 */}
          <div className="grid grid-cols-3 gap-8">
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
          <div className="grid grid-cols-3 gap-8">
            {sponsoredRow2.map((app, index) => (
              <AppIcon
                key={app.id}
                icon={app.icon}
                name={app.name}
                color={app.color}
                delay={1.3 + index * 0.1}
                isSponsored={true}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Dock */}
      <div className="absolute bottom-2 left-4 right-4">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20"
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/60 rounded-full"
      ></motion.div>
    </div>
  );
}
