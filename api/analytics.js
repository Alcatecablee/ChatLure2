import { AnalyticsAPI } from "../src/lib/api-server.js";

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
  const { action } = req.query;

  // Handle CORS preflight
  if (method === "OPTIONS") {
    return sendResponse(res, 200, {});
  }

  try {
    switch (method) {
      case "GET":
        if (action === "dashboard") {
          // Get dashboard metrics
          const metrics = await AnalyticsAPI.getDashboardMetrics();
          return sendResponse(res, 200, metrics);
        } else {
          // Get analytics by date range
          const { startDate, endDate } = req.query;
          if (!startDate || !endDate) {
            return sendResponse(res, 400, {
              error: "startDate and endDate are required",
            });
          }

          const analytics = await AnalyticsAPI.getDateRange(startDate, endDate);
          return sendResponse(res, 200, analytics);
        }

      case "POST":
        if (action === "track") {
          // Track a metric
          const { metric, value, metadata } = req.body;
          if (!metric || value === undefined) {
            return sendResponse(res, 400, {
              error: "metric and value are required",
            });
          }

          await AnalyticsAPI.track(metric, value, metadata);
          return sendResponse(res, 200, { success: true });
        }

        return sendResponse(res, 400, { error: "Invalid action" });

      default:
        return sendResponse(res, 405, {
          error: `Method ${method} not allowed`,
        });
    }
  } catch (error) {
    console.error("Analytics API error:", error);
    return sendResponse(res, 500, { error: "Internal server error" });
  }
}
