import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

interface StoryTimerProps {
  onBack: () => void;
}

export function StoryTimer({ onBack }: StoryTimerProps) {
  const [selectedStory, setSelectedStory] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [nextDropTime, setNextDropTime] = useState(
    new Date(Date.now() + 2 * 60 * 60 * 1000),
  ); // 2 hours from now

  const stories = [
    {
      id: 1,
      title: "Coffee Shop Chronicles",
      chapter: "Chapter 5",
      duration: 15,
      progress: 8,
      nextDrop: "2h 15m",
      status: "reading",
      color: "from-amber-500 to-orange-600",
    },
    {
      id: 2,
      title: "Office Romance",
      chapter: "Chapter 3",
      duration: 22,
      progress: 22,
      nextDrop: "4h 30m",
      status: "completed",
      color: "from-pink-500 to-rose-600",
    },
    {
      id: 3,
      title: "University Drama",
      chapter: "Chapter 1",
      duration: 18,
      progress: 0,
      nextDrop: "New!",
      status: "new",
      color: "from-blue-500 to-purple-600",
    },
    {
      id: 4,
      title: "Neighborhood Secrets",
      chapter: "Chapter 7",
      duration: 25,
      progress: 12,
      nextDrop: "Tomorrow",
      status: "reading",
      color: "from-green-500 to-teal-600",
    },
  ];

  const currentStory = stories[selectedStory];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentStory.duration * 60) {
            setIsPlaying(false);
            return currentStory.duration * 60;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStory.duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimeUntilDrop = () => {
    const now = new Date();
    const diff = nextDropTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
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
        <h1 className="text-lg font-semibold">Story Timer</h1>
        <div className="w-16"></div>
      </div>

      {/* Next Drop Countdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30"
      >
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Next Story Drop</div>
          <div className="text-2xl font-bold text-purple-400">
            {getTimeUntilDrop()}
          </div>
          <div className="text-xs text-gray-300 mt-1">
            Drama in the Park - Chapter 4
          </div>
        </div>
      </motion.div>

      {/* Current Story Player */}
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-6 rounded-xl bg-gradient-to-br ${currentStory.color} mb-4`}
        >
          <h2 className="text-xl font-bold mb-2">{currentStory.title}</h2>
          <p className="text-white/80 mb-4">{currentStory.chapter}</p>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentStory.duration * 60)}</span>
            </div>
            <Progress
              value={(currentTime / (currentStory.duration * 60)) * 100}
              className="h-2 bg-white/20"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentTime(0)}
              className="text-white/80 hover:text-white"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white hover:text-white"
            >
              {isPlaying ? (
                <PauseCircle className="w-8 h-8" />
              ) : (
                <PlayCircle className="w-8 h-8" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white"
            >
              <Bookmark className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Story List */}
      <div className="flex-1 overflow-y-auto px-4">
        <h3 className="font-semibold mb-3 text-gray-300">Your Stories</h3>
        {stories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedStory(index)}
            className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
              selectedStory === index
                ? "bg-purple-900/30 border border-purple-500/30"
                : "bg-gray-900/50 hover:bg-gray-800/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{story.title}</h4>
                <p className="text-sm text-gray-400">{story.chapter}</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Next Drop</div>
                <div className="text-sm font-medium text-purple-400">
                  {story.nextDrop}
                </div>
              </div>
            </div>

            {/* Reading Progress */}
            <div className="mt-2">
              <Progress
                value={(story.progress / story.duration) * 100}
                className="h-1 bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{story.progress}m read</span>
                <span>{story.duration}m total</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-800">
        <Button className="w-full bg-purple-600 hover:bg-purple-700 mb-2">
          <Clock className="w-4 h-4 mr-2" />
          Set Reading Reminder
        </Button>
        <Button
          variant="outline"
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          View Release Schedule
        </Button>
      </div>
    </div>
  );
}
