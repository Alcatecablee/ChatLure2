import React, { createContext, useContext, useReducer, useEffect } from "react";

// Types
export interface Story {
  id: string;
  title: string;
  genre: string;
  description: string;
  characters: Character[];
  plotPoints: PlotPoint[];
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  stats: StoryStats;
  viralScore: number;
  source: "original" | "reddit" | "imported";
}

export interface Character {
  id: string;
  name: string;
  avatar: string;
  role: "protagonist" | "antagonist" | "supporting";
  personality: string;
  secrets: string[];
}

export interface PlotPoint {
  id: string;
  trigger: "time" | "user_action" | "previous_message";
  delay: number;
  message: string;
  sender: string;
  emotions: string[];
  cliffhanger: boolean;
  viralMoment: boolean;
  messageType: "text" | "image" | "audio" | "video" | "location" | "contact";
  media?: any[];
}

export interface StoryStats {
  views: number;
  completions: number;
  shares: number;
  avgRating: number;
  completionRate: number;
}

export interface AppCredentials {
  reddit: {
    clientId: string;
    clientSecret: string;
    userAgent: string;
    enabled: boolean;
  };
  clerk: {
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
    enabled: boolean;
  };
  paypal: {
    clientId: string;
    clientSecret: string;
    planId: string;
    environment: "sandbox" | "production";
    enabled: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  lastActive: string;
  subscription: {
    status: "free" | "premium" | "cancelled";
    plan?: string;
    expiresAt?: string;
  };
}

interface AppState {
  stories: Story[];
  users: User[];
  credentials: AppCredentials;
  activeStory: Story | null;
  isLoading: boolean;
  notifications: Notification[];
}

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

type AppAction =
  | { type: "SET_STORIES"; payload: Story[] }
  | { type: "ADD_STORY"; payload: Story }
  | { type: "UPDATE_STORY"; payload: Story }
  | { type: "DELETE_STORY"; payload: string }
  | { type: "SET_ACTIVE_STORY"; payload: Story | null }
  | { type: "SET_USERS"; payload: User[] }
  | { type: "UPDATE_CREDENTIALS"; payload: AppCredentials }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "MARK_NOTIFICATION_READ"; payload: string }
  | { type: "IMPORT_STORIES"; payload: Story[] };

// Initial state
const initialState: AppState = {
  stories: [],
  users: [],
  credentials: {
    reddit: {
      clientId: "",
      clientSecret: "",
      userAgent: "ChatLure:v1.0",
      enabled: false,
    },
    clerk: {
      publishableKey: "",
      secretKey: "",
      webhookSecret: "",
      enabled: false,
    },
    paypal: {
      clientId: "",
      clientSecret: "",
      planId: "",
      environment: "sandbox",
      enabled: false,
    },
  },
  activeStory: null,
  isLoading: false,
  notifications: [],
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_STORIES":
      return { ...state, stories: action.payload };

    case "ADD_STORY":
      const newStories = [...state.stories, action.payload];
      // Save to localStorage
      localStorage.setItem("chatlure_stories", JSON.stringify(newStories));
      return { ...state, stories: newStories };

    case "UPDATE_STORY":
      const updatedStories = state.stories.map((story) =>
        story.id === action.payload.id ? action.payload : story,
      );
      localStorage.setItem("chatlure_stories", JSON.stringify(updatedStories));
      return { ...state, stories: updatedStories };

    case "DELETE_STORY":
      const filteredStories = state.stories.filter(
        (story) => story.id !== action.payload,
      );
      localStorage.setItem("chatlure_stories", JSON.stringify(filteredStories));
      return { ...state, stories: filteredStories };

    case "SET_ACTIVE_STORY":
      return { ...state, activeStory: action.payload };

    case "SET_USERS":
      return { ...state, users: action.payload };

    case "UPDATE_CREDENTIALS":
      return { ...state, credentials: action.payload };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };

    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((notif) =>
          notif.id === action.payload ? { ...notif, isRead: true } : notif,
        ),
      };

    case "IMPORT_STORIES":
      const importedStories = [...state.stories, ...action.payload];
      localStorage.setItem("chatlure_stories", JSON.stringify(importedStories));
      return { ...state, stories: importedStories };

    default:
      return state;
  }
}

// Create a default context value to prevent null errors
const defaultContextValue = {
  state: initialState,
  dispatch: (() => {}) as React.Dispatch<AppAction>,
  addStory: () => {},
  updateStory: () => {},
  deleteStory: () => {},
  importStories: () => {},
  addNotification: () => {},
  getStoryById: () => undefined,
  getStoriesByGenre: () => [],
  getActiveStories: () => [],
};

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  addStory: (story: Omit<Story, "id" | "createdAt" | "updatedAt">) => void;
  updateStory: (story: Story) => void;
  deleteStory: (id: string) => void;
  importStories: (stories: any[]) => void;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "isRead">,
  ) => void;
  getStoryById: (id: string) => Story | undefined;
  getStoriesByGenre: (genre: string) => Story[];
  getActiveStories: () => Story[];
}>(defaultContextValue);

