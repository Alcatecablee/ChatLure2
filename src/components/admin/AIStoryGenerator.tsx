import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/contexts/AppContext";
import {
  Sparkles,
  Wand2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GENRES = [
  { value: "scandal", label: "🔥 Scandal & Betrayal", color: "text-red-400" },
  { value: "drama", label: "💔 Relationship Drama", color: "text-pink-400" },
  { value: "mystery", label: "🕵️ Mystery & Suspense", color: "text-purple-400" },
  { value: "family", label: "👨‍👩‍👧 Family Drama", color: "text-blue-400" },
  { value: "moral", label: "⚖️ Moral Dilemma", color: "text-yellow-400" },
  { value: "entitled", label: "😤 Entitled Behavior", color: "text-orange-400" },
  { value: "confession", label: "🤐 Secret Confession", color: "text-indigo-400" },
];

const STORY_LENGTHS = [
  { value: "short", label: "Short (8-12 messages)", description: "Quick drama" },
  { value: "medium", label: "Medium (12-18 messages)", description: "Balanced story" },
  { value: "long", label: "Long (20-30 messages)", description: "Epic saga" },
];

export default function AIStoryGenerator() {
  const { addStory, addNotification } = useApp();
  const [genre, setGenre] = useState("scandal");
  const [storyPrompt, setStoryPrompt] = useState("");
  const [length, setLength] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<any>(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!storyPrompt.trim() && !genre) {
      setError("Please select a genre or enter a story prompt");
      return;
    }

    setIsGenerating(true);
    setError("");
    setGeneratedStory(null);

    try {
      const response = await fetch("/api/ai-generate-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          genre,
          storyPrompt,
          length,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate story");
      }

      setGeneratedStory(data.story);
      addNotification({
        type: "success",
        title: "Story Generated!",
        message: `Created "${data.story.title}" with ${data.story.messages?.length || 0} messages`,
      });
    } catch (err: any) {
      setError(err.message || "Failed to generate story");
      addNotification({
        type: "error",
        title: "Generation Failed",
        message: err.message || "Failed to generate story",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveStory = async () => {
    if (!generatedStory) return;

    try {
      // Transform the story format to match the database schema
      const storyData = {
        title: generatedStory.title,
        genre: generatedStory.genre,
        description: generatedStory.description || "",
        isActive: true,
        viralScore: generatedStory.viralScore || 75,
        source: "ai-generated",
        tags: generatedStory.tags || [],
        characters: generatedStory.characters || [],
        plotPoints:
          generatedStory.messages?.map((msg: any, idx: number) => ({
            id: `point-${idx}`,
            trigger: "time",
            delay: idx * 3,
            message: msg.message,
            sender: msg.sender,
            emotions: [msg.emotion || "casual"],
            cliffhanger: msg.isCliffhanger || false,
            viralMoment: msg.isCliffhanger || false,
            messageType: "text",
            typingIndicator: true,
            readReceipts: true,
          })) || [],
        stats: {
          views: 0,
          completions: 0,
          shares: 0,
          avgRating: 0,
          completionRate: 0,
        },
      };

      const response = await fetch("/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(storyData),
      });

      if (!response.ok) {
        throw new Error("Failed to save story");
      }

      const savedStory = await response.json();
      addStory(savedStory);

      addNotification({
        type: "success",
        title: "Story Saved!",
        message: `"${generatedStory.title}" has been added to your library`,
      });

      // Reset form
      setGeneratedStory(null);
      setStoryPrompt("");
    } catch (err: any) {
      addNotification({
        type: "error",
        title: "Save Failed",
        message: err.message || "Failed to save story",
      });
    }
  };

  const copyStoryJSON = () => {
    if (generatedStory) {
      navigator.clipboard.writeText(JSON.stringify(generatedStory, null, 2));
      addNotification({
        type: "success",
        title: "Copied!",
        message: "Story JSON copied to clipboard",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Story Generator</h2>
            <p className="text-sm text-gray-400">
              Let AI create engaging stories powered by Groq
            </p>
          </div>
        </div>
        <Badge variant="outline" className="bg-purple-500/10 border-purple-500/20">
          <Sparkles className="w-3 h-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      {/* Generator Form */}
      <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-purple-400" />
            Story Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Genre Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Genre</label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GENRES.map((g) => (
                  <SelectItem key={g.value} value={g.value}>
                    <span className={g.color}>{g.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Story Prompt */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Story Idea / Prompt{" "}
              <span className="text-gray-500 font-normal">(optional - leave blank to use genre only)</span>
            </label>
            <Textarea
              value={storyPrompt}
              onChange={(e) => setStoryPrompt(e.target.value)}
              placeholder="Describe your story idea... (e.g., 'A teen discovers their mom has been reading all their texts and confronts her', 'Best friend caught texting my crush behind my back')"
              className="min-h-24 resize-none"
              disabled={isGenerating}
            />
          </div>

          {/* Story Length */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Story Length</label>
            <Select value={length} onValueChange={setLength}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STORY_LENGTHS.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    <div className="flex flex-col items-start">
                      <span>{l.label}</span>
                      <span className="text-xs text-gray-400">{l.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400"
            >
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Story...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Story with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Story Preview */}
      {generatedStory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  Generated Story
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={copyStoryJSON}
                    variant="outline"
                    size="sm"
                    className="border-green-500/20"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy JSON
                  </Button>
                  <Button
                    onClick={handleSaveStory}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save to Library
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Story Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{generatedStory.title}</h3>
                  <Badge variant="outline" className="bg-purple-500/10">
                    Viral Score: {generatedStory.viralScore}
                  </Badge>
                </div>
                <p className="text-gray-400">{generatedStory.description}</p>
                <div className="flex flex-wrap gap-2">
                  {generatedStory.tags?.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Characters */}
              {generatedStory.characters && generatedStory.characters.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-400">Characters</h4>
                  <div className="grid gap-2">
                    {generatedStory.characters.map((char: any) => (
                      <div
                        key={char.name}
                        className="p-3 bg-white/5 rounded-lg flex items-center gap-3"
                      >
                        <span className="text-2xl">{char.avatar}</span>
                        <div className="flex-1">
                          <div className="font-medium">{char.name}</div>
                          <div className="text-xs text-gray-400">{char.personality}</div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {char.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages Preview */}
              {generatedStory.messages && generatedStory.messages.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-400">
                    Messages ({generatedStory.messages.length})
                  </h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {generatedStory.messages.map((msg: any, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-3 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-purple-400">
                            {msg.sender}
                          </span>
                          <div className="flex items-center gap-2">
                            {msg.isCliffhanger && (
                              <Badge variant="outline" className="text-xs bg-red-500/10">
                                Cliffhanger
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500">
                              {msg.timestamp || `${idx * 2}m ago`}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm">{msg.message}</p>
                        <div className="mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {msg.emotion}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
