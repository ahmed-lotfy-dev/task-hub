import { Elysia } from "elysia";
import { betterAuth } from "../middleware/authMiddleware";

export const apiInstance = new Elysia({ name: "api-instance" })
  .use(betterAuth);
