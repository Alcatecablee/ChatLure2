// Enhanced Reddit to ChatLure Content Strategy

export interface RedditSource {
  subreddit: string;
  members: string;
  category: string;
  viralPotential: number;
  contentTypes: string[];
  avgUpvotes: number;
  bestTimeToPost: string;
  commonFormats: string[];
}

export interface ContentTemplate {
  title: string;
  genre: string;
  scenario: string;
  characters: string[];
  plotStructure: string[];
  viralTriggers: string[];
  estimatedMessages: number;
  estimatedDuration: string;
}

export const TOP_REDDIT_SOURCES: RedditSource[] = [
  {
    subreddit: "r/insaneparents",
    members: "1.2M",
    category: "family",
    viralPotential: 95,
    contentTypes: ["Text conversations", "Screenshots", "Family conflicts"],
    avgUpvotes: 8500,
    bestTimeToPost: "Evening EST",
    commonFormats: [
      "Parent discovery",
      "Secret relationships",
      "Strict rules",
      "Punishment threats",
    ],
  },
  {
    subreddit: "r/relationship_advice",
    members: "3.2M",
    category: "drama",
    viralPotential: 88,
    contentTypes: ["Affair stories", "Breakup drama", "Cheating evidence"],
    avgUpvotes: 12000,
    bestTimeToPost: "Weekend mornings",
    commonFormats: [
      "Suspicious behavior",
      "Evidence discovery",
      "Confrontation",
      "Aftermath",
    ],
  },
  {
    subreddit: "r/AmItheAsshole",
    members: "4.8M",
    category: "moral",
    viralPotential: 92,
    contentTypes: ["Moral dilemmas", "Social conflicts", "Justice stories"],
    avgUpvotes: 15000,
    bestTimeToPost: "Weekday evenings",
    commonFormats: [
      "Setup situation",
      "Moral question",
      "Different perspectives",
      "Judgment",
    ],
  },
  {
    subreddit: "r/ChoosingBeggars",
    members: "2.8M",
    category: "entitled",
    viralPotential: 85,
    contentTypes: [
      "Entitled behavior",
      "Unreasonable demands",
      "Business interactions",
    ],
    avgUpvotes: 7800,
    bestTimeToPost: "Weekday lunch",
    commonFormats: [
      "Initial request",
      "Escalating demands",
      "Unreasonable expectations",
      "Rejection reaction",
    ],
  },
  {
    subreddit: "r/entitledparents",
    members: "2.1M",
    category: "family",
    viralPotential: 90,
    contentTypes: [
      "Helicopter parents",
      "Public meltdowns",
      "Demanding behavior",
    ],
    avgUpvotes: 9200,
    bestTimeToPost: "Weekend afternoons",
    commonFormats: [
      "Setup encounter",
      "Entitled demand",
      "Escalation",
      "Authority intervention",
    ],
  },
  {
    subreddit: "r/TrueOffMyChest",
    members: "1.8M",
    category: "confession",
    viralPotential: 87,
    contentTypes: ["Secret confessions", "Hidden truths", "Emotional releases"],
    avgUpvotes: 6700,
    bestTimeToPost: "Late night",
    commonFormats: [
      "Confession setup",
      "Background story",
      "The truth revealed",
      "Emotional impact",
    ],
  },
];

