import { db, Story, User, Notification } from "@/lib/database";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface StoryCreateRequest {
  title: string;
  description: string;
  content: string;
  category: "drama" | "romance" | "scandal" | "mystery" | "comedy";
  tags: string[];
  status: "draft" | "published" | "archived";
  visibility: "public" | "private" | "friends";
  readingTime?: number;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  scheduledAt?: Date;
}

export interface StoryUpdateRequest extends Partial<StoryCreateRequest> {
  id: string;
}

export interface UserCreateRequest {
  username: string;
  email: string;
  isPremium?: boolean;
  preferences?: {
    notifications: boolean;
    soundEnabled: boolean;
    theme: "dark" | "light";
    autoPlay: boolean;
  };
}

class APIRouteHandler {
  // Story operations
  async createStory(
    authorId: string,
    data: StoryCreateRequest,
  ): Promise<ApiResponse<Story>> {
    try {
      const story = await db.createStory({
        ...data,
        authorId,
        readingTime: data.readingTime || Math.ceil(data.content.length / 200),
        chapters: [],
      });

      return {
        success: true,
        data: story,
        message: "Story created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create story",
      };
    }
  }

  async updateStory(data: StoryUpdateRequest): Promise<ApiResponse<Story>> {
    try {
      const existingStory = await db.getStory(data.id);
      if (!existingStory) {
        return {
          success: false,
          error: "Story not found",
        };
      }

      const updatedStory = await db.updateStory(data.id, data);
      return {
        success: true,
        data: updatedStory,
        message: "Story updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update story",
      };
    }
  }

  async deleteStory(storyId: string): Promise<ApiResponse> {
    try {
      const story = await db.getStory(storyId);
      if (!story) {
        return {
          success: false,
          error: "Story not found",
        };
      }

      await db.deleteStory(storyId);
      return {
        success: true,
        message: "Story deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete story",
      };
    }
  }

  async getStories(params: {
    authorId?: string;
    category?: string;
    status?: string;
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<ApiResponse<Story[]>> {
    try {
      let stories: Story[] = [];

      if (params.search) {
        stories = await db.searchStories(params.search);
      } else if (params.authorId) {
        stories = await db.getStoriesByAuthor(params.authorId);
      } else {
        stories = await db.getTrendingStories();
      }

      // Apply filters
      if (params.category) {
        stories = stories.filter((story) => story.category === params.category);
      }

      if (params.status) {
        stories = stories.filter((story) => story.status === params.status);
      }

      // Apply pagination
      if (params.offset) {
        stories = stories.slice(params.offset);
      }

      if (params.limit) {
        stories = stories.slice(0, params.limit);
      }

      return {
        success: true,
        data: stories,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch stories",
      };
    }
  }

  async getStoryAnalytics(storyId: string): Promise<ApiResponse> {
    try {
      const story = await db.getStory(storyId);
      if (!story) {
        return {
          success: false,
          error: "Story not found",
        };
      }

      // Calculate analytics
      const analytics = {
        views: story.stats.views,
        likes: story.stats.likes,
        comments: story.stats.comments,
        shares: story.stats.shares,
        completionRate:
          story.stats.views > 0
            ? Math.round((story.stats.comments / story.stats.views) * 100)
            : 0,
        averageReadingTime: story.readingTime,
        engagement:
          story.stats.views > 0
            ? Math.round(
                ((story.stats.likes + story.stats.comments) /
                  story.stats.views) *
                  100,
              )
            : 0,
        trendingScore: this.calculateTrendingScore(story),
      };

      return {
        success: true,
        data: analytics,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch analytics",
      };
    }
  }

  private calculateTrendingScore(story: Story): number {
    const hoursOld =
      (Date.now() - new Date(story.createdAt).getTime()) / (1000 * 60 * 60);
    const timeDecay = Math.max(0, 1 - hoursOld / 168); // Decay over 7 days

    const engagementScore =
      story.stats.likes + story.stats.comments * 2 + story.stats.shares * 3;
    const viewScore = Math.log(story.stats.views + 1);

    return Math.round((engagementScore + viewScore) * timeDecay);
  }

  // User operations
  async createUser(data: UserCreateRequest): Promise<ApiResponse<User>> {
    try {
      const user = await db.createUser({
        ...data,
        lastSeen: new Date(),
        preferences: {
          notifications: true,
          soundEnabled: true,
          theme: "dark",
          autoPlay: true,
          ...data.preferences,
        },
      });

      return {
        success: true,
        data: user,
        message: "User created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create user",
      };
    }
  }

  async updateUserPreferences(
    userId: string,
    preferences: Partial<User["preferences"]>,
  ): Promise<ApiResponse<User>> {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        return {
          success: false,
          error: "User not found",
        };
      }

      const updatedUser = await db.updateUser(userId, {
        preferences: { ...user.preferences, ...preferences },
      });

      return {
        success: true,
        data: updatedUser,
        message: "Preferences updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update preferences",
      };
    }
  }

  // Notification operations
  async createNotification(
    userId: string,
    data: {
      type: "story_update" | "like" | "comment" | "follow" | "system";
      title: string;
      message: string;
      metadata?: any;
    },
  ): Promise<ApiResponse<Notification>> {
    try {
      const notification = await db.createNotification({
        userId,
        ...data,
        isRead: false,
      });

      return {
        success: true,
        data: notification,
        message: "Notification created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create notification",
      };
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse> {
    try {
      await db.markNotificationAsRead(notificationId);
      return {
        success: true,
        message: "Notification marked as read",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to mark notification as read",
      };
    }
  }

  // Analytics operations
  async getDashboardStats(userId?: string): Promise<ApiResponse> {
    try {
      const stories = userId
        ? await db.getStoriesByAuthor(userId)
        : await db.getTrendingStories();

      const totalViews = stories.reduce(
        (sum, story) => sum + (story.stats?.views || 0),
        0,
      );
      const totalLikes = stories.reduce(
        (sum, story) => sum + (story.stats?.likes || 0),
        0,
      );
      const totalComments = stories.reduce(
        (sum, story) => sum + (story.stats?.comments || 0),
        0,
      );

      const stats = {
        totalStories: stories.length,
        publishedStories: stories.filter((s) => s.status === "published")
          .length,
        draftStories: stories.filter((s) => s.status === "draft").length,
        totalViews,
        totalLikes,
        totalComments,
        averageViews:
          stories.length > 0 ? Math.round(totalViews / stories.length) : 0,
        engagementRate:
          totalViews > 0
            ? Math.round(((totalLikes + totalComments) / totalViews) * 100)
            : 0,
        topStories: stories
          .sort((a, b) => (b.stats?.views || 0) - (a.stats?.views || 0))
          .slice(0, 5),
      };

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch dashboard stats",
      };
    }
  }

  // Data export/import operations
  async exportUserData(userId: string): Promise<ApiResponse<string>> {
    try {
      const data = await db.exportData();
      return {
        success: true,
        data: data,
        message: "Data exported successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to export data",
      };
    }
  }

  async importStories(
    authorId: string,
    stories: Array<Omit<StoryCreateRequest, "authorId">>,
  ): Promise<ApiResponse<{ imported: number; failed: number }>> {
    try {
      let imported = 0;
      let failed = 0;

      for (const storyData of stories) {
        try {
          await this.createStory(authorId, storyData);
          imported++;
        } catch (error) {
          console.error("Failed to import story:", error);
          failed++;
        }
      }

      return {
        success: true,
        data: { imported, failed },
        message: `Import completed: ${imported} successful, ${failed} failed`,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to import stories",
      };
    }
  }
}

export const apiHandler = new APIRouteHandler();
