import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ApiKeyHeaderProps {
  newKeyName: string;
  setNewKeyName: (name: string) => void;
  isPending: boolean;
  onGenerate: () => void;
}

export function ApiKeyHeader({
  newKeyName,
  setNewKeyName,
  isPending,
  onGenerate,
}: ApiKeyHeaderProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newKeyName && !isPending) {
      onGenerate();
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">API Management</h2>
        <p className="text-muted-foreground">
          Securely connect external AI agents to your TaskHub workspace via MCP.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Input
          placeholder="Key Name (e.g. Claude Desktop)"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-64 bg-white/50"
        />
        <Button
          disabled={!newKeyName || isPending}
          onClick={onGenerate}
          className="rounded-xl shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Generate Key
        </Button>
      </div>
    </div>
  );
}
