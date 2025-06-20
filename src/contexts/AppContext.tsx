import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  APIClient,
  type Story,
  type User,
  type ApiCredentials,
} from "@/lib/api";

// Notification types
interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface AppState {
  stories: Story[];
  users: User[];
  credentials: ApiCredentials;
  activeStory: Story | null;
  isLoading: boolean;
  notifications: Notification[];
  error: string | null;
}

type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_STORIES"; payload: Story[] }
  | { type: "ADD_STORY"; payload: Story }
  | { type: "UPDATE_STORY"; payload: Story }
  | { type: "DELETE_STORY"; payload: string }
  | { type: "SET_ACTIVE_STORY"; payload: Story | null }
  | { type: "SET_USERS"; payload: User[] }
  | { type: "ADD_USER"; payload: User }
  | { type: "SET_CREDENTIALS"; payload: ApiCredentials }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "MARK_NOTIFICATION_READ"; payload: string };

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
  error: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };

    case "SET_STORIES":
      return { ...state, stories: action.payload };

    case "ADD_STORY":
      return { ...state, stories: [action.payload, ...state.stories] };

    case "UPDATE_STORY":
      return {
        ...state,
        stories: state.stories.map((story) =>
          story.id === action.payload.id ? action.payload : story,
        ),
      };

    case "DELETE_STORY":
      return {
        ...state,
        stories: state.stories.filter((story) => story.id !== action.payload),
      };

    case "SET_ACTIVE_STORY":
      return { ...state, activeStory: action.payload };

    case "SET_USERS":
      return { ...state, users: action.payload };

    case "ADD_USER":
      return { ...state, users: [action.payload, ...state.users] };

    case "SET_CREDENTIALS":
      return { ...state, credentials: action.payload };

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

    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Data fetching functions
  loadStories: () => Promise<void>;
  loadUsers: () => Promise<void>;
  loadCredentials: () => Promise<void>;
  // Story operations
  addStory: (
    story: Omit<Story, "id" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  updateStory: (id: string, story: Partial<Story>) => Promise<void>;
  deleteStory: (id: string) => Promise<void>;
  // User operations
  addUser: (user: Omit<User, "createdAt" | "lastActive">) => Promise<void>;
  // Credentials operations
  updateCredentials: (
    service: keyof ApiCredentials,
    config: any,
  ) => Promise<void>;
  // Utility functions
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "isRead">,
  ) => void;
  getStoryById: (id: string) => Story | undefined;
  getStoriesByGenre: (genre: string) => Story[];
  getActiveStories: () => Story[];
} | null>(null);

// Provider component
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Data loading functions
  const loadStories = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const stories = await APIClient.getStories();
      dispatch({ type: "SET_STORIES", payload: stories });
    } catch (error) {
      console.error("Failed to load stories:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to load stories. Please try again.",
      });
      addNotification({
        type: "error",
        title: "Load Error",
        message: "Failed to load stories from the database.",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const loadUsers = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const users = await APIClient.getUsers();
      dispatch({ type: "SET_USERS", payload: users });
    } catch (error) {
      console.error("Failed to load users:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to load users. Please try again.",
      });
      addNotification({
        type: "error",
        title: "Load Error",
        message: "Failed to load users from the database.",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const loadCredentials = async () => {
    try {
      const credentials = await APIClient.getCredentials();
      dispatch({ type: "SET_CREDENTIALS", payload: credentials });
    } catch (error) {
      console.error("Failed to load credentials:", error);
      addNotification({
        type: "error",
        title: "Load Error",
        message: "Failed to load API credentials.",
      });
    }
  };

  // Story operations
  const addStory = async (
    storyData: Omit<Story, "id" | "createdAt" | "updatedAt">,
  ) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const story = await APIClient.createStory(storyData);
      dispatch({ type: "ADD_STORY", payload: story });

      addNotification({
        type: "success",
        title: "Story Created",
        message: `"${story.title}" has been successfully created.`,
      });

      // Track analytics
      await APIClient.trackMetric("stories_created", 1);
    } catch (error) {
      console.error("Failed to create story:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to create story. Please try again.",
      });
      addNotification({
        type: "error",
        title: "Creation Failed",
        message: "Failed to create the story. Please try again.",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const updateStory = async (id: string, storyData: Partial<Story>) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const story = await APIClient.updateStory(id, storyData);
      dispatch({ type: "UPDATE_STORY", payload: story });

      addNotification({
        type: "success",
        title: "Story Updated",
        message: `"${story.title}" has been successfully updated.`,
      });
    } catch (error) {
      console.error("Failed to update story:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to update story. Please try again.",
      });
      addNotification({
        type: "error",
        title: "Update Failed",
        message: "Failed to update the story. Please try again.",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const deleteStory = async (id: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      await APIClient.deleteStory(id);
      dispatch({ type: "DELETE_STORY", payload: id });

      addNotification({
        type: "warning",
        title: "Story Deleted",
        message: "The story has been successfully deleted.",
      });
    } catch (error) {
      console.error("Failed to delete story:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to delete story. Please try again.",
      });
      addNotification({
        type: "error",
        title: "Deletion Failed",
        message: "Failed to delete the story. Please try again.",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // User operations
  const addUser = async (userData: Omit<User, "createdAt" | "lastActive">) => {
    try {
      const user = await APIClient.createUser(userData);
      dispatch({ type: "ADD_USER", payload: user });

      addNotification({
        type: "success",
        title: "User Added",
        message: `${user.firstName} ${user.lastName} has been added.`,
      });

      // Track analytics
      await APIClient.trackMetric("users_registered", 1);
    } catch (error) {
      console.error("Failed to add user:", error);
      addNotification({
        type: "error",
        title: "User Creation Failed",
        message: "Failed to add the user. Please try again.",
      });
    }
  };

  // Credentials operations
  const updateCredentials = async (
    service: keyof ApiCredentials,
    config: any,
  ) => {
    try {
      await APIClient.updateCredentials(service, config);
      const credentials = await APIClient.getCredentials();
      dispatch({ type: "SET_CREDENTIALS", payload: credentials });

      addNotification({
        type: "success",
        title: "Credentials Updated",
        message: `${service} credentials have been successfully updated.`,
      });
    } catch (error) {
      console.error("Failed to update credentials:", error);
      addNotification({
        type: "error",
        title: "Update Failed",
        message: `Failed to update ${service} credentials. Please try again.`,
      });
    }
  };

  // Utility functions
  const addNotification = (
    notificationData: Omit<Notification, "id" | "timestamp" | "isRead">,
  ) => {
    const notification: Notification = {
      ...notificationData,
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2)}`,
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

  // Load initial data on mount
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([loadStories(), loadUsers(), loadCredentials()]);
    };

    initializeData();
  }, []);

  const contextValue = {
    state,
    dispatch,
    loadStories,
    loadUsers,
    loadCredentials,
    addStory,
    updateStory,
    deleteStory,
    addUser,
    updateCredentials,
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
  if (!context) {
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

export function useUsers() {
  const { state } = useApp();
  return state.users;
}

export function useLoading() {
  const { state } = useApp();
  return state.isLoading;
}

export function useError() {
  const { state } = useApp();
  return state.error;
}
