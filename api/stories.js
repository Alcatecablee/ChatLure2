import { StoryAPI } from "../src/lib/api-server.js";

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
          // Get single story
          const story = await StoryAPI.getById(id);
          if (!story) {
            return sendResponse(res, 404, { error: "Story not found" });
          }
          return sendResponse(res, 200, story);
        } else {
          // Get all stories
          const stories = await StoryAPI.getAll();
          return sendResponse(res, 200, stories);
        }

      case "POST":
        // Create new story
        if (!req.body.title || !req.body.genre) {
          return sendResponse(res, 400, {
            error: "Title and genre are required",
          });
        }

        const newStory = await StoryAPI.create({
          title: req.body.title,
          genre: req.body.genre,
          description: req.body.description || "",
          isActive: req.body.isActive !== false,
          viralScore: req.body.viralScore || 50,
          source: req.body.source || "original",
          tags: req.body.tags || [],
          stats: req.body.stats || {
            views: 0,
            completions: 0,
            shares: 0,
            avgRating: 0,
            completionRate: 0,
          },
          characters: req.body.characters || [],
          plotPoints: req.body.plotPoints || [],
        });

        return sendResponse(res, 201, newStory);

      case "PUT":
        // Update story
        if (!id) {
          return sendResponse(res, 400, { error: "Story ID is required" });
        }

        const updatedStory = await StoryAPI.update(id, req.body);
        if (!updatedStory) {
          return sendResponse(res, 404, { error: "Story not found" });
        }

        return sendResponse(res, 200, updatedStory);

      case "DELETE":
        // Delete story
        if (!id) {
          return sendResponse(res, 400, { error: "Story ID is required" });
        }

        const deleted = await StoryAPI.delete(id);
        if (!deleted) {
          return sendResponse(res, 404, { error: "Story not found" });
        }

        return sendResponse(res, 200, { success: true });

      default:
        return sendResponse(res, 405, {
          error: `Method ${method} not allowed`,
        });
    }
  } catch (error) {
    console.error("Stories API error:", error);
    return sendResponse(res, 500, { error: "Internal server error" });
  }
}
