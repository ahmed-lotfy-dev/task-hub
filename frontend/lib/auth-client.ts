import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

// Get the API URL from environment or default to localhost
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const authClient = createAuthClient({
  baseURL,
  plugins: [
    // Add this if you have custom fields in your user schema
    inferAdditionalFields({
      user: {
        // Add any custom fields from your schema here
        role: { type: "string" }
      },
    }),
  ],
});

// Export typed hooks for convenience
export const { useSession, signIn, signOut, signUp } = authClient;