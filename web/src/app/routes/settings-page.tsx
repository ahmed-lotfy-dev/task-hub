import { useState } from "react";
import { User, Monitor, Shield, Key, Bell, Settings as SettingsIcon } from "lucide-react";
import { APIKeyManager } from "@/components/settings/api-key-manager";
import { cn } from "@/lib/utils";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("api");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Monitor },
    { id: "security", label: "Security", icon: Shield },
    { id: "api", label: "API & MCP", icon: Key },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="flex-1 overflow-auto bg-zinc-50/50 p-8 sm:p-12">
      <div className="max-w-[1400px] mx-auto space-y-12">
        <header className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <SettingsIcon className="w-10 h-10 text-primary" />
            Workspace Settings
          </h1>
          <p className="text-muted-foreground text-lg font-medium">Manage your personal preferences and workspace integrations.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Navigation Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <nav className="flex lg:flex-col gap-2 p-2 bg-white/50 backdrop-blur-sm rounded-[32px] border border-white/20 shadow-xl shadow-zinc-200/50 overflow-x-auto lg:overflow-visible">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all whitespace-nowrap lg:whitespace-normal",
                      isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-zinc-400")} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Settings Content - WIDE LAYOUT */}
          <main className="flex-1 min-h-[500px]">
            {activeTab === "api" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
                <APIKeyManager showInfo={false} />
              </div>
            )}

            {activeTab !== "api" && (
              <div className="flex flex-col items-center justify-center py-32 text-center bg-white/50 backdrop-blur-sm rounded-[48px] border border-dashed border-zinc-200">
                <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mb-6">
                  <SettingsIcon className="w-10 h-10 text-zinc-300" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-400">Section Under Development</h3>
                <p className="text-muted-foreground font-medium max-w-sm mt-2">
                  We're currently polishing the {activeTab} settings to ensure a premium experience.
                </p>
              </div>
            )}
          </main>
        </div>

        {/* Full-width AI Bridge Section at the bottom */}
        {activeTab === "api" && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
            <div className="mt-12 pt-12 border-t border-zinc-200">
              <APIKeyManager infoOnly showHeader={false} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
