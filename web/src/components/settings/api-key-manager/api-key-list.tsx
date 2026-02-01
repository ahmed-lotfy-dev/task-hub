import { RefreshCw, Key } from "lucide-react";
import { ApiKeyItem } from "./api-key-item";
import { ApiKey } from "@taskflow/shared";

interface ApiKeyListProps {
  keys: ApiKey[] | undefined;
  isLoading: boolean;
  onRevoke: (id: string) => void;
}

export function ApiKeyList({ keys, isLoading, onRevoke }: ApiKeyListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <RefreshCw className="w-10 h-10 animate-spin text-primary/20" />
      </div>
    );
  }

  if (!keys || keys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white/50 backdrop-blur-sm rounded-[48px] border border-dashed border-zinc-200">
        <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center mb-6">
          <Key className="w-10 h-10 text-zinc-200" />
        </div>
        <h3 className="text-xl font-bold text-zinc-400">No active API keys</h3>
        <p className="text-sm text-zinc-300 font-medium max-w-xs mt-2 text-center">
          Generate a key to connect your AI agents to the TaskHub ecosystem.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {keys.map((key) => (
        <ApiKeyItem key={key.id} apiKey={key} onRevoke={onRevoke} />
      ))}
    </div>
  );
}
