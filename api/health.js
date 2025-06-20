import {
  healthCheck,
  StoryAPI,
  UserAPI,
  AnalyticsAPI,
} from "../src/lib/api-server.js";

export default async function handler(req, res) {
  const { method } = req;
  const { action } = req.query;

  // Set CORS headers
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (method === "OPTIONS") {
    res.statusCode = 200;
    return res.end();
  }

  try {
    switch (method) {
      case "GET":
        if (action === "stats") {
          // Get comprehensive database statistics
          const health = healthCheck();
          const dashboardMetrics = AnalyticsAPI.getDashboardMetrics();
          const stories = StoryAPI.getAll();
          const users = UserAPI.getAll();

          const response = {
            health,
            stats: {
              ...dashboardMetrics,
              storiesActive: stories.filter((s) => s.isActive).length,
              storiesInactive: stories.filter((s) => !s.isActive).length,
              usersWithPremium: users.filter(
                (u) => u.subscription?.status === "premium",
              ).length,
              usersFree: users.filter((u) => u.subscription?.status === "free")
                .length,
            },
            sampleData: {
              latestStory: stories[0] || null,
              latestUser: users[0] || null,
            },
          };

          res.statusCode = 200;
          return res.end(JSON.stringify(response));
        } else {
          // Basic health check
          const health = healthCheck();
          res.statusCode = 200;
          return res.end(JSON.stringify(health));
        }

      case "POST":
        if (action === "test-connection") {
          // Test database operations
          const testResults = {
            read: false,
            write: false,
            delete: false,
          };

          try {
            // Test read
            const stories = StoryAPI.getAll();
            testResults.read = Array.isArray(stories);

            // Test write (create a test entry)
            const testStory = StoryAPI.create({
              title: "Database Test Story",
              genre: "test",
              description: "This is a test story for database validation",
              isActive: false,
            });
            testResults.write = !!testStory;

            // Test delete (remove the test entry)
            if (testStory) {
              testResults.delete = StoryAPI.delete(testStory.id);
            }
          } catch (error) {
            console.error("Database test error:", error);
          }

          const response = {
            status: "test_completed",
            results: testResults,
            allPassed:
              testResults.read && testResults.write && testResults.delete,
          };

          res.statusCode = 200;
          return res.end(JSON.stringify(response));
        }

        res.statusCode = 400;
        return res.end(JSON.stringify({ error: "Invalid action" }));

      default:
        res.statusCode = 405;
        return res.end(
          JSON.stringify({ error: `Method ${method} not allowed` }),
        );
    }
  } catch (error) {
    console.error("Health API error:", error);
    res.statusCode = 500;
    return res.end(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
    );
  }
}
