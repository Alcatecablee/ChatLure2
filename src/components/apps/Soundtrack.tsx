import { motion } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Shuffle,
  Repeat,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface SoundtrackProps {
  onBack: () => void;
}

export function Soundtrack({ onBack }: SoundtrackProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);

  const soundtracks = [
    {
      id: 1,
      title: "Tense Confrontation",
      artist: "Drama Sounds",
      duration: "3:24",
      category: "Drama",
      description: "Perfect for heated arguments and emotional scenes",
      cover: "linear-gradient(135deg, #ff6b6b, #ee5a52)",
      isLiked: true,
    },
    {
      id: 2,
      title: "Romantic Ambience",
      artist: "Love Themes",
      duration: "4:12",
      category: "Romance",
      description: "Soft melodies for romantic encounters",
      cover: "linear-gradient(135deg, #ff9a9e, #fecfef)",
      isLiked: false,
    },
    {
      id: 3,
      title: "Mystery Unfolds",
      artist: "Suspense Audio",
      duration: "2:45",
      category: "Mystery",
      description: "Builds tension for mysterious revelations",
      cover: "linear-gradient(135deg, #667eea, #764ba2)",
      isLiked: true,
    },
    {
      id: 4,
      title: "Coffee Shop Chatter",
      artist: "Ambient Life",
      duration: "10:00",
      category: "Ambient",
      description: "Background noise for intimate conversations",
      cover: "linear-gradient(135deg, #f093fb, #f5576c)",
      isLiked: false,
    },
    {
      id: 5,
      title: "Urban Night",
      artist: "City Sounds",
      duration: "6:30",
      category: "Ambient",
      description: "Evening city atmosphere for outdoor scenes",
      cover: "linear-gradient(135deg, #4facfe, #00f2fe)",
      isLiked: true,
    },
  ];

  const categories = [
    { name: "Drama", color: "bg-red-500" },
    { name: "Romance", color: "bg-pink-500" },
    { name: "Mystery", color: "bg-purple-500" },
    { name: "Ambient", color: "bg-blue-500" },
  ];

  const currentSoundtrack = soundtracks[currentTrack];

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % soundtracks.length);
  };

  const prevTrack = () => {
    setCurrentTrack(
      (prev) => (prev - 1 + soundtracks.length) % soundtracks.length,
    );
  };

  return (
    <div className="w-full h-full bg-black text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-lg font-semibold">Soundtrack</h1>
        <div className="w-16"></div>
      </div>

      {/* Now Playing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6"
      >
        <div
          className="h-64 rounded-xl flex items-end p-6 mb-4"
          style={{
            background: currentSoundtrack.cover,
          }}
        >
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {currentSoundtrack.title}
            </h2>
            <p className="text-white/80 mb-1">{currentSoundtrack.artist}</p>
            <p className="text-white/60 text-sm">
              {currentSoundtrack.description}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Slider
            value={[35]}
            max={100}
            step={1}
            className="mb-2"
            onValueChange={() => {}}
          />
          <div className="flex justify-between text-sm text-gray-400">
            <span>1:24</span>
            <span>{currentSoundtrack.duration}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-6 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsShuffled(!isShuffled)}
            className={`${isShuffled ? "text-purple-400" : "text-gray-400"} hover:text-white`}
          >
            <Shuffle className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            onClick={prevTrack}
            className="text-white hover:text-purple-400"
          >
            <SkipBack className="w-6 h-6" />
          </Button>

          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={nextTrack}
            className="text-white hover:text-purple-400"
          >
            <SkipForward className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsRepeating(!isRepeating)}
            className={`${isRepeating ? "text-purple-400" : "text-gray-400"} hover:text-white`}
          >
            <Repeat className="w-5 h-5" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-3">
          <Volume2 className="w-4 h-4 text-gray-400" />
          <Slider
            value={[volume]}
            max={100}
            step={1}
            onValueChange={(value) => setVolume(value[0])}
            className="flex-1"
          />
          <span className="text-sm text-gray-400 w-8">{volume}</span>
        </div>
      </motion.div>

      {/* Categories */}
      <div className="px-6 mb-4">
        <h3 className="font-semibold mb-3 text-gray-300">Browse by Mood</h3>
        <div className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`px-3 py-1 rounded-full text-sm ${category.color} text-white hover:opacity-80 transition-opacity`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Playlist */}
      <div className="flex-1 overflow-y-auto px-6">
        <h3 className="font-semibold mb-3 text-gray-300">Story Soundtracks</h3>
        {soundtracks.map((track, index) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setCurrentTrack(index)}
            className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
              currentTrack === index
                ? "bg-purple-900/30 border border-purple-500/30"
                : "bg-gray-900/50 hover:bg-gray-800/50"
            }`}
          >
            <div
              className="w-12 h-12 rounded-lg mr-3 flex-shrink-0"
              style={{ background: track.cover }}
            ></div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{track.title}</h4>
              <p className="text-sm text-gray-400 truncate">{track.artist}</p>
            </div>
            <div className="text-right mr-3">
              <div className="text-sm text-gray-400">{track.duration}</div>
              <div className="text-xs text-gray-500">{track.category}</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                // Toggle like
              }}
              className={`${track.isLiked ? "text-red-400" : "text-gray-400"} hover:text-red-400`}
            >
              <Heart
                className={`w-4 h-4 ${track.isLiked ? "fill-current" : ""}`}
              />
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-800">
        <Button className="w-full bg-purple-600 hover:bg-purple-700 mb-2">
          Create Custom Playlist
        </Button>
        <Button
          variant="outline"
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          Download for Offline
        </Button>
      </div>
    </div>
  );
}
