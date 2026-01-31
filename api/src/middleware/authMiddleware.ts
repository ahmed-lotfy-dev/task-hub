import { Elysia } from "elysia";
import { auth } from "../lib/auth";

export const betterAuth = new Elysia({ name: "better-auth" })
  .mount(auth.handler)
  .derive(async ({ request: { headers } }) => {
    const session = await auth.api.getSession({
      headers,
    });

    return {
      user: session?.user ?? null,
      session: session?.session ?? null,
    };
  })
  .macro({
    auth(enabled: boolean) {
      if (!enabled) return;

      return {
        beforeHandle({ user, set }) {
          if (!user) {
            set.status = 401;
            return { message: "Unauthorized" };
          }
        }
      }
    }
  });