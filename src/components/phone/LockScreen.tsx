import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Battery, Wifi, Signal, Lock, Camera } from "lucide-react";
import { useBattery } from "@/contexts/BatteryContext";

interface LockScreenProps {
  isLocked: boolean;
  onUnlock: () => void;
  wallpaper?: string;
}

export function LockScreen({ isLocked, onUnlock, wallpaper }: LockScreenProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [slideUpValue, setSlideUpValue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const { battery } = useBattery();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const handleSlideUp = (_, info) => {
    if (info.offset.y < -100) {
      onUnlock();
      setSlideUpValue(0);
    } else {
      setSlideUpValue(0);
    }
  };

  const notifications = [
    {
      id: 1,
      app: "ChatLure",
      icon: "https://cdn.builder.io/api/v1/assets/e980716d00e74498a7a36072ff1bc031/default-12-12ba5b?format=webp&width=800",
      title: "New Drama Dropped",
      message: "Sarah's coffee shop scandal just got spicy...",
      time: "2m ago",
    },
    {
      id: 2,
      app: "ChatLure",
      icon: "https://cdn.builder.io/api/v1/assets/e980716d00e74498a7a36072ff1bc031/default-12-12ba5b?format=webp&width=800",
      title: "Trending Alert",
      message: "University breakup story is going viral in your area",
      time: "5m ago",
    },
  ];

  if (!isLocked) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50"
        style={{
          backgroundImage: wallpaper
            ? `url(${wallpaper})`
            : `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

        {/* Status Bar */}
        <div className="relative z-10 flex justify-between items-center px-4 py-2 text-white">
          <div className="flex items-center space-x-1">
            <Signal className="w-4 h-4" />
            <Wifi className="w-4 h-4" />
          </div>
          <div className="text-sm font-medium">{formatTime(currentTime)}</div>
          <div className="flex items-center space-x-1">
            <span className="text-sm">{battery.level}%</span>
            <Battery
              className={`w-4 h-4 ${
                battery.isCharging ? "text-green-400" : "text-white"
              }`}
            />
          </div>
        </div>

        {/* Time & Date Display */}
        <div className="relative z-10 flex flex-col items-center justify-center mt-20">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="text-7xl font-thin text-white mb-2">
              {formatTime(currentTime)}
            </div>
            <div className="text-xl text-white/90 font-light">
              {formatDate(currentTime)}
            </div>
          </motion.div>

          {/* ChatLure Logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="mt-12 mb-8"
          >
            <img
              src="https://cdn.builder.io/api/v1/assets/e980716d00e74498a7a36072ff1bc031/default-12-12ba5b?format=webp&width=800"
              alt="ChatLure"
              className="w-16 h-16 rounded-full shadow-lg ring-4 ring-white/20"
            />
          </motion.div>
        </div>

        {/* Notifications */}
        <div className="relative z-10 px-4 space-y-3 max-h-64 overflow-hidden">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
            >
              <div className="flex items-start space-x-3">
                <img
                  src={notification.icon}
                  alt={notification.app}
                  className="w-8 h-8 rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-white">
                      {notification.app}
                    </p>
                    <p className="text-xs text-white/70">{notification.time}</p>
                  </div>
                  <p className="text-sm text-white/90 font-medium">
                    {notification.title}
                  </p>
                  <p className="text-sm text-white/70 truncate">
                    {notification.message}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Action Area */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          {/* Camera and Unlock Indicators */}
          <div className="flex justify-between items-center px-8 pb-6">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30"
            >
              <Camera className="w-6 h-6 text-white" />
            </motion.div>

            <div className="text-center">
              <Lock className="w-6 h-6 text-white mx-auto mb-2" />
              <p className="text-sm text-white/80">Slide up to unlock</p>
            </div>

            <motion.div
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30"
            >
              <img
                src="https://cdn.builder.io/api/v1/assets/e980716d00e74498a7a36072ff1bc031/default-12-12ba5b?format=webp&width=800"
                alt="ChatLure"
                className="w-6 h-6 rounded-full"
              />
            </motion.div>
          </div>

          {/* Slide Up Gesture Area */}
          <motion.div
            className="h-24 w-full"
            drag="y"
            dragConstraints={{ top: -200, bottom: 0 }}
            dragElastic={0.2}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleSlideUp}
            onDrag={(_, info) => {
              setSlideUpValue(Math.max(0, -info.offset.y));
            }}
          >
            <div className="h-full w-full bg-gradient-to-t from-black/50 to-transparent" />
            <motion.div
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white/60 rounded-full"
              animate={{
                scaleX: isDragging ? 1.5 : 1,
                y: -slideUpValue * 0.3,
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
