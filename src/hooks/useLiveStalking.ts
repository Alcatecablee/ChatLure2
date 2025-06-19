import { useState, useEffect, useCallback } from "react";

export interface StalkerReaction {
  id: string;
  emoji: string;
  timestamp: number;
  anonymous: boolean;
}

export interface LiveSession {
  chatId: string;
  viewerCount: number;
  peakViewers: number;
  reactions: StalkerReaction[];
  isLive: boolean;
  hotness: number; // 1-100 based on activity
  trendingRank?: number;
}

export interface StalkerProfile {
  id: string;
  anonymousName: string;
  level: number;
  timeSpentStalking: number;
  reactionsGiven: number;
}

export function useLiveStalking() {
  const [liveSessions, setLiveSessions] = useState<Record<string, LiveSession>>(
    {},
  );
  const [currentStalkers, setCurrentStalkers] = useState<StalkerProfile[]>([]);
  const [myProfile] = useState<StalkerProfile>(() => ({
    id: `stalker_${Date.now()}`,
    anonymousName: generateAnonymousName(),
    level: Math.floor(Math.random() * 50) + 1,
    timeSpentStalking: Math.floor(Math.random() * 1000),
    reactionsGiven: Math.floor(Math.random() * 500),
  }));

  // Initialize live sessions for different chats
  useEffect(() => {
    const initialSessions: Record<string, LiveSession> = {
      "1": {
        chatId: "1",
        viewerCount: Math.floor(Math.random() * 2000) + 500,
        peakViewers: Math.floor(Math.random() * 3000) + 1000,
        reactions: [],
        isLive: true,
        hotness: 95,
        trendingRank: 1,
      },
      "2": {
        chatId: "2",
        viewerCount: Math.floor(Math.random() * 800) + 200,
        peakViewers: Math.floor(Math.random() * 1200) + 400,
        reactions: [],
        isLive: true,
        hotness: 72,
        trendingRank: 3,
      },
      "3": {
        chatId: "3",
        viewerCount: Math.floor(Math.random() * 1500) + 300,
        peakViewers: Math.floor(Math.random() * 2000) + 800,
        reactions: [],
        isLive: true,
        hotness: 88,
        trendingRank: 2,
      },
      "4": {
        chatId: "4",
        viewerCount: Math.floor(Math.random() * 400) + 100,
        peakViewers: Math.floor(Math.random() * 600) + 200,
        reactions: [],
        isLive: true,
        hotness: 45,
      },
    };

    setLiveSessions(initialSessions);
  }, []);

  // Simulate real-time viewer fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveSessions((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((chatId) => {
          const session = updated[chatId];
          // Realistic viewer fluctuations based on hotness
          const fluctuation = Math.floor(
            (Math.random() - 0.5) * (session.hotness / 10),
          );
          const newViewerCount = Math.max(1, session.viewerCount + fluctuation);

          updated[chatId] = {
            ...session,
            viewerCount: newViewerCount,
            peakViewers: Math.max(session.peakViewers, newViewerCount),
          };
        });
        return updated;
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Generate random stalker reactions
  useEffect(() => {
    const interval = setInterval(() => {
      const chatIds = Object.keys(liveSessions);
      const randomChatId = chatIds[Math.floor(Math.random() * chatIds.length)];

      if (liveSessions[randomChatId] && Math.random() < 0.3) {
        addReaction(randomChatId, getRandomReaction());
      }
    }, 4000); // Random reactions every 4 seconds

    return () => clearInterval(interval);
  }, [liveSessions]);

  const joinSession = useCallback((chatId: string) => {
    setLiveSessions((prev) => ({
      ...prev,
      [chatId]: {
        ...prev[chatId],
        viewerCount: prev[chatId].viewerCount + 1,
      },
    }));
  }, []);

  const leaveSession = useCallback((chatId: string) => {
    setLiveSessions((prev) => ({
      ...prev,
      [chatId]: {
        ...prev[chatId],
        viewerCount: Math.max(1, prev[chatId].viewerCount - 1),
      },
    }));
  }, []);

  const addReaction = useCallback((chatId: string, emoji: string) => {
    const reaction: StalkerReaction = {
      id: `reaction_${Date.now()}_${Math.random()}`,
      emoji,
      timestamp: Date.now(),
      anonymous: true,
    };

    setLiveSessions((prev) => ({
      ...prev,
      [chatId]: {
        ...prev[chatId],
        reactions: [...(prev[chatId]?.reactions || []), reaction].slice(-50), // Keep last 50 reactions
      },
    }));

    // Remove reaction after 5 seconds
    setTimeout(() => {
      setLiveSessions((prev) => ({
        ...prev,
        [chatId]: {
          ...prev[chatId],
          reactions:
            prev[chatId]?.reactions.filter((r) => r.id !== reaction.id) || [],
        },
      }));
    }, 5000);
  }, []);

  const getTrendingChats = useCallback(() => {
    return Object.values(liveSessions)
      .sort((a, b) => b.hotness - a.hotness)
      .slice(0, 3);
  }, [liveSessions]);

  return {
    liveSessions,
    currentStalkers,
    myProfile,
    joinSession,
    leaveSession,
    addReaction,
    getTrendingChats,
  };
}

function generateAnonymousName(): string {
  const adjectives = [
    "Secret",
    "Silent",
    "Hidden",
    "Shadow",
    "Mystery",
    "Curious",
    "Sneaky",
    "Ghost",
    "Phantom",
    "Invisible",
  ];
  const nouns = [
    "Stalker",
    "Watcher",
    "Observer",
    "Spy",
    "Detective",
    "Voyeur",
    "Lurker",
    "Hunter",
    "Seeker",
    "Scout",
  ];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 999) + 1;

  return `${adj}${noun}${number}`;
}

function getRandomReaction(): string {
  const reactions = [
    "😱",
    "🔥",
    "💀",
    "👀",
    "😮",
    "🤐",
    "💯",
    "⚡",
    "🙊",
    "🎭",
    "🔪",
    "💔",
    "👑",
    "🕵️",
    "🤯",
    "😈",
  ];
  return reactions[Math.floor(Math.random() * reactions.length)];
}