export const VIRAL_CONTENT_TEMPLATES: ContentTemplate[] = [
  {
    title: "Parent Phone Invasion",
    genre: "family",
    scenario:
      "Strict parent discovers teenager's secret relationship by going through phone",
    characters: [
      "Teenager (protagonist)",
      "Best friend (support)",
      "Parent (antagonist)",
      "Secret boyfriend/girlfriend",
    ],
    plotStructure: [
      "Normal day conversation",
      "Parent becomes suspicious",
      "Phone confiscation/search",
      "Discovery of evidence",
      "Confrontation threat",
      "Panic and damage control",
      "Escalation",
      "Cliffhanger resolution",
    ],
    viralTriggers: [
      "Privacy violation",
      "Secret relationship exposure",
      "Parental control extremes",
      "Teen rebellion",
      "Authority vs freedom conflict",
    ],
    estimatedMessages: 24,
    estimatedDuration: "25 minutes",
  },
  {
    title: "Affair Discovery Technology",
    genre: "scandal",
    scenario:
      "Spouse discovers affair through technology (smart watch, cloud sync, etc.)",
    characters: [
      "Betrayed spouse (protagonist)",
      "Cheating partner (antagonist)",
      "Affair partner",
      "Confidant friend",
    ],
    plotStructure: [
      "Suspicious behavior noticed",
      "Technology accidentally reveals evidence",
      "Shock and disbelief",
      "Gathering more evidence",
      "Internal conflict about confrontation",
      "Planning next steps",
      "Evidence compilation",
      "Decision point cliffhanger",
    ],
    viralTriggers: [
      "Technology betrayal",
      "Accidental discovery",
      "Marriage destruction",
      "Evidence accumulation",
      "Revenge planning",
    ],
    estimatedMessages: 31,
    estimatedDuration: "32 minutes",
  },
  {
    title: "Wedding Disaster Drama",
    genre: "drama",
    scenario: "Wedding planning or wedding day disaster with family/friends",
    characters: [
      "Bride/Groom (protagonist)",
      "Problem family member (antagonist)",
      "Wedding planner/friend (support)",
      "Partner",
    ],
    plotStructure: [
      "Wedding preparation going well",
      "First sign of trouble",
      "Problem escalates",
      "Attempts to resolve diplomatically",
      "Situation gets worse",
      "Emergency planning",
      "Disaster unfolds",
      "Aftermath decisions",
    ],
    viralTriggers: [
      "Special day ruined",
      "Family drama explosion",
      "Public embarrassment",
      "Financial implications",
      "Relationship testing",
    ],
    estimatedMessages: 28,
    estimatedDuration: "30 minutes",
  },
  {
    title: "Inheritance Battle Revealed",
    genre: "money",
    scenario: "Family member discovers manipulation in inheritance/will",
    characters: [
      "Honest family member (protagonist)",
      "Manipulative relative (antagonist)",
      "Deceased person",
      "Lawyer/advisor",
    ],
    plotStructure: [
      "Initial inheritance news",
      "Something seems off",
      "Investigation begins",
      "Evidence of manipulation found",
      "Confronting the manipulator",
      "Legal implications discussed",
      "Family division",
      "Battle lines drawn",
    ],
    viralTriggers: [
      "Money corruption",
      "Family betrayal",
      "Legal drama",
      "Justice vs greed",
      "Hidden manipulation exposed",
    ],
    estimatedMessages: 22,
    estimatedDuration: "28 minutes",
  },
];

export const REDDIT_TO_CHATLURE_CONVERSION = {
  // Common Reddit patterns and how to convert them
  patterns: {
    UPDATE: "Convert to new message thread or continuation",
    EDIT: "Add as clarification message or separate thread",
    "TL;DR": "Use as story summary or hook message",
    "Throwaway account": "Indicates high drama potential",
    "I don't know what to do": "Perfect for advice-seeking format",
    "My (age/gender)": "Character setup for ChatLure",
    "This happened today": "Real-time messaging format perfect",
  },

  conversionSteps: [
    "1. Extract main characters and relationships",
    "2. Identify the central conflict/drama",
    "3. Break story into message-sized chunks",
    "4. Add realistic timing delays between messages",
    "5. Insert emotional reactions and cliffhangers",
    "6. Create supporting character responses",
    "7. Add multimedia elements (photos, voice notes)",
    "8. Build to viral moments and resolutions",
  ],

  enhancementTechniques: [
    "Add typing indicators for realism",
    "Include read receipts for tension",
    "Use emoji reactions for emotional impact",
    "Create group chat dynamics when applicable",
    "Add time stamps for authenticity",
    "Include location sharing for context",
    "Use voice messages for emotional moments",
    "Add photo evidence for viral impact",
  ],
};

export const VIRAL_MESSAGE_TEMPLATES = {
  openingHooks: [
    "I can't believe what just happened...",
    "I think my life is falling apart",
    "I need to tell someone this before I explode",
    "Something happened today that changed everything",
    "I found something that I wasn't supposed to see",
    "My whole world just came crashing down",
    "I don't know who else to talk to about this",
    "This is going to sound crazy but...",
    "I'm literally shaking right now",
    "I need advice and I need it fast",
  ],

  evidenceReveal: [
    "I have the screenshots to prove it",
    "Wait until you see what I found",
    "The evidence is right here in front of me",
    "I caught them red-handed",
    "There's no denying it anymore",
    "I have it all on camera",
    "The messages speak for themselves",
    "I found the smoking gun",
    "This proves everything I suspected",
    "I wish I never saw this",
  ],

  cliffhangers: [
    "Wait... there's more",
    "But that's not even the worst part",
    "I haven't told you the really bad news yet",
    "And then I discovered something even worse",
    "Just when I thought it couldn't get worse...",
    "But wait, it gets even more messed up",
    "That was just the beginning",
    "I'm not ready to tell you what happened next",
    "There's something else I need to tell you",
    "Hold on, someone's calling me...",
  ],

  viralMoments: [
    "I can't believe this is my life right now",
    "This is like something out of a movie",
    "I never thought this would happen to me",
    "This is the most insane thing ever",
    "I can't even process what's happening",
    "This changes absolutely everything",
    "My life will never be the same",
    "This is beyond anything I could imagine",
    "I feel like I'm in a nightmare",
    "This is the scandal of the century",
  ],
};

