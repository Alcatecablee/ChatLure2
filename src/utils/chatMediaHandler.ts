// ChatLure Media Handler for Rich Story Content

export interface MediaAsset {
  id: string;
  type: "image" | "audio" | "video" | "location" | "contact" | "document";
  url: string;
  thumbnail?: string;
  duration?: number; // for audio/video in seconds
  size: number; // in bytes
  filename: string;
  mimeType: string;
  metadata: MediaMetadata;
  uploadedAt: string;
  isProcessing?: boolean;
  compressionLevel?: "low" | "medium" | "high";
}

export interface MediaMetadata {
  width?: number;
  height?: number;
  aspectRatio?: string;
  format?: string;
  bitrate?: number;
  sampleRate?: number;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  fakeData?: {
    // For generating realistic fake media
    scenario: string;
    emotionalContext: string;
    viralPotential: number;
  };
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: number;
  messageType: "text" | "image" | "audio" | "video" | "location" | "contact";
  media?: MediaAsset[];
  reactions?: MessageReaction[];
  status: "sending" | "sent" | "delivered" | "read";
  isEdited?: boolean;
  replyTo?: string;
  forwardedFrom?: string;
  isDeleted?: boolean;
  emotion: string;
  isCliffhanger: boolean;
  viralMoment: boolean;
  engagement?: {
    screenshots?: number;
    shares?: number;
    reactions?: number;
  };
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  userName: string;
  timestamp: number;
}

export const VIRAL_MEDIA_TEMPLATES = {
  // Common viral media scenarios for different story types
  familyDrama: [
    {
      type: "image" as const,
      scenario: "Screenshot of secret texts",
      description: "Phone screen showing hidden conversations",
      viralPotential: 95,
      emotionalImpact: "betrayed",
    },
    {
      type: "audio" as const,
      scenario: "Overheard argument recording",
      description: "Muffled audio of parents fighting",
      viralPotential: 88,
      emotionalImpact: "anxious",
    },
    {
      type: "image" as const,
      scenario: "Evidence photo",
      description: "Photo of something they weren't supposed to find",
      viralPotential: 92,
      emotionalImpact: "shocked",
    },
  ],

  relationshipScandal: [
    {
      type: "image" as const,
      scenario: "Affair evidence",
      description: "Photo showing cheating partner with someone else",
      viralPotential: 98,
      emotionalImpact: "devastated",
    },
    {
      type: "video" as const,
      scenario: "Confrontation recording",
      description: "Video of catching them in the act",
      viralPotential: 96,
      emotionalImpact: "furious",
    },
    {
      type: "image" as const,
      scenario: "Social media screenshot",
      description: "Instagram/Facebook post revealing affair",
      viralPotential: 89,
      emotionalImpact: "humiliated",
    },
  ],

  moneyDrama: [
    {
      type: "image" as const,
      scenario: "Legal document",
      description: "Will or contract showing manipulation",
      viralPotential: 85,
      emotionalImpact: "betrayed",
    },
    {
      type: "image" as const,
      scenario: "Bank statement",
      description: "Evidence of financial theft/misuse",
      viralPotential: 87,
      emotionalImpact: "outraged",
    },
  ],
};

export const MESSAGE_FORMATTING = {
  // Realistic WhatsApp-style formatting
  timestamps: {
    recent: "now",
    minute: "1m ago",
    hour: "1h ago",
    day: "yesterday",
    week: "last week",
  },

  statusIndicators: {
    sending: "🕐",
    sent: "✓",
    delivered: "✓✓",
    read: "✓✓", // blue in real app
  },

  typingIndicators: [
    "is typing...",
    "is recording audio...",
    "is taking a photo...",
    "is recording video...",
  ],

  readReceipts: {
    enabled: true,
    showNames: true,
    showTimestamp: true,
  },
};

export class ChatMediaHandler {
  private mediaCache: Map<string, MediaAsset> = new Map();
  private compressionSettings = {
    image: { quality: 0.8, maxWidth: 1920, maxHeight: 1080 },
    audio: { bitrate: 128, format: "mp3" },
    video: { bitrate: 1000, maxDuration: 300 }, // 5 minutes max
  };

