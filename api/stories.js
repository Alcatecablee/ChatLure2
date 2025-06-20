import { StoryAPI } from "../src/lib/api-server.js";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  try {
    switch (method) {
      case "GET":
        if (id) {
          // Get single story
          const story = await StoryAPI.getById(id);
          if (!story) {
            return res.status(404).json({ error: "Story not found" });
          }
          return res.status(200).json(story);
        } else {
          // Get all stories
          const stories = await StoryAPI.getAll();
          return res.status(200).json(stories);
        }

      case "POST":
        // Create new story
        if (!req.body.title || !req.body.genre) {
          return res
            .status(400)
            .json({ error: "Title and genre are required" });
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

        return res.status(201).json(newStory);

      case "PUT":
        // Update story
        if (!id) {
          return res.status(400).json({ error: "Story ID is required" });
        }

        const updatedStory = await StoryAPI.update(id, req.body);
        if (!updatedStory) {
          return res.status(404).json({ error: "Story not found" });
        }

        return res.status(200).json(updatedStory);

      case "DELETE":
        // Delete story
        if (!id) {
          return res.status(400).json({ error: "Story ID is required" });
        }

        const deleted = await StoryAPI.delete(id);
        if (!deleted) {
          return res.status(404).json({ error: "Story not found" });
        }

        return res.status(200).json({ success: true });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error("Stories API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
