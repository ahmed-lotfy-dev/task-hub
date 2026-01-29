import { Elysia } from "elysia";
import { auth } from "../lib/auth";

/**
 * Better Auth middleware for Elysia
 * 
 * This middleware:
 * 1. Mounts the Better Auth handler for authentication routes
 * 2. Provides a macro for protected routes that require authentication
 * 
 * Usage:
 * ```ts
 * app.use(betterAuth)
 *   .get("/protected", ({ user, session }) => {
 *     return { user, session };
 *   }, { auth: true })
 * ```
 */
export const betterAuth = new Elysia({ name: "better-auth" })
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ set, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });

        if (!session) {
          set.status = 401;
          return { message: "Unauthorized" };
        }

        return {
          user: session.user,
          session: session.session,
        };
      },
    },
  });
