import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Home, Inbox, CheckCircle2, Settings, History, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function PersonalSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  const links = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Inbox", href: "/inbox", icon: Inbox },
    { name: "My Tasks", href: "/tasks", icon: CheckCircle2 },
    { name: "Activity", href: "/activity", icon: History },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 sticky top-0 h-screen flex flex-col gap-8 p-6 bg-white/50 backdrop-blur-md border-r border-white/20 self-start">
      <div className="text-xl font-bold px-2">TaskHub</div>

      <nav className="flex flex-col gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              to={link.href as any}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200",
                isActive
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "hover:bg-zinc-50 text-slate-500"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-semibold">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-2">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-4 mb-2">Workspaces</div>
        <Link to="/personal" className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-600 hover:text-black">
          <div className="w-2 h-2 rounded-full bg-accent" />
          Personal
        </Link>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-zinc-500 hover:text-red-600 transition-colors mt-4 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </aside >
  );
}
