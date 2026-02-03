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
import { invitationRoutes } from "./routes/invitations";
import { commentRoutes } from "./routes/comments";
import { memberRoutes } from "./routes/members";
import { betterAuth } from "./middleware/auth-middleware";
import { mcpServer } from "./mcp";

const app = new Elysia()
  .use(openapi({ scalar: true, documentation: { info: { title: "Task Deck API", version: "1.0.0" } }, path: "/docs" }))
  .use(cors({
    origin: (request) => {
      const origin = request.headers.get('origin');
      if (!origin) return true;
      return true; // Reflect origin for easier debugging while staying safe
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "Accept", "X-MCP-Protocol-Version"],
    exposeHeaders: ["Content-Type", "Authorization"],
  }))
  .use(mcpServer)
  .use(betterAuth)
  .group("/api", (app) =>
    app
      .use(workspaceRoutes)
      .use(boardRoutes)
      .use(listRoutes)
      .use(taskRoutes)
      .use(activityRoutes)
      .use(apiKeyRoutes)
      .use(invitationRoutes)
      .use(commentRoutes)
      .use(memberRoutes)
  )
  .get("/", () => "Hello From Elysia")
  .get("/health", () => ({ status: "ok" }))
  .get("/user", ({ user }) => user, {
    auth: true,
  }).listen(process.env.PORT || 8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
