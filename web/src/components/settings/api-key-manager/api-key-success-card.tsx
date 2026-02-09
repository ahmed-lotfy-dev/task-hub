import { useState } from "react";
import { Copy, Check, ShieldAlert, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ApiKeySuccessCardProps {
  generatedKey: string;
  onDismiss: () => void;
  onCopy: (text: string) => void;
}

export function ApiKeySuccessCard({
  generatedKey,
  onDismiss,
  onCopy,
}: ApiKeySuccessCardProps) {
  const [copiedRaw, setCopiedRaw] = useState(false);

  const handleCopyRaw = () => {
    onCopy(generatedKey);
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  const handleCopyConfig = () => {
    const config = `"taskflow": {
  "type": "http",
  "url": "https://api.ahmedlotfy.site/mcp",
  "headers": {
    "Authorization": "Bearer ${generatedKey}"
  }
}`;
    onCopy(config);
  };

  return (
    <Card className="relative p-5 border-l-4 border-l-primary bg-accent/50">
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3 mb-4">
        <ShieldAlert className="w-5 h-5 text-primary mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold">Copy your new API key</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            This key will only be shown once. Save it securely.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Raw Key */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">API Key</label>
          <div className="flex items-center gap-2 p-2.5 bg-background rounded-md border border-input">
            <code className="flex-1 font-mono text-xs break-all text-foreground">
              {generatedKey}
            </code>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2"
              onClick={handleCopyRaw}
            >
              {copiedRaw ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </div>

        {/* Config Snippet */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Claude Config</label>
          <div className="flex items-center gap-2 p-2.5 bg-slate-950 rounded-md">
            <pre className="flex-1 font-mono text-[10px] text-slate-300 overflow-hidden text-ellipsis">
              {`"Authorization": "Bearer ${generatedKey.slice(0, 12)}..."`}
            </pre>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              onClick={handleCopyConfig}
            >
              <Copy className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
