import { Plugin } from "vite";
import fs from "fs";
import path from "path";

export function apiRoutesPlugin(): Plugin {
  return {
    name: "api-routes",
    configureServer(server) {
      server.middlewares.use("/api", async (req, res, next) => {
        try {
          // Parse the URL to get the route
          const url = new URL(req.url!, `http://${req.headers.host}`);
          const pathname = url.pathname;

          // Map API routes to file handlers
          let handlerPath = "";
          let query: any = {};

          if (pathname.startsWith("/stories")) {
            handlerPath = "./api/stories.ts";
            if (pathname !== "/stories") {
              const id = pathname.split("/")[2];
              query.id = id;
            }
          } else if (pathname.startsWith("/users")) {
            handlerPath = "./api/users.ts";
            if (pathname !== "/users") {
              const id = pathname.split("/")[2];
              query.id = id;
            }
          } else if (pathname.startsWith("/credentials")) {
            handlerPath = "./api/credentials.ts";
            if (pathname !== "/credentials") {
              const service = pathname.split("/")[2];
              query.service = service;
            }
          } else if (pathname.startsWith("/analytics")) {
            handlerPath = "./api/analytics.ts";
            const parts = pathname.split("/");
            if (parts.length > 2) {
              query.action = parts[2];
            }
          }

          if (!handlerPath) {
            return next();
          }

          // Check if handler file exists
          if (!fs.existsSync(handlerPath)) {
            res.statusCode = 404;
            res.end("API handler not found");
            return;
          }

          // Parse URL query parameters
          for (const [key, value] of url.searchParams.entries()) {
            query[key] = value;
          }

          // Parse request body for POST/PUT requests
          let body = "";
          if (req.method === "POST" || req.method === "PUT") {
            req.on("data", (chunk) => {
              body += chunk.toString();
            });

            await new Promise((resolve) => {
              req.on("end", resolve);
            });
          }

          // Load and execute the handler
          const handlerModule = await import(handlerPath);
          const handler = handlerModule.default;

          // Create request/response objects
          const request = {
            method: req.method,
            query,
            body: body ? JSON.parse(body) : undefined,
            headers: req.headers,
          };

          const response = {
            status: (code: number) => {
              res.statusCode = code;
              return response;
            },
            json: (data: any) => {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(data));
            },
            end: (data?: string) => {
              res.end(data);
            },
            setHeader: (name: string, value: string) => {
              res.setHeader(name, value);
            },
          };

          // Execute the handler
          await handler(request, response);
        } catch (error) {
          console.error("API Error:", error);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Internal server error" }));
        }
      });
    },
  };
}
