import { seedDatabase } from "../src/lib/seed";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const result = await seedDatabase();

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Database seeded successfully",
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Seeding API error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to seed database",
    });
  }
}
