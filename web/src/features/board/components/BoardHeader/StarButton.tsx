import { Star } from "lucide-react";

export function StarButton() {
  return (
    <button className="text-muted-foreground hover:text-amber-500 transition-all duration-200 hover:scale-110 active:scale-95">
      <Star className="w-4 h-4" />
    </button>
  );
}