export const CONTENT_SOURCING_AUTOMATION = {
  // Keywords to search for high-viral content
  highValueKeywords: [
    "UPDATE:",
    "URGENT:",
    "I can't believe",
    "This just happened",
    "My husband/wife",
    "My mom/dad",
    "I found out",
    "Caught",
    "Affair",
    "Cheating",
    "Inheritance",
    "Will",
    "Money",
    "Wedding",
    "Divorce",
    "Pregnant",
    "Secret",
    "Hidden",
    "Betrayed",
    "Discovered",
    "Evidence",
    "Screenshots",
  ],

  // Indicators of high engagement potential
  engagementIndicators: [
    "Multiple updates",
    "High comment-to-upvote ratio",
    "Emotional language",
    "Specific details and evidence",
    "Timeline of events",
    "Multiple parties involved",
    "Legal/financial implications",
    "Family/relationship dynamics",
  ],

  // Red flags to avoid
  avoidContent: [
    "Obvious fake stories",
    "Repetitive content",
    "Low engagement",
    "Controversial political content",
    "Harmful/dangerous situations",
    "Copyright issues",
    "Personal information leakage",
  ],
};

export function analyzeRedditPostViralPotential(post: {
  title: string;
  content: string;
  upvotes: number;
  comments: number;
  subreddit: string;
  age: string;
}): number {
  let score = 50; // Base score

  // Upvote analysis
  if (post.upvotes > 10000) score += 20;
  else if (post.upvotes > 5000) score += 15;
  else if (post.upvotes > 1000) score += 10;

  // Comment engagement
  const commentRatio = post.comments / post.upvotes;
  if (commentRatio > 0.1)
    score += 15; // High engagement
  else if (commentRatio > 0.05) score += 10;

  // Content analysis
  const viralKeywords = [
    "affair",
    "cheating",
    "betrayed",
    "discovered",
    "secret",
    "inheritance",
    "money",
    "family",
    "wedding",
    "divorce",
    "pregnant",
    "caught",
    "evidence",
    "screenshots",
  ];

  const keywordMatches = viralKeywords.filter(
    (keyword) =>
      post.title.toLowerCase().includes(keyword) ||
      post.content.toLowerCase().includes(keyword),
  ).length;

  score += keywordMatches * 5;

  // Subreddit bonus
  const highValueSubs = [
    "insaneparents",
    "relationship_advice",
    "AmItheAsshole",
  ];
  if (highValueSubs.some((sub) => post.subreddit.includes(sub))) {
    score += 10;
  }

  // Recency bonus
  const hoursOld = parseInt(post.age);
  if (hoursOld < 24) score += 5;

  return Math.min(score, 100);
}

export function convertRedditToMessages(
  title: string,
  content: string,
  subreddit: string,
): Array<{
  sender: string;
  message: string;
  delay: number;
  emotion: string;
  isCliffhanger: boolean;
}> {
  // This is a simplified version - in real implementation,
  // you'd use NLP/AI to properly parse and convert content

  const messages = [];

  // Opening hook
  messages.push({
    sender: "User",
    message: `I need to tell someone about this... ${title}`,
    delay: 0,
    emotion: "anxious",
    isCliffhanger: true,
  });

  // Friend response
  messages.push({
    sender: "Friend",
    message: "OMG what happened?? Tell me everything!",
    delay: 120000, // 2 minutes
    emotion: "concerned",
    isCliffhanger: false,
  });

  // Story unfolds
  const contentChunks = content.split(".").slice(0, 3);
  contentChunks.forEach((chunk, index) => {
    if (chunk.trim()) {
      messages.push({
        sender: "User",
        message:
          chunk.trim() + (index === contentChunks.length - 1 ? "..." : "."),
        delay: (index + 1) * 180000, // 3 minutes apart
        emotion:
          index === contentChunks.length - 1 ? "devastated" : "explaining",
        isCliffhanger: index === contentChunks.length - 1,
      });
    }
  });

  return messages;
}
