import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  TrendingUp,
  Users,
  Search,
  Filter,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface DiscoverProps {
  onBack: () => void;
}

export function Discover({ onBack }: DiscoverProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("trending");

  const categories = [
    {
      id: "trending",
      name: "Trending",
      icon: <TrendingUp className="w-4 h-4" />,
    },
    { id: "nearby", name: "Nearby", icon: <MapPin className="w-4 h-4" /> },
    { id: "popular", name: "Popular", icon: <Users className="w-4 h-4" /> },
  ];

  const stories = [
    {
      id: 1,
      title: "Drama at Central Mall",
      location: "Downtown Mall, 0.3 miles",
      category: "Trending",
      readers: 1247,
      timeAgo: "2h ago",
      description: "Heated argument between ex-lovers in the food court",
      tags: ["drama", "public", "relationship"],
      distance: "0.3 miles",
      isLive: true,
    },
    {
      id: 2,
      title: "Coffee Shop Confession",
      location: "Starbucks on 5th St, 0.8 miles",
      category: "Romance",
      readers: 892,
      timeAgo: "5h ago",
      description: "Someone just confessed their feelings to their best friend",
      tags: ["romance", "confession", "friendship"],
      distance: "0.8 miles",
      isLive: false,
    },
    {
      id: 3,
      title: "University Scandal",
      location: "State University, 1.2 miles",
      category: "Scandal",
      readers: 2103,
      timeAgo: "1d ago",
      description: "Professor caught in compromising situation",
      tags: ["scandal", "university", "authority"],
      distance: "1.2 miles",
      isLive: false,
    },
    {
      id: 4,
      title: "Neighbor Feud Escalates",
      location: "Maple Street, 0.5 miles",
      category: "Conflict",
      readers: 634,
      timeAgo: "3h ago",
      description: "Property line dispute turns into neighborhood drama",
      tags: ["neighbors", "conflict", "property"],
      distance: "0.5 miles",
      isLive: true,
    },
    {
      id: 5,
      title: "Workplace Romance Exposed",
      location: "Tech Tower, 2.1 miles",
      category: "Romance",
      readers: 1456,
      timeAgo: "6h ago",
      description: "Secret office affair revealed during team meeting",
      tags: ["workplace", "romance", "secret"],
      distance: "2.1 miles",
      isLive: false,
    },
  ];

  const filteredStories = stories.filter(
    (story) =>
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Trending: "bg-red-500",
      Romance: "bg-pink-500",
      Scandal: "bg-purple-500",
      Conflict: "bg-orange-500",
    };
    return colors[category] || "bg-gray-500";
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
          Discovering stories within 5 miles
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
        {filteredStories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-900/50 rounded-lg p-4 mb-3 cursor-pointer hover:bg-gray-800/50 transition-colors border border-gray-800"
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
              <div className="text-right">
                <div
                  className={`inline-block px-2 py-1 rounded text-xs text-white ${getCategoryColor(story.category)}`}
                >
                  {story.category}
                </div>
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-3">{story.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{story.readers.toLocaleString()} readers</span>
                </div>
                <span>{story.timeAgo}</span>
                <span>{story.distance}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-2">
              {story.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
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
