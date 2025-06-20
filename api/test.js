import {
  StoryAPI,
  UserAPI,
  CredentialsAPI,
  AnalyticsAPI,
  healthCheck,
} from "../src/lib/api-server.js";

// Helper function for consistent responses
function sendResponse(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  return res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  const { method } = req;
  const { action, entity } = req.query;

  // Handle CORS preflight
  if (method === "OPTIONS") {
    return sendResponse(res, 200, {});
  }

  try {
    switch (method) {
      case "GET":
        if (action === "all") {
          // Get everything for comprehensive testing
          const stories = StoryAPI.getAll();
          const users = UserAPI.getAll();
          const credentials = CredentialsAPI.getAll();
          const metrics = AnalyticsAPI.getDashboardMetrics();
          const health = healthCheck();

          return sendResponse(res, 200, {
            health,
            metrics,
            data: {
              stories: stories.slice(0, 2), // First 2 stories to avoid too much data
              users: users.slice(0, 2), // First 2 users
              credentials: credentials.map((c) => ({
                ...c,
                credentials: Object.keys(c.credentials), // Don't expose actual credentials
              })),
            },
            counts: {
              stories: stories.length,
              users: users.length,
              credentials: credentials.length,
            },
          });
        }

        if (entity === "stories") {
          return sendResponse(res, 200, StoryAPI.getAll());
        }

        if (entity === "users") {
          return sendResponse(res, 200, UserAPI.getAll());
        }

        if (entity === "analytics") {
          return sendResponse(res, 200, AnalyticsAPI.getDashboardMetrics());
        }

        if (entity === "health") {
          return sendResponse(res, 200, healthCheck());
        }

        // Default: return test endpoints
        return sendResponse(res, 200, {
          message: "ChatLure Database Test API",
          endpoints: [
            "GET /api/test?action=all - Get everything",
            "GET /api/test?entity=stories - Get all stories",
            "GET /api/test?entity=users - Get all users",
            "GET /api/test?entity=analytics - Get analytics",
            "GET /api/test?entity=health - Health check",
            "POST /api/test?action=create-story - Create test story",
            "POST /api/test?action=create-user - Create test user",
            "POST /api/test?action=track-analytics - Track test analytics",
            "DELETE /api/test?action=cleanup - Delete test entries",
          ],
          database: healthCheck(),
        });

      case "POST":
        if (action === "create-story") {
          const testStory = StoryAPI.create({
            title: `Test Story ${Date.now()}`,
            genre: "test",
            description: `Test story created at ${new Date().toISOString()}`,
            isActive: true,
            viralScore: 50,
            source: "api-test",
            tags: ["test", "api"],
            stats: {
              views: 0,
              completions: 0,
              shares: 0,
              avgRating: 0,
              completionRate: 0,
            },
            characters: [
              {
                name: "Test Character",
                type: "protagonist",
                description: "A test character",
                avatar: "🧪",
                personality: { traits: ["test"] },
                backstory: "Created for testing",
              },
            ],
            plotPoints: [
              {
                type: "message",
                content: "This is a test message",
                sender: "Test Character",
                timestamp: new Date().toISOString(),
                choices: ["Option A", "Option B"],
                effects: { test: 1 },
              },
            ],
          });

          return sendResponse(res, 201, {
            message: "Test story created successfully",
            story: testStory,
          });
        }

        if (action === "create-user") {
          const testUser = UserAPI.create({
            id: `test_user_${Date.now()}`,
            email: `test${Date.now()}@example.com`,
            firstName: "Test",
            lastName: "User",
            imageUrl: "https://via.placeholder.com/150",
            subscription: { status: "free" },
            engagement: {
              storiesRead: 0,
              avgTime: "0m",
              favoriteGenre: "test",
            },
          });

          return sendResponse(res, 201, {
            message: "Test user created successfully",
            user: testUser,
          });
        }

        if (action === "track-analytics") {
          const metrics = [
            { metric: "test_views", value: Math.floor(Math.random() * 100) },
            { metric: "test_clicks", value: Math.floor(Math.random() * 50) },
            { metric: "test_signups", value: Math.floor(Math.random() * 10) },
          ];

          for (const { metric, value } of metrics) {
            AnalyticsAPI.track(metric, value, {
              test: true,
              timestamp: new Date().toISOString(),
            });
          }

          return sendResponse(res, 201, {
            message: "Test analytics tracked successfully",
            metrics,
          });
        }

        return sendResponse(res, 400, {
          error: "Invalid action for POST request",
        });

      case "DELETE":
        if (action === "cleanup") {
          // Delete test entries
          const stories = StoryAPI.getAll();

          let deleted = { stories: 0, users: 0 };

          // Delete test stories
          stories
            .filter((s) => s.source === "api-test" || s.genre === "test")
            .forEach((story) => {
              if (StoryAPI.delete(story.id)) {
                deleted.stories++;
              }
            });

          // Note: Users don't have a delete method in the current API
          // This is intentional for data safety

          return sendResponse(res, 200, {
            message: "Test cleanup completed",
            deleted,
          });
        }

        return sendResponse(res, 400, {
          error: "Invalid action for DELETE request",
        });

      default:
        return sendResponse(res, 405, {
          error: `Method ${method} not allowed`,
        });
    }
  } catch (error) {
    console.error("Test API error:", error);
    return sendResponse(res, 500, {
      error: "Internal server error",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}
