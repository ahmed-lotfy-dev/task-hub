// Removed next/headers
import { authClient } from "./auth-client";

const baseURL = process.env.VITE_BACKEND_API_URL || "http://localhost:8000";

/**
 * Server-side authentication actions
 * These run on the server and can access cookies/headers
 */

export async function getSession() {
  try {
    // const headersList = await headers();
    const cookie = ""; // Placeholder, will fix with TanStack Server Functions

    const response = await fetch(`${baseURL}/api/auth/get-session`, {
      headers: {
        cookie: cookie,
      },
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const result = await authClient.signIn.email({
      email,
      password,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Sign in failed:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
) {
  try {
    const result = await authClient.signUp.email({
      email,
      password,
      name,
      role: "user",
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Sign up failed:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function signInWithGoogle(callbackURL?: string) {
  try {
    const result = await authClient.signIn.social({
      provider: "google",
      callbackURL: callbackURL || "/",
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    // For OAuth, this will redirect, so we won't reach here
    return { success: true, data: result.data };
  } catch (error) {
    console.error("Google sign in failed:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function signOutUser() {
  try {
    const result = await authClient.signOut();

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Sign out failed:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}


