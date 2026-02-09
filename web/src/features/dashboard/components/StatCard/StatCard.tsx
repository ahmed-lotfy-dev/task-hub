"use client";

import { Card } from "@/components/ui/card";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <Card className="flex items-center gap-6 p-6 hover:translate-y-[-4px] transition-transform cursor-pointer group">
      <div className="w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{label}</div>
        <div className="text-3xl font-extrabold">{value}</div>
      </div>
    </Card>
  );
}
