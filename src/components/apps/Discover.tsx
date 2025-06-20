import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  TrendingUp,
  Users,
  Search,
  Filter,
  Navigation,
  BookOpen,
  Eye,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useDatabase } from "@/contexts/DatabaseContext";

interface DiscoverProps {
  onBack: () => void;
}

export function Discover({ onBack }: DiscoverProps) {
  const {
    getTrendingStories,
    searchStories,
    incrementViews,
    addBookmark,
    currentUser,
  } = useDatabase();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("trending");
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, [selectedCategory]);

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      loadStories();
    }
  }, [searchQuery]);

  const categories = [
    {
      id: "trending",
      name: "Trending",
      icon: <TrendingUp className="w-4 h-4" />,
    },
    { id: "nearby", name: "Nearby", icon: <MapPin className="w-4 h-4" /> },
    { id: "popular", name: "Popular", icon: <Users className="w-4 h-4" /> },
  ];

  const loadStories = async () => {
    setLoading(true);
    try {
      let loadedStories: any[] = [];

      if (selectedCategory === "trending") {
        loadedStories = await getTrendingStories();
      } else {
        // For demo purposes, load trending for all categories
        loadedStories = await getTrendingStories();
      }

      // Add some demo metadata
      const enhancedStories = loadedStories.map((story) => ({
        ...story,
        location: story.location?.address || "Unknown location",
        distance: `${Math.random() * 5 + 0.1}`.slice(0, 3) + " miles",
        isLive: Math.random() > 0.7,
        timeAgo: formatTimeAgo(new Date(story.createdAt)),
        readers: story.stats.views,
      }));

      setStories(enhancedStories);
    } catch (error) {
      console.error("Failed to load stories:", error);
      // Fallback to demo data
      setStories(createDemoStories());
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const results = await searchStories(searchQuery);
      const enhancedResults = results.map((story) => ({
        ...story,
        location: story.location?.address || "Unknown location",
        distance: `${Math.random() * 5 + 0.1}`.slice(0, 3) + " miles",
        isLive: Math.random() > 0.8,
        timeAgo: formatTimeAgo(new Date(story.createdAt)),
        readers: story.stats.views,
      }));
      setStories(enhancedResults);
    } catch (error) {
      console.error("Search failed:", error);
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  const createDemoStories = () => [
    {
      id: "demo-1",
      title: "Drama at Central Mall",
      description: "Heated argument between ex-lovers in the food court",
      category: "Drama",
      tags: ["drama", "public", "relationship"],
      location: "Downtown Mall, 0.3 miles",
      distance: "0.3 miles",
      readers: 1247,
      timeAgo: "2h ago",
      isLive: true,
      stats: { views: 1247, likes: 89, comments: 34 },
    },
    {
      id: "demo-2",
      title: "Coffee Shop Confession",
      description: "Someone just confessed their feelings to their best friend",
      category: "Romance",
      tags: ["romance", "confession", "friendship"],
      location: "Starbucks on 5th St, 0.8 miles",
      distance: "0.8 miles",
      readers: 892,
      timeAgo: "5h ago",
      isLive: false,
      stats: { views: 892, likes: 156, comments: 67 },
    },
    {
      id: "demo-3",
      title: "University Scandal",
      description: "Professor caught in compromising situation",
      category: "Scandal",
      tags: ["scandal", "university", "authority"],
      location: "State University, 1.2 miles",
      distance: "1.2 miles",
      readers: 2103,
      timeAgo: "1d ago",
      isLive: false,
      stats: { views: 2103, likes: 234, comments: 123 },
    },
  ];

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Drama: "bg-red-500",
      Romance: "bg-pink-500",
      Scandal: "bg-purple-500",
      Mystery: "bg-indigo-500",
      Comedy: "bg-green-500",
    };
    return colors[category] || "bg-gray-500";
  };

  const handleStoryClick = async (story: any) => {
    try {
      await incrementViews(story.id);
      // Could navigate to story detail view
      console.log("Viewing story:", story.title);
    } catch (error) {
      console.error("Failed to increment views:", error);
    }
  };

  const handleBookmark = async (storyId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await addBookmark(storyId, "Discovered story");
      // Show success feedback
      console.log("Story bookmarked");
    } catch (error) {
      console.error("Failed to bookmark story:", error);
    }
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
        <h1 className="text-lg font-semibold">Discover</h1>
        <Button variant="ghost" size="sm" className="text-gray-400">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Location Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30"
      >
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Navigation className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-gray-300">Your Location: Downtown</span>
        </div>
        <div className="text-center text-xs text-gray-400">
          Discovering stories within 5 miles • {stories.length} stories found
        </div>
      </motion.div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search stories, locations, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-4 pb-4">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 ${
                selectedCategory === category.id
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "border-gray-600 text-gray-300 hover:bg-gray-800"
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Stories List */}
      <div className="flex-1 overflow-y-auto px-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No stories found</h3>
            <p className="text-sm">
              {searchQuery
                ? "Try a different search term"
                : "No stories in this category yet"}
            </p>
          </div>
        ) : (
          stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900/50 rounded-lg p-4 mb-3 cursor-pointer hover:bg-gray-800/50 transition-colors border border-gray-800"
              onClick={() => handleStoryClick(story)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-white">{story.title}</h3>
                    {story.isLive && (
                      <Badge className="bg-red-500 text-white text-xs px-2 py-0.5 animate-pulse">
                        LIVE
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                    <MapPin className="w-3 h-3" />
                    <span>{story.location}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <div
                    className={`px-2 py-1 rounded text-xs text-white ${getCategoryColor(story.category)}`}
                  >
                    {story.category}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleBookmark(story.id, e)}
                    className="text-gray-400 hover:text-yellow-400 p-1"
                  >
                    <BookOpen className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-3">{story.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{story.readers?.toLocaleString() || 0} views</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>{story.stats?.likes || 0} likes</span>
                  </div>
                  <span>{story.timeAgo}</span>
                  <span>{story.distance}</span>
                </div>
              </div>

              {/* Tags */}
              {story.tags && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {story.tags.slice(0, 3).map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-800">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 mb-2">
          <MapPin className="w-4 h-4 mr-2" />
          Enable Location for Better Discoveries
        </Button>
        <Button
          variant="outline"
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          Submit Story Tip
        </Button>
      </div>
    </div>
  );
}
