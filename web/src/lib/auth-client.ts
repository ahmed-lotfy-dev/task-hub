import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

const baseURL = import.meta.env.VITE_API_URL;

export const authClient = createAuthClient({
  baseURL,
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string" }
      },
    }),
  ],
});

// Export typed hooks for convenience
export const { useSession, signIn, signOut, signUp } = authClient;