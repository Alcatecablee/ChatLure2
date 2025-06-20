import {
  healthCheck,
  StoryAPI,
  UserAPI,
  AnalyticsAPI,
} from "../src/lib/api-server.js";

export default async function handler(req, res) {
  const { method } = req;
  const { action } = req.query;

  try {
    switch (method) {
      case "GET":
        if (action === "stats") {
          // Get comprehensive database statistics
          const health = healthCheck();
          const dashboardMetrics = AnalyticsAPI.getDashboardMetrics();
          const stories = StoryAPI.getAll();
          const users = UserAPI.getAll();

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          return res.end(JSON.stringify({
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
          });
        } else {
          // Basic health check
          const health = healthCheck();
          return res.status(200).json(health);
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

          return res.status(200).json({
            status: "test_completed",
            results: testResults,
            allPassed:
              testResults.read && testResults.write && testResults.delete,
          });
        }

        return res.status(400).json({ error: "Invalid action" });

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error("Health API error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
}