  // Generate fake but realistic media for stories
  generateFakeMedia(
    type: MediaAsset["type"],
    scenario: string,
    emotionalContext: string,
  ): MediaAsset {
    const id = this.generateId();
    const timestamp = new Date().toISOString();

    const fakeMedia: MediaAsset = {
      id,
      type,
      url: this.generateFakeUrl(type, scenario),
      size: this.estimateSize(type),
      filename: this.generateFilename(type, scenario),
      mimeType: this.getMimeType(type),
      uploadedAt: timestamp,
      metadata: {
        fakeData: {
          scenario,
          emotionalContext,
          viralPotential: this.calculateViralPotential(scenario, type),
        },
      },
    };

    // Add type-specific metadata
    switch (type) {
      case "image":
        fakeMedia.metadata.width = 1080;
        fakeMedia.metadata.height = 1920;
        fakeMedia.metadata.aspectRatio = "9:16";
        fakeMedia.thumbnail = fakeMedia.url;
        break;

      case "audio":
        fakeMedia.duration = this.generateAudioDuration(scenario);
        fakeMedia.metadata.bitrate = 128000;
        fakeMedia.metadata.sampleRate = 44100;
        break;

      case "video":
        fakeMedia.duration = this.generateVideoDuration(scenario);
        fakeMedia.metadata.width = 1080;
        fakeMedia.metadata.height = 1920;
        fakeMedia.thumbnail = this.generateThumbnailUrl(id);
        break;

      case "location":
        fakeMedia.metadata.location = this.generateFakeLocation(scenario);
        break;
    }

    this.mediaCache.set(id, fakeMedia);
    return fakeMedia;
  }

  // Create realistic chat message with media
  createMediaMessage(
    senderId: string,
    senderName: string,
    content: string,
    mediaType: MediaAsset["type"],
    scenario: string,
    emotion: string,
    isViral: boolean = false,
  ): ChatMessage {
    const media = this.generateFakeMedia(mediaType, scenario, emotion);

    return {
      id: this.generateId(),
      senderId,
      senderName,
      senderAvatar: this.getAvatarForSender(senderId),
      content,
      timestamp: Date.now(),
      messageType: mediaType,
      media: [media],
      status: "delivered",
      emotion,
      isCliffhanger: isViral,
      viralMoment: isViral,
      reactions: isViral ? this.generateViralReactions() : [],
      engagement: isViral
        ? {
            screenshots: Math.floor(Math.random() * 500) + 100,
            shares: Math.floor(Math.random() * 200) + 50,
            reactions: Math.floor(Math.random() * 1000) + 200,
          }
        : undefined,
    };
  }

  // Process and optimize media for chat
  async processMedia(
    file: File,
    type: MediaAsset["type"],
  ): Promise<MediaAsset> {
    const id = this.generateId();

    // In real implementation, this would:
    // 1. Upload to cloud storage
    // 2. Generate thumbnails
    // 3. Compress media
    // 4. Extract metadata
    // 5. Run content moderation

    const processedMedia: MediaAsset = {
      id,
      type,
      url: URL.createObjectURL(file), // Temporary URL
      size: file.size,
      filename: file.name,
      mimeType: file.type,
      uploadedAt: new Date().toISOString(),
      isProcessing: true,
      metadata: {},
    };

    // Simulate processing
    setTimeout(() => {
      processedMedia.isProcessing = false;
    }, 2000);

    return processedMedia;
  }

