"use client";

import { useSession, signIn, signOut, signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

/**
 * Simple hook that wraps better-auth's useSession
 * Returns session state and auth methods directly from better-auth
 * No redundant abstraction - use better-auth's methods directly in components
 */
export function useAuth() {
  const sessionQuery = useSession();
  const router = useRouter();

  return {
    // Session state from better-auth
    user: sessionQuery.data?.user,
    session: sessionQuery.data?.session,
    isPending: sessionQuery.isPending,
    error: sessionQuery.error,
    isAuthenticated: !!sessionQuery.data?.user,
    
    // Direct exports from better-auth (use these in components)
    signIn,
    signUp,
    signOut,
  };
}
