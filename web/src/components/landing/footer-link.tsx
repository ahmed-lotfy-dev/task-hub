import { Link } from "react-router";

interface FooterLinkProps {
  label: string;
  href?: string;
}

export function FooterLink({ label, href = "#" }: FooterLinkProps) {
  return (
    <Link to={href} className="text-muted-foreground font-bold hover:text-primary transition-colors cursor-pointer text-sm">
      {label}
    </Link>
  );
}
