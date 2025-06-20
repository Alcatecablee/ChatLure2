import { CredentialsAPI } from "../src/lib/api-server.js";

export default async function handler(req, res) {
  const { method } = req;
  const { service } = req.query;

  try {
    switch (method) {
      case "GET":
        // Get all credentials
        const credentials = await CredentialsAPI.getAll();
        return res.status(200).json(credentials);

      case "PUT":
        // Update credentials for a specific service
        if (!service || !["reddit", "clerk", "paypal"].includes(service)) {
          return res.status(400).json({ error: "Valid service is required" });
        }

        await CredentialsAPI.updateCredentials(service, req.body);
        const updatedCredentials = await CredentialsAPI.getAll();

        return res.status(200).json(updatedCredentials);

      default:
        res.setHeader("Allow", ["GET", "PUT"]);
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error("Credentials API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
