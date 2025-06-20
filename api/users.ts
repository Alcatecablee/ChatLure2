import { UserAPI, type User } from "../src/lib/api";

export default async function handler(req: any, res: any) {
  const { method } = req;
  const { id } = req.query;

  try {
    switch (method) {
      case "GET":
        if (id) {
          // Get single user
          const user = await UserAPI.getById(id as string);
          if (!user) {
            return res.status(404).json({ error: "User not found" });
          }
          return res.status(200).json(user);
        } else {
          // Get all users
          const users = await UserAPI.getAll();
          return res.status(200).json(users);
        }

      case "POST":
        // Create new user
        if (!req.body.id || !req.body.email) {
          return res.status(400).json({ error: "ID and email are required" });
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

        return res.status(201).json(newUser);

      case "PUT":
        // Update user activity
        if (!id) {
          return res.status(400).json({ error: "User ID is required" });
        }

        await UserAPI.updateActivity(id as string);
        const updatedUser = await UserAPI.getById(id as string);

        return res.status(200).json(updatedUser);

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT"]);
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error("Users API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
