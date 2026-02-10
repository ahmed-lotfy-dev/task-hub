import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { auth } from "./lib/auth";
import { workspaceRoutes } from "./routes/workspaces";
import { boardRoutes } from "./routes/boards";
import { listRoutes } from "./routes/lists";
import { taskRoutes } from "./routes/tasks";
import { activityRoutes } from "./routes/activities";
import { apiKeyRoutes } from "./routes/api-keys";
import { invitationRoutes } from "./routes/invitations";
import { commentRoutes } from "./routes/comments";
import { notificationRoutes } from "./routes/notifications";
import { memberRoutes } from "./routes/members";
import { testimonialRoutes } from "./routes/testimonials";
import logixlysia from "logixlysia";
import { betterAuth } from "./middleware/auth-middleware";
import { mcpServer } from "./mcp";
import llmText from "./llm.txt";
import { securityHeaders } from "./middleware/security-headers";

const app = new Elysia()
  .onRequest(({ request }) => {
    // Fix for MCP clients that don't send proper Accept headers (e.g., OpenCode)
    // The MCP SDK requires both application/json and text/event-stream
    // This must run BEFORE the mcpServer to patch headers before the transport checks them
    const acceptHeader = request.headers.get("Accept");
    if (acceptHeader && !acceptHeader.includes("text/event-stream")) {
      const newHeaders = new Headers(request.headers);
      newHeaders.set("Accept", `${acceptHeader}, text/event-stream`);
      Object.defineProperty(request, "headers", {
        value: newHeaders,
        writable: false,
      });
    }
  })
  .use(
    openapi({
      scalar: true,
      documentation: { info: { title: "Task Deck API", version: "1.0.0" } },
      path: "/docs",
    }),
  )
  .use(
    cors({
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      credentials: true,
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Cookie",
        "Accept",
        "X-MCP-Protocol-Version",
      ],
      exposeHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .use(logixlysia())
  .use(securityHeaders)
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
      .use(notificationRoutes)
      .use(memberRoutes)
      .use(testimonialRoutes)
      .get("/user", ({ user }) => user, {
        auth: true,
      }),
  )
  .get("/llm.txt", () => llmText)
  .get("/", () => "Hello From Elysia")
  .get("/health", () => ({ status: "ok" }))
  .listen(process.env.PORT || 8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
