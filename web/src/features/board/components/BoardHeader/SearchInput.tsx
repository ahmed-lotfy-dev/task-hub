import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="relative group/search">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/70 group-focus-within/search:text-white transition-colors" />
      <Input
        type="text"
        placeholder="Search tasks..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 w-48 h-8 text-[13px] bg-white/10 border-white/10 hover:bg-white/20 focus:bg-white/20 focus:ring-white/10 transition-all rounded-md text-white placeholder:text-white/60"
      />
    </div>
  );
}
