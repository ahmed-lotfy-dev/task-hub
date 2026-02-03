import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

const isServer = typeof window === 'undefined';
const baseURL = isServer
  ? (process.env.VITE_API_URL || "http://api:8000")
  : (import.meta.env.VITE_BACKEND_API_URL || "/api");

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