"use client";

import Link from "next/link";
import React from "react";

interface FooterLinkProps {
  label: string;
  href?: string;
}

export function FooterLink({ label, href = "#" }: FooterLinkProps) {
  return (
    <Link href={href} className="text-muted-foreground font-bold hover:text-primary transition-colors cursor-pointer text-sm">
      {label}
    </Link>
  );
}
