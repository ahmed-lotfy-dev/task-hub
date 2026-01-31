"use client";

import React from "react";

interface SocialLinkProps {
  icon: React.ReactNode;
  href?: string;
}

export function SocialLink({ icon, href = "#" }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-primary hover:bg-white hover:shadow-sm transition-all cursor-pointer"
    >
      {icon}
    </a>
  );
}
