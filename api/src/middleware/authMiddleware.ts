import { Elysia } from "elysia";
import { auth } from "../lib/auth";

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