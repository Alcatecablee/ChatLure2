import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Search,
  Filter,
  TrendingUp,
  Calendar,
  User,
  MapPin,
  Clock,
  Edit,
  Archive,
  Trash2,
  ExternalLink,
  Play,
  Pause,
  BarChart3,
  AlertCircle,
  Plus,
} from "lucide-react";
import { useDatabase } from "@/contexts/DatabaseContext";
import { Story } from "@/lib/database";

type SortOption =
  | "newest"
  | "oldest"
  | "most_viewed"
  | "most_liked"
  | "alphabetical";
type FilterStatus = "all" | "published" | "draft" | "archived";

export function StoryLibrary() {
  const {
    getTrendingStories,
    getMyStories,
    searchStories,
    incrementViews,
    isInitialized,
  } = useDatabase();

  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (!isInitialized) return;
    loadStories();
  }, [isInitialized, searchQuery, sortBy, filterStatus, selectedCategory]);

  const loadStories = async () => {
    try {
      setIsLoading(true);

      let allStories: Story[] = [];

      if (searchQuery.trim()) {
        // Search stories by query
        allStories = await searchStories(searchQuery);
      } else {
        // Get all stories (trending + my stories)
        const trending = await getTrendingStories();
        const myStories = await getMyStories();

        // Combine and deduplicate
        const storyMap = new Map();
        [...trending, ...myStories].forEach((story) => {
          storyMap.set(story.id, story);
        });

        allStories = Array.from(storyMap.values());
      }

      // Apply filters
      let filteredStories = allStories;

      if (filterStatus !== "all") {
        filteredStories = filteredStories.filter(
          (story) => story.status === filterStatus,
        );
      }

      if (selectedCategory !== "all") {
        filteredStories = filteredStories.filter(
          (story) => story.category === selectedCategory,
        );
      }

      // Apply sorting
      filteredStories.sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          case "oldest":
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          case "most_viewed":
            return (b.stats?.views || 0) - (a.stats?.views || 0);
          case "most_liked":
            return (b.stats?.likes || 0) - (a.stats?.likes || 0);
          case "alphabetical":
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });

      setStories(filteredStories);
    } catch (error) {
      console.error("Failed to load stories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStoryAction = async (storyId: string, action: string) => {
    try {
      switch (action) {
        case "view":
          await incrementViews(storyId);
          // Update local state
          setStories((prev) =>
            prev.map((story) =>
              story.id === storyId
                ? {
                    ...story,
                    stats: {
                      ...story.stats,
                      views: (story.stats?.views || 0) + 1,
                    },
                  }
                : story,
            ),
          );
          break;
        case "edit":
          // Navigate to edit mode (would implement routing)
          console.log("Edit story:", storyId);
          break;
        case "archive":
          // Implement archive functionality
          console.log("Archive story:", storyId);
          break;
        case "delete":
          // Implement delete functionality
          console.log("Delete story:", storyId);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action} story:`, error);
    }
  };

  const formatTimeAgo = (dateString: string | Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500/20 text-green-400";
      case "draft":
        return "bg-yellow-500/20 text-yellow-400";
      case "archived":
        return "bg-gray-500/20 text-gray-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "drama":
        return "bg-red-500/20 text-red-400";
      case "romance":
        return "bg-pink-500/20 text-pink-400";
      case "scandal":
        return "bg-orange-500/20 text-orange-400";
      case "mystery":
        return "bg-purple-500/20 text-purple-400";
      case "comedy":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Story Library</h2>
            <p className="text-gray-400">Loading stories...</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700 animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Story Library</h2>
          <p className="text-gray-400">
            {stories.length === 0
              ? "No stories found"
              : `${stories.length} stories`}
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Story
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600"
                />
              </div>
            </div>

            <Select
              value={filterStatus}
              onValueChange={(value: FilterStatus) => setFilterStatus(value)}
            >
              <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="drama">Drama</SelectItem>
                <SelectItem value="romance">Romance</SelectItem>
                <SelectItem value="scandal">Scandal</SelectItem>
                <SelectItem value="mystery">Mystery</SelectItem>
                <SelectItem value="comedy">Comedy</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value: SortOption) => setSortBy(value)}
            >
              <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
                <BarChart3 className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="most_viewed">Most Viewed</SelectItem>
                <SelectItem value="most_liked">Most Liked</SelectItem>
                <SelectItem value="alphabetical">A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stories Grid */}
      {stories.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No Stories Found
            </h3>
            <p className="text-gray-400 mb-4">
              {searchQuery
                ? `No stories match your search for "${searchQuery}"`
                : "You haven't created any stories yet"}
            </p>
            <Button>Create Your First Story</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <Card
              key={story.id}
              className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold text-white truncate">
                      {story.title}
                    </CardTitle>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                      {story.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <Badge className={getCategoryColor(story.category)}>
                    {story.category}
                  </Badge>
                  <Badge className={getStatusColor(story.status)}>
                    {story.status}
                  </Badge>
                  {story.stats && story.stats.views > 100 && (
                    <Badge className="bg-orange-500/20 text-orange-400">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{story.stats?.views || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{story.stats?.likes || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{story.stats?.comments || 0}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{story.readingTime} min</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>By Admin</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatTimeAgo(story.createdAt)}</span>
                    </div>
                  </div>

                  {/* Location */}
                  {story.location && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{story.location.address}</span>
                    </div>
                  )}

                  {/* Tags */}
                  {story.tags && story.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {story.tags.slice(0, 3).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          #{tag}
                        </Badge>
                      ))}
                      {story.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{story.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStoryAction(story.id, "view")}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStoryAction(story.id, "edit")}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>

                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-blue-400"
                        onClick={() => handleStoryAction(story.id, "analytics")}
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-yellow-400"
                        onClick={() => handleStoryAction(story.id, "archive")}
                      >
                        <Archive className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-400"
                        onClick={() => handleStoryAction(story.id, "delete")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Load More */}
      {stories.length > 0 && stories.length % 12 === 0 && (
        <div className="text-center">
          <Button variant="outline" onClick={loadStories}>
            Load More Stories
          </Button>
        </div>
      )}
    </div>
  );
}
