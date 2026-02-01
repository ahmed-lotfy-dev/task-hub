import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { openapi } from '@elysiajs/openapi'
import { auth } from "./lib/auth";
import { workspaceRoutes } from "./routes/workspaces";
import { boardRoutes } from "./routes/boards";
import { listRoutes } from "./routes/lists";
import { taskRoutes } from "./routes/tasks";
import { activityRoutes } from "./routes/activities";
import { apiKeyRoutes } from "./routes/api-keys";
import { betterAuth } from "./middleware/auth-middleware";
import { mcpServer } from "./mcp";

const app = new Elysia()
  .use(openapi({ scalar: true, documentation: { info: { title: "Task Deck API", version: "1.0.0" } }, path: "/docs" }))
  .use(mcpServer)
  .use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  }))
  .use(betterAuth)
  .group("/api", (app) =>
    app
      .use(workspaceRoutes)
      .use(boardRoutes)
      .use(listRoutes)
      .use(taskRoutes)
      .use(activityRoutes)
      .use(apiKeyRoutes)
  )
  .get("/", () => "Hello From Elysia")
  .get("/health", () => ({ status: "ok" }))
  .get("/user", ({ user }) => user, {
    auth: true,
  }).listen(process.env.PORT || 8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
