"use client";

import React from "react";

interface FooterColumnProps {
  title: string;
  children: React.ReactNode;
}

export function FooterColumn({ title, children }: FooterColumnProps) {
  return (
    <div className="flex flex-col gap-6">
      <h4 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em]">{title}</h4>
      <div className="flex flex-col gap-4">
        {children}
      </div>
    </div>
  );
}
