import { Link, useParams, useLocation, useNavigate } from "react-router";
import { LayoutGrid, List, Users, Settings, Plus, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function WorkspaceSidebar() {
  const { slug } = useParams() as { slug?: string };
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const links = [
    { name: "Boards", href: `/workspace/${slug}`, icon: LayoutGrid },
    { name: "Lists", href: `/workspace/${slug}/list`, icon: List },
    { name: "Members", href: `/workspace/${slug}/members`, icon: Users },
    { name: "Settings", href: `/workspace/${slug}/settings`, icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen flex flex-col bg-sidebar border-r border-sidebar-border">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
            {slug ? slug[0].toUpperCase() : 'W'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-sidebar-foreground truncate">
              {slug}
            </div>
            <div className="text-xs text-sidebar-foreground/60">Workspace</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {link.name}
            </Link>
          );
        })}

        {/* Projects Section */}
        <div className="pt-6">
          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wide">
              Projects
            </span>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          <div className="space-y-0.5">
            <ProjectItem name="Q1 Roadmap" color="bg-blue-500" />
            <ProjectItem name="Marketing" color="bg-emerald-500" />
            <ProjectItem name="Mobile App" color="bg-purple-500" />
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
}

function ProjectItem({ name, color }: { name: string; color: string }) {
  return (
    <div className="flex items-center gap-3 px-3 py-1.5 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground cursor-pointer rounded-md hover:bg-sidebar-accent/30 transition-colors">
      <div className={cn("w-2 h-2 rounded-full", color)} />
      <span className="truncate">{name}</span>
    </div>
  );
}
