import { motion } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Bookmark,
  ExternalLink,
  TrendingUp,
  Clock,
  Users,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface BrowseProps {
  onBack: () => void;
}

export function Browse({ onBack }: BrowseProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const trendingSources = [
    {
      id: 1,
      name: "Reddit Drama",
      description: "r/relationship_advice, r/AmItheAsshole",
      url: "https://reddit.com",
      category: "Drama",
      followers: "2.1M",
      isLive: true,
      lastUpdate: "2m ago",
      thumbnail: "🔥",
    },
    {
      id: 2,
      name: "Twitter Scandals",
      description: "Real-time celebrity and influencer drama",
      url: "https://twitter.com",
      category: "Celebrity",
      followers: "892K",
      isLive: true,
      lastUpdate: "5m ago",
      thumbnail: "🐦",
    },
    {
      id: 3,
      name: "TikTok Tea",
      description: "Latest influencer beef and callouts",
      url: "https://tiktok.com",
      category: "Influencer",
      followers: "1.5M",
      isLive: false,
      lastUpdate: "15m ago",
      thumbnail: "🍵",
    },
    {
      id: 4,
      name: "Discord Leaks",
      description: "Leaked conversations from gaming servers",
      url: "https://discord.com",
      category: "Gaming",
      followers: "654K",
      isLive: true,
      lastUpdate: "8m ago",
      thumbnail: "💬",
    },
  ];

  const viralContent = [
    {
      id: 1,
      title: "Bride Cancels Wedding After Seeing Groom's Text",
      source: "Reddit",
      votes: 15623,
      comments: 2341,
      timeAgo: "3h ago",
      category: "Relationship",
      description:
        "A bride discovered her groom's affair through a text message the morning of their wedding...",
    },
    {
      id: 2,
      title: "Professor Accidentally Shares Screen During Zoom",
      source: "Twitter",
      votes: 8956,
      comments: 1205,
      timeAgo: "5h ago",
      category: "Education",
      description:
        "University professor's private messages exposed during online lecture...",
    },
    {
      id: 3,
      title: "Neighbor's Camera Captures Marriage Proposal Gone Wrong",
      source: "TikTok",
      votes: 12784,
      comments: 3421,
      timeAgo: "1d ago",
      category: "Public",
      description:
        "Ring doorbell footage shows awkward proposal rejection in front of family...",
    },
    {
      id: 4,
      title: "Corporate Slack Channel Drama Leaked",
      source: "LinkedIn",
      votes: 6543,
      comments: 892,
      timeAgo: "2d ago",
      category: "Workplace",
      description:
        "Employee exposes toxic workplace culture through internal messages...",
    },
  ];

  const bookmarkedSources = [
    {
      id: 1,
      name: "Relationship Drama Central",
      url: "https://reddit.com/r/relationship_advice",
      category: "Relationships",
      addedDate: "2 weeks ago",
    },
    {
      id: 2,
      name: "Celebrity Tea Time",
      url: "https://twitter.com/celebritytea",
      category: "Celebrity",
      addedDate: "1 week ago",
    },
    {
      id: 3,
      name: "Office Drama Hub",
      url: "https://reddit.com/r/antiwork",
      category: "Workplace",
      addedDate: "3 days ago",
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Drama: "bg-red-500",
      Celebrity: "bg-purple-500",
      Influencer: "bg-pink-500",
      Gaming: "bg-blue-500",
      Relationship: "bg-rose-500",
      Education: "bg-green-500",
      Public: "bg-orange-500",
      Workplace: "bg-teal-500",
      Relationships: "bg-rose-500",
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
        <h1 className="text-lg font-semibold">Browse</h1>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
        >
          <Bookmark className="w-4 h-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search drama sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Content Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="trending" className="h-full flex flex-col">
          <TabsList className="mx-4 mb-4 bg-gray-900 border-gray-700">
            <TabsTrigger
              value="trending"
              className="data-[state=active]:bg-blue-600"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger
              value="viral"
              className="data-[state=active]:bg-purple-600"
            >
              <Globe className="w-4 h-4 mr-2" />
              Viral
            </TabsTrigger>
            <TabsTrigger
              value="bookmarks"
              className="data-[state=active]:bg-green-600"
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Saved
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="flex-1 overflow-y-auto px-4">
            <h3 className="font-semibold mb-4 text-gray-300">
              Live Drama Sources
            </h3>
            {trendingSources.map((source, index) => (
              <motion.div
                key={source.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/50 rounded-lg p-4 mb-3 cursor-pointer hover:bg-gray-800/50 transition-colors border border-gray-800"
                onClick={() => window.open(source.url, "_blank")}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="text-2xl">{source.thumbnail}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold">{source.name}</h3>
                        {source.isLive && (
                          <Badge className="bg-red-500 text-white text-xs px-2 py-0.5 animate-pulse">
                            LIVE
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm mb-2">
                        {source.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{source.followers}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{source.lastUpdate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div
                      className={`px-2 py-1 rounded text-xs text-white ${getCategoryColor(source.category)}`}
                    >
                      {source.category}
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="viral" className="flex-1 overflow-y-auto px-4">
            <h3 className="font-semibold mb-4 text-gray-300">Viral Stories</h3>
            {viralContent.map((content, index) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/50 rounded-lg p-4 mb-3 cursor-pointer hover:bg-gray-800/50 transition-colors border border-gray-800"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-white flex-1 mr-2">
                    {content.title}
                  </h3>
                  <div
                    className={`px-2 py-1 rounded text-xs text-white ${getCategoryColor(content.category)}`}
                  >
                    {content.category}
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  {content.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-blue-400">
                      {content.source}
                    </span>
                    <span>↑ {content.votes.toLocaleString()}</span>
                    <span>💬 {content.comments.toLocaleString()}</span>
                  </div>
                  <span>{content.timeAgo}</span>
                </div>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent
            value="bookmarks"
            className="flex-1 overflow-y-auto px-4"
          >
            <h3 className="font-semibold mb-4 text-gray-300">
              Bookmarked Sources
            </h3>
            {bookmarkedSources.map((bookmark, index) => (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/50 rounded-lg p-4 mb-3 cursor-pointer hover:bg-gray-800/50 transition-colors border border-gray-800 flex items-center justify-between"
                onClick={() => window.open(bookmark.url, "_blank")}
              >
                <div>
                  <h3 className="font-semibold text-white">{bookmark.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div
                      className={`px-2 py-1 rounded text-xs text-white ${getCategoryColor(bookmark.category)}`}
                    >
                      {bookmark.category}
                    </div>
                    <span className="text-xs text-gray-400">
                      Added {bookmark.addedDate}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </motion.div>
            ))}

            {bookmarkedSources.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No bookmarked sources yet</p>
                <p className="text-sm">
                  Bookmark your favorite drama sources to access them quickly
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-800">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 mb-2">
          <ExternalLink className="w-4 h-4 mr-2" />
          Submit New Source
        </Button>
        <Button
          variant="outline"
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          Manage Bookmarks
        </Button>
      </div>
    </div>
  );
}
