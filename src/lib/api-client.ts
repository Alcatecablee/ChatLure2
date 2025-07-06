// API Client types and implementation

export interface Story {
  id: string;
  title: string;
  genre: "scandal" | "drama" | "romance" | "mystery" | "family" | "money";
  description: string;
  isActive: boolean;
  viralScore: number;
  source: string;
  tags: string[];
  stats: {
    views: number;
    completions: number;
    shares: number;
    avgRating: number;
    completionRate: number;
  };
  characters: Character[];
  plotPoints: PlotPoint[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Character {
  id: string;
  name: string;
  avatar: string;
  personality: string;
  role: "protagonist" | "antagonist" | "supporting";
  secrets: string[];
  phoneNumber?: string;
  profileImage?: string;
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
  media?: MediaItem[];
  readReceipts?: boolean;
  typingIndicator?: boolean;
  messageType: "text" | "image" | "audio" | "video" | "location" | "contact";
}

export interface MediaItem {
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

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  subscription: {
    status: "free" | "premium" | "enterprise";
    plan?: string;
    expiresAt?: string;
  };
  engagement: {
    storiesRead: number;
    avgTime: string;
    favoriteGenre: string;
  };
  createdAt?: string;
  lastActive?: string;
}

export interface ApiCredentials {
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
    environment: "sandbox" | "live";
    enabled: boolean;
  };
}

export interface DashboardMetrics {
  totalStories: number;
  activeStories: number;
  totalUsers: number;
  averageEngagement: number;
  topGenres: { genre: string; count: number; growth: number }[];
  recentActivity: { type: string; message: string; timestamp: string }[];
  performanceMetrics: {
    responseTime: number;
    uptime: number;
    errorRate: number;
  };
}

class APIClientClass {
  private baseURL: string;

  constructor() {
    this.baseURL = window.location.origin;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    try {
      const url = `${this.baseURL}/api${endpoint}`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ error: response.statusText }));
        throw new Error(
          error.error || `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Stories API
  async getStories(): Promise<Story[]> {
    return this.request<Story[]>("/stories");
  }

  async getStory(id: string): Promise<Story> {
    return this.request<Story>(`/stories?id=${id}`);
  }

  async createStory(
    story: Omit<Story, "id" | "createdAt" | "updatedAt">,
  ): Promise<Story> {
    return this.request<Story>("/stories", {
      method: "POST",
      body: JSON.stringify(story),
    });
  }

  async updateStory(id: string, story: Partial<Story>): Promise<Story> {
    return this.request<Story>(`/stories?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(story),
    });
  }

  async deleteStory(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/stories?id=${id}`, {
      method: "DELETE",
    });
  }

  // Users API
  async getUsers(): Promise<User[]> {
    return this.request<User[]>("/users");
  }

  async getUser(id: string): Promise<User> {
    return this.request<User>(`/users?id=${id}`);
  }

  async createUser(
    user: Omit<User, "createdAt" | "lastActive">,
  ): Promise<User> {
    return this.request<User>("/users", {
      method: "POST",
      body: JSON.stringify(user),
    });
  }

  async updateUserActivity(id: string): Promise<User> {
    return this.request<User>(`/users?id=${id}`, {
      method: "PUT",
    });
  }

  // Credentials API
  async getCredentials(): Promise<ApiCredentials> {
    return this.request<ApiCredentials>("/credentials");
  }

  async updateCredentials(
    service: string,
    credentials: Record<string, any>,
  ): Promise<ApiCredentials> {
    return this.request<ApiCredentials>(`/credentials?service=${service}`, {
      method: "PUT",
      body: JSON.stringify(credentials),
    });
  }

  // Analytics API
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return this.request<DashboardMetrics>("/analytics?action=dashboard");
  }

  async trackMetric(
    metric: string,
    value: number,
    metadata?: Record<string, any>,
  ): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>("/analytics?action=track", {
      method: "POST",
      body: JSON.stringify({ metric, value, metadata }),
    });
  }

  async getAnalytics(startDate: string, endDate: string): Promise<any> {
    return this.request<any>(
      `/analytics?startDate=${startDate}&endDate=${endDate}`,
    );
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>("/health");
  }
}

export const APIClient = new APIClientClass();
