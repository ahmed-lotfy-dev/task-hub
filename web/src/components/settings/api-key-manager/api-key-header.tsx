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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">API Keys</h2>
        <p className="text-sm text-muted-foreground">
          Manage API keys for MCP server access
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Key name (e.g. Claude)"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-56"
        />
        <Button
          disabled={!newKeyName || isPending}
          onClick={onGenerate}
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Generate
        </Button>
      </div>
    </div>
  );
}
