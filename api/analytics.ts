import { AnalyticsAPI } from "../src/lib/api-server";

export default async function handler(req: any, res: any) {
  const { method } = req;
  const { action } = req.query;

  try {
    switch (method) {
      case "GET":
        if (action === "dashboard") {
          // Get dashboard metrics
          const metrics = await AnalyticsAPI.getDashboardMetrics();
          return res.status(200).json(metrics);
        } else {
          // Get analytics by date range
          const { startDate, endDate } = req.query;
          if (!startDate || !endDate) {
            return res
              .status(400)
              .json({ error: "startDate and endDate are required" });
          }

          const analytics = await AnalyticsAPI.getDateRange(
            startDate as string,
            endDate as string,
          );
          return res.status(200).json(analytics);
        }

      case "POST":
        if (action === "track") {
          // Track a metric
          const { metric, value, metadata } = req.body;
          if (!metric || value === undefined) {
            return res
              .status(400)
              .json({ error: "metric and value are required" });
          }

          await AnalyticsAPI.track(metric, value, metadata);
          return res.status(200).json({ success: true });
        }

        return res.status(400).json({ error: "Invalid action" });

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error("Analytics API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
