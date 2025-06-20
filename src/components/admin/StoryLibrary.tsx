import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Eye,
  Heart,
  MessageCircle,
  Edit,
  Trash2,
  MoreVertical,
  Archive,
  Share,
  BookOpen,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDatabase } from "@/contexts/DatabaseContext";

export function StoryLibrary() {
  const { getMyStories, getTrendingStories, updateStory, currentUser } =
    useDatabase();
  const [stories, setStories] = useState<any[]>([]);
  const [filteredStories, setFilteredStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    loadStories();
  }, []);

  useEffect(() => {
    filterAndSortStories();
  }, [stories, searchQuery, statusFilter, categoryFilter, sortBy]);

  const loadStories = async () => {
    setLoading(true);
    try {
      const [myStories, trendingStories] = await Promise.all([
        getMyStories(),
        getTrendingStories(),
      ]);

      // Combine and enhance stories with additional metadata
      const enhancedStories = myStories.map((story) => ({
        ...story,
        isTrending: trendingStories.some((t) => t.id === story.id),
        createdAt: new Date(story.createdAt),
        updatedAt: new Date(story.updatedAt),
      }));

      setStories(enhancedStories);
    } catch (error) {
      console.error("Failed to load stories:", error);
      // Fallback to demo data if needed
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortStories = () => {
    let filtered = stories.filter((story) => {
      const matchesSearch =
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.tags.some((tag: string) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesStatus =
        statusFilter === "all" || story.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || story.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    // Sort stories
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case "mostViewed":
        filtered.sort((a, b) => b.stats.views - a.stats.views);
        break;
      case "mostLiked":
        filtered.sort((a, b) => b.stats.likes - a.stats.likes);
        break;
      case "alphabetical":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredStories(filtered);
  };

  const handleStatusChange = async (storyId: string, newStatus: string) => {
    try {
      await updateStory(storyId, { status: newStatus });
      setStories((prev) =>
        prev.map((story) =>
          story.id === storyId ? { ...story, status: newStatus } : story,
        ),
      );
    } catch (error) {
      console.error("Failed to update story status:", error);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      "day",
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-600";
      case "draft":
        return "bg-yellow-600";
      case "archived":
        return "bg-gray-600";
      default:
        return "bg-gray-600";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      drama: "bg-red-500",
      romance: "bg-pink-500",
      scandal: "bg-purple-500",
      mystery: "bg-indigo-500",
      comedy: "bg-green-500",
    };
    return colors[category] || "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Story Library</h2>
          <p className="text-gray-400 mt-1">
            Manage and track your published stories ({stories.length} total)
          </p>
        </div>
        <Button
          onClick={loadStories}
          variant="outline"
          className="border-gray-600"
        >
          <Clock className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Published Stories</p>
                <p className="text-2xl font-bold text-green-400">
                  {stories.filter((s) => s.status === "published").length}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Views</p>
                <p className="text-2xl font-bold text-blue-400">
                  {stories
                    .reduce((sum, s) => sum + s.stats.views, 0)
                    .toLocaleString()}
                </p>
              </div>
              <Eye className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Likes</p>
                <p className="text-2xl font-bold text-red-400">
                  {stories
                    .reduce((sum, s) => sum + s.stats.likes, 0)
                    .toLocaleString()}
                </p>
              </div>
              <Heart className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Trending</p>
                <p className="text-2xl font-bold text-orange-400">
                  {stories.filter((s) => s.isTrending).length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="drama">Drama</SelectItem>
                <SelectItem value="romance">Romance</SelectItem>
                <SelectItem value="scandal">Scandal</SelectItem>
                <SelectItem value="mystery">Mystery</SelectItem>
                <SelectItem value="comedy">Comedy</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="mostViewed">Most Viewed</SelectItem>
                <SelectItem value="mostLiked">Most Liked</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stories Grid */}
      {filteredStories.length === 0 ? (
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {stories.length === 0
                ? "No stories yet"
                : "No stories match your filters"}
            </h3>
            <p className="text-gray-400 mb-4">
              {stories.length === 0
                ? "Create your first story to get started!"
                : "Try adjusting your search or filter criteria"}
            </p>
            {stories.length === 0 && (
              <Button className="bg-purple-600 hover:bg-purple-700">
                <BookOpen className="w-4 h-4 mr-2" />
                Create Your First Story
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg line-clamp-2 mb-2">
                        {story.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge
                          className={`${getStatusColor(story.status)} text-white`}
                        >
                          {story.status}
                        </Badge>
                        <Badge
                          className={`${getCategoryColor(story.category)} text-white`}
                        >
                          {story.category}
                        </Badge>
                        {story.isTrending && (
                          <Badge className="bg-orange-600 text-white">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                    {story.description}
                  </p>

                  <div className="space-y-3">
                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {story.stats.views}
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {story.stats.likes}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          {story.stats.comments}
                        </span>
                      </div>
                      <span>{story.readingTime}m read</span>
                    </div>

                    {/* Tags */}
                    {story.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {story.tags.slice(0, 3).map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                        {story.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                            +{story.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Date */}
                    <div className="text-xs text-gray-500">
                      Created {formatDate(story.createdAt)} • Updated{" "}
                      {formatDate(story.updatedAt)}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:text-white flex-1"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:text-white"
                      >
                        <Share className="w-3 h-3" />
                      </Button>
                      {story.status === "published" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatusChange(story.id, "archived")
                          }
                          className="border-gray-600 text-gray-300 hover:text-yellow-400"
                        >
                          <Archive className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
