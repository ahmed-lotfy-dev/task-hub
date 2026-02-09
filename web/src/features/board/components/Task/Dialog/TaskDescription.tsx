import { Textarea } from "@/components/ui/textarea";
import { AlignLeft } from "lucide-react";

interface TaskDetailDescriptionProps {
  description: string;
  setDescription: (desc: string) => void;
  onUpdate: (data: any) => void;
}

export function TaskDetailDescription({
  description,
  setDescription,
  onUpdate,
}: TaskDetailDescriptionProps) {
  return (
    <div className="space-y-4 group/desc">
      <div className="flex items-center gap-2.5">
        <AlignLeft className="w-4 h-4 text-zinc-400 stroke-[2.5]" />
        <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wider">Description</h3>
      </div>

      <div className="relative">
        <Textarea
          className="min-h-[180px] p-4 text-sm font-medium leading-relaxed bg-muted/30 border-none shadow-none ring-1 ring-zinc-200/50 focus-visible:ring-primary/20 focus-visible:bg-white resize-none transition-all rounded-2xl placeholder:text-zinc-300 placeholder:italic"
          placeholder="Add a more detailed description about this task..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => {
            onUpdate({ description });
          }}
        />
        <div className="absolute bottom-3 right-3 opacity-0 group-focus-within/desc:opacity-100 transition-opacity">
          <span className="text-[10px] font-bold text-zinc-400 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md border border-zinc-100 shadow-sm">
            Auto-saving
          </span>
        </div>
      </div>
    </div>
  );
}
