import fs from "fs";
import path from "path";

export function apiMiddleware() {
  return {
    name: "api-middleware",
    configureServer(server) {
      server.middlewares.use("/api", async (req, res, next) => {
        try {
          // Parse request body for POST/PUT requests
          if (req.method === "POST" || req.method === "PUT") {
            let body = "";
            req.on("data", (chunk) => {
              body += chunk.toString();
            });

            await new Promise((resolve) => {
              req.on("end", () => {
                try {
                  req.body = body ? JSON.parse(body) : {};
                } catch (error) {
                  req.body = {};
                }
                resolve();
              });
            });
          }

          // Parse URL to get the endpoint
          const url = new URL(req.url, `http://${req.headers.host}`);
          const apiPath = url.pathname.replace("/api", "");

          console.log(`[API] ${req.method} ${apiPath}`);

          // Route to actual API files
          const apiFileName = apiPath.split("/")[1].split("?")[0];
          const apiFilePath = path.join(process.cwd(), "api", `${apiFileName}.js`);

          if (fs.existsSync(apiFilePath)) {
            try {
              // Import and execute the API handler
              const apiHandler = await import(apiFilePath);
              const handler = apiHandler.default;

              if (typeof handler === "function") {
                return await handler(req, res);
              } else {
                console.error(`[API] Invalid handler in ${apiFilePath}`);
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                return res.end(
                  JSON.stringify({ error: "Invalid API handler" }),
                );
              }
            } catch (error) {
              console.error(`[API] Error loading ${apiFilePath}:`, error);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              return res.end(
                JSON.stringify({
                  error: "API handler error",
                  details: error.message,
                }),
              );
            }
          }

          // If no API handler found, return 404
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          return res.end(
            JSON.stringify({ error: `API endpoint not found: ${apiPath}` }),
          );
        } catch (error) {
          console.error("[API] Error:", error);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          return res.end(JSON.stringify({ error: "Internal server error" }));
        }
      });
    },
  };
}

// Fallback handler for when no API file is found
function fallbackResponse(res, apiPath) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  res.statusCode = 404;
  return res.end(
    JSON.stringify({
      error: `API endpoint not found: ${apiPath}`,
      availableEndpoints: [
        "/api/stories",
        "/api/users",
        "/api/credentials",
        "/api/analytics",
        "/api/health",
        "/api/test"
      ]
    }),
  );
}
}