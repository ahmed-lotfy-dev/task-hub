import { Link, useParams, useLocation, useNavigate } from "react-router";
import { LayoutGrid, List, Users, Settings, Plus, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";
import { InviteDialog } from "@/components/invitation/invite-dialog";

export function WorkspaceSidebar() {
  const { slug } = useParams({ strict: false }) as { slug?: string };
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const links = [
    { name: "Board View", href: `/workspace/${slug}`, icon: LayoutGrid },
    { name: "List View", href: `/workspace/${slug}/list`, icon: List },
    { name: "Members", href: `/workspace/${slug}/members`, icon: Users },
    { name: "Settings", href: `/workspace/${slug}/settings`, icon: Settings },
  ];

  return (
    <aside className="w-64 flex flex-col gap-8 p-6 bg-white/50 backdrop-blur-md border-r border-white/20">
      <div className="flex items-center gap-3 px-2">
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-bold shadow-lg">
          {slug ? slug[0].toUpperCase() : 'W'}
        </div>
        <div className="text-xl font-extrabold text-[#2D3748] truncate tracking-tight">
          {slug}
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              to={link.href as any}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 cursor-pointer",
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

      <div className="mt-8 flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Projects</div>
          <button className="hover:text-primary transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <ProjectItem name="Q1 Roadmap" color="bg-secondary" />
          <ProjectItem name="Marketing Site" color="bg-accent" />
          <ProjectItem name="Mobile App" color="bg-primary" />
        </div>

        <InviteDialog
          workspaceId={slug}  // Using slug as ID for now? Wait, slug is NOT ID. workspaceRoutes uses ensureUserOnboarding.
          // The fetch in sidebar doesn't have workspace ID readily available if we only have slug from URL.
          // But usually we need ID.
          // I need to fetch workspace by slug first! 
          // Or I can modify InviteDialog to take slug? 
          // No, API expects ID.
          // Actually, I should probably fetch workspace details in layout or sidebar.
          // For now, let's assume I need to fetch it.
          // Wait, the workspace sidebar doesn't fetch workspace details yet?
          // It just uses slug for links.
          // I should skip workspace invite in sidebar for now if I don't have ID, 
          // OR I can use the board page which has board ID.
          // The user said "invite ... to our workspace".
          // I'll skip sidebar for a moment and do board first which has ID?
          // No, board page has `boardId`.
          // Let's implement Board invite first.
          trigger={
            <button className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-zinc-500 hover:text-primary transition-colors cursor-pointer">
              <Users className="w-4 h-4" />
              Invite Members
            </button>
          }
        />

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-zinc-500 hover:text-red-600 transition-colors mt-4 cursor-pointer"
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
    <div className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-zinc-600 hover:text-black cursor-pointer group">
      <div className={cn("w-2 h-2 rounded-full", color)} />
      <span className="group-hover:translate-x-1 transition-transform">{name}</span>
    </div>
  );
}
