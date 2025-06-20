import { CredentialsAPI } from "../src/lib/api-server.js";

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
  const { service } = req.query;

  // Handle CORS preflight
  if (method === "OPTIONS") {
    return sendResponse(res, 200, {});
  }

  try {
    switch (method) {
      case "GET":
        // Get all credentials
        const credentials = await CredentialsAPI.getAll();
        return sendResponse(res, 200, credentials);

      case "PUT":
        // Update credentials for a specific service
        if (!service || !["reddit", "clerk", "paypal"].includes(service)) {
          return sendResponse(res, 400, {
            error: "Valid service is required",
          });
        }

        await CredentialsAPI.updateCredentials(service, req.body);
        const updatedCredentials = await CredentialsAPI.getAll();

        return sendResponse(res, 200, updatedCredentials);

      default:
        return sendResponse(res, 405, {
          error: `Method ${method} not allowed`,
        });
    }
  } catch (error) {
    console.error("Credentials API error:", error);
    return sendResponse(res, 500, { error: "Internal server error" });
  }
}
