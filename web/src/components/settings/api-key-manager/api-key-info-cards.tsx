import { Monitor, Copy, ShieldAlert, Zap, Globe, Cpu, ChevronRight, Binary } from "lucide-react";
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
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black tracking-tight text-[#2D3748]">AI Agent Ecosystem</h2>
        <p className="text-muted-foreground font-medium max-w-2xl">
          Scale your productivity by connecting premium LLMs directly to your TaskHub workspace using the Model Context Protocol (MCP).
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Connection Dashboard */}
        <Card className="lg:col-span-3 p-10 bg-zinc-950 text-white rounded-[48px] shadow-2xl shadow-zinc-900/40 border-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] group-hover:bg-primary/30 transition-all duration-1000" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />

          <div className="relative space-y-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-sm">
                  <Cpu className="w-7 h-7 text-primary animate-pulse" />
                </div>
                <div>
                  <h3 className="font-black text-2xl tracking-tight">AI Agent Bridge</h3>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    HTTPS / SSE Stream Active
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                <Globe className="w-4 h-4 text-zinc-400" />
                <span className="text-xs font-bold text-zinc-300">api.ahmedlotfy.site</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-zinc-400 font-bold text-sm">
                <Zap className="w-4 h-4 text-accent" />
                Quick-Start Configuration
              </div>

              <div className="bg-black/60 rounded-[32px] p-8 border border-white/10 font-mono text-xs leading-relaxed group/code shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6 text-zinc-500 uppercase tracking-[0.2em] text-[10px] font-black">
                  <div className="flex items-center gap-2">
                    <Binary className="w-4 h-4" />
                    <span>Claude Desktop Config</span>
                  </div>
                  <button
                    onClick={handleCopyClaudeConfig}
                    className="hover:text-primary transition-all flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 hover:border-primary/20 hover:scale-105 active:scale-95"
                  >
                    <Copy className="w-3.5 h-3.5" /> COPY
                  </button>
                </div>
                <pre className="text-zinc-300 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                  <span className="text-primary/80">"taskflow"</span>: &#123;{"\n"}
                  {"  "}<span className="text-primary/80">"type"</span>: <span className="text-accent">"http"</span>,{"\n"}
                  {"  "}<span className="text-primary/80">"url"</span>: <span className="text-accent">"https://api.ahmedlotfy.site/mcp"</span>,{"\n"}
                  {"  "}<span className="text-primary/80">"headers"</span>: &#123;{"\n"}
                  {"    "}<span className="text-primary/80">"Authorization"</span>: <span className="text-accent">"Bearer {generatedKey ?
                    <span className="bg-primary/20 text-primary px-1 rounded animate-pulse">{generatedKey.slice(0, 12)}...</span> :
                    "YOUR_KEY_HERE"}"</span>{"\n"}
                  {"  "}&#125;{"\n"}
                  &#125;
                </pre>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                variant="white"
                className="flex-1 h-14 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/5"
                onClick={() => window.open("https://modelcontextprotocol.io/introduction", "_blank")}
              >
                Protocol Documentation
              </Button>
              <Button
                className="flex-1 h-14 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all border border-white/10"
                onClick={handleCopyAIPrompt}
              >
                Copy System Instruction
              </Button>
            </div>
          </div>
        </Card>

        {/* Info Sidebar */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-10 rounded-[48px] bg-white border border-zinc-100 shadow-xl shadow-zinc-200/40 space-y-8 flex flex-col justify-between h-full group">
            <div className="space-y-8">
              <div className="w-16 h-16 rounded-[24px] bg-zinc-50 flex items-center justify-center border border-zinc-100 group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
                <Monitor className="w-8 h-8 text-primary" />
              </div>

              <div className="space-y-4">
                <h4 className="font-black text-2xl text-[#2D3748] tracking-tight">AI Orientation</h4>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  Tell your AI agent exactly how to use its new superpowers. Paste this instruction to get started.
                </p>

                <div className="bg-zinc-50 rounded-3xl p-6 border border-zinc-100/50 relative group/prompt overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full -mr-8 -mt-8 opacity-0 group-hover/prompt:opacity-100 transition-opacity" />
                  <p className="text-[14px] font-bold text-zinc-600 leading-relaxed italic relative z-10">
                    "You have access to the TaskHub MCP server. Start by calling 'list_workspaces' to see
                    my available environments..."
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h4 className="font-black text-zinc-900 flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 text-accent" />
                  Security Policy
                </h4>
                <div className="space-y-3">
                  {[
                    "Never expose keys in client-side code",
                    "Use specific keys for unique agents",
                    "Rotate keys regularly for protection",
                  ].map((tip, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-zinc-500 font-bold group/item">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 group-hover/item:bg-primary transition-colors" />
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button className="w-full py-4 flex items-center justify-between text-zinc-400 hover:text-primary transition-colors font-black text-xs uppercase tracking-[0.2em] border-t border-zinc-50 mt-6">
              View Connectivity Audit
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
