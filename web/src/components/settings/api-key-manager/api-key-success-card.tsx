import { useState } from "react";
import { Copy, Check, ShieldAlert } from "lucide-react";
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
    <Card className="p-8 border-primary/30 bg-primary/5 backdrop-blur-md relative overflow-hidden rounded-[40px] animate-in zoom-in duration-300">
      <div className="absolute top-0 right-0 p-6">
        <Button variant="ghost" size="sm" onClick={onDismiss} className="rounded-xl">
          Dismiss
        </Button>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 text-primary">
          <ShieldAlert className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-black">Copy your new API Key</h3>
            <p className="text-sm text-primary/70 font-medium">
              For security, this key will only be shown **once**. If you lose it, you'll need to generate a new one.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest font-black text-primary/40 ml-1">
              Raw API Key
            </label>
            <div className="flex items-center gap-2 p-4 bg-white/80 rounded-[24px] border border-primary/20 shadow-inner group">
              <code className="flex-1 font-mono text-sm break-all font-bold text-zinc-800">
                {generatedKey}
              </code>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-xl hover:bg-primary/10 hover:text-primary"
                onClick={handleCopyRaw}
              >
                {copiedRaw ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest font-black text-primary/40 ml-1">
              Claude Desktop Config Snippet
            </label>
            <div className="flex items-center gap-2 p-4 bg-zinc-900 rounded-[24px] border border-white/5 shadow-2xl group">
              <pre className="flex-1 font-mono text-[10px] text-primary/80 overflow-hidden text-ellipsis leading-relaxed">
                {`"taskflow": {
  "type": "http",
  "url": "https://api.ahmedlotfy.site/mcp",
  "headers": { "Authorization": "Bearer ${generatedKey.slice(0, 10)}..." }
}`}
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="rounded-xl text-white/50 hover:text-white hover:bg-white/10"
                onClick={handleCopyConfig}
              >
                <Copy className="w-4 h-4 mr-2" /> Copy Full Config
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
