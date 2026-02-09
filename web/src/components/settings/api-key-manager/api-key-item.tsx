import { Key, Clock, Monitor, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ApiKey } from "@taskflow/shared";

interface ApiKeyItemProps {
  apiKey: ApiKey;
  onRevoke: (id: string) => void;
  onRegenerate?: (id: string) => void;
}

export function ApiKeyItem({ apiKey, onRevoke, onRegenerate }: ApiKeyItemProps) {
  const handleRevoke = () => {
    onRevoke(apiKey.id);
  };

  const handleRegenerate = () => {
    onRegenerate?.(apiKey.id);
  };

  return (
    <Card className="p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
          <Key className="w-5 h-5" />
        </div>
        <div>
          <div className="font-medium text-sm">{apiKey.name}</div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
            <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{apiKey.preview}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Created {formatDistanceToNow(new Date(apiKey.createdAt), { addSuffix: true })}
            </span>
            {apiKey.lastUsedAt && (
              <span className="flex items-center gap-1 text-foreground/70">
                <Monitor className="w-3 h-3" />
                Used {formatDistanceToNow(new Date(apiKey.lastUsedAt), { addSuffix: true })}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {onRegenerate && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={handleRegenerate}
            title="Regenerate key"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={handleRevoke}
          title="Revoke key"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