  // Generate realistic viral reactions
  private generateViralReactions(): MessageReaction[] {
    const reactions = ["😱", "😡", "💔", "😭", "🤯", "👀", "🔥"];
    const users = [
      "Sarah M.",
      "Mike_K",
      "jenny_2024",
      "alex_the_great",
      "mom_of_3",
    ];

    return reactions
      .slice(0, Math.floor(Math.random() * 4) + 2)
      .map((emoji) => ({
        emoji,
        userId: this.generateId(),
        userName: users[Math.floor(Math.random() * users.length)],
        timestamp: Date.now() - Math.random() * 3600000, // Last hour
      }));
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private generateFakeUrl(type: MediaAsset["type"], scenario: string): string {
    // In real app, these would be actual media files
    const baseUrl = "/fake-media/";
    const scenarios = scenario.toLowerCase().replace(/ /g, "-");
    return `${baseUrl}${type}/${scenarios}-${this.generateId()}.${this.getFileExtension(type)}`;
  }

  private generateThumbnailUrl(mediaId: string): string {
    return `/thumbnails/${mediaId}-thumb.jpg`;
  }

  private estimateSize(type: MediaAsset["type"]): number {
    const sizes = {
      image: Math.floor(Math.random() * 3000000) + 500000, // 0.5-3.5MB
      audio: Math.floor(Math.random() * 5000000) + 1000000, // 1-6MB
      video: Math.floor(Math.random() * 50000000) + 10000000, // 10-60MB
      location: 1024, // Small JSON
      contact: 2048, // Small vCard
      document: Math.floor(Math.random() * 10000000) + 100000, // 0.1-10MB
    };
    return sizes[type];
  }

  private generateFilename(type: MediaAsset["type"], scenario: string): string {
    const timestamp = new Date().toISOString().slice(0, 10);
    const cleanScenario = scenario.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const ext = this.getFileExtension(type);
    return `${cleanScenario}-${timestamp}.${ext}`;
  }

  private getFileExtension(type: MediaAsset["type"]): string {
    const extensions = {
      image: "jpg",
      audio: "mp3",
      video: "mp4",
      location: "json",
      contact: "vcf",
      document: "pdf",
    };
    return extensions[type];
  }

  private getMimeType(type: MediaAsset["type"]): string {
    const mimeTypes = {
      image: "image/jpeg",
      audio: "audio/mpeg",
      video: "video/mp4",
      location: "application/json",
      contact: "text/vcard",
      document: "application/pdf",
    };
    return mimeTypes[type];
  }

  private generateAudioDuration(scenario: string): number {
    // Different scenarios have different typical durations
    if (scenario.includes("argument") || scenario.includes("confrontation")) {
      return Math.floor(Math.random() * 180) + 30; // 30s - 3m
    }
    if (scenario.includes("voice note") || scenario.includes("message")) {
      return Math.floor(Math.random() * 60) + 10; // 10s - 1m
    }
    return Math.floor(Math.random() * 120) + 15; // 15s - 2m
  }

  private generateVideoDuration(scenario: string): number {
    if (scenario.includes("evidence") || scenario.includes("proof")) {
      return Math.floor(Math.random() * 60) + 10; // 10s - 1m
    }
    if (scenario.includes("confrontation")) {
      return Math.floor(Math.random() * 300) + 60; // 1m - 5m
    }
    return Math.floor(Math.random() * 180) + 30; // 30s - 3m
  }

  private generateFakeLocation(scenario: string): {
    lat: number;
    lng: number;
    address: string;
  } {
    // Generate realistic but fake locations
    const locations = [
      {
        lat: 40.7589,
        lng: -73.9851,
        address: "Times Square, New York, NY",
      },
      {
        lat: 34.0522,
        lng: -118.2437,
        address: "Downtown Los Angeles, CA",
      },
      {
        lat: 41.8781,
        lng: -87.6298,
        address: "Chicago Loop, Chicago, IL",
      },
    ];

    const location = locations[Math.floor(Math.random() * locations.length)];

    // Add some random variance
    return {
      lat: location.lat + (Math.random() - 0.5) * 0.01,
      lng: location.lng + (Math.random() - 0.5) * 0.01,
      address: location.address,
    };
  }

  private calculateViralPotential(
    scenario: string,
    type: MediaAsset["type"],
  ): number {
    let score = 50;

    // Type bonus
    if (type === "video") score += 20;
    else if (type === "audio") score += 15;
    else if (type === "image") score += 10;

    // Scenario analysis
    const viralKeywords = [
      "affair",
      "evidence",
      "caught",
      "secret",
      "confrontation",
      "betrayal",
      "scandal",
    ];

    const matches = viralKeywords.filter((keyword) =>
      scenario.toLowerCase().includes(keyword),
    ).length;

    score += matches * 8;

    return Math.min(score, 100);
  }

  private getAvatarForSender(senderId: string): string {
    // Simple avatar assignment based on sender ID
    const avatars = ["👧", "👩", "👨", "👦", "👴", "👵", "👱‍♀️", "👱‍♂️"];
    const index = senderId.length % avatars.length;
    return avatars[index];
  }
}

// Export singleton instance
export const chatMediaHandler = new ChatMediaHandler();

// Utility functions for story creators
export function createViralImageMessage(
  sender: string,
  content: string,
  scenario: string,
): ChatMessage {
  return chatMediaHandler.createMediaMessage(
    sender,
    sender,
    content,
    "image",
    scenario,
    "shocked",
    true,
  );
}

export function createEmotionalAudioMessage(
  sender: string,
  content: string,
  emotion: string,
): ChatMessage {
  return chatMediaHandler.createMediaMessage(
    sender,
    sender,
    content,
    "audio",
    "emotional voice note",
    emotion,
    false,
  );
}

export function createEvidenceVideoMessage(
  sender: string,
  content: string,
  scenario: string,
): ChatMessage {
  return chatMediaHandler.createMediaMessage(
    sender,
    sender,
    content,
    "video",
    scenario,
    "devastating",
    true,
  );
}
