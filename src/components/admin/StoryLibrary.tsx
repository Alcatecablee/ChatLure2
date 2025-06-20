import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useApp, useStories, useLoading } from "@/contexts/AppContext";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Star,
  Share,
  Play,
  Pause,
  TrendingUp,
  Users,
  Clock,
  BarChart3,
  Download,
  Upload,
  Copy,
  MessageSquare,
  Image,
  Mic,
  Video,
  Zap,
  Settings,
  Archive,
  ChevronDown,
  ChevronUp,
  Calendar,
  Tag,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Using Story from API types
import type { Story } from "@/lib/api";

interface Character {
  id: string;
  name: string;
  avatar: string;
  role: "protagonist" | "antagonist" | "supporting";
}

interface StoryStats {
  views: number;
  completions: number;
  shares: number;
  avgRating: number;
  completionRate: number;
  avgEngagementTime: number;
  peakViewers: number;
  comments: number;
}

const GENRE_COLORS = {
  family: "bg-blue-500/20 text-blue-400",
  scandal: "bg-red-500/20 text-red-400",
  romance: "bg-pink-500/20 text-pink-400",
  money: "bg-green-500/20 text-green-400",
  mystery: "bg-purple-500/20 text-purple-400",
  drama: "bg-orange-500/20 text-orange-400",
};

