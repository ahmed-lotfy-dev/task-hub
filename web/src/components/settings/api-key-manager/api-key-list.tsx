import { RefreshCw, Key } from "lucide-react";
import { ApiKeyItem } from "./api-key-item";
import { ApiKey } from "@taskflow/shared";

interface ApiKeyListProps {
  keys: ApiKey[] | undefined;
  isLoading: boolean;
  onRevoke: (id: string) => void;
  onRegenerate?: (id: string) => void;
}

export function ApiKeyList({ keys, isLoading, onRevoke, onRegenerate }: ApiKeyListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <RefreshCw className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!keys || keys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border rounded-lg bg-muted/30">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3">
          <Key className="w-5 h-5 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-medium text-foreground">No API keys</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Generate a key to connect AI agents via MCP
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {keys.map((key) => (
        <ApiKeyItem key={key.id} apiKey={key} onRevoke={onRevoke} onRegenerate={onRegenerate} />
      ))}
    </div>
  );
}
