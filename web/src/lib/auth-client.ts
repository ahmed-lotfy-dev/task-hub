import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

const baseURL = (import.meta.env.SSR
  ? (process.env.VITE_API_URL || "http://api:8000")
  : window.location.origin) + "/api";

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