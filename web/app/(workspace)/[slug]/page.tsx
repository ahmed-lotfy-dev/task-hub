"use client";

import { Button } from "@/components/reusable/button";
import { Plus, Filter, ArrowUpDown, Search, Settings, Share2, Star, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { BoardColumn } from "@/components/workspace/board-column";
import { TaskCard } from "@/components/workspace/task-card";

export default function WorkspacePage() {
  const { slug } = useParams();

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary shadow-lg flex items-center justify-center text-white text-2xl font-bold">
              {typeof slug === 'string' ? slug[0].toUpperCase() : 'W'}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-[#2D3748] tracking-tight flex items-center gap-3">
                {slug}
                <Star className="w-6 h-6 text-zinc-300 hover:text-accent cursor-pointer transition-colors" />
              </h1>
              <p className="text-muted-foreground font-medium flex items-center gap-1">
                Team Workspace <span className="mx-2">•</span> <Users className="w-4 h-4" /> 12 Members
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3 mr-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-[#F8FAFC] bg-zinc-200 cursor-pointer hover:translate-y-[-4px] transition-transform" />
              ))}
              <div className="w-10 h-10 rounded-full border-4 border-[#F8FAFC] bg-white flex items-center justify-center text-xs font-bold text-zinc-400 shadow-sm cursor-pointer hover:translate-y-[-4px] transition-transform">
                +8
              </div>
            </div>
            <Button variant="white" className="flex items-center gap-2 cursor-pointer shadow-sm border border-zinc-100">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button className="flex items-center gap-2 cursor-pointer">
              <Plus className="w-5 h-5" />
              Add Ticket
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
                className="pl-11 pr-4 py-2.5 rounded-xl bg-white border border-transparent shadow-sm focus:border-primary/20 focus:outline-none w-64 text-sm font-medium"
              />
            </div>
            <div className="h-8 w-px bg-zinc-200 mx-2" />
            <button className="px-4 py-2.5 rounded-xl hover:bg-white hover:shadow-sm transition-all text-sm font-bold text-zinc-600 flex items-center gap-2 cursor-pointer">
              <Filter className="w-4 h-4" />
              All Tasks
            </button>
            <button className="px-4 py-2.5 rounded-xl hover:bg-white hover:shadow-sm transition-all text-sm font-bold text-zinc-600 flex items-center gap-2 cursor-pointer">
              <ArrowUpDown className="w-4 h-4" />
              Sort by: Newest
            </button>
          </div>
          <div className="flex items-center gap-2 mr-2">
            <button className="p-2.5 rounded-xl hover:bg-white hover:shadow-sm transition-all cursor-pointer">
              <Settings className="w-5 h-5 text-zinc-500" />
            </button>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-4 gap-8 items-start min-h-[60vh]">
        <BoardColumn title="Backlog" count={5}>
          <TaskCard
            title="Fix header responsiveness"
            tags={["Bug"]}
            members={1}
            comments={2}
          />
          <TaskCard
            title="Add data export to CSV"
            tags={["Feature"]}
            members={2}
          />
        </BoardColumn>

        <BoardColumn title="In Progress" count={2}>
          <TaskCard
            title="Implement MCP Client"
            tags={["Dev", "AI"]}
            members={3}
            comments={8}
          />
          <TaskCard
            title="Design System Polish"
            tags={["Design"]}
            members={2}
            comments={12}
          />
        </BoardColumn>

        <BoardColumn title="Review" count={1}>
          <TaskCard
            title="Mobile App Navigation"
            tags={["Mobile"]}
            members={1}
            comments={4}
          />
        </BoardColumn>

        <BoardColumn title="Completed" count={14}>
          <TaskCard
            title="Initial project setup"
            tags={["Dev"]}
            members={1}
            isDone
          />
          <TaskCard
            title="Database migration script"
            tags={["Infra"]}
            members={1}
            isDone
          />
        </BoardColumn>
      </div>
    </div>
  );
}
