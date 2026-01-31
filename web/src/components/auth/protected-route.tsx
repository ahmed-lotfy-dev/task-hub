import { useSession } from "@/lib/auth-client";
import { useRouter, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Client-side protected route component
 * Uses better-auth's useSession hook directly
 * Redirects to login if user is not authenticated
 */
export function ProtectedRoute({
  children,
  fallback,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isPending && !session) {
      // Redirect to login with return URL
      router.navigate({
        to: redirectTo as any,
        search: { returnUrl: pathname } as any
      });
    }
  }, [session, isPending, router, pathname, redirectTo]);

  // Show fallback or nothing while checking auth
  if (isPending) {
    return fallback || <div>Loading...</div>;
  }

  // Only render children if authenticated
  if (!session) {
    return null;
  }

  return <>{children}</>;
}
