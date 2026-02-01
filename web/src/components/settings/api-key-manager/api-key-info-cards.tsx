import { Monitor, Copy, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ApiKeyInfoCardsProps {
  onCopy: (text: string) => void;
  generatedKey?: string | null;
}

export function ApiKeyInfoCards({ onCopy, generatedKey }: ApiKeyInfoCardsProps) {
  const handleCopyClaudeConfig = () => {
    onCopy(
      `"taskflow": {
  "type": "http",
  "url": "https://api.ahmedlotfy.site/mcp",
  "headers": {
    "Authorization": "Bearer ${generatedKey || "YOUR_KEY_HERE"}"
  }
}`
    );
  };

  const handleCopyAIPrompt = () => {
    onCopy(
      `You have access to the TaskHub MCP server. Start by calling 'list_workspaces' to see my available environments, then help me manage my boards and tasks.`
    );
  };

  return (
    <>
      <div className="space-y-6">
        <Card className="p-8 bg-zinc-900 text-white rounded-[48px] shadow-2xl shadow-zinc-500/20 border-none relative overflow-hidden group min-h-[450px] flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/40 transition-all duration-700" />

          <div className="relative space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center transition-transform group-hover:rotate-12 duration-500">
                <Monitor className="w-6 h-6 text-primary" />
              </div>
              <div className="bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20">
                <span className="text-primary text-[10px] font-black tracking-widest uppercase">
                  Cloud Bridge
                </span>
              </div>
            </div>

            <h3 className="font-black text-3xl tracking-tight leading-none">AI Agent Bridge</h3>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed">
              Connect your workspace directly to Claude Desktop or any AI Agent via a secure public
              SSE URL.
            </p>

            <div className="bg-black/40 rounded-3xl p-6 border border-white/5 font-mono text-[11px] leading-relaxed group/code shadow-inner">
              <div className="flex items-center justify-between mb-3 text-zinc-600 uppercase tracking-[0.2em] text-[10px] font-black">
                <span>Claude Desktop JSON</span>
                <button
                  onClick={handleCopyClaudeConfig}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" /> COPY
                </button>
              </div>
              <pre className="text-primary/70 overflow-x-auto whitespace-pre-wrap break-all leading-normal">
                {`"taskflow": {
  "type": "http",
  "url": ".../mcp",
  "headers": {
    "Authorization": "Bearer ${generatedKey ? generatedKey.slice(0, 10) + "..." : "..."}"
  }
}`}
              </pre>
            </div>
          </div>

          <Button
            className="w-full h-14 rounded-3xl bg-white text-black font-black hover:bg-zinc-200 transition-all hover:scale-[1.02] active:scale-95 text-base relative z-10"
            onClick={() => window.open("https://modelcontextprotocol.io/introduction", "_blank")}
          >
            MCP Protocol Docs
          </Button>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-4">
        <div className="p-8 rounded-[40px] bg-white border border-zinc-100 shadow-xl shadow-zinc-200/50 space-y-4">
          <h4 className="font-black text-zinc-900 flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-accent" />
            Security Policy
          </h4>
          <ul className="space-y-4">
            {[
              "Never expose keys in client-side code",
              "Use specific keys for unique agents",
              "Rotate keys regularly for protection",
              "Revoke any keys showing latency",
            ].map((tip, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-zinc-500 font-bold">
                <div className="w-2 h-2 rounded-full bg-accent/20 border border-accent/40 shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-8 rounded-[40px] bg-white border border-zinc-100 shadow-xl shadow-zinc-200/50 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-black text-zinc-900 flex items-center gap-3">
              <Monitor className="w-6 h-6 text-primary" />
              AI Orientation Guide
            </h4>
            <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-200/50">
              <p className="text-[11px] text-zinc-500 font-bold mb-3 uppercase tracking-wider">
                Paste this to your AI:
              </p>
              <div className="bg-white p-4 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-600 relative group/prompt leading-relaxed">
                "You have access to the TaskHub MCP server. Start by calling 'list_workspaces' to see
                my available environments, then help me manage my boards and tasks."
                <button
                  onClick={handleCopyAIPrompt}
                  className="absolute top-2 right-2 opacity-0 group-hover/prompt:opacity-100 transition-opacity bg-zinc-900 text-white p-1.5 rounded-lg"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
