import { useWorkspaceMembers } from "@/hooks/use-workspace-members";
import { MemberAvatars } from "@/components/ui/MemberAvatars/MemberAvatars";

interface WorkspaceItemProps {
  name: string;
  icon: string;
  onClick?: () => void;
}

export function WorkspaceItem({ name, icon, workspaceId, onClick }: WorkspaceItemProps & { workspaceId: string }) {
  const { data: members } = useWorkspaceMembers(workspaceId);

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-3 rounded-xl hover:bg-white hover:shadow-md hover:ring-1 hover:ring-zinc-100 transition-all duration-200 cursor-pointer group bg-transparent"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-zinc-800">{name}</span>
          <div className="flex items-center gap-2 mt-0.5">
            <MemberAvatars
              members={members || []}
              maxVisible={2}
              showCount={true}
              className="scale-90 origin-left"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
