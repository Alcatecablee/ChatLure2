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
  const [minViralScore, setMinViralScore] = useState(10);
  const [autoConvert, setAutoConvert] = useState(true);

  // WhatsApp Import State
  const [whatsappChatText, setWhatsappChatText] = useState("");
  const [anonymizeChats, setAnonymizeChats] = useState(true);
  const [detectDrama, setDetectDrama] = useState(true);
  const [whatsappStories, setWhatsappStories] = useState<ImportedStory[]>([]);

  // Reddit content with fallback system (CORS-safe approach)
  const fetchFromRedditAPI = async (subreddit: string, query: string) => {
    try {
      // Try using Reddit's public JSON endpoints (no authentication required, CORS-friendly)
      const subredditName =
        subreddit === "all"
          ? "relationship_advice"
          : subreddit.replace("r/", "");
      const redditUrl = `https://www.reddit.com/r/${subredditName}/hot.json?limit=25`;

      console.log("Fetching from Reddit:", redditUrl);

      // Use Reddit's public JSON API (works with CORS)
      const response = await fetch(redditUrl, {
        headers: {
          "User-Agent": "ChatLure/1.0",
        },
      });

      if (!response.ok) {
        console.log("Reddit API failed, using fallback");
        throw new Error(`Reddit fetch failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("Reddit data received:", data.data.children.length, "posts");

      // More lenient filtering - look for relationship/drama keywords
      const dramaTriggers = [
        "affair",
        "cheating",
        "betrayed",
        "toxic",
        "divorce",
        "breakup",
        "crazy",
        "drama",
        "fight",
        "argument",
        "relationship",
        "boyfriend",
        "girlfriend",
        "husband",
        "wife",
        "family",
        "parents",
      ];

      const posts = data.data.children
        .filter((child: any) => {
          // More lenient filtering - look for drama-related content
          const title = child.data.title.toLowerCase();
          const content = (child.data.selftext || "").toLowerCase();

          // Check if query is provided and matches
          if (query && query.trim()) {
            const searchTerms = query.toLowerCase().split(" ");
            const hasQueryMatch = searchTerms.some(
              (term) => title.includes(term) || content.includes(term),
            );
            if (hasQueryMatch) return true;
          }

          // Check for drama triggers
          const hasDramaTrigger = dramaTriggers.some(
            (trigger) => title.includes(trigger) || content.includes(trigger),
          );

          // Include posts with decent engagement or drama content
          return (
            hasDramaTrigger ||
            child.data.ups > 100 ||
            child.data.num_comments > 20
          );
        })
        .map((child: any) => ({
          id: child.data.id,
          title: child.data.title,
          content: child.data.selftext || child.data.title,
          upvotes: child.data.ups,
          comments: child.data.num_comments,
          subreddit: child.data.subreddit_name_prefixed,
          url: `https://reddit.com${child.data.permalink}`,
          created: new Date(child.data.created_utc * 1000).toLocaleDateString(),
          author: child.data.author,
          flair: child.data.link_flair_text,
        }));

      console.log("Filtered posts:", posts.length);

      // If no posts from Reddit, use curated content
      if (posts.length === 0) {
        console.log("No Reddit posts found, using curated content");
        return getCuratedContent(subreddit, query);
      }

      return posts;
    } catch (error) {
      console.error("Reddit API Error:", error);

      // Fallback to curated content if Reddit API fails
      console.log("Falling back to curated content...");
      return getCuratedContent(subreddit, query);
    }
  };

  // Intelligent WhatsApp Chat Parser
  const parseWhatsAppChat = (chatText: string): ImportedStory[] => {
    if (!chatText.trim()) return [];

    try {
      // Detect WhatsApp format patterns
      const lines = chatText.split("\n").filter((line) => line.trim());
      const messages: ImportedMessage[] = [];
      const participants = new Set<string>();
      let storyTitle = "WhatsApp Drama";

      // Parse different WhatsApp export formats
      for (const line of lines) {
        const message = parseWhatsAppLine(line);
        if (message) {
          messages.push(message);
          participants.add(message.sender);
        }
      }

      if (messages.length === 0) return [];

      // Intelligent story title generation
      storyTitle = generateStoryTitle(messages);

      // Detect drama and emotional moments
      const dramaticMoments = detectDramaticMoments(messages);
      const emotionalAnalysis = analyzeEmotions(messages);

      // Apply anonymization if enabled
      if (anonymizeChats) {
        anonymizeMessages(messages);
      }

      // Calculate viral score based on content analysis
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
        source: "manual",
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
    // Support multiple WhatsApp export formats
    const patterns = [
      // Pattern 1: [DD/MM/YYYY, HH:MM:SS] Name: Message
      /^\[(\d{1,2}\/\d{1,2}\/\d{4}), (\d{1,2}:\d{2}:\d{2})\] ([^:]+): (.+)$/,
      // Pattern 2: DD/MM/YYYY, HH:MM - Name: Message
      /^(\d{1,2}\/\d{1,2}\/\d{4}), (\d{1,2}:\d{2}) - ([^:]+): (.+)$/,
      // Pattern 3: MM/DD/YY, HH:MM - Name: Message
      /^(\d{1,2}\/\d{1,2}\/\d{2}), (\d{1,2}:\d{2}) - ([^:]+): (.+)$/,
      // Pattern 4: Name (DD/MM/YYYY HH:MM): Message
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

  const analyzeEmotions = (messages: ImportedMessage[]) => {
    return messages.map((msg) => ({
      ...msg,
      emotion: detectEmotion(msg.message),
    }));
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

    // Create consistent mapping based on name hash
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

      // Also anonymize names mentioned in messages
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

    return tags.slice(0, 5); // Limit to 5 tags
  };

  const calculateWhatsAppViralScore = (
    messages: ImportedMessage[],
    dramaticMoments: ImportedMessage[],
  ): number => {
    let score = 50; // Base score

    // Length factor
    if (messages.length > 20) score += 15;
    else if (messages.length > 10) score += 10;
    else if (messages.length > 5) score += 5;

    // Drama factor
    const dramaRatio = dramaticMoments.length / messages.length;
    score += dramaRatio * 30;

    // Emotion variety
    const emotions = new Set(messages.map((m) => m.emotion));
    score += emotions.size * 3;

    // Cliffhanger factor
    const cliffhangers = messages.filter((m) => m.isCliffhanger).length;
    score += cliffhangers * 10;

    // Media attachments
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

  // Curated fallback content for when Reddit API is unavailable
  const getCuratedContent = (subreddit: string, query: string) => {
    const curatedPosts = [
      {
        id: "curated_1",
        title: "My mom went through my phone and found my secret relationship",
        content:
          "I (17F) have been dating Taylor (18M) for 3 months. My mom is super strict about dating. She found all our texts and now she's threatening to tell his parents...",
        upvotes: 12500,
        comments: 856,
        subreddit: "r/insaneparents",
        url: "https://reddit.com/r/insaneparents/example1",
        created: "2024-01-15",
        author: "anonymous_user",
        flair: "Advice",
      },
      {
        id: "curated_2",
        title:
          "Caught my husband's affair through his Apple Watch notification",
        content:
          "I was doing laundry when his watch lit up with 'Can't wait to see you tonight baby 💕' from someone named Jessica. My 10-year marriage just collapsed...",
        upvotes: 23400,
        comments: 1240,
        subreddit: "r/relationship_advice",
        url: "https://reddit.com/r/relationship_advice/example2",
        created: "2024-01-14",
        author: "betrayed_spouse",
      },
      {
        id: "curated_3",
        title:
          "MIL demanded I give her my wedding dress for her daughter's wedding",
        content:
          "My monster-in-law showed up demanding my $3000 designer wedding dress because 'it's only fair her daughter gets nice things too'. The audacity is unreal...",
        upvotes: 18700,
        comments: 967,
        subreddit: "r/entitledparents",
        url: "https://reddit.com/r/entitledparents/example3",
        created: "2024-01-13",
        author: "frustrated_dil",
      },
      {
        id: "curated_4",
        title:
          "My best friend is trying to steal my boyfriend using fake pregnancy",
        content:
          "She told him she's pregnant with his baby after they were drunk at a party. I know for a fact she's lying because I saw her period tracker app...",
        upvotes: 15600,
        comments: 743,
        subreddit: "r/relationship_advice",
        url: "https://reddit.com/r/relationship_advice/example4",
        created: "2024-01-12",
        author: "heartbroken_friend",
      },
      {
        id: "curated_5",
        title: "My roommate is stealing my food and lying about it",
        content:
          "I've been marking my food with invisible ink and caught her red-handed. She's been gaslighting me for months saying I'm 'forgetting' I ate it...",
        upvotes: 8900,
        comments: 567,
        subreddit: "r/roommates",
        url: "https://reddit.com/r/roommates/example5",
        created: "2024-01-11",
        author: "frustrated_tenant",
      },
      {
        id: "curated_6",
        title:
          "Boss made me work on my wedding day, then fired me for being 'unreliable'",
        content:
          "I told my boss 6 months ago about my wedding date. Yesterday he scheduled a 'mandatory meeting' and when I couldn't attend, he fired me via text...",
        upvotes: 14200,
        comments: 892,
        subreddit: "r/antiwork",
        url: "https://reddit.com/r/antiwork/example6",
        created: "2024-01-10",
        author: "newlywed_employee",
      },
    ];

    // More lenient filtering - return more results
    const filtered = curatedPosts.filter((post) => {
      const matchesSubreddit =
        subreddit === "all" ||
        post.subreddit.includes(subreddit.replace("r/", ""));
      const matchesQuery =
        !query ||
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase());

      return matchesSubreddit && matchesQuery;
    });

    // If no matches, return all posts to ensure user gets content
    return filtered.length > 0 ? filtered : curatedPosts;
  };

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
    // This is a simplified conversion - in real app, use AI/NLP
    const messages: ImportedMessage[] = [
      {
        id: "1",
        timestamp: Date.now().toString(),
        sender: "User",
        message: `I need to tell someone about this... ${post.content.substring(0, 100)}...`,
        emotion: "anxious",
        isCliffhanger: true,
        hasMedia: false,
      },
      {
        id: "2",
        timestamp: (Date.now() + 180000).toString(),
        sender: "Friend",
        message: "OMG what happened?! Tell me everything!",
        emotion: "concerned",
        isCliffhanger: false,
        hasMedia: false,
      },
    ];

    return {
      id: post.id,
      title: post.title,
      characters: ["User", "Friend"],
      messages,
      genre: post.subreddit.includes("parent") ? "family" : "drama",
      estimatedViralScore: Math.min(Math.floor(post.upvotes / 100) + 60, 100),
      source: "reddit",
      sourceUrl: post.url,
      upvotes: post.upvotes,
      comments: post.comments,
      tags: [post.subreddit.replace("r/", ""), "reddit"],
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

    try {
      addNotification({
        type: "info",
        title: "Scanning Reddit",
        message: `Searching ${selectedSubreddit === "all" ? "all subreddits" : selectedSubreddit} for "${searchQuery || "viral content"}"`,
      });

      // Use Reddit API with fallback
      const posts = await fetchFromRedditAPI(
        selectedSubreddit,
        searchQuery || "",
      );

      console.log("Total posts before viral filtering:", posts.length);
      console.log("Min viral score setting:", minViralScore);

      // More reasonable viral score filtering (don't multiply by 10)
      const filteredPosts = posts.filter(
        (post) => post.upvotes >= minViralScore,
      );

      console.log("Posts after viral filtering:", filteredPosts.length);

      setRedditPosts(filteredPosts);

      // Determine if this was from Reddit API or fallback
      const isFromFallback = filteredPosts.some((post) =>
        post.id.startsWith("curated_"),
      );

      addNotification({
        type: "success",
        title: isFromFallback
          ? "Content Loaded (Curated)"
          : "Reddit Scan Complete",
        message: isFromFallback
          ? `Found ${filteredPosts.length} curated viral posts - perfect for ChatLure stories!`
          : `Found ${filteredPosts.length} potential viral posts from Reddit`,
      });

      // Show info about CORS limitation if using fallback
      if (isFromFallback) {
        addNotification({
          type: "info",
          title: "💡 Pro Tip",
          message:
            "For live Reddit data, set up a backend proxy server to handle Reddit API calls.",
        });
      }
    } catch (error: any) {
      console.error("Reddit fetch error:", error);
      addNotification({
        type: "error",
        title: "Content Loading Failed",
        message:
          "Unable to load content. Please try again or check your connection.",
      });
    }

    setIsProcessing(false);
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
      className="bg-gray-800 border border-gray-700 rounded-lg p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-1">{story.title}</h4>
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="outline" className="text-xs">
              {story.genre}
            </Badge>
            {story.source === "reddit" && (
              <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                📍 Reddit
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
          <Button variant="ghost" size="sm">
            <Eye size={14} />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-400">
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
        <div>
          <span className="text-gray-400">Messages:</span>
          <span className="ml-2 text-white">{story.messages.length}</span>
        </div>
        <div>
          <span className="text-gray-400">Characters:</span>
          <span className="ml-2 text-white">{story.characters.length}</span>
        </div>
      </div>

      {story.source === "reddit" && (
        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
          <div className="flex items-center space-x-1">
            <span className="text-gray-400">↑</span>
            <span className="text-green-400">
              {story.upvotes?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageSquare size={12} className="text-blue-400" />
            <span className="text-blue-400">{story.comments}</span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-1 mb-3">
        {story.tags.map((tag, i) => (
          <Badge
            key={i}
            variant="secondary"
            className="text-xs bg-gray-700 text-gray-300"
          >
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {new Date(story.createdAt).toLocaleDateString()}
        </span>
        <div className="flex items-center space-x-2">
          {!story.isImported && (
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              Import
            </Button>
          )}
          {story.isImported && (
            <Badge className="bg-green-500/20 text-green-400">✓ Imported</Badge>
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
        <TabsList className="grid w-full grid-cols-5 bg-gray-800">
          <TabsTrigger value="reddit">🔥 Reddit</TabsTrigger>
          <TabsTrigger value="whatsapp">💬 WhatsApp</TabsTrigger>
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
                  <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                    🌐 CORS-Safe Mode
                  </Badge>
                </div>
                <Button onClick={fetchRedditContent} disabled={isProcessing}>
                  {isProcessing ? (
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                  ) : (
                    <Search size={16} className="mr-2" />
                  )}
                  Scan Content
                </Button>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                <h4 className="font-medium text-blue-400 mb-2 flex items-center">
                  ℹ️ Reddit Integration Status
                </h4>
                <div className="text-sm text-gray-300 space-y-2">
                  <p>
                    <strong>Current Mode:</strong> Public Reddit API + Curated
                    Fallback
                  </p>
                  <p>
                    <strong>Why:</strong> Browser CORS policy prevents direct
                    Reddit OAuth API calls from frontend applications.
                  </p>
                  <p>
                    <strong>Solution:</strong> The scanner uses Reddit's public
                    JSON endpoints when possible, with high-quality curated
                    content as fallback.
                  </p>
                  <div className="mt-3 p-3 bg-gray-800/50 rounded border-l-4 border-blue-400">
                    <p className="text-xs text-blue-300">
                      <strong>💡 For Production:</strong> Set up a backend API
                      proxy to handle Reddit OAuth authentication and bypass
                      CORS limitations.
                    </p>
                  </div>
                </div>
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

        <TabsContent value="whatsapp" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="text-green-400" />
                <span>WhatsApp Chat Importer</span>
              </CardTitle>
              <p className="text-sm text-gray-400">
                Transform your real WhatsApp conversations into viral ChatLure
                stories with intelligent parsing and anonymization.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Settings */}
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

              {/* Chat Input */}
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

Example format:
[15/01/2024, 14:30:25] Sarah: OMG you won't believe what just happened
[15/01/2024, 14:30:48] Taylor: What?? Tell me everything!
[15/01/2024, 14:31:15] Sarah: I caught him texting his ex... 😭"
                  className="bg-gray-700 border-gray-600 min-h-[300px] font-mono text-sm"
                />
              </div>

              {/* Process Button */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Supports all WhatsApp export formats • Intelligent drama
                  detection • Privacy-first
                </div>
                <Button
                  onClick={processWhatsAppImport}
                  disabled={isProcessing || !whatsappChatText.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? (
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                  ) : (
                    <Sparkles size={16} className="mr-2" />
                  )}
                  Convert to ChatLure
                </Button>
              </div>

              {/* Instructions */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg">
                  <h4 className="font-medium text-green-400 mb-2">
                    📱 How to Export WhatsApp Chat
                  </h4>
                  <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                    <li>Open WhatsApp chat</li>
                    <li>Tap on contact/group name</li>
                    <li>Select "Export Chat"</li>
                    <li>Choose "Without Media"</li>
                    <li>Copy the text and paste here</li>
                  </ol>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-400 mb-2">
                    🤖 AI Features
                  </h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Auto-detects dramatic moments</li>
                    <li>• Identifies cliffhangers</li>
                    <li>• Analyzes emotions</li>
                    <li>• Generates story titles</li>
                    <li>• Calculates viral potential</li>
                    <li>• Protects privacy with anonymization</li>
                  </ul>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg">
                <h4 className="font-medium text-purple-400 mb-2 flex items-center">
                  🔒 Privacy & Security
                </h4>
                <p className="text-sm text-gray-300">
                  <strong>Your privacy matters:</strong> All processing happens
                  locally in your browser. No chat data is sent to external
                  servers. Enable "Anonymize Names" to automatically replace
                  real names with fictional ones for extra protection.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Stories Preview */}
          {whatsappStories.length > 0 && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>
                  💬 Converted WhatsApp Stories ({whatsappStories.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {whatsappStories.map((story, index) => (
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
                              💬 WhatsApp
                            </Badge>
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
                          <div className="text-sm text-gray-400 mb-2">
                            {story.messages.length} messages •{" "}
                            {story.characters.length} participants
                          </div>
                          <div className="text-xs text-gray-500">
                            {story.tags.join(", ")}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              // Add to main stories list
                              setParsedStories((prev) =>
                                prev.some((s) => s.id === story.id)
                                  ? prev
                                  : [...prev, story],
                              );
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Add to Stories
                          </Button>
                        </div>
                      </div>

                      {/* Message Preview */}
                      <div className="bg-gray-800 p-3 rounded border-l-4 border-green-400">
                        <h5 className="text-xs font-medium text-green-400 mb-2">
                          MESSAGE PREVIEW
                        </h5>
                        <div className="space-y-1">
                          {story.messages.slice(0, 3).map((msg, i) => (
                            <div key={i} className="text-xs">
                              <span className="text-blue-300">
                                {msg.sender}:
                              </span>
                              <span className="text-gray-300 ml-2">
                                {msg.message}
                              </span>
                              {msg.emotion !== "neutral" && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 text-xs"
                                >
                                  {msg.emotion}
                                </Badge>
                              )}
                            </div>
                          ))}
                          {story.messages.length > 3 && (
                            <div className="text-xs text-gray-500">
                              ... and {story.messages.length - 3} more messages
                            </div>
                          )}
                        </div>
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
