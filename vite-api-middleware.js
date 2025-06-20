import fs from "fs";
import path from "path";

export function apiMiddleware() {
  return {
    name: "api-middleware",
    configureServer(server) {
      server.middlewares.use("/api", async (req, res, next) => {
        try {
          // Parse URL to get the endpoint
          const url = new URL(req.url, `http://${req.headers.host}`);
          const apiPath = url.pathname.replace("/api", "");

          console.log(`[API] ${req.method} ${apiPath}`);

          // Handle different endpoints
          if (apiPath === "/stories" || apiPath.startsWith("/stories/")) {
            return handleApiResponse(res, "stories", req);
          } else if (apiPath === "/users" || apiPath.startsWith("/users/")) {
            return handleApiResponse(res, "users", req);
          } else if (
            apiPath === "/credentials" ||
            apiPath.startsWith("/credentials/")
          ) {
            return handleApiResponse(res, "credentials", req);
          } else if (apiPath === "/analytics/dashboard") {
            return handleApiResponse(res, "analytics", req);
          } else if (apiPath.startsWith("/test-connection/")) {
            const service = apiPath.replace("/test-connection/", "");
            return handleApiResponse(res, `test-${service}`, req);
          } else if (apiPath.startsWith("/reddit/")) {
            return handleApiResponse(res, "reddit", req);
          }

          // If no API handler found, return 404
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          return res.end(
            JSON.stringify({ error: `API endpoint not found: ${apiPath}` }),
          );
        } catch (error) {
          console.error("[API] Error:", error);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          return res.end(JSON.stringify({ error: "Internal server error" }));
        }
      });
    },
  };
}

