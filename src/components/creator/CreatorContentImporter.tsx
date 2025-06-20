import { useState } from "react";
import { motion } from "framer-motion";
import { useApp, useCredentials } from "@/contexts/AppContext";
import {
  Upload,
  FileText,
  Zap,
  CheckCircle,
  AlertCircle,
  Download,
  Sparkles,
  TrendingUp,
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ImportedStory {
  id: string;
  title: string;
  characters: string[];
  messages: ImportedMessage[];
  genre: string;
  estimatedViralScore: number;
  source?: "whatsapp" | "manual" | "template";
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

interface CreatorContentImporterProps {
  onImport: (stories: ImportedStory[]) => void;
}

export function CreatorContentImporter({
  onImport,
}: CreatorContentImporterProps) {
  const { importStories, addNotification } = useApp();
  const [activeTab, setActiveTab] = useState("whatsapp");
  const [importMethod, setImportMethod] = useState<"csv" | "text" | "json">(
    "text",
  );
  const [inputContent, setInputContent] = useState("");
  const [parsedStories, setParsedStories] = useState<ImportedStory[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // WhatsApp Import State
  const [whatsappChatText, setWhatsappChatText] = useState("");
  const [anonymizeChats, setAnonymizeChats] = useState(true);
  const [detectDrama, setDetectDrama] = useState(true);
  const [whatsappStories, setWhatsappStories] = useState<ImportedStory[]>([]);

  // All the WhatsApp parsing functions from the original ContentImporter
  const parseWhatsAppChat = (chatText: string): ImportedStory[] => {
    if (!chatText.trim()) return [];

    try {
      const lines = chatText.split("\n").filter((line) => line.trim());
      const messages: ImportedMessage[] = [];
      const participants = new Set<string>();
      let storyTitle = "WhatsApp Drama";

      for (const line of lines) {
        const message = parseWhatsAppLine(line);
        if (message) {
          messages.push(message);
          participants.add(message.sender);
        }
      }

      if (messages.length === 0) return [];

      storyTitle = generateStoryTitle(messages);
      const dramaticMoments = detectDramaticMoments(messages);

      if (anonymizeChats) {
        anonymizeMessages(messages);
      }

      const viralScore = calculateWhatsAppViralScore(messages, dramaticMoments);

      const story: ImportedStory = {
        id: `whatsapp_${Date.now()}`,
        title: storyTitle,
        characters: Array.from(participants).map((name) =>
          anonymizeChats ? anonymizeName(name) : name,
        ),
        messages: messages,
        genre: detectGenre(messages),
        estimatedViralScore: viralScore,
        source: "whatsapp",
        tags: extractTags(messages),
        isImported: false,
        createdAt: new Date().toISOString(),
      };

      return [story];
    } catch (error) {
      console.error("WhatsApp parsing error:", error);
      addNotification({
        type: "error",
        title: "Parsing Failed",
        message: "Could not parse WhatsApp chat. Please check the format.",
      });
      return [];
    }
  };

  const parseWhatsAppLine = (line: string): ImportedMessage | null => {
    const patterns = [
      /^\[(\d{1,2}\/\d{1,2}\/\d{4}), (\d{1,2}:\d{2}:\d{2})\] ([^:]+): (.+)$/,
      /^(\d{1,2}\/\d{1,2}\/\d{4}), (\d{1,2}:\d{2}) - ([^:]+): (.+)$/,
      /^(\d{1,2}\/\d{1,2}\/\d{2}), (\d{1,2}:\d{2}) - ([^:]+): (.+)$/,
      /^([^(]+) \((\d{1,2}\/\d{1,2}\/\d{4}) (\d{1,2}:\d{2})\): (.+)$/,
    ];

    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        const [, date, time, sender, messageText] = match;

        return {
          id: `msg_${Date.now()}_${Math.random()}`,
          timestamp: `${date} ${time}`,
          sender: sender.trim(),
          message: messageText.trim(),
          emotion: detectEmotion(messageText),
          isCliffhanger: isCliffhanger(messageText),
          hasMedia: hasMediaAttachment(messageText),
        };
      }
    }
    return null;
  };

  const generateStoryTitle = (messages: ImportedMessage[]): string => {
    const content = messages
      .map((m) => m.message)
      .join(" ")
      .toLowerCase();

    const titleTriggers = [
      {
        keywords: ["affair", "cheating", "cheated"],
        title: "The Affair Discovery",
      },
      {
        keywords: ["pregnant", "pregnancy", "baby"],
        title: "Unexpected Pregnancy Drama",
      },
      { keywords: ["wedding", "married", "divorce"], title: "Marriage Chaos" },
      { keywords: ["boss", "work", "fired", "job"], title: "Workplace Drama" },
      {
        keywords: ["friend", "betrayed", "backstab"],
        title: "Friendship Betrayal",
      },
      { keywords: ["family", "mom", "dad", "parent"], title: "Family Drama" },
      {
        keywords: ["money", "debt", "broke", "loan"],
        title: "Financial Crisis",
      },
      {
        keywords: ["secret", "hidden", "discovered"],
        title: "Secret Revealed",
      },
    ];

    for (const trigger of titleTriggers) {
      if (trigger.keywords.some((keyword) => content.includes(keyword))) {
        return trigger.title;
      }
    }

    return "WhatsApp Drama Story";
  };

  const detectDramaticMoments = (messages: ImportedMessage[]) => {
    return messages.filter((msg) => {
      const text = msg.message.toLowerCase();
      const dramaticTriggers = [
        "can't believe",
        "shocked",
        "devastated",
        "betrayed",
        "furious",
        "wtf",
        "omg",
        "no way",
        "seriously?",
        "what the hell",
        "i'm done",
        "it's over",
        "how could you",
        "you lied",
      ];

      return (
        dramaticTriggers.some((trigger) => text.includes(trigger)) ||
        msg.message.includes("!!!") ||
        msg.message.includes("???") ||
        (msg.message.match(/[A-Z]/g) || []).length > msg.message.length * 0.3
      );
    });
  };

  const detectEmotion = (text: string): string => {
    const emotionPatterns = {
      angry: ["wtf", "furious", "pissed", "angry", "mad", "hate", "😡", "🤬"],
      sad: [
        "crying",
        "devastated",
        "heartbroken",
        "depressed",
        "😭",
        "💔",
        "😢",
      ],
      shocked: [
        "omg",
        "wtf",
        "can't believe",
        "shocked",
        "stunned",
        "😱",
        "🤯",
      ],
      happy: ["lol", "haha", "excited", "amazing", "love", "😂", "❤️", "😍"],
      scared: ["terrified", "scared", "worried", "anxious", "😨", "😰"],
      betrayed: ["betrayed", "lied", "cheated", "backstabbed"],
      neutral: [],
    };

    const lowerText = text.toLowerCase();

    for (const [emotion, triggers] of Object.entries(emotionPatterns)) {
      if (triggers.some((trigger) => lowerText.includes(trigger))) {
        return emotion;
      }
    }

    return "neutral";
  };

  const isCliffhanger = (text: string): boolean => {
    const cliffhangerTriggers = [
      "wait until you hear this",
      "you won't believe",
      "i need to tell you something",
      "we need to talk",
      "call me now",
      "emergency",
      "something happened",
      "i have news",
    ];

    const lowerText = text.toLowerCase();
    return (
      cliffhangerTriggers.some((trigger) => lowerText.includes(trigger)) ||
      text.includes("...") ||
      (text.endsWith("?") && text.includes("what")) ||
      text.includes("to be continued")
    );
  };

  const hasMediaAttachment = (text: string): boolean => {
    const mediaIndicators = [
      "<Media omitted>",
      "image omitted",
      "video omitted",
      "audio omitted",
      "document omitted",
      "sticker omitted",
    ];

    return mediaIndicators.some((indicator) => text.includes(indicator));
  };

  const anonymizeName = (name: string): string => {
    if (!name || name.length === 0) return "Anonymous";

    const anonymizedNames = [
      "Alex",
      "Jordan",
      "Taylor",
      "Casey",
      "Riley",
      "Avery",
      "Quinn",
      "Sage",
      "Blake",
      "Drew",
      "Emery",
      "Finley",
    ];

    const hash = name.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    return anonymizedNames[hash % anonymizedNames.length];
  };

  const anonymizeMessages = (messages: ImportedMessage[]) => {
    const nameMap = new Map<string, string>();

    messages.forEach((msg) => {
      if (!nameMap.has(msg.sender)) {
        nameMap.set(msg.sender, anonymizeName(msg.sender));
      }
      msg.sender = nameMap.get(msg.sender)!;

      nameMap.forEach((anonymized, original) => {
        const regex = new RegExp(`\\b${original}\\b`, "gi");
        msg.message = msg.message.replace(regex, anonymized);
      });
    });
  };

  const detectGenre = (messages: ImportedMessage[]): string => {
    const content = messages
      .map((m) => m.message)
      .join(" ")
      .toLowerCase();

    const genreKeywords = {
      romance: [
        "love",
        "boyfriend",
        "girlfriend",
        "dating",
        "crush",
        "relationship",
      ],
      family: [
        "mom",
        "dad",
        "parent",
        "family",
        "sibling",
        "brother",
        "sister",
      ],
      workplace: ["boss", "work", "job", "office", "colleague", "meeting"],
      friendship: ["friend", "bff", "bestie", "group chat"],
      drama: ["drama", "fight", "argument", "betrayed", "lied", "cheated"],
    };

    let maxScore = 0;
    let detectedGenre = "drama";

    Object.entries(genreKeywords).forEach(([genre, keywords]) => {
      const score = keywords.reduce((count, keyword) => {
        return count + (content.match(new RegExp(keyword, "g")) || []).length;
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        detectedGenre = genre;
      }
    });

    return detectedGenre;
  };

  const extractTags = (messages: ImportedMessage[]): string[] => {
    const content = messages
      .map((m) => m.message)
      .join(" ")
      .toLowerCase();
    const tags = [];

    const tagKeywords = [
      "viral",
      "drama",
      "shocking",
      "betrayal",
      "cheating",
      "affair",
      "pregnancy",
      "wedding",
      "divorce",
      "family",
      "work",
      "friendship",
      "money",
      "secret",
      "revealed",
      "emotional",
      "heartbreak",
    ];

    tagKeywords.forEach((tag) => {
      if (content.includes(tag)) {
        tags.push(tag);
      }
    });

    return tags.slice(0, 5);
  };

  const calculateWhatsAppViralScore = (
    messages: ImportedMessage[],
    dramaticMoments: ImportedMessage[],
  ): number => {
    let score = 50;

    if (messages.length > 20) score += 15;
    else if (messages.length > 10) score += 10;
    else if (messages.length > 5) score += 5;

    const dramaRatio = dramaticMoments.length / messages.length;
    score += dramaRatio * 30;

    const emotions = new Set(messages.map((m) => m.emotion));
    score += emotions.size * 3;

    const cliffhangers = messages.filter((m) => m.isCliffhanger).length;
    score += cliffhangers * 10;

    const mediaMessages = messages.filter((m) => m.hasMedia).length;
    score += mediaMessages * 5;

    return Math.min(Math.round(score), 100);
  };

  const processWhatsAppImport = () => {
    setIsProcessing(true);

    try {
      const stories = parseWhatsAppChat(whatsappChatText);

      if (stories.length === 0) {
        addNotification({
          type: "warning",
          title: "No Stories Found",
          message:
            "Could not extract any valid conversations from the WhatsApp chat.",
        });
      } else {
        setWhatsappStories(stories);
        setParsedStories((prev) => [...prev, ...stories]);

        addNotification({
          type: "success",
          title: "WhatsApp Import Successful",
          message: `Successfully converted ${stories.length} WhatsApp conversation(s) into ChatLure format!`,
        });
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: "Import Failed",
        message:
          "Failed to process WhatsApp chat. Please check the format and try again.",
      });
    }

    setIsProcessing(false);
  };

  const processManualImport = () => {
    setIsProcessing(true);

    try {
      // Simple text parsing for creators
      const lines = inputContent.split("\n").filter((line) => line.trim());
      const messages: ImportedMessage[] = [];

      lines.forEach((line, index) => {
        if (line.includes(":")) {
          const [sender, ...messageParts] = line.split(":");
          const message = messageParts.join(":").trim();

          messages.push({
            id: `manual_${index}`,
            timestamp: new Date().toISOString(),
            sender: sender.trim(),
            message: message,
            emotion: detectEmotion(message),
            isCliffhanger: isCliffhanger(message),
            hasMedia: false,
          });
        }
      });

      if (messages.length > 0) {
        const story: ImportedStory = {
          id: `manual_${Date.now()}`,
          title: "Manual Import Story",
          characters: Array.from(new Set(messages.map((m) => m.sender))),
          messages: messages,
          genre: detectGenre(messages),
          estimatedViralScore: calculateWhatsAppViralScore(
            messages,
            detectDramaticMoments(messages),
          ),
          source: "manual",
          tags: extractTags(messages),
          isImported: false,
          createdAt: new Date().toISOString(),
        };

        setParsedStories((prev) => [...prev, story]);

        addNotification({
          type: "success",
          title: "Manual Import Successful",
          message: "Successfully created story from manual input!",
        });
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: "Import Failed",
        message:
          "Failed to process manual input. Please check the format and try again.",
      });
    }

    setIsProcessing(false);
  };

  const publishStory = (story: ImportedStory) => {
    onImport([story]);
    addNotification({
      type: "success",
      title: "Story Published",
      message: `"${story.title}" has been published to your account!`,
    });
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="whatsapp">💬 WhatsApp</TabsTrigger>
          <TabsTrigger value="manual">📝 Manual</TabsTrigger>
          <TabsTrigger value="library">📚 My Imports</TabsTrigger>
        </TabsList>

        <TabsContent value="whatsapp" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="text-green-400" />
                <span>WhatsApp Chat Importer</span>
              </CardTitle>
              <p className="text-sm text-gray-400">
                Transform your real WhatsApp conversations into viral ChatLure
                stories
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={anonymizeChats}
                    onCheckedChange={setAnonymizeChats}
                  />
                  <Label>Anonymize Names</Label>
                  <Badge variant="secondary" className="text-xs">
                    Recommended
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={detectDrama}
                    onCheckedChange={setDetectDrama}
                  />
                  <Label>Auto-Detect Drama Moments</Label>
                  <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                    AI
                  </Badge>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="whatsapp-chat"
                  className="text-lg font-medium mb-3 block"
                >
                  Paste Your WhatsApp Chat Export
                </Label>
                <Textarea
                  id="whatsapp-chat"
                  value={whatsappChatText}
                  onChange={(e) => setWhatsappChatText(e.target.value)}
                  placeholder="Paste your WhatsApp chat export here...

Example:
[15/01/2024, 14:30:25] Sarah: OMG you won't believe what happened
[15/01/2024, 14:30:48] Taylor: What?? Tell me everything!"
                  className="bg-gray-700 border-gray-600 min-h-[300px] font-mono text-sm"
                />
              </div>

              <Button
                onClick={processWhatsAppImport}
                disabled={isProcessing || !whatsappChatText.trim()}
                className="bg-green-600 hover:bg-green-700 w-full"
              >
                {isProcessing ? (
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                ) : (
                  <Sparkles size={16} className="mr-2" />
                )}
                Convert to ChatLure Story
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>📝 Manual Story Creation</CardTitle>
              <p className="text-sm text-gray-400">
                Create stories by typing conversations directly
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="manual-content">Story Content</Label>
                <Textarea
                  id="manual-content"
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  placeholder="Enter conversations in this format:

Sarah: OMG you won't believe what just happened!
Taylor: What?? Tell me everything!
Sarah: I caught Jake texting his ex... again 😭
Taylor: NO WAY! What did you do??"
                  className="bg-gray-700 border-gray-600 min-h-[300px]"
                />
              </div>

              <Button
                onClick={processManualImport}
                disabled={isProcessing || !inputContent.trim()}
                className="bg-blue-600 hover:bg-blue-700 w-full"
              >
                {isProcessing ? (
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                ) : (
                  <BookOpen size={16} className="mr-2" />
                )}
                Create Story
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>
                📚 Imported Stories ({parsedStories.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {parsedStories.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No imported stories yet. Import some content to get started!
                </div>
              ) : (
                <div className="space-y-4">
                  {parsedStories.map((story) => (
                    <div key={story.id} className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-2">
                            {story.title}
                          </h4>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {story.genre}
                            </Badge>
                            <Badge className="bg-green-500/20 text-green-400 text-xs">
                              {story.source === "whatsapp"
                                ? "💬 WhatsApp"
                                : "📝 Manual"}
                            </Badge>
                            <div className="flex items-center space-x-1 text-xs">
                              <TrendingUp size={12} />
                              <span className="font-bold">
                                {story.estimatedViralScore}% viral
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-400">
                            {story.messages.length} messages •{" "}
                            {story.characters.length} characters
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => publishStory(story)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Publish Story
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
