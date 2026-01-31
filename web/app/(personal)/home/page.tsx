"use client";

import { Card } from "@/components/reusable/card";
import { Button } from "@/components/reusable/button";
import { motion } from "framer-motion";
import { Star, Clock, Calendar, LayoutGrid, ChevronRight, Plus, Search } from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/home/stat-card";
import { BoardCard } from "@/components/home/board-card";
import { TaskItem } from "@/components/home/task-item";
import { ActivityItem } from "@/components/home/activity-item";
import { WorkspaceItem } from "@/components/home/workspace-item";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-[#2D3748] tracking-tight"
          >
            Good Morning! 👋
          </motion.h1>
          <p className="text-muted-foreground text-lg font-medium">Here's your productivity overview for today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-11 pr-4 py-3 rounded-2xl bg-white shadow-sm border border-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 font-medium transition-all"
            />
          </div>
          <Button className="flex items-center gap-2 cursor-pointer">
            <Plus className="w-5 h-5" />
            New Task
          </Button>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <StatCard icon={<Star className="text-accent" />} label="Focus" value="3 Tasks" />
        <StatCard icon={<Clock className="text-primary" />} label="In Progress" value="8h 20m" />
        <StatCard icon={<Calendar className="text-secondary" />} label="Upcoming" value="12 Tasks" />
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <LayoutGrid className="w-6 h-6 text-primary" />
                Recent Boards
              </h2>
              <Link href="/boards" className="text-primary font-bold text-sm hover:underline cursor-pointer flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <BoardCard name="Product Roadmap" workspace="Engineering" color="bg-primary" activeTasks={12} />
              <BoardCard name="Marketing Site" workspace="Growth" color="bg-secondary" activeTasks={5} />
              <BoardCard name="User Research" workspace="Design" color="bg-accent" activeTasks={8} />
              <div className="flex items-center justify-center p-8 rounded-[32px] border-2 border-dashed border-zinc-200 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-sm text-zinc-500 group-hover:text-primary">Create New Board</span>
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold">Priority Focus</h2>
            <div className="flex flex-col gap-4">
              <TaskItem title="Finalize Claymorphic Components" project="TaskHub Design" status="Urgent" />
              <TaskItem title="Integrate Auth Redirects" project="TaskHub Core" status="High" />
              <TaskItem title="Review Isometric Assets" project="Marketing" status="Medium" />
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-8">
          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold">Team Activity</h2>
            <Card className="p-6 flex flex-col gap-6">
              <ActivityItem
                user="Ahmed Lotfy"
                action="moved"
                target="Dashboard Refactor"
                time="2m ago"
              />
              <ActivityItem
                user="Sara Smith"
                action="commented on"
                target="API Design"
                time="15m ago"
              />
              <ActivityItem
                user="Mike Chen"
                action="created"
                target="User Feedback"
                time="1h ago"
              />
              <Button variant="white" className="w-full mt-2 cursor-pointer">View All Activity</Button>
            </Card>
          </section>

          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold">Workspaces</h2>
            <div className="flex flex-col gap-3">
              <WorkspaceItem name="TechFlow" members={12} icon="T" />
              <WorkspaceItem name="Client Projects" members={4} icon="C" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
