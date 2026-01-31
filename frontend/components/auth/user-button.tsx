"use client";

import { useSession, signOut } from "@/lib/auth-client";
import Link from "next/link";

/**
 * User button component that shows login/signup or user menu
 * based on authentication state
 */
export function UserButton() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="text-sm font-medium px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-700">
        {session.user.name || session.user.email}
      </span>
      <button
        onClick={() => signOut()}
        className="text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        Sign out
      </button>
    </div>
  );
}
