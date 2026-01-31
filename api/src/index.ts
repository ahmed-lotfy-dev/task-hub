import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { openapi } from '@elysiajs/openapi'
import { betterAuth } from "./middleware/authMiddleware";
import { workspaceRoutes } from "./routes/workspaces";
import { boardRoutes } from "./routes/boards";
import { taskRoutes } from "./routes/tasks";

const app = new Elysia()
  .use(openapi({ scalar: true, documentation: { info: { title: "Task Deck API", version: "1.0.0" } }, path: "/docs" }))
  .use(cors({
    origin: (request) => {
      const origin = request.headers.get("origin");
      if (!origin) return false;
      const url = new URL(origin);
      return url.hostname === "localhost" || url.hostname.endsWith(".ahmedlotfy.site");
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  }))
  .use(betterAuth)
  .group("/api", (app) =>
    app
      .use(workspaceRoutes)
      .use(boardRoutes)
      .use(taskRoutes)
  )
  .get("/", () => "Hello From Elysia")
  .get("/health", () => ({ status: "ok" }))
  .get("/user", ({ user }) => user, {
    auth: true,
  })
  .listen(process.env.PORT || 8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
