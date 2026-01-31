"use client";

import { Github, Twitter, Linkedin } from "lucide-react";
import { FooterColumn } from "./footer-column";
import { FooterLink } from "./footer-link";
import { SocialLink } from "./social-link";

export function LandingFooter() {
  return (
    <footer className="w-full bg-white border-t border-zinc-100 py-20 mt-40">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl">T</div>
            <span className="text-2xl font-extrabold tracking-tight">Task<span className="text-primary">Hub</span></span>
          </div>
          <p className="text-muted-foreground font-medium leading-relaxed">
            The most tactile project management tool ever built. Playful by design, powerful in practice.
          </p>
          <div className="flex items-center gap-4">
            <SocialLink icon={<Twitter className="w-5 h-5" />} />
            <SocialLink icon={<Github className="w-5 h-5" />} />
            <SocialLink icon={<Linkedin className="w-5 h-5" />} />
          </div>
        </div>

        <FooterColumn title="Product">
          <FooterLink label="Features" />
          <FooterLink label="Pricing" />
          <FooterLink label="Integrations" />
          <FooterLink label="Task Hub AI" />
        </FooterColumn>

        <FooterColumn title="Resources">
          <FooterLink label="Documentation" />
          <FooterLink label="Templates" />
          <FooterLink label="Community" />
          <FooterLink label="Guides" />
        </FooterColumn>

        <FooterColumn title="Legal">
          <FooterLink label="Privacy Policy" />
          <FooterLink label="Terms of Service" />
          <FooterLink label="Cookie Policy" />
          <FooterLink label="Security" />
        </FooterColumn>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-zinc-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">© 2026 Task Hub Inc. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <span className="text-sm font-bold text-zinc-400 cursor-pointer hover:text-primary transition-colors uppercase tracking-widest">Status</span>
          <span className="text-sm font-bold text-zinc-400 cursor-pointer hover:text-primary transition-colors uppercase tracking-widest">Twitter</span>
        </div>
      </div>
    </footer>
  );
}
