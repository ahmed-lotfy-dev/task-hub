import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlobalCreateTaskDialog } from "@/features/board/components/GlobalCreateTaskDialog/GlobalCreateTaskDialog";

interface HomeHeaderProps {
  userName: string | undefined;
}

export function HomeHeader({ userName }: HomeHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex flex-col gap-2">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-slate-900 tracking-tight font-sans"
        >
          Good Morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-500">{userName?.split(" ")[0]}!</span> 👋
        </motion.h1>
        <p className="text-slate-500 text-lg font-medium">
          Here's your productivity overview for today.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-600 transition-colors" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="pl-11 pr-4 py-3 rounded-2xl bg-white/50 backdrop-blur-sm shadow-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 w-64 font-medium transition-all"
          />
        </div>
        <GlobalCreateTaskDialog>
          <Button className="flex items-center gap-2 cursor-pointer rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/10 transition-all hover:scale-105 active:scale-95">
            <Plus className="w-5 h-5" />
            New Task
          </Button>
        </GlobalCreateTaskDialog>
      </div>
    </header>
  );
}
