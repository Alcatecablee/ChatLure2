import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Eye,
  Upload,
  Image,
  MapPin,
  Tag,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useDatabase } from "@/contexts/DatabaseContext";

interface StoryCreatorProps {
  onSave?: (story: any) => void;
}

export function StoryCreator({ onSave }: StoryCreatorProps) {
  const { createStory, currentUser } = useDatabase();
  const [story, setStory] = useState({
    title: "",
    description: "",
    content: "",
    category: "drama" as const,
    tags: [] as string[],
    status: "draft" as const,
    visibility: "public" as const,
    location: {
      address: "",
      lat: 0,
      lng: 0,
    },
    scheduledAt: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { value: "drama", label: "Drama", color: "bg-red-500" },
    { value: "romance", label: "Romance", color: "bg-pink-500" },
    { value: "scandal", label: "Scandal", color: "bg-purple-500" },
    { value: "mystery", label: "Mystery", color: "bg-indigo-500" },
    { value: "comedy", label: "Comedy", color: "bg-green-500" },
  ];

  // Calculate reading time and word count
  const updateContentStats = (content: string) => {
    const words = content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const count = words.length;
    const readTime = Math.max(1, Math.ceil(count / 200)); // 200 words per minute

    setWordCount(count);
    setReadingTime(readTime);
  };

  const handleContentChange = (content: string) => {
    setStory((prev) => ({ ...prev, content }));
    updateContentStats(content);
  };

  const addTag = () => {
    if (tagInput.trim() && !story.tags.includes(tagInput.trim())) {
      setStory((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim().toLowerCase()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setStory((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to cloud storage
      console.log("Image selected:", file.name);
      // For demo, just show feedback
      alert(
        `Image "${file.name}" selected! (Upload functionality would be implemented here)`,
      );
    }
  };

  const handleSave = async (saveStatus: "draft" | "published") => {
    if (!story.title.trim() || !story.content.trim()) {
      alert("Please fill in at least the title and content");
      return;
    }

    if (!currentUser) {
      alert("You must be logged in to create stories");
      return;
    }

    setSaving(true);
    try {
      const storyData = {
        title: story.title.trim(),
        description:
          story.description.trim() || story.content.substring(0, 200) + "...",
        content: story.content.trim(),
        authorId: currentUser.id,
        category: story.category,
        tags: story.tags,
        status: saveStatus,
        visibility: story.visibility,
        readingTime,
        chapters: [], // For now, single chapter stories
        ...(story.location.address && { location: story.location }),
        ...(story.scheduledAt &&
          saveStatus === "published" && {
            scheduledAt: new Date(story.scheduledAt),
          }),
      };

      const createdStory = await createStory(storyData);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);

      onSave?.(createdStory);

      // Reset form if published
      if (saveStatus === "published") {
        setStory({
          title: "",
          description: "",
          content: "",
          category: "drama",
          tags: [],
          status: "draft",
          visibility: "public",
          location: { address: "", lat: 0, lng: 0 },
          scheduledAt: "",
        });
        setWordCount(0);
        setReadingTime(0);
      }
    } catch (error) {
      console.error("Failed to save story:", error);
      alert("Failed to save story. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const getCategoryColor = (categoryValue: string) => {
    return (
      categories.find((c) => c.value === categoryValue)?.color || "bg-gray-500"
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Story Creator</h2>
          <p className="text-gray-400 mt-1">
            Create engaging stories that captivate your audience
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {saved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center text-green-400 text-sm"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Saved!
            </motion.div>
          )}

          <Button
            variant="outline"
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="border-gray-600"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>

          <Button
            onClick={() => handleSave("published")}
            disabled={saving || !story.title.trim() || !story.content.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Publishing...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Publish Story
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Story Content */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Story Content</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <Input
                  value={story.title}
                  onChange={(e) =>
                    setStory((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter your story title..."
                  className="bg-gray-800 border-gray-600 text-white text-lg"
                  maxLength={100}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {story.title.length}/100
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <Textarea
                  value={story.description}
                  onChange={(e) =>
                    setStory((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Brief description of your story..."
                  className="bg-gray-800 border-gray-600 text-white"
                  rows={3}
                  maxLength={300}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {story.description.length}/300
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Story Content *
                </label>
                <Textarea
                  value={story.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Tell your story... What happened? Who was involved? Paint the scene for your readers."
                  className="bg-gray-800 border-gray-600 text-white min-h-[300px]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>
                    {wordCount} words • {readingTime} min read
                  </span>
                  <span>Minimum 50 words recommended</span>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cover Image (Optional)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={handleImageUpload}
                  className="border-gray-600 w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Cover Image
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Story Settings */}
        <div className="space-y-4">
          {/* Category & Tags */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Tag className="w-5 h-5" />
                <span>Category & Tags</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <Select
                  value={story.category}
                  onValueChange={(value: any) =>
                    setStory((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${category.color}`}
                          />
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Add tags..."
                    className="bg-gray-800 border-gray-600 text-white flex-1"
                  />
                  <Button
                    onClick={addTag}
                    size="sm"
                    variant="outline"
                    className="border-gray-600"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-gray-700 text-gray-300 cursor-pointer hover:bg-red-600"
                      onClick={() => removeTag(tag)}
                    >
                      #{tag} ✕
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Publishing Options */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Publishing</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Visibility
                </label>
                <Select
                  value={story.visibility}
                  onValueChange={(value: any) =>
                    setStory((prev) => ({ ...prev, visibility: value }))
                  }
                >
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="public">🌍 Public</SelectItem>
                    <SelectItem value="private">🔒 Private</SelectItem>
                    <SelectItem value="friends">👥 Friends Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Schedule Publication (Optional)
                </label>
                <Input
                  type="datetime-local"
                  value={story.scheduledAt}
                  onChange={(e) =>
                    setStory((prev) => ({
                      ...prev,
                      scheduledAt: e.target.value,
                    }))
                  }
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location (Optional)
                </label>
                <Input
                  value={story.location.address}
                  onChange={(e) =>
                    setStory((prev) => ({
                      ...prev,
                      location: { ...prev.location, address: e.target.value },
                    }))
                  }
                  placeholder="e.g., Downtown Coffee Shop"
                  className="bg-gray-800 border-gray-600 text-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Help readers discover local stories
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Story Stats */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Story Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Word Count:</span>
                <span className="text-white">{wordCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Reading Time:</span>
                <span className="text-white">{readingTime} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Category:</span>
                <div className="flex items-center space-x-1">
                  <div
                    className={`w-2 h-2 rounded-full ${getCategoryColor(story.category)}`}
                  />
                  <span className="text-white capitalize">
                    {story.category}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tags:</span>
                <span className="text-white">{story.tags.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tips */}
      <Card className="bg-blue-900/20 border-blue-500/30">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-blue-400 font-medium mb-1">
                💡 Story Writing Tips
              </h4>
              <ul className="text-blue-300 text-sm space-y-1">
                <li>
                  • Start with a compelling hook to grab attention immediately
                </li>
                <li>
                  • Include specific details about people, places, and emotions
                </li>
                <li>• Use dialogue to make scenes more vivid and engaging</li>
                <li>• Keep paragraphs short for easy mobile reading</li>
                <li>• Add relevant tags to help readers discover your story</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