function handleApiResponse(res, type, req) {
  // Return mock data for development
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS requests for CORS
  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    return res.end();
  }

  switch (type) {
    case "test":
      res.statusCode = 200;
      return res.end(
        JSON.stringify({
          status: "connected",
          message: "API middleware is working",
          timestamp: new Date().toISOString(),
        }),
      );

    case "reddit":
      if (req.method === "POST") {
        // Mock Reddit search results with realistic viral content
        const mockRedditPosts = [
          {
            id: `post_${Date.now()}_1`,
            title:
              "My mom went through my phone and found texts about my secret boyfriend",
            content:
              "I (17F) have been secretly dating someone (18M) for 3 months. My mom has always been super strict about dating. Today she demanded to see my phone and found all our texts. She's threatening to kick me out and is calling his parents. I don't know what to do...",
            upvotes: 15420,
            comments: 892,
            subreddit: "r/insaneparents",
            url: "https://reddit.com/r/insaneparents/comments/example1",
            created: "2024-01-15",
            author: "throwaway_teen123",
            flair: "Support",
          },
          {
            id: `post_${Date.now()}_2`,
            title:
              "Caught my husband's affair through his smartwatch notifications",
            content:
              "His Apple Watch was synced to our shared iPad. I saw a notification from 'Sarah ❤️' saying 'Can't wait to see you tonight, love you too'. My world is falling apart. We've been married 8 years. I took screenshots of everything...",
            upvotes: 23890,
            comments: 1247,
            subreddit: "r/relationship_advice",
            url: "https://reddit.com/r/relationship_advice/comments/example2",
            created: "2024-01-14",
            author: "devastated_wife_32",
            flair: "Infidelity",
          },
          {
            id: `post_${Date.now()}_3`,
            title:
              "My sister tried to steal my inheritance by forging documents",
            content:
              "My grandmother left me her house in her will. My sister (who expected to get it) somehow got fake documents saying grandma changed her mind. I found the original will and confronted her. Now she's threatening to sue me and the whole family is taking sides...",
            upvotes: 18750,
            comments: 756,
            subreddit: "r/AmItheAsshole",
            url: "https://reddit.com/r/AmItheAsshole/comments/example3",
            created: "2024-01-13",
            author: "rightful_heir_28",
            flair: "Not the A-hole",
          },
          {
            id: `post_${Date.now()}_4`,
            title:
              "Wedding vendor is demanding double payment 2 days before my wedding",
            content:
              "Our caterer just called saying there was a 'miscommunication' about pricing and we owe $5000 more or they won't show up. Wedding is Saturday. 150 guests. Contract clearly states the original price. They're holding us hostage...",
            upvotes: 12340,
            comments: 634,
            subreddit: "r/ChoosingBeggars",
            url: "https://reddit.com/r/ChoosingBeggars/comments/example4",
            created: "2024-01-12",
            author: "stressed_bride_2024",
            flair: "Vendor Drama",
          },
          {
            id: `post_${Date.now()}_5`,
            title:
              "My parents are demanding I pay for my brother's rehab or they'll disown me",
            content:
              "I (25F) have a good job and savings. My brother (22M) has been addicted to drugs for 2 years. Parents have spent $50k already. Now they want me to pay for a $30k rehab program 'because family helps family'. I said no and they're calling me selfish...",
            upvotes: 9876,
            comments: 423,
            subreddit: "r/entitledparents",
            url: "https://reddit.com/r/entitledparents/comments/example5",
            created: "2024-01-11",
            author: "independent_daughter",
            flair: "Financial Abuse",
          },
        ];

        // Filter based on request criteria
        const { subreddit, query, minViralScore = 70 } = req.body;

        let filteredPosts = mockRedditPosts;

        // Filter by subreddit
        if (subreddit && subreddit !== "all") {
          filteredPosts = filteredPosts.filter((post) =>
            post.subreddit
              .toLowerCase()
              .includes(subreddit.toLowerCase().replace("r/", "")),
          );
        }

        // Filter by search query
        if (query) {
          filteredPosts = filteredPosts.filter(
            (post) =>
              post.title.toLowerCase().includes(query.toLowerCase()) ||
              post.content.toLowerCase().includes(query.toLowerCase()),
          );
        }

        // Filter by viral potential (using upvotes as proxy)
        filteredPosts = filteredPosts.filter(
          (post) => post.upvotes >= minViralScore * 100,
        );

        return res.end(
          JSON.stringify({
            success: true,
            posts: filteredPosts,
            total: filteredPosts.length,
            message: `Found ${filteredPosts.length} viral posts matching criteria`,
          }),
        );
      }
      break;
    case "stories":
      if (req.method === "GET") {
        return res.end(
          JSON.stringify([
            {
              id: "mock_story_1",
              title: "The Digital Stalker",
              genre: "thriller",
              description: "A thrilling story about digital privacy",
              isActive: true,
              viralScore: 89,
              source: "original",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              tags: ["thriller", "digital", "privacy"],
              stats: {
                views: 15420,
                completions: 12336,
                shares: 892,
                avgRating: 4.7,
                completionRate: 80,
              },
              characters: [],
              plotPoints: [],
            },
          ]),
        );
      }
      break;

    case "users":
      if (req.method === "GET") {
        return res.end(
          JSON.stringify([
            {
              id: "mock_user_1",
              email: "user@example.com",
              firstName: "John",
              lastName: "Doe",
              createdAt: new Date().toISOString(),
              lastActive: new Date().toISOString(),
              subscription: { status: "premium", plan: "Pro" },
              engagement: {
                storiesRead: 12,
                avgTime: "15m",
                favoriteGenre: "thriller",
              },
            },
          ]),
        );
      }
      break;

    case "credentials":
      if (req.method === "GET") {
        return res.end(
          JSON.stringify({
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
          }),
        );
      }
      break;

    case "analytics":
      if (req.method === "GET") {
        return res.end(
          JSON.stringify({
            totalRevenue: 24847,
            activeSubscribers: 1847,
            avgEngagementTime: 14,
            revenueChange: 12.5,
            subscriberChange: 8.3,
            engagementChange: -2.1,
            completionChange: 5.7,
          }),
        );
      }
      break;
  }

  // Default response
  res.statusCode = 200;
  res.end(JSON.stringify({ success: true }));
}
