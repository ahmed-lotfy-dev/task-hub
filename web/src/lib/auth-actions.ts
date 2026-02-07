import { authClient } from "./auth-client";

const baseURL = process.env.VITE_BACKEND_API_URL || "https://api.ahmedlotfy.site";

/**
 * Standard utility to fetch session data with optional cookie forwarding.
 * Useful for checking session status in components or custom hooks.
 */
export async function getSession(cookie?: string) {
  try {
    const response = await fetch(`${baseURL}/api/auth/get-session`, {
      headers: {
        cookie: cookie || "",
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

/**
 * Client-side Sign In with Email
 * Note: Support for email/password is removed from UI but kept in logic for potential future use.
 */
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

/**
 * Client-side Sign Up with Email
 */
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

/**
 * Sign In with Google
 * callbackURL defaults to absolute /home on the client
 */
export async function signInWithGoogle(callbackURL?: string) {
  try {
    const result = await authClient.signIn.social({
      provider: "google",
      callbackURL: callbackURL || `${window.location.origin}/home`,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Google sign in failed:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Sign Out User
 */
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
