import fs from "fs";
import path from "path";

export function apiMiddleware() {
  return {
    name: "api-middleware",
    configureServer(server) {
      server.middlewares.use("/api", async (req, res, next) => {
        // Parse URL to get the endpoint
        const url = new URL(req.url, `http://${req.headers.host}`);
        const apiPath = url.pathname.replace("/api", "");

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
        }

        // If no API handler found, continue to next middleware
        next();
      });
    },
  };
}

function handleApiResponse(res, type, req) {
  // For now, return mock data since we can't easily execute the Node.js API files
  res.setHeader("Content-Type", "application/json");

  switch (type) {
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
