import { useSession, signOut } from "@/lib/auth-client";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

/**
 * User button component that shows login/signup or user menu
 * based on authentication state
 */
export function UserButton() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  if (isPending) {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-4">
        <Link to="/login">
          <Button variant="ghost" size="sm">Sign in</Button>
        </Link>
        <Link to="/signup">
          <Button size="sm">Get Started</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-zinc-600">
        {session.user.name || session.user.email}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignOut}
        className="text-zinc-500 hover:text-destructive hover:bg-red-50"
      >
        Sign out
      </Button>
    </div>
  );
}
