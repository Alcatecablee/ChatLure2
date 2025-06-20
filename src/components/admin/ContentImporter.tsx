import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Upload,
  FileText,
  Globe,
  Loader2,
  Download,
  Trash2,
  AlertCircle,
  ExternalLink,
  Clock,
  TrendingUp,
  Users,
  MessageCircle,
  Plus,
} from "lucide-react";
import { useDatabase } from "@/contexts/DatabaseContext";
import { useApp } from "@/contexts/AppContext";
import { redditAPI, RedditSearchParams } from "@/utils/redditApi";
import { apiHandler } from "@/utils/apiRoutes";

interface ImportedStory {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  estimatedViralScore: number;
  source?: "reddit" | "manual" | "template";
  sourceUrl?: string;
  readingTime?: number;
  upvotes?: number;
  comments?: number;
  subreddit?: string;
  isImported: boolean;
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
}

const REDDIT_SOURCES = [
  {
    name: "r/relationship_advice",
    members: "3.2M",
    category: "relationships",
    viral: 89,
  },
  { name: "r/AmItheAsshole", members: "4.8M", category: "drama", viral: 95 },
  { name: "r/entitledparents", members: "1.8M", category: "family", viral: 87 },
  { name: "r/tifu", members: "17.2M", category: "comedy", viral: 92 },
  { name: "r/confession", members: "1.1M", category: "secrets", viral: 94 },
];

