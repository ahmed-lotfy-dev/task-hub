"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Inbox, CheckCircle2, Settings, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function PersonalSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Inbox", href: "/inbox", icon: Inbox },
    { name: "My Tasks", href: "/tasks", icon: CheckCircle2 },
  ];

  return (
    <aside className="w-64 flex flex-col gap-8 p-6 bg-white/50 backdrop-blur-md border-r border-white/20">
      <div className="text-xl font-bold px-2">TaskHub</div>

      <nav className="flex flex-col gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200",
                isActive
                  ? "bg-white shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] text-primary"
                  : "hover:bg-white/40 text-muted-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-semibold">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-2">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-4 mb-2">Workspaces</div>
        <Link href="/personal" className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-600 hover:text-black">
          <div className="w-2 h-2 rounded-full bg-accent" />
          Personal
        </Link>
      </div>
    </aside>
  );
}
