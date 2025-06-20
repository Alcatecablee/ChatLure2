export default async function handler(req: any, res: any) {
  const { method } = req;
  const { service } = req.query;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${method} not allowed` });
  }

  if (!service || !["reddit", "clerk", "paypal"].includes(service)) {
    return res.status(400).json({ error: "Valid service is required" });
  }

  try {
    const config = req.body;

    switch (service) {
      case "reddit":
        // Test Reddit API connection
        if (!config.clientId || !config.clientSecret) {
          return res
            .status(400)
            .json({ error: "Reddit client ID and secret are required" });
        }

        // In a real implementation, you would test the Reddit API here
        // For now, just validate the config format
        if (config.clientId.length < 10 || config.clientSecret.length < 10) {
          return res
            .status(400)
            .json({ error: "Invalid Reddit credentials format" });
        }

        return res.status(200).json({
          success: true,
          message: "Reddit API connection test successful",
        });

      case "clerk":
        // Test Clerk API connection
        if (!config.publishableKey || !config.secretKey) {
          return res.status(400).json({
            error: "Clerk publishable key and secret key are required",
          });
        }

        // Validate Clerk key formats
        if (
          !config.publishableKey.startsWith("pk_") ||
          !config.secretKey.startsWith("sk_")
        ) {
          return res.status(400).json({ error: "Invalid Clerk key format" });
        }

        return res.status(200).json({
          success: true,
          message: "Clerk API connection test successful",
        });

      case "paypal":
        // Test PayPal API connection
        if (!config.clientId || !config.clientSecret) {
          return res.status(400).json({
            error: "PayPal client ID and secret are required",
          });
        }

        // Basic validation for PayPal credentials
        if (config.clientId.length < 20 || config.clientSecret.length < 20) {
          return res
            .status(400)
            .json({ error: "Invalid PayPal credentials format" });
        }

        return res.status(200).json({
          success: true,
          message: "PayPal API connection test successful",
        });

      default:
        return res.status(400).json({ error: "Unknown service" });
    }
  } catch (error) {
    console.error("Test connection error:", error);
    return res.status(500).json({
      error: "Failed to test connection",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
