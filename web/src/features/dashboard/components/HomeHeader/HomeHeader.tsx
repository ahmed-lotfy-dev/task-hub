"use client";

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
          className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight"
        >
          Welcome back, <span className="text-primary">{userName?.split(" ")[0]}</span>
        </motion.h1>
        <p className="text-muted-foreground text-base">
          Here is a focused overview of your work today.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="pl-10 pr-4 h-11 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 w-64 text-sm font-medium transition-all"
          />
        </div>
        <GlobalCreateTaskDialog>
          <Button className="flex items-center gap-2 cursor-pointer rounded-xl">
            <Plus className="w-5 h-5" />
            New Task
          </Button>
        </GlobalCreateTaskDialog>
      </div>
    </header>
  );
}
