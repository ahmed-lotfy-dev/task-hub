import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
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