"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && !session) {
      // Redirect to login with return URL
      const returnUrl = encodeURIComponent(pathname);
      router.push(`${redirectTo}?returnUrl=${returnUrl}`);
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

/**
 * Server-side auth check helper
 * Use this in Server Components
 */
export async function getServerSession() {
  const { getSession } = await import("@/lib/auth-actions");
  return getSession();
}
