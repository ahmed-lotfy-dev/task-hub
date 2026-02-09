interface BoardIconProps {
  name?: string;
}

export function BoardIcon({ name }: BoardIconProps) {
  return (
    <div className="w-8 h-8 rounded-md bg-white/20 backdrop-blur-sm shadow-sm flex items-center justify-center text-white font-bold text-sm border border-white/20 transition-all duration-300">
      {name?.[0]?.toUpperCase() || "B"}
    </div>
  );
}