export function ContentImporter() {
  const { createStory, createNotification } = useDatabase();
  const { state: appState, addNotification } = useApp();
  const credentials = appState.credentials;

  const [activeTab, setActiveTab] = useState("reddit");
  const [importMethod, setImportMethod] = useState<"csv" | "text" | "json">(
    "text",
  );
  const [importData, setImportData] = useState("");
  const [parsedStories, setParsedStories] = useState<ImportedStory[]>([]);
  const [redditPosts, setRedditPosts] = useState<RedditPost[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubreddit, setSelectedSubreddit] = useState("all");
  const [minViralScore, setMinViralScore] = useState(70);

  const convertRedditToStory = (post: RedditPost): ImportedStory => {
    // Convert Reddit post to story format
    const estimatedReadingTime = Math.ceil(post.content.length / 200); // Rough estimate: 200 chars per minute

    // Generate story content from Reddit post
    const storyContent = `Original Post:\n\n${post.content}\n\nThis story has been adapted from a real Reddit post and transformed into an interactive narrative experience.`;

    // Generate tags based on subreddit and content
    const baseTags = [post.subreddit.replace("r/", ""), "reddit", "real_story"];
    const contentTags = extractTagsFromContent(post.title + " " + post.content);

    return {
      id: `reddit_${post.id}`,
      title: post.title,
      description: `A real story from ${post.subreddit} that caught everyone's attention`,
      content: storyContent,
      category: determineCategory(post.subreddit),
      tags: [...baseTags, ...contentTags].slice(0, 8),
      estimatedViralScore: Math.min(Math.floor(post.upvotes / 100) + 60, 100),
      source: "reddit",
      sourceUrl: post.url,
      readingTime: estimatedReadingTime,
      upvotes: post.upvotes,
      comments: post.comments,
      subreddit: post.subreddit,
      isImported: false,
    };
  };

  const extractTagsFromContent = (text: string): string[] => {
    const commonWords = [
      "the",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
    ];
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 3 && !commonWords.includes(word));

    const wordFreq: { [key: string]: number } = {};
    words.forEach((word) => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    return Object.entries(wordFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  };

  const determineCategory = (subreddit: string): string => {
    const categoryMap: { [key: string]: string } = {
      relationship_advice: "romance",
      AmItheAsshole: "drama",
      entitledparents: "drama",
      tifu: "comedy",
      confession: "scandal",
      insaneparents: "drama",
    };

    const subName = subreddit.replace("r/", "");
    return categoryMap[subName] || "drama";
  };

  const fetchRedditContent = async () => {
    setIsProcessing(true);
    setRedditPosts([]);

    try {
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

      addNotification({
        type: "info",
        title: "Scanning Reddit",
        message: `Searching ${selectedSubreddit === "all" ? "all subreddits" : selectedSubreddit} for "${searchQuery || "viral content"}"`,
      });

      // Make real Reddit API call
      const response = await makeRedditApiCall();

      if (response.success) {
        setRedditPosts(response.posts);
        addNotification({
          type: "success",
          title: "Reddit Scan Complete",
          message: `Found ${response.posts.length} potential viral posts`,
        });
      } else {
        throw new Error(response.error || "Failed to fetch Reddit data");
      }
    } catch (error) {
      console.error("Reddit fetch error:", error);
      addNotification({
        type: "error",
        title: "Reddit Scan Failed",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch content from Reddit. Check your API credentials.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const makeRedditApiCall = async (): Promise<{
    success: boolean;
    posts: RedditPost[];
    error?: string;
  }> => {
    try {
      const searchParams: RedditSearchParams = {
        query: searchQuery || undefined,
        subreddit:
          selectedSubreddit === "all"
            ? undefined
            : selectedSubreddit.replace("r/", ""),
        sort: "hot",
        limit: 25,
        minScore: minViralScore,
      };

      const result = await redditAPI.searchPosts(
        credentials.reddit,
        searchParams,
      );

      if (!result.success) {
        if (result.error?.includes("Authentication failed")) {
          addNotification({
            type: "error",
            title: "Authentication Failed",
            message:
              "Please check your Reddit API credentials in Settings. Make sure Client ID and Secret are correct.",
          });
        } else {
          addNotification({
            type: "error",
            title: "Reddit API Error",
            message: result.error || "Failed to fetch posts from Reddit",
          });
        }
      }

      return result;
    } catch (error) {
      return {
        success: false,
        posts: [],
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportData(content);
    };
    reader.readAsText(file);
  };

  const parseImportData = () => {
    if (!importData.trim()) {
      addNotification({
        type: "error",
        title: "No Data to Parse",
        message: "Please enter or upload data to import.",
      });
      return;
    }

    setIsProcessing(true);

    try {
      let stories: ImportedStory[] = [];

      if (importMethod === "json") {
        const jsonData = JSON.parse(importData);
        stories = Array.isArray(jsonData) ? jsonData : [jsonData];
      } else if (importMethod === "csv") {
        // Simple CSV parsing (would need a proper CSV parser for production)
        const lines = importData.split("\n");
        const headers = lines[0].split(",").map((h) => h.trim());

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",").map((v) => v.trim());
          if (values.length >= 2) {
            stories.push({
              id: `manual_${Date.now()}_${i}`,
              title: values[0] || `Imported Story ${i}`,
              description: values[1] || "Imported story",
              content: values[2] || values[1] || "Imported content",
              category: "drama",
              tags: ["manual", "imported"],
              estimatedViralScore: 50,
              source: "manual",
              isImported: false,
            });
          }
        }
      } else {
        // Text parsing - split by paragraphs/sections
        const sections = importData.split("\n\n").filter((s) => s.trim());
        sections.forEach((section, index) => {
          const lines = section.split("\n");
          stories.push({
            id: `text_${Date.now()}_${index}`,
            title: lines[0] || `Text Story ${index + 1}`,
            description: lines[1] || "Imported text story",
            content: section,
            category: "drama",
            tags: ["text", "imported"],
            estimatedViralScore: 50,
            source: "manual",
            isImported: false,
          });
        });
      }

      setParsedStories(stories);
      addNotification({
        type: "success",
        title: "Data Parsed",
        message: `Successfully parsed ${stories.length} stories from your data.`,
      });
    } catch (error) {
      addNotification({
        type: "error",
        title: "Parse Error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to parse import data.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const importStories = async (storiesToImport: ImportedStory[]) => {
    setIsProcessing(true);

    try {
      let successCount = 0;
      let errorCount = 0;

      for (const story of storiesToImport) {
        try {
          await createStory({
            title: story.title,
            description: story.description,
            content: story.content,
            authorId: "admin", // Would use real user ID
            category: story.category as any,
            tags: story.tags,
            status: "published",
            visibility: "public",
            readingTime:
              story.readingTime || Math.ceil(story.content.length / 200),
            chapters: [],
          });

          successCount++;

          // Mark as imported
          setParsedStories((prev) =>
            prev.map((s) =>
              s.id === story.id ? { ...s, isImported: true } : s,
            ),
          );
        } catch (error) {
          console.error(`Failed to import story ${story.title}:`, error);
          errorCount++;
        }
      }

      addNotification({
        type: successCount > errorCount ? "success" : "warning",
        title: "Import Complete",
        message: `Successfully imported ${successCount} stories. ${errorCount > 0 ? `${errorCount} failed.` : ""}`,
      });
    } catch (error) {
      addNotification({
        type: "error",
        title: "Import Failed",
        message: "Failed to import stories to database.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearImportData = () => {
    setImportData("");
    setParsedStories([]);
    setRedditPosts([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Content Importer</h2>
          <p className="text-gray-400">
            Import stories from various sources or create manually
          </p>
        </div>
        <Button variant="outline" onClick={clearImportData}>
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="reddit">🔥 Reddit</TabsTrigger>
          <TabsTrigger value="manual">📝 Manual</TabsTrigger>
          <TabsTrigger value="upload">📄 Upload</TabsTrigger>
          <TabsTrigger value="template">📋 Template</TabsTrigger>
        </TabsList>

        <TabsContent value="reddit" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="text-orange-400" />
                <span>Reddit Content Scanner</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Real Reddit API integration requires OAuth setup and access
                  tokens. Configure your Reddit API credentials in Settings to
                  enable live data fetching.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Search Query
                  </label>
                  <Input
                    placeholder="Enter keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                    Min Viral Score: {minViralScore}
                  </label>
                  <Slider
                    value={[minViralScore]}
                    onValueChange={(value) => setMinViralScore(value[0])}
                    max={100}
                    min={0}
                    step={5}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {credentials.reddit.enabled ? (
                    <Badge className="bg-green-500/20 text-green-400 text-xs">
                      ✓ Reddit Connected
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500/20 text-red-400 text-xs">
                      ✗ Not Connected
                    </Badge>
                  )}
                </div>

                <Button
                  onClick={fetchRedditContent}
                  disabled={isProcessing || !credentials.reddit.enabled}
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Globe className="w-4 h-4 mr-2" />
                  )}
                  Scan Reddit
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {REDDIT_SOURCES.map((source) => (
                  <div key={source.name} className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">
                        {source.name}
                      </span>
                      <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                        {source.viral}% viral
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-400">
                      <div className="flex items-center gap-1 mb-1">
                        <Users className="w-3 h-3" />
                        {source.members} members
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {source.category}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {redditPosts.length > 0 && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>📈 Reddit Posts ({redditPosts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {redditPosts.map((post, index) => (
                    <div key={post.id} className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-sm font-medium text-white">
                          {post.title}
                        </h4>
                        <Button
                          size="sm"
                          onClick={() => {
                            const story = convertRedditToStory(post);
                            setParsedStories((prev) => [...prev, story]);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                        {post.content.substring(0, 150)}...
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <Badge variant="outline" className="text-xs">
                            {post.subreddit}
                          </Badge>
                          <span>↑ {post.upvotes}</span>
                          <span>💬 {post.comments}</span>
                        </div>
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
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
              <CardTitle>Manual Story Creation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="story-title">Story Title</Label>
                  <Input
                    id="story-title"
                    placeholder="Enter story title..."
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <Label htmlFor="story-category">Category</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="drama">Drama</SelectItem>
                      <SelectItem value="romance">Romance</SelectItem>
                      <SelectItem value="scandal">Scandal</SelectItem>
                      <SelectItem value="mystery">Mystery</SelectItem>
                      <SelectItem value="comedy">Comedy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="story-description">Description</Label>
                <Textarea
                  id="story-description"
                  placeholder="Brief description of the story..."
                  className="bg-gray-700 border-gray-600"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="story-content">Story Content</Label>
                <Textarea
                  id="story-content"
                  placeholder="Enter the full story content..."
                  className="bg-gray-700 border-gray-600"
                  rows={10}
                />
              </div>

              <div>
                <Label htmlFor="story-tags">Tags (comma-separated)</Label>
                <Input
                  id="story-tags"
                  placeholder="drama, romance, viral..."
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Create Story
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Upload Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Import Method</Label>
                <Select
                  value={importMethod}
                  onValueChange={(value: any) => setImportMethod(value)}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Plain Text</SelectItem>
                    <SelectItem value="csv">CSV File</SelectItem>
                    <SelectItem value="json">JSON File</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="file-upload">Upload File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".txt,.csv,.json"
                  onChange={handleFileUpload}
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div>
                <Label htmlFor="import-data">Or Paste Content</Label>
                <Textarea
                  id="import-data"
                  placeholder="Paste your content here..."
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                  rows={10}
                />
              </div>

              <Button onClick={parseImportData} disabled={isProcessing}>
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4 mr-2" />
                )}
                Parse Content
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="template" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Story Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-center py-8">
                Story templates coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Parsed Stories Preview */}
      {parsedStories.length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>📚 Parsed Stories ({parsedStories.length})</CardTitle>
            <Button
              onClick={() =>
                importStories(parsedStories.filter((s) => !s.isImported))
              }
              disabled={
                isProcessing || parsedStories.every((s) => s.isImported)
              }
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Import All ({parsedStories.filter((s) => !s.isImported).length})
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {parsedStories.map((story) => (
                <div key={story.id} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white mb-1">
                        {story.title}
                      </h4>
                      <p className="text-xs text-gray-400 mb-2">
                        {story.description}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {story.category}
                        </Badge>
                        {story.source === "reddit" && (
                          <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                            📍 Reddit
                          </Badge>
                        )}
                        <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                          🔥 {story.estimatedViralScore}%
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        {story.readingTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {story.readingTime} min
                          </span>
                        )}
                        {story.upvotes && <span>↑ {story.upvotes}</span>}
                        {story.comments && (
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {story.comments}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {story.isImported ? (
                        <Badge className="bg-green-500/20 text-green-400 text-xs">
                          ✓ Imported
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => importStories([story])}
                          disabled={isProcessing}
                        >
                          Import
                        </Button>
                      )}
                    </div>
                  </div>
                  {story.sourceUrl && (
                    <a
                      href={story.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Original
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Summary */}
      {parsedStories.length === 0 && activeTab !== "reddit" && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="text-center py-8">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No Content to Import
            </h3>
            <p className="text-sm text-gray-400">
              Use the Reddit scanner or manual import to get started
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
