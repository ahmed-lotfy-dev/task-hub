"use client";


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
      className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-card hover:shadow-sm transition-all cursor-pointer"
    >
      {icon}
    </a>
  );
}
