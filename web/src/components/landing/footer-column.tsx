"use client";


interface FooterColumnProps {
  title: string;
  children: React.ReactNode;
}

export function FooterColumn({ title, children }: FooterColumnProps) {
  return (
    <div className="flex flex-col gap-6">
      <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">{title}</h4>
      <div className="flex flex-col gap-4">
        {children}
      </div>
    </div>
  );
}
