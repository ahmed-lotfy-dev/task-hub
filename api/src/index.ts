import { Elysia } from "elysia";

const app = new Elysia().listen(process.env.PORT || 8000);

app.get("/", () => "Hello From Elysia");
app.get("/health", () => ({ status: "ok" }));





console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
