import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Check, Download, Palette } from "lucide-react";
import { WALLPAPERS, useLockScreen } from "@/contexts/LockScreenContext";

interface WallpaperSelectorProps {
  onBack: () => void;
}

export function WallpaperSelector({ onBack }: WallpaperSelectorProps) {
  const { settings, setWallpaper } = useLockScreen();
  const [selectedWallpaper, setSelectedWallpaper] = useState(
    settings.wallpaper,
  );
  const [showPreview, setShowPreview] = useState(false);

  const handleWallpaperSelect = (wallpaper: any) => {
    setSelectedWallpaper(wallpaper.url || wallpaper.preview);
    setWallpaper(wallpaper.url || wallpaper.preview);
  };

  const getWallpaperStyle = (wallpaper: any) => {
    if (wallpaper.url) {
      return {
        backgroundImage: `url(${wallpaper.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    } else {
      return {
        background: wallpaper.preview,
      };
    }
  };

  return (
    <div className="w-full h-full bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-blue-400"
        >
          <ChevronLeft size={20} />
          <span>Back</span>
        </button>
        <h1 className="text-lg font-semibold">Wallpapers</h1>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="text-blue-400"
        >
          Preview
        </button>
      </div>

      {/* Preview Mode */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50"
            style={getWallpaperStyle({
              url: selectedWallpaper?.includes("http") ? selectedWallpaper : "",
              preview: selectedWallpaper?.includes("gradient")
                ? selectedWallpaper
                : "",
            })}
          >
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 flex flex-col h-full">
              {/* Preview Header */}
              <div className="flex justify-between items-center p-4">
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-white bg-black/30 backdrop-blur-md px-4 py-2 rounded-full"
                >
                  Done
                </button>
                <div className="text-center">
                  <div className="text-6xl font-thin text-white">12:34</div>
                  <div className="text-lg text-white/90">
                    Monday, January 15
                  </div>
                </div>
                <div className="w-16" />
              </div>

              {/* Preview ChatLure Logo */}
              <div className="flex-1 flex items-center justify-center">
                <img
                  src="https://cdn.builder.io/api/v1/assets/e980716d00e74498a7a36072ff1bc031/default-12-12ba5b?format=webp&width=800"
                  alt="ChatLure"
                  className="w-20 h-20 rounded-full shadow-lg ring-4 ring-white/20"
                />
              </div>

              {/* Preview Bottom */}
              <div className="p-4 text-center">
                <p className="text-white/80 text-sm">Slide up to unlock</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wallpaper Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {WALLPAPERS.map((wallpaper) => (
            <motion.div
              key={wallpaper.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleWallpaperSelect(wallpaper)}
              className="relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer border-2 border-transparent"
              style={{
                ...getWallpaperStyle(wallpaper),
                borderColor:
                  selectedWallpaper === (wallpaper.url || wallpaper.preview)
                    ? "#3B82F6"
                    : "transparent",
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Preview Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-3">
                {/* Top - Status */}
                <div className="flex justify-between items-start">
                  <div className="text-white text-xs">9:41</div>
                  <div className="text-white text-xs">100%</div>
                </div>

                {/* Center - Logo */}
                <div className="flex items-center justify-center">
                  <img
                    src="https://cdn.builder.io/api/v1/assets/e980716d00e74498a7a36072ff1bc031/default-12-12ba5b?format=webp&width=800"
                    alt="ChatLure"
                    className="w-8 h-8 rounded-full"
                  />
                </div>

                {/* Bottom - Name */}
                <div className="text-white text-xs text-center">
                  {wallpaper.name}
                </div>
              </div>

              {/* Selection Indicator */}
              {selectedWallpaper === (wallpaper.url || wallpaper.preview) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                >
                  <Check size={14} className="text-white" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Categories */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center space-x-2">
            <Palette size={20} className="text-gray-400" />
            <h3 className="text-lg font-semibold">Categories</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">🌈</div>
              <div className="text-sm">Gradients</div>
              <div className="text-xs text-gray-400">5 wallpapers</div>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">🏞️</div>
              <div className="text-sm">Nature</div>
              <div className="text-xs text-gray-400">3 wallpapers</div>
            </div>
          </div>
        </div>

        {/* Download More */}
        <div className="mt-6 bg-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Get More Wallpapers</h4>
              <p className="text-sm text-gray-400">
                Download from our collection
              </p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2">
              <Download size={16} />
              <span>Browse</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
