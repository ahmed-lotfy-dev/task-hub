import { useSession } from "@/lib/auth-client";
import { useNavigate, useLocation } from "react-router";
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
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isPending && !session) {
      // Redirect to login with return URL
      navigate(redirectTo, { state: { returnUrl: pathname } });
    }
  }, [session, isPending, navigate, pathname, redirectTo]);

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