export function StoryLibrary() {
  const { updateStory, deleteStory, addNotification, loadStories } = useApp();
  const stories = useStories();
  const isLoading = useLoading();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState("viral");
  const [showInactive, setShowInactive] = useState(false);
  const [selectedStories, setSelectedStories] = useState<string[]>([]);
  const [expandedStory, setExpandedStory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredStories = stories.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesGenre =
      selectedGenre === "all" || story.genre === selectedGenre;
    const matchesActive = showInactive || story.isActive;

    return matchesSearch && matchesGenre && matchesActive;
  });

  const sortedStories = [...filteredStories].sort((a, b) => {
    switch (sortBy) {
      case "viral":
        return b.viralScore - a.viralScore;
      case "views":
        return b.stats.views - a.stats.views;
      case "recent":
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      case "rating":
        return b.stats.avgRating - a.stats.avgRating;
      case "completion":
        return b.stats.completionRate - a.stats.completionRate;
      default:
        return 0;
    }
  });

  const toggleStorySelection = (storyId: string) => {
    setSelectedStories((prev) =>
      prev.includes(storyId)
        ? prev.filter((id) => id !== storyId)
        : [...prev, storyId],
    );
  };

  const toggleStoryActive = (storyId: string) => {
    const story = stories.find((s) => s.id === storyId);
    if (story) {
      const updatedStory = { ...story, isActive: !story.isActive };
      updateStory(updatedStory);
      setStories((prev) =>
        prev.map((s) => (s.id === storyId ? updatedStory : s)),
      );
    }
  };

  const StoryCard = ({ story }: { story: Story }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`bg-gray-800 border border-gray-700 rounded-lg p-4 transition-all hover:border-gray-600 ${
        selectedStories.includes(story.id) ? "ring-2 ring-purple-500" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <input
            type="checkbox"
            checked={selectedStories.includes(story.id)}
            onChange={() => toggleStorySelection(story.id)}
            className="mt-1 rounded"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-1">{story.title}</h3>
            <p className="text-sm text-gray-400 mb-2 line-clamp-2">
              {story.description}
            </p>

            <div className="flex items-center space-x-2 mb-2">
              <Badge
                className={
                  GENRE_COLORS[story.genre as keyof typeof GENRE_COLORS]
                }
              >
                {story.genre}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {story.source}
              </Badge>
              {!story.isActive && (
                <Badge
                  variant="secondary"
                  className="bg-gray-600 text-gray-300 text-xs"
                >
                  Inactive
                </Badge>
              )}
              <div className="flex items-center space-x-1 text-orange-400">
                <TrendingUp size={12} />
                <span className="text-xs font-bold">{story.viralScore}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm">
            <Eye size={14} />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleStoryActive(story.id)}
            className={story.isActive ? "text-green-400" : "text-gray-400"}
          >
            {story.isActive ? <Play size={14} /> : <Pause size={14} />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
        <div className="text-center">
          <div className="text-blue-400 font-bold">
            {story.stats.views.toLocaleString()}
          </div>
          <div className="text-gray-500 text-xs">Views</div>
        </div>
        <div className="text-center">
          <div className="text-green-400 font-bold">
            {story.stats.completionRate}%
          </div>
          <div className="text-gray-500 text-xs">Completion</div>
        </div>
        <div className="text-center">
          <div className="text-yellow-400 font-bold">
            {story.stats.avgRating}
          </div>
          <div className="text-gray-500 text-xs">Rating</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1">
            <MessageSquare size={12} />
            <span>{story.plotPoints?.length || 0}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Users size={12} />
            <span>{story.characters?.length || 0}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Clock size={12} />
            <span>
              {Math.round((story.plotPoints?.length || 0) * 2.5)}m est.
            </span>
          </span>
        </div>
        <div className="flex items-center space-x-1">
          {story.plotPoints?.some((p) => p.messageType === "image") && (
            <span className="flex items-center space-x-1">
              <Image size={12} />
              <span>
                {
                  story.plotPoints.filter((p) => p.messageType === "image")
                    .length
                }
              </span>
            </span>
          )}
          {story.plotPoints?.some((p) => p.messageType === "audio") && (
            <span className="flex items-center space-x-1">
              <Mic size={12} />
              <span>
                {
                  story.plotPoints.filter((p) => p.messageType === "audio")
                    .length
                }
              </span>
            </span>
          )}
          {story.plotPoints?.some((p) => p.messageType === "video") && (
            <span className="flex items-center space-x-1">
              <Video size={12} />
              <span>
                {
                  story.plotPoints.filter((p) => p.messageType === "video")
                    .length
                }
              </span>
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {story.tags.slice(0, 3).map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="text-xs bg-gray-700 text-gray-300"
          >
            {tag}
          </Badge>
        ))}
        {story.tags.length > 3 && (
          <Badge
            variant="secondary"
            className="text-xs bg-gray-700 text-gray-300"
          >
            +{story.tags.length - 3}
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Updated {new Date(story.updatedAt).toLocaleDateString()}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            setExpandedStory(expandedStory === story.id ? null : story.id)
          }
        >
          {expandedStory === story.id ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          )}
        </Button>
      </div>

      {expandedStory === story.id && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-gray-700"
        >
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-semibold mb-2 text-gray-300">Characters</h5>
              <div className="space-y-1">
                {story.characters.map((char) => (
                  <div key={char.id} className="flex items-center space-x-2">
                    <span>{char.avatar}</span>
                    <span className="text-gray-400">{char.name}</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        char.role === "protagonist"
                          ? "border-green-500 text-green-400"
                          : char.role === "antagonist"
                            ? "border-red-500 text-red-400"
                            : "border-blue-500 text-blue-400"
                      }`}
                    >
                      {char.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-2 text-gray-300">
                Advanced Stats
              </h5>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Shares:</span>
                  <span className="text-blue-400">
                    {story.stats.shares.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Comments:</span>
                  <span className="text-purple-400">
                    {story.stats.comments.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Peak Viewers:</span>
                  <span className="text-orange-400">
                    {story.stats.peakViewers.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Time:</span>
                  <span className="text-green-400">
                    {Math.floor(story.stats.avgEngagementTime / 60)}m
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  if (isLoading && stories.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 bg-gray-900 text-white rounded-xl">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="ml-3 text-gray-400">Loading stories...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-900 text-white rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-3">
            <Archive className="text-purple-400" />
            <span>Story Library</span>
            <Badge
              variant="secondary"
              className="bg-purple-500/20 text-purple-400"
            >
              {stories.length} Stories
            </Badge>
          </h1>
          <p className="text-gray-400 mt-1">
            Manage and organize your ChatLure stories
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload size={16} className="mr-2" />
            Import
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Zap size={16} className="mr-2" />
            New Story
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stories by title, description, or tags..."
              className="pl-10 bg-gray-800 border-gray-700"
            />
          </div>
        </div>

        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
          <SelectTrigger className="w-40 bg-gray-800 border-gray-700">
            <SelectValue placeholder="All Genres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            <SelectItem value="family">Family</SelectItem>
            <SelectItem value="scandal">Scandal</SelectItem>
            <SelectItem value="romance">Romance</SelectItem>
            <SelectItem value="money">Money</SelectItem>
            <SelectItem value="mystery">Mystery</SelectItem>
            <SelectItem value="drama">Drama</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40 bg-gray-800 border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="viral">Viral Score</SelectItem>
            <SelectItem value="views">Most Views</SelectItem>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="completion">Completion Rate</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2">
          <Switch checked={showInactive} onCheckedChange={setShowInactive} />
          <span className="text-sm text-gray-400">Show Inactive</span>
        </div>
      </div>

      {selectedStories.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">
              {selectedStories.length} stories selected
            </span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Star size={14} className="mr-1" />
                Favorite
              </Button>
              <Button variant="outline" size="sm">
                <Share size={14} className="mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Archive size={14} className="mr-1" />
                Archive
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 size={14} className="mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedStories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>

      {sortedStories.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          <Archive size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">No stories found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