// Provider component with error handling
export function AppProvider({ children }: { children: React.ReactNode }) {
  // Safe useReducer with error handling
  let state: AppState;
  let dispatch: React.Dispatch<AppAction>;

  try {
    [state, dispatch] = useReducer(appReducer, initialState);
  } catch (error) {
    console.error("AppProvider useReducer error:", error);
    // Fallback to default state if useReducer fails
    state = initialState;
    dispatch = () => {};
  }

  // Load data from localStorage on mount
  useEffect(() => {
    const savedStories = localStorage.getItem("chatlure_stories");
    if (savedStories) {
      try {
        const stories = JSON.parse(savedStories);
        dispatch({ type: "SET_STORIES", payload: stories });
      } catch (error) {
        console.error("Failed to load stories from localStorage:", error);
      }
    }

    // Load credentials from localStorage
    const credentials: AppCredentials = {
      reddit: {
        clientId: localStorage.getItem("reddit_client_id") || "",
        clientSecret: localStorage.getItem("reddit_client_secret") || "",
        userAgent: localStorage.getItem("reddit_user_agent") || "ChatLure:v1.0",
        enabled: localStorage.getItem("reddit_enabled") === "true",
      },
      clerk: {
        publishableKey: localStorage.getItem("clerk_publishable_key") || "",
        secretKey: localStorage.getItem("clerk_secret_key") || "",
        webhookSecret: localStorage.getItem("clerk_webhook_secret") || "",
        enabled: localStorage.getItem("clerk_enabled") === "true",
      },
      paypal: {
        clientId: localStorage.getItem("paypal_client_id") || "",
        clientSecret: localStorage.getItem("paypal_client_secret") || "",
        planId: localStorage.getItem("paypal_plan_id") || "",
        environment:
          (localStorage.getItem("paypal_environment") as
            | "sandbox"
            | "production") || "sandbox",
        enabled: localStorage.getItem("paypal_enabled") === "true",
      },
    };
    dispatch({ type: "UPDATE_CREDENTIALS", payload: credentials });

    // Listen for credential updates
    const handleCredentialsUpdate = (event: CustomEvent) => {
      dispatch({ type: "UPDATE_CREDENTIALS", payload: event.detail });
    };

    window.addEventListener(
      "credentials-updated",
      handleCredentialsUpdate as EventListener,
    );

    return () => {
      window.removeEventListener(
        "credentials-updated",
        handleCredentialsUpdate as EventListener,
      );
    };
  }, []);

  // Helper functions
  const addStory = (
    storyData: Omit<Story, "id" | "createdAt" | "updatedAt">,
  ) => {
    const now = new Date().toISOString();
    const story: Story = {
      ...storyData,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
      stats: {
        views: 0,
        completions: 0,
        shares: 0,
        avgRating: 0,
        completionRate: 0,
      },
    };
    dispatch({ type: "ADD_STORY", payload: story });
    addNotification({
      type: "success",
      title: "Story Created",
      message: `"${story.title}" has been added to your library`,
    });
  };

  const updateStory = (story: Story) => {
    const updatedStory = { ...story, updatedAt: new Date().toISOString() };
    dispatch({ type: "UPDATE_STORY", payload: updatedStory });
    addNotification({
      type: "success",
      title: "Story Updated",
      message: `"${story.title}" has been updated`,
    });
  };

  const deleteStory = (id: string) => {
    const story = state.stories.find((s) => s.id === id);
    dispatch({ type: "DELETE_STORY", payload: id });
    if (story) {
      addNotification({
        type: "warning",
        title: "Story Deleted",
        message: `"${story.title}" has been removed from your library`,
      });
    }
  };

  const importStories = (importedStories: any[]) => {
    const stories: Story[] = importedStories.map((story) => ({
      id: story.id || Date.now().toString() + Math.random(),
      title: story.title,
      genre: story.genre || "drama",
      description: story.description || "",
      characters: story.characters || [],
      plotPoints:
        story.messages?.map((msg: any, index: number) => ({
          id: `${story.id}-${index}`,
          trigger: "time" as const,
          delay: index * 180000, // 3 minutes apart
          message: msg.message,
          sender: msg.sender,
          emotions: [msg.emotion || "neutral"],
          cliffhanger: msg.isCliffhanger || false,
          viralMoment: msg.viral || false,
          messageType: msg.messageType || ("text" as const),
        })) || [],
      tags: story.tags || [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        views: story.upvotes || 0,
        completions: 0,
        shares: 0,
        avgRating: 0,
        completionRate: 0,
      },
      viralScore: story.estimatedViralScore || 50,
      source: story.source || ("imported" as const),
    }));

    dispatch({ type: "IMPORT_STORIES", payload: stories });
    addNotification({
      type: "success",
      title: "Stories Imported",
      message: `${stories.length} stories have been imported successfully`,
    });
  };

  const addNotification = (
    notificationData: Omit<Notification, "id" | "timestamp" | "isRead">,
  ) => {
    const notification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    dispatch({ type: "ADD_NOTIFICATION", payload: notification });
  };

  const getStoryById = (id: string) => {
    return state.stories.find((story) => story.id === id);
  };

  const getStoriesByGenre = (genre: string) => {
    return state.stories.filter((story) => story.genre === genre);
  };

  const getActiveStories = () => {
    return state.stories.filter((story) => story.isActive);
  };

  const contextValue = {
    state,
    dispatch,
    addStory,
    updateStory,
    deleteStory,
    importStories,
    addNotification,
    getStoryById,
    getStoriesByGenre,
    getActiveStories,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (context === defaultContextValue) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

// Selector hooks for specific data
export function useStories() {
  const { state } = useApp();
  return state.stories;
}

export function useCredentials() {
  const { state } = useApp();
  return state.credentials;
}

export function useNotifications() {
  const { state } = useApp();
  return state.notifications;
}
