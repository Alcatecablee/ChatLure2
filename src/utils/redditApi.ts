export interface RedditCredentials {
  clientId: string;
  clientSecret: string;
  userAgent: string;
  enabled: boolean;
}

export interface RedditPost {
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
  nsfw: boolean;
  stickied: boolean;
}

export interface RedditSearchParams {
  query?: string;
  subreddit?: string;
  sort?: "hot" | "new" | "top" | "rising";
  timeframe?: "hour" | "day" | "week" | "month" | "year" | "all";
  limit?: number;
  minScore?: number;
}

class RedditAPIService {
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  async authenticate(credentials: RedditCredentials): Promise<boolean> {
    try {
      const auth = btoa(`${credentials.clientId}:${credentials.clientSecret}`);

      const response = await fetch(
        "https://www.reddit.com/api/v1/access_token",
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": credentials.userAgent,
          },
          body: "grant_type=client_credentials",
        },
      );

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + data.expires_in * 1000;

      return true;
    } catch (error) {
      console.error("Reddit authentication failed:", error);
      return false;
    }
  }

  private async ensureAuthenticated(
    credentials: RedditCredentials,
  ): Promise<boolean> {
    if (
      !this.accessToken ||
      !this.tokenExpiry ||
      Date.now() > this.tokenExpiry
    ) {
      return await this.authenticate(credentials);
    }
    return true;
  }

  async searchPosts(
    credentials: RedditCredentials,
    params: RedditSearchParams,
  ): Promise<{ success: boolean; posts: RedditPost[]; error?: string }> {
    try {
      if (!(await this.ensureAuthenticated(credentials))) {
        return { success: false, posts: [], error: "Authentication failed" };
      }

      let url = "https://oauth.reddit.com";

      if (params.query) {
        // Search across Reddit
        url += `/search?q=${encodeURIComponent(params.query)}`;
        if (params.subreddit && params.subreddit !== "all") {
          url += `&restrict_sr=true&sr=${params.subreddit}`;
        }
      } else if (params.subreddit && params.subreddit !== "all") {
        // Browse specific subreddit
        url += `/r/${params.subreddit}/${params.sort || "hot"}`;
      } else {
        // Browse front page
        url += `/${params.sort || "hot"}`;
      }

      // Add query parameters
      const queryParams = new URLSearchParams();
      queryParams.append("limit", String(params.limit || 25));
      queryParams.append("raw_json", "1");

      if (params.timeframe && params.sort === "top") {
        queryParams.append("t", params.timeframe);
      }

      url += `?${queryParams.toString()}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "User-Agent": credentials.userAgent,
        },
      });

      if (!response.ok) {
        throw new Error(`Reddit API error: ${response.status}`);
      }

      const data = await response.json();
      const posts = this.parseRedditPosts(data, params);

      return { success: true, posts };
    } catch (error) {
      return {
        success: false,
        posts: [],
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  private parseRedditPosts(
    data: any,
    params: RedditSearchParams,
  ): RedditPost[] {
    if (!data.data || !data.data.children) {
      return [];
    }

    return data.data.children
      .map((child: any) => {
        const post = child.data;

        // Skip if post doesn't meet minimum score
        if (params.minScore && post.score < params.minScore) {
          return null;
        }

        // Skip if removed or deleted
        if (post.removed_by_category || post.author === "[deleted]") {
          return null;
        }

        return {
          id: post.id,
          title: post.title,
          content: post.selftext || post.title,
          upvotes: post.score || 0,
          comments: post.num_comments || 0,
          subreddit: post.subreddit_name_prefixed || `r/${post.subreddit}`,
          url: `https://reddit.com${post.permalink}`,
          created: new Date(post.created_utc * 1000).toISOString(),
          author: post.author,
          flair: post.link_flair_text,
          nsfw: post.over_18,
          stickied: post.stickied,
        } as RedditPost;
      })
      .filter(Boolean);
  }

  async getSubredditInfo(
    credentials: RedditCredentials,
    subredditName: string,
  ): Promise<{ success: boolean; info?: any; error?: string }> {
    try {
      if (!(await this.ensureAuthenticated(credentials))) {
        return { success: false, error: "Authentication failed" };
      }

      const response = await fetch(
        `https://oauth.reddit.com/r/${subredditName}/about`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "User-Agent": credentials.userAgent,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch subreddit info: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, info: data.data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async testConnection(credentials: RedditCredentials): Promise<boolean> {
    return await this.authenticate(credentials);
  }
}

export const redditAPI = new RedditAPIService();
