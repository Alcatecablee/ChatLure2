import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Share,
  Download,
  Search,
  Grid3X3,
  List,
  Bookmark,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface GalleryProps {
  onBack: () => void;
}

export function Gallery({ onBack }: GalleryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const screenshots = [
    {
      id: 1,
      title: "Epic Confrontation at Mall",
      story: "Drama at Central Mall",
      timestamp: "2:34 PM",
      date: "Today",
      likes: 234,
      saved: true,
      category: "Drama",
      description: "The moment she threw the coffee at him",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop",
    },
    {
      id: 2,
      title: "Secret Text Messages",
      story: "Office Romance Exposed",
      timestamp: "11:45 AM",
      date: "Yesterday",
      likes: 156,
      saved: false,
      category: "Romance",
      description: "The texts that started it all",
      image:
        "https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?w=400&h=600&fit=crop",
    },
    {
      id: 3,
      title: "University Board Meeting Chaos",
      story: "Student Protest Drama",
      timestamp: "3:15 PM",
      date: "2 days ago",
      likes: 89,
      saved: true,
      category: "Education",
      description: "When the dean walked out mid-meeting",
      image:
        "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=600&fit=crop",
    },
    {
      id: 4,
      title: "Neighborhood HOA Meeting",
      story: "Property Line Wars",
      timestamp: "7:20 PM",
      date: "3 days ago",
      likes: 67,
      saved: false,
      category: "Community",
      description: "Karen demanding to speak to the manager",
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=600&fit=crop",
    },
    {
      id: 5,
      title: "Coffee Shop Confession",
      story: "Love Triangle Revealed",
      timestamp: "5:30 PM",
      date: "1 week ago",
      likes: 312,
      saved: true,
      category: "Romance",
      description: "The confession that broke hearts",
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=600&fit=crop",
    },
    {
      id: 6,
      title: "Parking Lot Argument",
      story: "Road Rage Drama",
      timestamp: "2:10 PM",
      date: "1 week ago",
      likes: 98,
      saved: false,
      category: "Public",
      description: "When road rage goes too far",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
    },
  ];

  const collections = [
    {
      name: "Best Drama Moments",
      count: 23,
      preview: screenshots.slice(0, 3),
    },
    {
      name: "Romance Screenshots",
      count: 15,
      preview: screenshots.filter((s) => s.category === "Romance").slice(0, 3),
    },
    {
      name: "Viral Moments",
      count: 8,
      preview: screenshots.filter((s) => s.likes > 200).slice(0, 3),
    },
  ];

  const filteredScreenshots = screenshots.filter(
    (screenshot) =>
      screenshot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      screenshot.story.toLowerCase().includes(searchQuery.toLowerCase()) ||
      screenshot.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Drama: "bg-red-500",
      Romance: "bg-pink-500",
      Education: "bg-blue-500",
      Community: "bg-green-500",
      Public: "bg-orange-500",
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
        <h1 className="text-lg font-semibold">Gallery</h1>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="text-gray-400 hover:text-white"
          >
            {viewMode === "grid" ? (
              <List className="w-4 h-4" />
            ) : (
              <Grid3X3 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30"
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-400">
              {screenshots.length}
            </div>
            <div className="text-xs text-gray-400">Screenshots</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-pink-400">
              {screenshots.filter((s) => s.saved).length}
            </div>
            <div className="text-xs text-gray-400">Saved</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">
              {screenshots.reduce((sum, s) => sum + s.likes, 0)}
            </div>
            <div className="text-xs text-gray-400">Total Likes</div>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search screenshots..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Content Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="all" className="h-full flex flex-col">
          <TabsList className="mx-4 mb-4 bg-gray-900 border-gray-700">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-purple-600"
            >
              All Photos
            </TabsTrigger>
            <TabsTrigger
              value="collections"
              className="data-[state=active]:bg-pink-600"
            >
              Collections
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="data-[state=active]:bg-blue-600"
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Saved
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="flex-1 overflow-y-auto px-4">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredScreenshots.map((screenshot, index) => (
                  <motion.div
                    key={screenshot.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => setSelectedImage(screenshot.id)}
                  >
                    <img
                      src={screenshot.image}
                      alt={screenshot.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                      <div className="absolute top-2 right-2">
                        {screenshot.saved && (
                          <Bookmark className="w-4 h-4 text-yellow-400 fill-current" />
                        )}
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <h3 className="text-white text-sm font-medium mb-1 line-clamp-2">
                          {screenshot.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div
                            className={`px-2 py-1 rounded text-xs text-white ${getCategoryColor(screenshot.category)}`}
                          >
                            {screenshot.category}
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-300">
                            <Heart className="w-3 h-3" />
                            <span>{screenshot.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredScreenshots.map((screenshot, index) => (
                  <motion.div
                    key={screenshot.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedImage(screenshot.id)}
                  >
                    <img
                      src={screenshot.image}
                      alt={screenshot.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-white mb-1">
                        {screenshot.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2">
                        {screenshot.story}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{screenshot.date}</span>
                        <span>•</span>
                        <span>{screenshot.timestamp}</span>
                        <span>•</span>
                        <span>{screenshot.likes} likes</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <div
                        className={`px-2 py-1 rounded text-xs text-white ${getCategoryColor(screenshot.category)}`}
                      >
                        {screenshot.category}
                      </div>
                      {screenshot.saved && (
                        <Bookmark className="w-4 h-4 text-yellow-400 fill-current mx-auto" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="collections"
            className="flex-1 overflow-y-auto px-4"
          >
            <h3 className="font-semibold mb-4 text-gray-300">My Collections</h3>
            {collections.map((collection, index) => (
              <motion.div
                key={collection.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/50 rounded-lg p-4 mb-3 cursor-pointer hover:bg-gray-800/50 transition-colors border border-gray-800"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">
                    {collection.name}
                  </h3>
                  <Badge
                    variant="outline"
                    className="border-gray-600 text-gray-400"
                  >
                    {collection.count} items
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  {collection.preview.map((preview, idx) => (
                    <img
                      key={idx}
                      src={preview.image}
                      alt={preview.title}
                      className="w-16 h-20 object-cover rounded flex-1"
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="saved" className="flex-1 overflow-y-auto px-4">
            <div className="grid grid-cols-2 gap-3">
              {filteredScreenshots
                .filter((s) => s.saved)
                .map((screenshot, index) => (
                  <motion.div
                    key={screenshot.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => setSelectedImage(screenshot.id)}
                  >
                    <img
                      src={screenshot.image}
                      alt={screenshot.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                      <div className="absolute bottom-2 left-2 right-2">
                        <h3 className="text-white text-sm font-medium mb-1 line-clamp-2">
                          {screenshot.title}
                        </h3>
                        <div
                          className={`inline-block px-2 py-1 rounded text-xs text-white ${getCategoryColor(screenshot.category)}`}
                        >
                          {screenshot.category}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-800">
        <div className="grid grid-cols-2 gap-2">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
