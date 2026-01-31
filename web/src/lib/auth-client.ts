import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

// Get the API URL from environment or default to localhost
// Get the API URL from environment
const baseURL = process.env.VITE_BACKEND_API_URL || "http://localhost:8000";

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

// Export typed hooks and fetcher for convenience
export const { useSession, signIn, signOut, signUp } = authClient;
export const $fetch = authClient.$fetch;