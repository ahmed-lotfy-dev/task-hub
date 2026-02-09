import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SortButton() {
  return (
    <Button variant="ghost" size="sm" className="gap-2 text-zinc-500 hover:text-zinc-900 h-9 px-3 rounded-lg hover:bg-zinc-100 transition-all font-medium">
      <ArrowUpDown className="w-4 h-4" />
      Sort
    </Button>
  );
}
