import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Save,
  Copy,
  Shuffle,
  Sparkles,
  TrendingUp,
  Image,
  Mic,
  Video,
  Upload,
  Eye,
  Play,
  Pause,
  Volume2,
  Download,
  Trash2,
  MessageCircle,
  Clock,
  Zap,
  Users,
  BarChart3,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MediaItem {
  id: string;
  type: "image" | "audio" | "video";
  url: string;
  thumbnail?: string;
  duration?: number;
  size?: number;
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
  };
}

interface StoryTemplate {
  id: string;
  name: string;
  genre: "scandal" | "drama" | "romance" | "mystery" | "family" | "money";
  description: string;
  characters: Character[];
  plotPoints: PlotPoint[];
  estimatedDuration: string;
  viralPotential: number;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  stats?: {
    views: number;
    completionRate: number;
    shareRate: number;
  };
}

interface Character {
  id: string;
  name: string;
  avatar: string;
  personality: string;
  role: "protagonist" | "antagonist" | "supporting";
  secrets: string[];
  phoneNumber?: string;
  profileImage?: string;
}

interface PlotPoint {
  id: string;
  trigger: "time" | "user_action" | "previous_message";
  delay: number;
  message: string;
  sender: string;
  emotions: string[];
  cliffhanger: boolean;
  viralMoment: boolean;
  media?: MediaItem[];
  readReceipts?: boolean;
  typingIndicator?: boolean;
  messageType: "text" | "image" | "audio" | "video" | "location" | "contact";
}

const GENRE_EMOJIS = {
  scandal: "🔥",
  drama: "🎭",
  romance: "💕",
  mystery: "🔍",
  family: "👨‍👩‍👧‍👦",
  money: "💰",
};

const VIRAL_TEMPLATES = [
  "I can't believe what I just found out...",
  "My whole world just fell apart in 10 seconds",
  "I'm literally shaking right now",
  "This changes EVERYTHING",
  "I should have trusted my instincts",
  "Wait... there's more",
  "You're not going to believe this",
  "I found the smoking gun",
  "This is so much worse than I thought",
  "I need to tell someone before I explode",
  "The evidence is right here...",
  "I have the screenshots to prove it",
  "Someone's been lying to me for months",
  "I caught them red-handed",
  "The truth is finally coming out",
];

const DRAMA_SCENARIOS = [
  { title: "Mom Saw the Texts", genre: "family", viral: 95 },
  { title: "Affair Exposed", genre: "scandal", viral: 98 },
  { title: "Wedding Disaster", genre: "drama", viral: 85 },
  { title: "Inheritance Battle", genre: "money", viral: 88 },
  { title: "Stalker Revealed", genre: "mystery", viral: 92 },
  { title: "Best Friend's Betrayal", genre: "drama", viral: 90 },
];

import { useApp } from "@/contexts/AppContext";

