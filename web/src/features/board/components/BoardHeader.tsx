"use client";

import { Button } from '@/components/ui/button';
import { Plus, Filter, ArrowUpDown, Search, Settings, Star, Users, UserPlus } from 'lucide-react';
import { InviteDialog } from '@/components/invitation/invite-dialog';

interface BoardHeaderProps {
  board: any;
  boardId: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSettingsClick?: () => void;
}

export function BoardHeader({ board, boardId, searchQuery, setSearchQuery, onSettingsClick }: BoardHeaderProps) {
  return (
    <header className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary shadow-lg flex items-center justify-center text-white text-2xl font-bold">
            {board?.name?.[0]?.toUpperCase() || 'B'}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-[#2D3748] tracking-tight flex items-center gap-3">
              {board?.name || 'Board'}
              <Star className="w-6 h-6 text-zinc-300 hover:text-accent cursor-pointer transition-colors" />
            </h1>
            <p className="text-muted-foreground font-medium flex items-center gap-1">
              Workspace Board <span className="mx-2">•</span> <Users className="w-4 h-4" /> Team Access
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3 mr-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-4 border-[#F8FAFC] bg-zinc-200 cursor-pointer hover:translate-y-[-4px] transition-transform" />
            ))}
            <div className="w-10 h-10 rounded-full border-4 border-[#F8FAFC] bg-white flex items-center justify-center text-xs font-bold text-zinc-400 shadow-sm cursor-pointer hover:translate-y-[-4px] transition-transform">
              +3
            </div>
          </div>
          <InviteDialog
            boardId={boardId}
            trigger={
              <Button variant="white" className="flex items-center gap-2 cursor-pointer shadow-sm border border-zinc-100">
                <UserPlus className="w-4 h-4" />
                Invite
              </Button>
            }
          />
          <Button className="flex items-center gap-2 cursor-pointer">
            <Plus className="w-5 h-5" />
            Add List
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white/50 backdrop-blur-sm p-2 rounded-2xl border border-white/20">
        <div className="flex items-center gap-2">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Filter tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-2.5 rounded-xl bg-white border border-transparent shadow-sm focus:border-primary/20 focus:outline-none w-64 text-sm font-medium"
            />
          </div>
          <div className="h-8 w-px bg-zinc-200 mx-2" />
          <button className="px-4 py-2.5 rounded-xl hover:bg-white hover:shadow-sm transition-all text-sm font-bold text-zinc-600 flex items-center gap-2 cursor-pointer">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="px-4 py-2.5 rounded-xl hover:bg-white hover:shadow-sm transition-all text-sm font-bold text-zinc-600 flex items-center gap-2 cursor-pointer">
            <ArrowUpDown className="w-4 h-4" />
            Sort
          </button>
        </div>
        <div className="flex items-center gap-2 mr-2">
          <button
            onClick={onSettingsClick}
            className="p-2.5 rounded-xl hover:bg-white hover:shadow-sm transition-all cursor-pointer"
          >
            <Settings className="w-5 h-5 text-zinc-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
