import { UserAPI } from "../src/lib/api-server.js";

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
  const { id } = req.query;

  // Handle CORS preflight
  if (method === "OPTIONS") {
    return sendResponse(res, 200, {});
  }

  try {
    switch (method) {
      case "GET":
        if (id) {
          // Get single user
          const user = await UserAPI.getById(id);
          if (!user) {
            return sendResponse(res, 404, { error: "User not found" });
          }
          return sendResponse(res, 200, user);
        } else {
          // Get all users
          const users = await UserAPI.getAll();
          return sendResponse(res, 200, users);
        }

      case "POST":
        // Create new user
        if (!req.body.id || !req.body.email) {
          return sendResponse(res, 400, {
            error: "ID and email are required",
          });
        }

        const newUser = await UserAPI.create({
          id: req.body.id,
          email: req.body.email,
          firstName: req.body.firstName || "",
          lastName: req.body.lastName || "",
          imageUrl: req.body.imageUrl,
          subscription: req.body.subscription || { status: "free" },
          engagement: req.body.engagement || {
            storiesRead: 0,
            avgTime: "0m",
            favoriteGenre: "unknown",
          },
        });

        return sendResponse(res, 201, newUser);

      case "PUT":
        // Update user activity
        if (!id) {
          return sendResponse(res, 400, { error: "User ID is required" });
        }

        await UserAPI.updateActivity(id);
        const updatedUser = await UserAPI.getById(id);

        return sendResponse(res, 200, updatedUser);

      default:
        return sendResponse(res, 405, {
          error: `Method ${method} not allowed`,
        });
    }
  } catch (error) {
    console.error("Users API error:", error);
    return sendResponse(res, 500, { error: "Internal server error" });
  }
}
