import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Bookmark,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { useDatabase } from "@/contexts/DatabaseContext";

interface StoryTimerProps {
  onBack: () => void;
}

export function StoryTimer({ onBack }: StoryTimerProps) {
  const { getMyStories, saveProgress, getProgress, currentUser } =
    useDatabase();
  const [stories, setStories] = useState<any[]>([]);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    loadStories();
  }, []);

  useEffect(() => {
    if (stories.length > 0) {
      loadStoryProgress(stories[selectedStoryIndex]);
    }
  }, [selectedStoryIndex, stories]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < totalTime) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= totalTime) {
            setIsPlaying(false);
            return totalTime;
          }

          // Save progress every 10 seconds
          if (newTime % 10 === 0 && stories[selectedStoryIndex]) {
            saveStoryProgress(newTime);
          }

          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, totalTime, selectedStoryIndex, stories]);

  const loadStories = async () => {
    try {
      const myStories = await getMyStories();

      // If no user stories, create demo stories for the timer
      if (myStories.length === 0) {
        const demoStories = [
          {
            id: "demo-1",
            title: "Coffee Shop Chronicles",
            description: "A tale of love and betrayal over lattes",
            readingTime: 15,
            status: "reading",
            progress: 0,
            nextDrop: "2h 15m",
          },
          {
            id: "demo-2",
            title: "University Drama",
            description: "Campus secrets revealed",
            readingTime: 22,
            status: "new",
            progress: 0,
            nextDrop: "Tomorrow",
          },
          {
            id: "demo-3",
            title: "Office Romance",
            description: "Workplace relationships get complicated",
            readingTime: 18,
            status: "reading",
            progress: 45,
            nextDrop: "4h 30m",
          },
        ];
        setStories(demoStories);
        setTotalTime(demoStories[0].readingTime * 60);
      } else {
        const formattedStories = myStories.map((story) => ({
          id: story.id,
          title: story.title,
          description: story.description,
          readingTime: story.readingTime,
          status: "reading",
          progress: 0,
          nextDrop: "Available now",
        }));
        setStories(formattedStories);
        if (formattedStories.length > 0) {
          setTotalTime(formattedStories[0].readingTime * 60);
        }
      }
    } catch (error) {
      console.error("Failed to load stories:", error);
    }
  };

  const loadStoryProgress = async (story: any) => {
    if (!story || !currentUser) return;

    try {
      const progress = await getProgress(story.id);
      if (progress) {
        const timeInSeconds = Math.floor(
          (progress.progress / 100) * (story.readingTime * 60),
        );
        setCurrentTime(timeInSeconds);
      } else {
        setCurrentTime(0);
      }
      setTotalTime(story.readingTime * 60);
    } catch (error) {
      console.error("Failed to load progress:", error);
      setCurrentTime(0);
      setTotalTime(story.readingTime * 60);
    }
  };

  const saveStoryProgress = async (timeInSeconds: number) => {
    const story = stories[selectedStoryIndex];
    if (!story || !currentUser) return;

    try {
      const progressPercent = (timeInSeconds / totalTime) * 100;
      await saveProgress(story.id, progressPercent, `time:${timeInSeconds}`);
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStorySelect = (index: number) => {
    // Save current progress before switching
    if (stories[selectedStoryIndex]) {
      saveStoryProgress(currentTime);
    }

    setSelectedStoryIndex(index);
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentTime(0);
    setIsPlaying(false);
    if (stories[selectedStoryIndex]) {
      saveStoryProgress(0);
    }
  };

  const currentStory = stories[selectedStoryIndex];

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

      {/* Current Story Player */}
      {currentStory && (
        <div className="p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 mb-4"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold mb-2">{currentStory.title}</h2>
                <p className="text-white/80 text-sm">
                  {currentStory.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-white/60">Status</div>
                <div className="text-sm font-medium capitalize">
                  {currentStory.status}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(totalTime)}</span>
              </div>
              <Progress
                value={totalTime > 0 ? (currentTime / totalTime) * 100 : 0}
                className="h-2 bg-white/20"
              />
              <div className="text-xs text-white/60 mt-1 text-center">
                {totalTime > 0
                  ? Math.round((currentTime / totalTime) * 100)
                  : 0}
                % Complete
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-white/80 hover:text-white"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white hover:text-white"
                disabled={currentTime >= totalTime}
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
                onClick={() => {
                  // Add bookmark functionality
                  console.log("Bookmark story");
                }}
              >
                <Bookmark className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Story List */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-300">Your Stories</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <BookOpen className="w-4 h-4" />
            <span>{stories.length} stories</span>
          </div>
        </div>

        {stories.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No stories to read yet</p>
            <p className="text-sm">
              Create your first story to start timing your reading!
            </p>
          </div>
        ) : (
          stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleStorySelect(index)}
              className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                selectedStoryIndex === index
                  ? "bg-purple-900/30 border border-purple-500/30"
                  : "bg-gray-900/50 hover:bg-gray-800/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{story.title}</h4>
                  <p className="text-sm text-gray-400 line-clamp-1">
                    {story.description}
                  </p>
                </div>
                <div className="text-right ml-3">
                  <div className="text-xs text-gray-400">Reading Time</div>
                  <div className="text-sm font-medium text-purple-400">
                    {story.readingTime}m
                  </div>
                </div>
              </div>

              {/* Reading Progress */}
              <div className="mt-2">
                <Progress
                  value={story.progress || 0}
                  className="h-1 bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{Math.round(story.progress || 0)}% read</span>
                  <span className="capitalize">{story.status}</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-800">
        <Button className="w-full bg-purple-600 hover:bg-purple-700 mb-2">
          <Clock className="w-4 h-4 mr-2" />
          Set Reading Goals
        </Button>
        <Button
          variant="outline"
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          View Reading Stats
        </Button>
      </div>
    </div>
  );
}
