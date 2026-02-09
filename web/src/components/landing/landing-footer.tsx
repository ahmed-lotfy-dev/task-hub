"use client";

import { Github, Twitter, Linkedin } from "lucide-react";
import { FooterColumn } from "./footer-column";
import { FooterLink } from "./footer-link";
import { SocialLink } from "./social-link";

export function LandingFooter() {
  return (
    <footer className="w-full bg-white border-t border-slate-100 py-24 mt-40">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/20">T</div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 font-sans">Task<span className="text-cyan-600">Hub</span></span>
          </div>
          <p className="text-slate-500 font-medium leading-relaxed">
            The most clear and tactile project management tool ever built.
            Detailed design, powerful focus.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <SocialLink icon={<Twitter className="w-5 h-5 hover:text-cyan-500 transition-colors" />} />
            <SocialLink icon={<Github className="w-5 h-5 hover:text-slate-900 transition-colors" />} />
            <SocialLink icon={<Linkedin className="w-5 h-5 hover:text-blue-600 transition-colors" />} />
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
      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">© 2026 Task Hub Inc. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <span className="text-sm font-bold text-slate-400 cursor-pointer hover:text-cyan-600 transition-colors uppercase tracking-widest">Status</span>
          <span className="text-sm font-bold text-slate-400 cursor-pointer hover:text-cyan-600 transition-colors uppercase tracking-widest">Twitter</span>
        </div>
      </div>
    </footer>
  );
}
