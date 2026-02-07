import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Plus, X, Check, Users, Calendar, Tag, Info } from "lucide-react";

interface TaskDetailSidebarProps {
  assignees: any[];
  candidates: any[];
  currentUserId?: string;
  onAssign: (userId: string) => void;
  onUnassign: (userId: string) => void;
}

export function TaskDetailSidebar({
  assignees,
  candidates,
  currentUserId,
  onAssign,
  onUnassign,
}: TaskDetailSidebarProps) {
  return (
    <div className="space-y-10 group/sidebar">
      {/* Assignees Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Users className="w-3.5 h-3.5 stroke-[2.5]" />
            Assignees
          </h3>
        </div>

        <div className="flex flex-col gap-2.5">
          {assignees?.map((assignee: any) => (
            <div
              key={assignee.id}
              className="flex items-center gap-3 p-1.5 pr-2 rounded-xl border border-zinc-100/50 bg-white hover:border-zinc-200 transition-all group/item shadow-sm hover:shadow-md"
            >
              <Avatar className="w-7 h-7 ring-2 ring-zinc-50 border-white">
                <AvatarImage src={assignee.image} />
                <AvatarFallback className="text-[10px] font-bold bg-zinc-100 text-zinc-600">
                  {assignee.name[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-bold text-zinc-700 truncate flex-1 leading-none">
                {assignee.name}
                {assignee.id === currentUserId && <span className="ml-1 opacity-50 font-medium">(You)</span>}
              </span>
              <button
                onClick={() => onUnassign(assignee.id)}
                className="opacity-0 group-hover/item:opacity-100 text-zinc-300 hover:text-red-500 transition-all p-1 hover:bg-red-50 rounded-md"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center gap-2 text-zinc-400 border-dashed border-2 hover:border-zinc-300 hover:bg-zinc-50 transition-all h-10 rounded-xl"
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs font-bold">Add Member</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-64 rounded-2xl shadow-2xl border-none ring-1 ring-zinc-200" align="end">
              <Command className="rounded-2xl">
                <CommandInput placeholder="Search members..." className="h-12 border-none ring-0 focus-visible:ring-0" />
                <CommandList className="max-h-[300px]">
                  <CommandEmpty className="py-6 text-sm text-zinc-400 font-medium">No members found.</CommandEmpty>
                  <CommandGroup className="p-2">
                    {candidates?.map((candidate) => {
                      const isAssigned = assignees?.some((a: any) => a.id === candidate.id);
                      const isMe = candidate.id === currentUserId;

                      return (
                        <CommandItem
                          key={candidate.id}
                          value={candidate.name}
                          onSelect={() => {
                            console.log("[Sidebar] onSelect triggered", candidate.id);
                            if (isAssigned) {
                              onUnassign(candidate.id);
                            } else {
                              onAssign(candidate.id);
                            }
                          }}
                          className="rounded-xl h-11 px-3 cursor-pointer aria-selected:bg-zinc-100 data-[selected=true]:bg-zinc-100"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <Avatar className="w-6 h-6 ring-2 ring-zinc-50">
                              <AvatarImage src={candidate.image} />
                              <AvatarFallback className="text-[10px] font-bold bg-zinc-100 text-zinc-600">
                                {candidate.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-semibold text-zinc-700 leading-none">
                              {candidate.name}
                              {isMe && <span className="ml-1 opacity-50 text-[10px] font-bold uppercase tracking-tighter">(You)</span>}
                            </span>
                          </div>
                          {isAssigned && <Check className="w-4 h-4 text-primary font-black ml-auto" />}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Placeholder Sections for Premium Look */}
      <div className="pt-6 border-t border-zinc-100 space-y-6">
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />
            Dates
          </h3>
          <Button variant="ghost" className="w-full justify-start text-xs text-zinc-400 font-bold hover:bg-zinc-50 rounded-xl px-2 h-9">
            No due date set
          </Button>
        </div>

        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 stroke-[2.5]" />
            Labels
          </h3>
          <Button variant="ghost" className="w-full justify-start text-xs text-zinc-400 font-bold hover:bg-zinc-50 rounded-xl px-2 h-9">
            Add labels...
          </Button>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-2">
        <div className="flex items-center gap-2 text-zinc-400">
          <Info className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black uppercase tracking-wider">Metatada</span>
        </div>
        <div className="text-[10px] font-bold text-zinc-500 leading-relaxed">
          Task created by <span className="text-zinc-900">Ahmed Lotfy</span> yesterday.
        </div>
      </div>
    </div>
  );
}
