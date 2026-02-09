import { Link, useLocation, useNavigate } from "react-router";
import { Home, Inbox, CheckCircle2, Settings, History, LogOut, ChevronRight, Hash } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useBoards } from "@/hooks/use-boards";
import { useState } from "react";

export function PersonalSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { data: workspaces } = useWorkspaces();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const links = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Inbox", href: "/inbox", icon: Inbox },
    { name: "My Tasks", href: "/tasks", icon: CheckCircle2 },
    { name: "Activity", href: "/activity", icon: History },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 h-full flex flex-col bg-sidebar border-r border-sidebar-border shadow-sm shrink-0">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-primary-foreground font-bold text-base">T</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-sidebar-foreground">TaskHub</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pb-4 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-0.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-primary-foreground" : "text-sidebar-foreground/40")} />
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Workspaces Section */}
        <div className="pt-8">
          <div className="px-3 mb-3 flex items-center justify-between">
            <span className="text-[10px] font-bold text-sidebar-foreground/30 uppercase tracking-widest">
              Your Workspaces
            </span>
          </div>
          <div className="space-y-4">
            {workspaces?.map((workspace) => (
              <WorkspaceSection key={workspace.id} workspace={workspace} pathname={pathname} />
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500/70 hover:bg-red-50/50 hover:text-red-500 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
}

function WorkspaceSection({ workspace, pathname }: { workspace: any; pathname: string }) {
  const { data: boards } = useBoards(workspace.id);
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="space-y-1">
      <div
        className={cn(
          "group flex items-center gap-2 px-3 py-2 text-sm font-bold rounded-xl transition-all duration-200 text-sidebar-foreground/80 hover:bg-sidebar-accent/30 cursor-pointer",
          pathname.includes(`/workspace/${workspace.slug}`) && "bg-sidebar-accent/50"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <ChevronRight className={cn("w-3.5 h-3.5 transition-transform duration-200 text-sidebar-foreground/30", isExpanded && "rotate-90")} />
        <div className="w-5 h-5 rounded-md bg-zinc-100 flex items-center justify-center text-[10px] text-zinc-600 font-bold border border-zinc-200 group-hover:border-primary/20 group-hover:text-primary transition-colors">
          {workspace.name[0].toUpperCase()}
        </div>
        <span className="truncate flex-1">{workspace.name}</span>
      </div>

      {isExpanded && (
        <div className="pl-9 space-y-1">
          {boards?.map((board) => (
            <Link
              key={board.id}
              to={`/board/${board.id}`}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200",
                pathname === `/board/${board.id}`
                  ? "text-primary bg-primary/5 font-bold"
                  : "text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/20"
              )}
            >
              <Hash className="w-3 h-3 opacity-50" />
              <span className="truncate">{board.name}</span>
            </Link>
          ))}
          {boards?.length === 0 && (
            <div className="px-3 py-2 text-[10px] text-sidebar-foreground/30 italic">
              No boards yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}
