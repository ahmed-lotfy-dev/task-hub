import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { openapi} from '@elysiajs/openapi'
import { betterAuth } from "./middleware/authMiddleware";

const app = new Elysia()
  .use(openapi({scalar: true, documentation: {info: {title: "Task Deck API", version: "1.0.0"}},path: "/docs"}))
  .use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }))
  .use(betterAuth)
  .get("/", () => "Hello From Elysia")
  .get("/health", () => ({ status: "ok" }))
  .get("/user", ({ user }) => user, {
    auth: true,
  })
  .listen(process.env.PORT || 8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
