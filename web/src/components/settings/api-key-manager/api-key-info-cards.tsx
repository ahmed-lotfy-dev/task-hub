import { Copy, ShieldAlert, Cpu, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ApiKeyInfoCardsProps {
  onCopy: (text: string) => void;
  generatedKey?: string | null;
}

export function ApiKeyInfoCards({ onCopy, generatedKey }: ApiKeyInfoCardsProps) {
  const backendBaseUrl = (import.meta.env.VITE_BACKEND_API_URL ?? "").replace(/\/+$/, "");
  const mcpUrl = backendBaseUrl ? `${backendBaseUrl}/mcp` : "/mcp";

  const handleCopyClaudeConfig = () => {
    onCopy(
      `"taskflow": {
  "type": "http",
  "url": "${mcpUrl}",
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
    <div className="space-y-6">
      {/* MCP Server Info */}
      <Card className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">MCP Server</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Connect AI agents to your workspace
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-slate-950 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">Endpoint</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[10px] text-slate-500">Active</span>
              </div>
            </div>
            <code className="text-xs text-slate-300 font-mono">
              {mcpUrl}
            </code>
          </div>

          <div className="p-3 bg-slate-950 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">Configuration</span>
              <button
                onClick={handleCopyClaudeConfig}
                className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
              >
                <Copy className="w-3 h-3" />
                Copy
              </button>
            </div>
            <pre className="text-[10px] text-slate-400 font-mono overflow-x-auto">
              {`"Authorization": "Bearer ${generatedKey ? generatedKey.slice(0, 12) + "..." : "th_live_..."}"`}
            </pre>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={() => window.open("https://modelcontextprotocol.io/introduction", "_blank")}
          >
            <ExternalLink className="w-3 h-3 mr-1.5" />
            Docs
          </Button>
          <Button
            size="sm"
            className="flex-1 text-xs"
            onClick={handleCopyAIPrompt}
          >
            <Copy className="w-3 h-3 mr-1.5" />
            Copy Prompt
          </Button>
        </div>
      </Card>

      {/* Security Tips */}
      <Card className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold">Security</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Best practices for API keys
            </p>
          </div>
        </div>

        <ul className="space-y-2">
          {[
            "Never expose keys in client-side code",
            "Use specific keys for unique agents",
            "Rotate keys regularly for protection",
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="w-1 h-1 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
