import React, { createContext, useContext, useEffect, useState } from "react";
import {
  db,
  User,
  Story,
  Notification,
  Bookmark,
  ReadingProgress,
} from "@/lib/database";

interface DatabaseContextType {
  isInitialized: boolean;
  currentUser: User | null;

  // User operations
  createUser: (userData: Omit<User, "id" | "createdAt">) => Promise<User>;
  loginUser: (email: string) => Promise<User | null>;
  updateUser: (updates: Partial<User>) => Promise<void>;

  // Story operations
  createStory: (
    storyData: Omit<Story, "id" | "createdAt" | "updatedAt" | "stats">,
  ) => Promise<Story>;
  getStory: (id: string) => Promise<Story | undefined>;
  getTrendingStories: () => Promise<Story[]>;
  getMyStories: () => Promise<Story[]>;
  searchStories: (query: string) => Promise<Story[]>;

  // Notification operations
  notifications: Notification[];
  unreadCount: number;
  createNotification: (
    data: Omit<Notification, "id" | "createdAt">,
  ) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;

  // Bookmark operations
  bookmarks: Bookmark[];
  addBookmark: (storyId: string, note?: string) => Promise<void>;
  removeBookmark: (storyId: string) => Promise<void>;
  refreshBookmarks: () => Promise<void>;

  // Reading progress
  saveProgress: (
    storyId: string,
    progress: number,
    position: string,
    chapterId?: string,
  ) => Promise<void>;
  getProgress: (storyId: string) => Promise<ReadingProgress | undefined>;

  // Utility operations
  incrementViews: (storyId: string) => Promise<void>;
  exportData: () => Promise<string>;
  clearData: () => Promise<void>;
}

// Create a default context value to prevent undefined errors
const defaultContextValue: DatabaseContextType = {
  isInitialized: false,
  currentUser: null,
  createUser: async () => ({}) as User,
  loginUser: async () => null,
  updateUser: async () => {},
  createStory: async () => ({}) as Story,
  getStory: async () => undefined,
  getTrendingStories: async () => [],
  getMyStories: async () => [],
  searchStories: async () => [],
  notifications: [],
  unreadCount: 0,
  createNotification: async () => {},
  markAsRead: async () => {},
  refreshNotifications: async () => {},
  bookmarks: [],
  addBookmark: async () => {},
  removeBookmark: async () => {},
  refreshBookmarks: async () => {},
  saveProgress: async () => {},
  getProgress: async () => undefined,
  incrementViews: async () => {},
  exportData: async () => "",
  clearData: async () => {},
};