export function StoryCreator({
  onSave,
}: {
  onSave?: (story: StoryTemplate) => void;
}) {
  const { addStory, addNotification } = useApp();
  const [currentStory, setCurrentStory] = useState<Partial<StoryTemplate>>({
    genre: "scandal",
    characters: [],
    plotPoints: [],
    viralPotential: 50,
    tags: [],
    isActive: true,
    createdAt: new Date().toISOString(),
  });

  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const storyTemplates: StoryTemplate[] = [
    {
      id: "mom-saw-texts",
      name: "Mom Saw the Texts",
      genre: "family",
      description:
        "Teen's secret relationship exposed when strict mother goes through phone",
      estimatedDuration: "25 minutes",
      viralPotential: 95,
      tags: ["family", "secrets", "teens", "strict-parents"],
      isActive: true,
      createdAt: new Date().toISOString(),
      characters: [
        {
          id: "lena",
          name: "Lena",
          avatar: "👧",
          personality: "Rebellious teenager, secretive, dramatic",
          role: "protagonist",
          secrets: ["Dating Taylor secretly", "Plans to sneak out to party"],
          phoneNumber: "(555) 0123",
          profileImage: "/avatars/teen-girl.jpg",
        },
        {
          id: "zoey",
          name: "Zoey",
          avatar: "👭",
          personality: "Best friend, loyal, voice of reason",
          role: "supporting",
          secrets: ["Knows about Taylor", "Helps plan escapes"],
          phoneNumber: "(555) 0124",
        },
        {
          id: "mom",
          name: "Mom",
          avatar: "👩‍💼",
          personality: "Strict, controlling, suspicious",
          role: "antagonist",
          secrets: ["Going through daughter's phone", "Planning confrontation"],
          phoneNumber: "(555) 0125",
        },
      ],
      plotPoints: [
        {
          id: "discovery",
          trigger: "time",
          delay: 0,
          message: "OMG. She saw the texts 😭😭😭",
          sender: "lena",
          emotions: ["panic", "devastated"],
          cliffhanger: true,
          viralMoment: true,
          messageType: "text",
          typingIndicator: true,
          readReceipts: true,
        },
        {
          id: "escalation",
          trigger: "time",
          delay: 180000, // 3 minutes
          message: "WAIT. Your mom??!! 😨",
          sender: "zoey",
          emotions: ["shocked", "worried"],
          cliffhanger: false,
          viralMoment: false,
          messageType: "text",
        },
        {
          id: "revelation",
          trigger: "time",
          delay: 300000, // 5 minutes
          message: "She saw EVERYTHING. Even the pics from Taylor 😬",
          sender: "lena",
          emotions: ["terrified", "exposed"],
          cliffhanger: true,
          viralMoment: true,
          messageType: "text",
        },
      ],
    },
  ];

  const generateViralMessage = () => {
    return VIRAL_TEMPLATES[Math.floor(Math.random() * VIRAL_TEMPLATES.length)];
  };

  const loadTemplate = (templateId: string) => {
    const template = storyTemplates.find((t) => t.id === templateId);
    if (template) {
      setCurrentStory(template);
      setSelectedTemplate(templateId);
    }
  };

  const addCharacter = () => {
    const newCharacter: Character = {
      id: Date.now().toString(),
      name: `Character ${(currentStory.characters?.length || 0) + 1}`,
      avatar: "👤",
      personality: "Describe personality...",
      role: "supporting",
      secrets: [],
      phoneNumber: `(555) ${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
    };

    setCurrentStory((prev) => ({
      ...prev,
      characters: [...(prev.characters || []), newCharacter],
    }));
  };

  const addPlotPoint = (type: PlotPoint["messageType"] = "text") => {
    const newPlotPoint: PlotPoint = {
      id: Date.now().toString(),
      trigger: "time",
      delay: 300000, // 5 minutes
      message: type === "text" ? "New message..." : "",
      sender: currentStory.characters?.[0]?.id || "character1",
      emotions: ["neutral"],
      cliffhanger: false,
      viralMoment: false,
      messageType: type,
      media: type !== "text" ? [] : undefined,
      typingIndicator: true,
      readReceipts: true,
    };

    setCurrentStory((prev) => ({
      ...prev,
      plotPoints: [...(prev.plotPoints || []), newPlotPoint],
    }));
  };

  const addMediaToMessage = (
    plotPointId: string,
    mediaType: MediaItem["type"],
  ) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept =
        mediaType === "image"
          ? "image/*"
          : mediaType === "audio"
            ? "audio/*"
            : "video/*";
      fileInputRef.current.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          // In real app, upload to server and get URL
          const mediaUrl = URL.createObjectURL(file);
          const newMedia: MediaItem = {
            id: Date.now().toString(),
            type: mediaType,
            url: mediaUrl,
            size: file.size,
            metadata: {
              format: file.type,
            },
          };

          setCurrentStory((prev) => ({
            ...prev,
            plotPoints:
              prev.plotPoints?.map((point) =>
                point.id === plotPointId
                  ? { ...point, media: [...(point.media || []), newMedia] }
                  : point,
              ) || [],
          }));
        }
      };
      fileInputRef.current.click();
    }
  };

  const calculateViralScore = () => {
    let score = 50;
    const plotPoints = currentStory.plotPoints || [];

    // More plot points = more engagement
    score += Math.min(plotPoints.length * 5, 25);

    // Cliffhangers boost viral potential
    const cliffhangers = plotPoints.filter((p) => p.cliffhanger).length;
    score += cliffhangers * 15;

    // Viral moments
    const viralMoments = plotPoints.filter((p) => p.viralMoment).length;
    score += viralMoments * 20;

    // Rich media content
    const mediaMessages = plotPoints.filter(
      (p) => p.media && p.media.length > 0,
    ).length;
    score += mediaMessages * 10;

    // Strong emotions
    const strongEmotions = plotPoints.reduce((count, p) => {
      return (
        count +
        p.emotions.filter((e) =>
          [
            "devastated",
            "terrified",
            "shocked",
            "betrayed",
            "furious",
          ].includes(e),
        ).length
      );
    }, 0);
    score += strongEmotions * 8;

    return Math.min(score, 100);
  };

  const MessagePreview = ({
    plotPoint,
    character,
  }: {
    plotPoint: PlotPoint;
    character?: Character;
  }) => (
    <div
      className={`flex ${plotPoint.sender === "lena" ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
          plotPoint.sender === "lena"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-900"
        }`}
      >
        {plotPoint.messageType === "text" && (
          <p className="text-sm">{plotPoint.message}</p>
        )}
        {plotPoint.messageType === "image" && plotPoint.media?.[0] && (
          <div>
            <img
              src={plotPoint.media[0].url}
              alt="Chat image"
              className="rounded-lg max-w-full h-auto mb-2"
            />
            {plotPoint.message && (
              <p className="text-sm">{plotPoint.message}</p>
            )}
          </div>
        )}
        {plotPoint.messageType === "audio" && (
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost" className="p-1">
              <Play size={16} />
            </Button>
            <div className="flex-1 h-2 bg-gray-300 rounded-full">
              <div className="h-2 bg-blue-500 rounded-full w-1/3"></div>
            </div>
            <span className="text-xs">0:23</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-900 text-white rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center space-x-3">
          <Sparkles className="text-purple-400" />
          <span>ChatLure Story Creator</span>
          <Badge
            variant="secondary"
            className="bg-orange-500/20 text-orange-400"
          >
            {calculateViralScore()}% Viral
          </Badge>
        </h1>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center space-x-2"
          >
            <Eye size={16} />
            <span>{isPreviewMode ? "Edit" : "Preview"}</span>
          </Button>
          <Button
            onClick={() => {
              if (currentStory.name && currentStory.genre) {
                addStory({
                  title: currentStory.name,
                  genre: currentStory.genre,
                  description: currentStory.description || "",
                  characters: currentStory.characters || [],
                  plotPoints: currentStory.plotPoints || [],
                  tags: currentStory.tags || [],
                  isActive: currentStory.isActive !== false,
                  viralScore: calculateViralScore(),
                  source: "original",
                });
                // Reset form
                setCurrentStory({
                  genre: "scandal",
                  characters: [],
                  plotPoints: [],
                  viralPotential: 50,
                  tags: [],
                  isActive: true,
                  createdAt: new Date().toISOString(),
                });
                if (onSave) onSave(currentStory as StoryTemplate);
              } else {
                addNotification({
                  type: "error",
                  title: "Missing Information",
                  message:
                    "Please add a story name and select a genre before saving.",
                });
              }
            }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 flex items-center space-x-2"
          >
            <Save size={16} />
            <span>Save Story</span>
          </Button>
        </div>
      </div>

      {isPreviewMode ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="text-green-400" />
              <span>Story Preview: {currentStory.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-700 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-gray-600">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold">
                  {currentStory.characters?.[0]?.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm">
                    {currentStory.characters?.[0]?.name}
                  </div>
                  <div className="text-xs text-gray-400">online</div>
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {currentStory.plotPoints?.map((plotPoint, index) => (
                  <MessagePreview
                    key={plotPoint.id}
                    plotPoint={plotPoint}
                    character={currentStory.characters?.find(
                      (c) => c.id === plotPoint.sender,
                    )}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800">
            <TabsTrigger value="overview">📝 Overview</TabsTrigger>
            <TabsTrigger value="characters">👥 Characters</TabsTrigger>
            <TabsTrigger value="timeline">📖 Timeline</TabsTrigger>
            <TabsTrigger value="media">🎬 Media</TabsTrigger>
            <TabsTrigger value="templates">📚 Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>📋 Story Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Story Name
                    </label>
                    <Input
                      value={currentStory.name || ""}
                      onChange={(e) =>
                        setCurrentStory((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Enter compelling story title..."
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Genre
                    </label>
                    <Select
                      value={currentStory.genre}
                      onValueChange={(value) =>
                        setCurrentStory((prev) => ({
                          ...prev,
                          genre: value as any,
                        }))
                      }
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(GENRE_EMOJIS).map(([genre, emoji]) => (
                          <SelectItem key={genre} value={genre}>
                            {emoji}{" "}
                            {genre.charAt(0).toUpperCase() + genre.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={currentStory.description || ""}
                    onChange={(e) =>
                      setCurrentStory((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe the dramatic premise that will hook viewers..."
                    className="bg-gray-700 border-gray-600 h-24"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Tags
                  </label>
                  <Input
                    placeholder="Add tags separated by commas (family, secrets, betrayal...)"
                    className="bg-gray-700 border-gray-600"
                    onChange={(e) => {
                      const tags = e.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean);
                      setCurrentStory((prev) => ({ ...prev, tags }));
                    }}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentStory.tags?.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-purple-600/20 text-purple-400"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="text-orange-400" />
                  <span>Viral Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {calculateViralScore()}%
                    </div>
                    <div className="text-sm text-gray-400">Viral Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {currentStory.plotPoints?.length || 0}
                    </div>
                    <div className="text-sm text-gray-400">Messages</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {currentStory.plotPoints?.filter((p) => p.cliffhanger)
                        .length || 0}
                    </div>
                    <div className="text-sm text-gray-400">Cliffhangers</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="characters" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="text-blue-400" />
                  <span>
                    Characters ({currentStory.characters?.length || 0})
                  </span>
                </CardTitle>
                <Button
                  onClick={addCharacter}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus size={16} className="mr-1" />
                  Add Character
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentStory.characters?.map((character, index) => (
                    <div
                      key={character.id}
                      className="bg-gray-700 p-4 rounded-lg"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">
                            Name
                          </label>
                          <Input
                            value={character.name}
                            onChange={(e) => {
                              const updatedCharacters = [
                                ...(currentStory.characters || []),
                              ];
                              updatedCharacters[index] = {
                                ...character,
                                name: e.target.value,
                              };
                              setCurrentStory((prev) => ({
                                ...prev,
                                characters: updatedCharacters,
                              }));
                            }}
                            className="bg-gray-600 border-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">
                            Role
                          </label>
                          <Select
                            value={character.role}
                            onValueChange={(value) => {
                              const updatedCharacters = [
                                ...(currentStory.characters || []),
                              ];
                              updatedCharacters[index] = {
                                ...character,
                                role: value as any,
                              };
                              setCurrentStory((prev) => ({
                                ...prev,
                                characters: updatedCharacters,
                              }));
                            }}
                          >
                            <SelectTrigger className="bg-gray-600 border-gray-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="protagonist">
                                💙 Protagonist
                              </SelectItem>
                              <SelectItem value="antagonist">
                                💥 Antagonist
                              </SelectItem>
                              <SelectItem value="supporting">
                                🤝 Supporting
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="mt-3">
                        <label className="block text-sm text-gray-400 mb-1">
                          Personality
                        </label>
                        <Textarea
                          value={character.personality}
                          onChange={(e) => {
                            const updatedCharacters = [
                              ...(currentStory.characters || []),
                            ];
                            updatedCharacters[index] = {
                              ...character,
                              personality: e.target.value,
                            };
                            setCurrentStory((prev) => ({
                              ...prev,
                              characters: updatedCharacters,
                            }));
                          }}
                          className="bg-gray-600 border-gray-500 h-16"
                          placeholder="Describe personality, motivations, and key traits..."
                        />
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{character.avatar}</span>
                          <Badge
                            variant={
                              character.role === "protagonist"
                                ? "default"
                                : character.role === "antagonist"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {character.role}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="text-green-400" />
                  <span>
                    Message Timeline ({currentStory.plotPoints?.length || 0})
                  </span>
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => addPlotPoint("text")}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <MessageCircle size={16} className="mr-1" />
                    Text
                  </Button>
                  <Button
                    onClick={() => addPlotPoint("image")}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Image size={16} className="mr-1" />
                    Image
                  </Button>
                  <Button
                    onClick={() => addPlotPoint("audio")}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Mic size={16} className="mr-1" />
                    Audio
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentStory.plotPoints?.map((point, index) => (
                    <div
                      key={point.id}
                      className="bg-gray-700 p-4 rounded-lg border-l-4 border-purple-500"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-400">
                            #{index + 1}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {point.messageType}
                          </Badge>
                          {point.viralMoment && (
                            <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                              🔥 VIRAL
                            </Badge>
                          )}
                          {point.cliffhanger && (
                            <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                              ⚡ CLIFFHANGER
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">
                            {Math.floor(point.delay / 60000)}m delay
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">
                            Sender
                          </label>
                          <Select value={point.sender}>
                            <SelectTrigger className="bg-gray-600 border-gray-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {currentStory.characters?.map((char) => (
                                <SelectItem key={char.id} value={char.id}>
                                  {char.avatar} {char.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">
                            Delay (minutes)
                          </label>
                          <Input
                            type="number"
                            value={point.delay / 60000}
                            onChange={(e) => {
                              const updatedPoints = [
                                ...(currentStory.plotPoints || []),
                              ];
                              updatedPoints[index] = {
                                ...point,
                                delay: parseInt(e.target.value) * 60000,
                              };
                              setCurrentStory((prev) => ({
                                ...prev,
                                plotPoints: updatedPoints,
                              }));
                            }}
                            className="bg-gray-600 border-gray-500"
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="block text-sm text-gray-400 mb-1">
                          Message
                        </label>
                        <Textarea
                          value={point.message}
                          onChange={(e) => {
                            const updatedPoints = [
                              ...(currentStory.plotPoints || []),
                            ];
                            updatedPoints[index] = {
                              ...point,
                              message: e.target.value,
                            };
                            setCurrentStory((prev) => ({
                              ...prev,
                              plotPoints: updatedPoints,
                            }));
                          }}
                          className="bg-gray-600 border-gray-500 h-20"
                          placeholder="Enter message text..."
                        />
                      </div>

                      {point.messageType !== "text" && (
                        <div className="mb-3">
                          <label className="block text-sm text-gray-400 mb-2">
                            Media
                          </label>
                          <Button
                            onClick={() =>
                              addMediaToMessage(
                                point.id,
                                point.messageType as MediaItem["type"],
                              )
                            }
                            variant="outline"
                            size="sm"
                            className="border-gray-500"
                          >
                            <Upload size={16} className="mr-1" />
                            Add {point.messageType}
                          </Button>

                          {point.media && point.media.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {point.media.map((media) => (
                                <div
                                  key={media.id}
                                  className="flex items-center space-x-2 text-sm"
                                >
                                  <span>
                                    {media.type === "image"
                                      ? "🖼️"
                                      : media.type === "audio"
                                        ? "🎵"
                                        : "🎬"}
                                  </span>
                                  <span className="text-gray-400">
                                    {media.type} file (
                                    {(media.size || 0 / 1024).toFixed(1)} KB)
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={point.cliffhanger}
                            onChange={(e) => {
                              const updatedPoints = [
                                ...(currentStory.plotPoints || []),
                              ];
                              updatedPoints[index] = {
                                ...point,
                                cliffhanger: e.target.checked,
                              };
                              setCurrentStory((prev) => ({
                                ...prev,
                                plotPoints: updatedPoints,
                              }));
                            }}
                            className="rounded"
                          />
                          <span>Cliffhanger</span>
                        </label>
                        <label className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={point.viralMoment}
                            onChange={(e) => {
                              const updatedPoints = [
                                ...(currentStory.plotPoints || []),
                              ];
                              updatedPoints[index] = {
                                ...point,
                                viralMoment: e.target.checked,
                              };
                              setCurrentStory((prev) => ({
                                ...prev,
                                plotPoints: updatedPoints,
                              }));
                            }}
                            className="rounded"
                          />
                          <span>Viral Moment</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Video className="text-red-400" />
                  <span>Media Library</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-400 py-8">
                  <Upload size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Media management coming soon...</p>
                  <p className="text-sm">
                    Upload and manage images, audio, and video files for your
                    stories
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>🔥 Viral Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {storyTemplates.map((template) => (
                      <motion.button
                        key={template.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => loadTemplate(template.id)}
                        className={`w-full p-4 rounded-lg text-left transition-all ${
                          selectedTemplate === template.id
                            ? "bg-purple-600/30 border border-purple-500"
                            : "bg-gray-700 hover:bg-gray-600"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{template.name}</h3>
                          <div className="flex items-center space-x-1">
                            <TrendingUp size={12} className="text-orange-400" />
                            <span className="text-xs text-orange-400">
                              {template.viralPotential}%
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">
                          {template.description}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="bg-purple-600/20 px-2 py-1 rounded text-purple-400">
                            {GENRE_EMOJIS[template.genre]} {template.genre}
                          </span>
                          <span className="text-gray-500">
                            {template.estimatedDuration}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>⚡ Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        const viralMessage = generateViralMessage();
                        addPlotPoint("text");
                        const plotPoints = currentStory.plotPoints || [];
                        if (plotPoints.length > 0) {
                          plotPoints[plotPoints.length - 1].message =
                            viralMessage;
                          plotPoints[plotPoints.length - 1].viralMoment = true;
                          setCurrentStory((prev) => ({ ...prev, plotPoints }));
                        }
                      }}
                      className="w-full bg-green-600/20 hover:bg-green-600/30 border border-green-500/30"
                    >
                      <Sparkles size={16} className="mr-2" />
                      Add Viral Message
                    </Button>

                    <Button
                      onClick={() => {
                        const randomMessage = generateViralMessage();
                        navigator.clipboard.writeText(randomMessage);
                      }}
                      className="w-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30"
                    >
                      <Copy size={16} className="mr-2" />
                      Copy Viral Template
                    </Button>

                    <Button className="w-full bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30">
                      <Shuffle size={16} className="mr-2" />
                      Random Plot Twist
                    </Button>

                    <Button className="w-full bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30">
                      <Zap size={16} className="mr-2" />
                      Auto-Generate Story
                    </Button>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-semibold mb-3 text-gray-400">
                      💡 Viral Scenarios
                    </h4>
                    <div className="space-y-2">
                      {DRAMA_SCENARIOS.map((scenario, index) => (
                        <div
                          key={index}
                          className="bg-gray-700 p-2 rounded text-sm"
                        >
                          <div className="flex items-center justify-between">
                            <span>{scenario.title}</span>
                            <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                              {scenario.viral}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}

      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={() => {}} // Handled in addMediaToMessage
      />
    </div>
  );
}
