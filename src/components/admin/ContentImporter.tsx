import { useState } from "react";
import { motion } from "framer-motion";
import { useApp, useCredentials } from "@/contexts/AppContext";
import {
  Upload,
  FileText,
  Zap,
  CheckCircle,
  AlertCircle,
  Globe,
  Download,
  Sparkles,
  TrendingUp,
  Filter,
  Search,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Star,
  Share,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface ImportedStory {
  id: string;
  title: string;
  characters: string[];
  messages: ImportedMessage[];
  genre: string;
  estimatedViralScore: number;
  source?: "reddit" | "manual" | "template";
  sourceUrl?: string;
  upvotes?: number;
  comments?: number;
  tags: string[];
  isImported: boolean;
  createdAt: string;
}

interface ImportedMessage {
  id: string;
  timestamp: string;
  sender: string;
  message: string;
  emotion: string;
  isCliffhanger: boolean;
  hasMedia: boolean;
  mediaType?: "image" | "audio" | "video";
}

interface RedditPost {
  id: string;
  title: string;
  content: string;
  upvotes: number;
  comments: number;
  subreddit: string;
  url: string;
  created: string;
  author: string;
  flair?: string;
}

const REDDIT_SOURCES = [
  { name: "r/insaneparents", members: "1.2M", category: "family", viral: 95 },
  {
    name: "r/relationship_advice",
    members: "3.2M",
    category: "drama",
    viral: 88,
  },
  { name: "r/AmItheAsshole", members: "4.8M", category: "moral", viral: 92 },
  {
    name: "r/ChoosingBeggars",
    members: "2.8M",
    category: "entitled",
    viral: 85,
  },
  { name: "r/entitledparents", members: "2.1M", category: "family", viral: 90 },
  {
    name: "r/TrueOffMyChest",
    members: "1.8M",
    category: "confession",
    viral: 87,
  },
];

const SAMPLE_FORMATS = {
  text: `STORY: Mom Saw the Texts
GENRE: family
CHARACTER: Lena (daughter) 👧
CHARACTER: Zoey (best friend) 👭
CHARACTER: Mom (mother) 👩‍💼

MESSAGE: Lena: OMG. She saw the texts 😭😭😭
DELAY: 0min
EMOTION: panic
CLIFFHANGER: true

MESSAGE: Zoey: WAIT. Your mom??!! 😨
DELAY: 3min
EMOTION: shocked

MESSAGE: Lena: She saw EVERYTHING. Even the pics from Taylor 😬
DELAY: 5min
EMOTION: terrified
CLIFFHANGER: true
VIRAL: true`,

  csv: `story_title,genre,sender,message,delay_minutes,emotion,cliffhanger,viral
Mom Saw Texts,family,Lena,OMG. She saw the texts 😭😭😭,0,panic,true,false
Mom Saw Texts,family,Zoey,WAIT. Your mom??!! 😨,3,shocked,false,false
Mom Saw Texts,family,Lena,She saw EVERYTHING,5,terrified,true,true`,

  json: `{
  "stories": [
    {
      "title": "Mom Saw the Texts",
      "genre": "family",
      "tags": ["family", "secrets", "teens"],
      "characters": [
        {"name": "Lena", "role": "protagonist", "avatar": "👧"},
        {"name": "Zoey", "role": "supporting", "avatar": "👭"}
      ],
      "messages": [
        {
          "sender": "Lena",
          "message": "OMG. She saw the texts 😭😭😭",
          "delay": 0,
          "emotion": "panic",
          "cliffhanger": true,
          "viral": false
        }
      ]
    }
  ]
}`,
};

export function ContentImporter({
  onImport,
}: {
  onImport?: (stories: ImportedStory[]) => void;
}) {
  const { importStories, addNotification } = useApp();
  const credentials = useCredentials();
  const [activeTab, setActiveTab] = useState("reddit");
  const [importMethod, setImportMethod] = useState<"csv" | "text" | "json">(
    "text",
  );
  const [inputContent, setInputContent] = useState("");
  const [parsedStories, setParsedStories] = useState<ImportedStory[]>([]);
  const [redditPosts, setRedditPosts] = useState<RedditPost[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubreddit, setSelectedSubreddit] = useState("all");
  const [minViralScore, setMinViralScore] = useState(70);
  const [autoConvert, setAutoConvert] = useState(true);

  // Reddit posts will be fetched from the actual Reddit API

  const calculateViralScore = (messages: ImportedMessage[]): number => {
    let score = 50;

    score += Math.min(messages.length * 5, 30);

    const cliffhangers = messages.filter((m) => m.isCliffhanger).length;
    score += cliffhangers * 15;

    const strongEmotions = messages.filter((m) =>
      [
        "shocked",
        "angry",
        "devastated",
        "terrified",
        "betrayed",
        "furious",
      ].includes(m.emotion),
    ).length;
    score += strongEmotions * 10;

    const viralKeywords = [
      "can't believe",
      "shocking",
      "betrayed",
      "devastating",
      "explosive",
    ];
    const keywordMatches = messages.reduce((count, m) => {
      return (
        count +
        viralKeywords.filter((keyword) =>
          m.message.toLowerCase().includes(keyword),
        ).length
      );
    }, 0);
    score += keywordMatches * 8;

    return Math.min(score, 100);
  };

  const parseTextFormat = (content: string): ImportedStory[] => {
    const stories: ImportedStory[] = [];
    const lines = content.split("\n").filter((line) => line.trim());

    let currentStory: Partial<ImportedStory> = {};
    let currentMessages: ImportedMessage[] = [];
    let currentCharacters: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith("STORY:")) {
        if (currentStory.title) {
          stories.push({
            ...currentStory,
            id: Date.now().toString() + Math.random(),
            characters: currentCharacters,
            messages: currentMessages,
            estimatedViralScore: calculateViralScore(currentMessages),
            source: "manual",
            tags: [],
            isImported: false,
            createdAt: new Date().toISOString(),
          } as ImportedStory);
        }

        currentStory = { title: trimmed.replace("STORY:", "").trim() };
        currentMessages = [];
        currentCharacters = [];
      } else if (trimmed.startsWith("GENRE:")) {
        currentStory.genre = trimmed.replace("GENRE:", "").trim();
      } else if (trimmed.startsWith("CHARACTER:")) {
        currentCharacters.push(trimmed.replace("CHARACTER:", "").trim());
      } else if (trimmed.startsWith("MESSAGE:")) {
        const messagePart = trimmed.replace("MESSAGE:", "").trim();
        const [sender, message] = messagePart.split(":").map((s) => s.trim());

        currentMessages.push({
          id: Date.now().toString() + Math.random(),
          timestamp: Date.now().toString(),
          sender,
          message,
          emotion: "neutral",
          isCliffhanger: false,
          hasMedia: false,
        });
      } else if (trimmed.startsWith("EMOTION:")) {
        if (currentMessages.length > 0) {
          currentMessages[currentMessages.length - 1].emotion = trimmed
            .replace("EMOTION:", "")
            .trim();
        }
      } else if (trimmed.startsWith("CLIFFHANGER:")) {
        if (currentMessages.length > 0) {
          currentMessages[currentMessages.length - 1].isCliffhanger =
            trimmed.replace("CLIFFHANGER:", "").trim() === "true";
        }
      }
    }

    if (currentStory.title) {
      stories.push({
        ...currentStory,
        id: Date.now().toString() + Math.random(),
        characters: currentCharacters,
        messages: currentMessages,
        estimatedViralScore: calculateViralScore(currentMessages),
        source: "manual",
        tags: [],
        isImported: false,
        createdAt: new Date().toISOString(),
      } as ImportedStory);
    }

    return stories;
  };

  const convertRedditToStory = (post: RedditPost): ImportedStory => {
    // Enhanced conversion with better story structure
    const messages: ImportedMessage[] = [];

    // Determine genre and characters based on subreddit
    let genre = "drama";
    let characters = ["User", "BestFriend"];

    if (post.subreddit.includes("parent")) {
      genre = "family";
      characters = ["Teen", "BestFriend", "Mom"];
    } else if (post.subreddit.includes("relationship")) {
      genre = "romance";
      characters = ["Partner1", "Partner2", "Friend"];
    } else if (
      post.subreddit.includes("Asshole") ||
      post.subreddit.includes("advice")
    ) {
      genre = "moral";
      characters = ["Person", "Friend", "Advisor"];
    }

    // Opening hook - always start strong
    messages.push({
      id: "msg_1",
      timestamp: Date.now().toString(),
      sender: characters[0],
      message:
        "I can't believe what just happened... I need to tell someone this",
      emotion: "shocked",
      isCliffhanger: true,
      hasMedia: false,
    });

    // Friend's concerned response
    messages.push({
      id: "msg_2",
      timestamp: (Date.now() + 120000).toString(),
      sender: characters[1],
      message: "OMG what?? Are you okay? What happened??",
      emotion: "concerned",
      isCliffhanger: false,
      hasMedia: false,
    });

    // Main story revelation - use post title
    messages.push({
      id: "msg_3",
      timestamp: (Date.now() + 240000).toString(),
      sender: characters[0],
      message: post.title + " 😭",
      emotion: "devastated",
      isCliffhanger: true,
      hasMedia: false,
    });

    // Add urgency
    messages.push({
      id: "msg_4",
      timestamp: (Date.now() + 300000).toString(),
      sender: characters[1],
      message: "WAIT WHAT?! Tell me EVERYTHING right now!",
      emotion: "urgent",
      isCliffhanger: false,
      hasMedia: false,
    });

    // Story details - use content chunks
    if (post.content && post.content.length > 100) {
      const contentParts = post.content
        .substring(0, 400)
        .split(". ")
        .slice(0, 3);
      contentParts.forEach((part, index) => {
        if (part.trim()) {
          messages.push({
            id: `msg_${5 + index}`,
            timestamp: (Date.now() + 360000 + index * 180000).toString(),
            sender: characters[0],
            message:
              part.trim() + (index === contentParts.length - 1 ? "..." : "."),
            emotion:
              index === contentParts.length - 1 ? "terrified" : "explaining",
            isCliffhanger: index === contentParts.length - 1,
            hasMedia: false,
          });
        }
      });
    }

    // Calculate viral score based on multiple factors
    let viralScore = 50;
    viralScore += Math.min(Math.floor(post.upvotes / 200), 30); // Up to 30 pts for upvotes
    viralScore += Math.min(Math.floor(post.comments / 50), 15); // Up to 15 pts for engagement
    if (post.title.length > 50) viralScore += 5; // Detailed titles
    if (post.content && post.content.length > 500) viralScore += 10; // Rich content

    // Genre-specific bonuses
    if (
      post.subreddit.includes("insane") ||
      post.subreddit.includes("entitled")
    )
      viralScore += 10;
    if (
      post.subreddit.includes("relationship") ||
      post.subreddit.includes("Asshole")
    )
      viralScore += 8;

    return {
      id: `reddit_${post.id}`,
      title:
        post.title.length > 60
          ? post.title.substring(0, 60) + "..."
          : post.title,
      characters,
      messages,
      genre,
      estimatedViralScore: Math.min(viralScore, 100),
      source: "reddit",
      sourceUrl: post.url,
      upvotes: post.upvotes,
      comments: post.comments,
      tags: [post.subreddit.replace("r/", ""), "reddit", genre, "viral"],
      isImported: false,
      createdAt: post.created,
    };
  };

  const processContent = async () => {
    setIsProcessing(true);

    try {
      let parsed: ImportedStory[] = [];

      switch (importMethod) {
        case "text":
          parsed = parseTextFormat(inputContent);
          break;
        case "csv":
          // CSV parsing logic here
          break;
        case "json":
          const jsonData = JSON.parse(inputContent);
          parsed = jsonData.stories || [];
          break;
      }

      setParsedStories(parsed);
    } catch (error) {
      console.error("Parse error:", error);
    }

    setIsProcessing(false);
  };

  const fetchRedditContent = async () => {
    setIsProcessing(true);

    // Check if Reddit credentials are configured
    if (!credentials.reddit.enabled || !credentials.reddit.clientId) {
      addNotification({
        type: "error",
        title: "Reddit Not Configured",
        message:
          "Please configure your Reddit API credentials in Settings before scanning.",
      });
      setIsProcessing(false);
      return;
    }

    try {
      addNotification({
        type: "info",
        title: "��� Scanning Reddit",
        message: `Searching ${selectedSubreddit === "all" ? "all viral subreddits" : selectedSubreddit} for "${searchQuery || "high-engagement content"}"`,
      });

      // Make actual Reddit API call
      const response = await fetch("/api/reddit/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subreddit: selectedSubreddit,
          query: searchQuery,
          minViralScore,
          timeFilter: "week", // Focus on recent viral content
          sort: "hot", // Get trending posts
          limit: 25, // More results for better selection
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch Reddit posts");
      }

      const data = await response.json();
      const posts = data.posts || [];

      // Sort by viral potential
      const sortedPosts = posts.sort(
        (a: RedditPost, b: RedditPost) =>
          b.upvotes + b.comments * 10 - (a.upvotes + a.comments * 10),
      );

      setRedditPosts(sortedPosts);

      addNotification({
        type: "success",
        title: "🔥 Reddit Scan Complete",
        message: `Found ${posts.length} viral-potential posts! Top post has ${posts[0]?.upvotes || 0} upvotes.`,
      });

      // Auto-convert top posts if enabled
      if (autoConvert && posts.length > 0) {
        const topPosts = posts.slice(0, 3);
        const convertedStories = topPosts.map(convertRedditToStory);
        setParsedStories((prev) => [...prev, ...convertedStories]);

        addNotification({
          type: "info",
          title: "🤖 Auto-Conversion Complete",
          message: `Converted top ${topPosts.length} posts to ChatLure format!`,
        });
      }
    } catch (error) {
      console.error("Reddit scan error:", error);
      addNotification({
        type: "error",
        title: "Reddit Scan Failed",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch content from Reddit. Check your API credentials.",
      });
    }

    setIsProcessing(false);
  };

  const importSingleStory = async (story: ImportedStory) => {
    try {
      await importStories([story]);
      setParsedStories((prev) =>
        prev.map((s) => (s.id === story.id ? { ...s, isImported: true } : s)),
      );

      addNotification({
        type: "success",
        title: "Story Imported",
        message: `"${story.title}" has been added to your library!`,
      });
    } catch (error) {
      addNotification({
        type: "error",
        title: "Import Failed",
        message: "Failed to import story. Please try again.",
      });
    }
  };

  const StoryCard = ({
    story,
    index,
  }: {
    story: ImportedStory;
    index: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-1 line-clamp-2">
            {story.title}
          </h4>
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="outline" className="text-xs capitalize">
              {story.genre}
            </Badge>
            {story.source === "reddit" && (
              <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                🔥 Reddit
              </Badge>
            )}
            <div
              className={`flex items-center space-x-1 ${
                story.estimatedViralScore >= 80
                  ? "text-green-400"
                  : story.estimatedViralScore >= 60
                    ? "text-yellow-400"
                    : "text-red-400"
              }`}
            >
              <TrendingUp size={12} />
              <span className="text-xs font-bold">
                {story.estimatedViralScore}% viral
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" title="Preview messages">
            <Eye size={14} />
          </Button>
          <Button variant="ghost" size="sm" title="Edit story">
            <Edit size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400"
            title="Delete story"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      {/* Message Preview */}
      {story.messages.length > 0 && (
        <div className="bg-gray-700/50 p-3 rounded-lg mb-3">
          <div className="text-xs text-gray-400 mb-1">Preview:</div>
          <div className="text-sm text-gray-300 italic">
            "{story.messages[0].message.substring(0, 80)}..."
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
        <div>
          <span className="text-gray-400">Messages:</span>
          <span className="ml-2 text-white font-semibold">
            {story.messages.length}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Characters:</span>
          <span className="ml-2 text-white font-semibold">
            {story.characters.length}
          </span>
        </div>
      </div>

      {story.source === "reddit" && (
        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
          <div className="flex items-center space-x-1">
            <span className="text-gray-400">↑</span>
            <span className="text-green-400 font-semibold">
              {story.upvotes?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageSquare size={12} className="text-blue-400" />
            <span className="text-blue-400 font-semibold">
              {story.comments}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-1 mb-3">
        {story.tags.slice(0, 4).map((tag, i) => (
          <Badge
            key={i}
            variant="secondary"
            className="text-xs bg-gray-700 text-gray-300"
          >
            {tag}
          </Badge>
        ))}
        {story.tags.length > 4 && (
          <Badge
            variant="secondary"
            className="text-xs bg-gray-700 text-gray-400"
          >
            +{story.tags.length - 4}
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {new Date(story.createdAt).toLocaleDateString()}
        </span>
        <div className="flex items-center space-x-2">
          {!story.isImported && (
            <Button
              size="sm"
              onClick={() => importSingleStory(story)}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle size={14} className="mr-1" />
              Import
            </Button>
          )}
          {story.isImported && (
            <Badge className="bg-green-500/20 text-green-400">
              <CheckCircle size={12} className="mr-1" />
              Imported
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gray-900 text-white rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center space-x-3">
          <Upload className="text-blue-400" />
          <span>Content Importer</span>
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
            {parsedStories.length} Stories
          </Badge>
        </h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Export All
          </Button>
          <Button
            onClick={() => {
              const storiesToImport = parsedStories.filter(
                (s) => !s.isImported,
              );
              if (storiesToImport.length > 0) {
                importStories(storiesToImport);
                // Mark as imported
                setParsedStories((prev) =>
                  prev.map((story) => ({ ...story, isImported: true })),
                );
                if (onImport) onImport(storiesToImport);
              }
            }}
            className="bg-green-600 hover:bg-green-700"
            disabled={parsedStories.filter((s) => !s.isImported).length === 0}
          >
            <CheckCircle size={16} className="mr-2" />
            Import Selected ({parsedStories.filter((s) => !s.isImported).length}
            )
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="reddit">🔥 Reddit</TabsTrigger>
          <TabsTrigger value="manual">📝 Manual</TabsTrigger>
          <TabsTrigger value="bulk">📊 Bulk Import</TabsTrigger>
          <TabsTrigger value="library">📚 Library</TabsTrigger>
        </TabsList>

        <TabsContent value="reddit" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="text-orange-400" />
                <span>Reddit Content Scanner</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Search Keywords
                  </label>
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="affair, toxic parents, drama..."
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Subreddit
                  </label>
                  <Select
                    value={selectedSubreddit}
                    onValueChange={setSelectedSubreddit}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue placeholder="All subreddits" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All subreddits</SelectItem>
                      {REDDIT_SOURCES.map((source) => (
                        <SelectItem key={source.name} value={source.name}>
                          {source.name} ({source.members})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Min Viral Score
                  </label>
                  <Input
                    type="number"
                    value={minViralScore}
                    onChange={(e) => setMinViralScore(parseInt(e.target.value))}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={autoConvert}
                      onCheckedChange={setAutoConvert}
                    />
                    <span className="text-sm">
                      Auto-convert to ChatLure format
                    </span>
                  </div>
                  {credentials.reddit.enabled ? (
                    <Badge className="bg-green-500/20 text-green-400 text-xs">
                      ✓ Reddit Connected
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-yellow-400 border-yellow-500/30 text-xs"
                    >
                      ⚠ Configure in Settings
                    </Badge>
                  )}
                </div>
                <Button
                  onClick={fetchRedditContent}
                  disabled={isProcessing || !credentials.reddit.enabled}
                >
                  {isProcessing ? (
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                  ) : (
                    <Search size={16} className="mr-2" />
                  )}
                  Scan Reddit
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {REDDIT_SOURCES.map((source) => (
                  <div key={source.name} className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">
                        {source.name}
                      </span>
                      <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                        {source.viral}%
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-400">
                      {source.members} members
                    </div>
                    <div className="text-xs text-gray-500">
                      {source.category}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {redditPosts.length > 0 && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>
                  📈 Trending Reddit Posts ({redditPosts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {redditPosts.map((post, index) => (
                    <div key={post.id} className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-white flex-1 pr-4">
                          {post.title}
                        </h4>
                        <Button
                          size="sm"
                          onClick={() => {
                            const story = convertRedditToStory(post);
                            setParsedStories((prev) => [...prev, story]);
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Convert
                        </Button>
                      </div>

                      <p className="text-sm text-gray-400 mb-3">
                        {post.content.substring(0, 200)}...
                      </p>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-4">
                          <span className="text-green-400">
                            ↑ {post.upvotes.toLocaleString()}
                          </span>
                          <span className="text-blue-400">
                            💬 {post.comments}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {post.subreddit}
                          </Badge>
                        </div>
                        <span className="text-gray-500">{post.created}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>📝 Manual Story Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                {(["text", "csv", "json"] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setImportMethod(method)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      importMethod === method
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-600 bg-gray-700 hover:border-gray-500"
                    }`}
                  >
                    <FileText size={24} className="mx-auto mb-2" />
                    <div className="font-semibold">{method.toUpperCase()}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {method === "text" && "Simple text format"}
                      {method === "csv" && "Spreadsheet format"}
                      {method === "json" && "Advanced format"}
                    </div>
                  </button>
                ))}
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2 text-gray-400">
                  📋 Sample Format ({importMethod.toUpperCase()})
                </h4>
                <pre className="bg-gray-700 p-4 rounded-lg text-sm overflow-x-auto text-green-400">
                  {SAMPLE_FORMATS[importMethod]}
                </pre>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2 text-gray-400">
                  ✏️ Paste Your Content
                </h4>
                <Textarea
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  className="w-full h-64 bg-gray-700 border-gray-600 font-mono text-sm"
                  placeholder={`Paste your ${importMethod.toUpperCase()} content here...`}
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-400">
                    {inputContent.length} characters
                  </div>
                  <Button
                    onClick={processContent}
                    disabled={!inputContent.trim() || isProcessing}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap size={16} className="mr-2" />
                        Parse Content
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>📊 Bulk Import Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-400 py-8">
                <Upload size={48} className="mx-auto mb-4 opacity-50" />
                <p>Bulk import tools coming soon...</p>
                <p className="text-sm">
                  Import multiple files, CSV sheets, and automated content
                  scanning
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                📚 Imported Stories ({parsedStories.length})
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter size={16} className="mr-1" />
                  Filter
                </Button>
                <Select>
                  <SelectTrigger className="w-32 bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viral">Viral Score</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="messages">Message Count</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {parsedStories.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {parsedStories.map((story, index) => (
                    <StoryCard key={story.id} story={story} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No stories imported yet</p>
                  <p className="text-sm">
                    Use the Reddit scanner or manual import to get started
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
