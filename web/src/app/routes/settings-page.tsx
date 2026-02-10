import { useState } from "react";
import { User, Monitor, Shield, Key, Bell } from "lucide-react";
import { APIKeyManager } from "@/components/settings/api-key-manager";
import { cn } from "@/lib/utils";
import { AppearanceSettings } from "@/components/settings/appearance-settings";

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
    <div className="flex-1 p-6 lg:p-8 bg-background">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account preferences and workspace settings
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-56 shrink-0">
            <nav className="flex flex-row lg:flex-col gap-1 p-1 bg-muted/50 rounded-lg">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-h-[400px]">
            {activeTab === "api" ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
                <APIKeyManager showInfo={false} />
              </div>
            ) : activeTab === "appearance" ? (
              <AppearanceSettings />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-lg bg-muted/30">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                  <Monitor className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-medium text-foreground">Coming Soon</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  This section is currently under development
                </p>
              </div>
            )}
          </main>
        </div>

        {/* Info Section */}
        {activeTab === "api" && (
          <div className="border-t">
            <APIKeyManager infoOnly showHeader={false} />
          </div>
        )}
      </div>
    </div>
  );
}