const DatabaseContext = createContext<DatabaseContextType>(defaultContextValue);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  // Safe useState calls with error handling
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [bookmarks, setBookmarks] = React.useState<Bookmark[]>([]);

  // Initialize database
  useEffect(() => {
    const initDB = async () => {
      try {
        await db.init();
        setIsInitialized(true);

        // Try to get current user from localStorage
        const savedUserId = localStorage.getItem("chatlure-user-id");
        if (savedUserId) {
          const user = await db.getUser(savedUserId);
          if (user) {
            setCurrentUser(user);
            await refreshNotifications();
            await refreshBookmarks();
          }
        } else {
          // Create demo user if none exists
          await createDemoUser();
        }
      } catch (error) {
        console.error("Failed to initialize database:", error);
      }
    };

    initDB();
  }, []);

  const createDemoUser = async () => {
    try {
      const demoUser = await db.createUser({
        username: "VoyeurMaster",
        email: "demo@chatlure.app",
        isPremium: false,
        lastSeen: new Date(),
        preferences: {
          notifications: true,
          soundEnabled: true,
          theme: "dark",
          autoPlay: true,
        },
      });

      setCurrentUser(demoUser);
      localStorage.setItem("chatlure-user-id", demoUser.id);

      // Create some demo stories and notifications
      await createDemoData(demoUser.id);
    } catch (error) {
      console.error("Failed to create demo user:", error);
    }
  };

  const createDemoData = async (userId: string) => {
    try {
      // Create demo stories
      const stories = [
        {
          title: "Coffee Shop Chronicles",
          description: "A tale of love, betrayal, and caffeine addiction",
          content:
            "It all started on a Tuesday morning when Sarah walked into the coffee shop...",
          authorId: userId,
          category: "romance" as const,
          tags: ["coffee", "love", "drama"],
          status: "published" as const,
          visibility: "public" as const,
          readingTime: 15,
          chapters: [],
        },
        {
          title: "University Scandal",
          description: "The shocking truth behind the perfect campus couple",
          content:
            "Everyone thought Jake and Emma were the perfect couple, but secrets have a way of surfacing...",
          authorId: userId,
          category: "scandal" as const,
          tags: ["university", "betrayal", "secrets"],
          status: "published" as const,
          visibility: "public" as const,
          readingTime: 22,
          chapters: [],
        },
        {
          title: "Office Romance Gone Wrong",
          description: "When workplace relationships turn messy",
          content:
            "The quarterly report meeting turned into something nobody expected...",
          authorId: userId,
          category: "drama" as const,
          tags: ["office", "romance", "drama"],
          status: "published" as const,
          visibility: "public" as const,
          readingTime: 18,
          chapters: [],
        },
      ];

      for (const storyData of stories) {
        await db.createStory(storyData);
      }

      // Create demo notifications
      await db.createNotification({
        userId,
        type: "story_update",
        title: "New Story Alert",
        message: "Your story 'Coffee Shop Chronicles' is trending!",
        isRead: false,
      });

      await db.createNotification({
        userId,
        type: "system",
        title: "Welcome to ChatLure",
        message: "Start exploring dramatic stories in your area!",
        isRead: false,
      });

      await refreshNotifications();
    } catch (error) {
      console.error("Failed to create demo data:", error);
    }
  };

  const createUser = async (userData: Omit<User, "id" | "createdAt">) => {
    const user = await db.createUser(userData);
    setCurrentUser(user);
    localStorage.setItem("chatlure-user-id", user.id);
    return user;
  };

  const loginUser = async (email: string) => {
    const user = await db.getUserByEmail(email);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem("chatlure-user-id", user.id);
      await refreshNotifications();
      await refreshBookmarks();
    }
    return user || null;
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!currentUser) return;

    await db.updateUser(currentUser.id, updates);
    const updatedUser = await db.getUser(currentUser.id);
    if (updatedUser) {
      setCurrentUser(updatedUser);
    }
  };

  const createStory = async (
    storyData: Omit<Story, "id" | "createdAt" | "updatedAt" | "stats">,
  ) => {
    return await db.createStory(storyData);
  };

  const getStory = async (id: string) => {
    return await db.getStory(id);
  };

  const getTrendingStories = async () => {
    return await db.getTrendingStories();
  };

  const getMyStories = async () => {
    if (!currentUser) return [];
    return await db.getStoriesByAuthor(currentUser.id);
  };

  const searchStories = async (query: string) => {
    return await db.searchStories(query);
  };

  const createNotification = async (
    data: Omit<Notification, "id" | "createdAt">,
  ) => {
    await db.createNotification(data);
    await refreshNotifications();
  };

  const markAsRead = async (id: string) => {
    await db.markNotificationAsRead(id);
    await refreshNotifications();
  };

  const refreshNotifications = async () => {
    if (!currentUser) return;

    const userNotifications = await db.getNotifications(currentUser.id);
    setNotifications(userNotifications);

    const unread = await db.getUnreadNotificationCount(currentUser.id);
    setUnreadCount(unread);
  };

  const addBookmark = async (storyId: string, note?: string) => {
    if (!currentUser) return;

    await db.createBookmark({
      userId: currentUser.id,
      storyId,
      note,
    });
    await refreshBookmarks();
  };

  const removeBookmark = async (storyId: string) => {
    if (!currentUser) return;

    await db.removeBookmark(currentUser.id, storyId);
    await refreshBookmarks();
  };

  const refreshBookmarks = async () => {
    if (!currentUser) return;

    const userBookmarks = await db.getBookmarks(currentUser.id);
    setBookmarks(userBookmarks);
  };

  const saveProgress = async (
    storyId: string,
    progress: number,
    position: string,
    chapterId?: string,
  ) => {
    if (!currentUser) return;

    await db.saveReadingProgress({
      userId: currentUser.id,
      storyId,
      chapterId,
      progress,
      lastPosition: position,
    });
  };

  const getProgress = async (storyId: string) => {
    if (!currentUser) return undefined;

    return await db.getReadingProgress(currentUser.id, storyId);
  };

  const incrementViews = async (storyId: string) => {
    await db.incrementStoryViews(storyId);
  };

  const exportData = async () => {
    return await db.exportData();
  };

  const clearData = async () => {
    await db.clearAllData();
    setCurrentUser(null);
    setNotifications([]);
    setUnreadCount(0);
    setBookmarks([]);
    localStorage.removeItem("chatlure-user-id");
  };

  const value: DatabaseContextType = {
    isInitialized,
    currentUser,
    createUser,
    loginUser,
    updateUser,
    createStory,
    getStory,
    getTrendingStories,
    getMyStories,
    searchStories,
    notifications,
    unreadCount,
    createNotification,
    markAsRead,
    refreshNotifications,
    bookmarks,
    addBookmark,
    removeBookmark,
    refreshBookmarks,
    saveProgress,
    getProgress,
    incrementViews,
    exportData,
    clearData,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context || context === defaultContextValue) {
    throw new Error(
      "useDatabase must be used within a DatabaseProvider. Make sure your component is wrapped with <DatabaseProvider>.",
    );
  }
  return context;
}
