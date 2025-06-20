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
          } else if (apiPath === "/test-connection") {
            return handleApiResponse(res, "test", req);
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
