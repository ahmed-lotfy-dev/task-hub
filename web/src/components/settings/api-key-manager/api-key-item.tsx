import { Key, Clock, Monitor, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate, DATE_FORMATS } from "@taskflow/shared";
import { ApiKey } from "@taskflow/shared";

interface ApiKeyItemProps {
  apiKey: ApiKey;
  onRevoke: (id: string) => void;
}

export function ApiKeyItem({ apiKey, onRevoke }: ApiKeyItemProps) {
  const handleRevoke = () => {
    onRevoke(apiKey.id);
  };

  return (
    <Card className="p-6 flex items-center justify-between group hover:shadow-2xl hover:shadow-zinc-200/50 hover:-translate-y-1 transition-all duration-300 bg-white/80 backdrop-blur-sm rounded-[32px] border-white/20">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 rounded-3xl bg-zinc-50 flex items-center justify-center text-zinc-300 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500 scale-95 group-hover:scale-100">
          <Key className="w-8 h-8" />
        </div>
        <div>
          <div className="font-black text-xl text-zinc-800">{apiKey.name}</div>
          <div className="flex items-center gap-6 text-sm text-zinc-400 mt-1.5 font-bold">
            <div className="bg-zinc-100/80 px-3 py-1 rounded-xl uppercase tracking-widest text-[10px] text-zinc-500 border border-zinc-200/50">
              {apiKey.preview}
            </div>
            <span className="flex items-center gap-2 group-hover:text-zinc-600 transition-colors">
              <Clock className="w-4 h-4 opacity-40" />
              {formatDate(apiKey.createdAt, DATE_FORMATS.DISPLAY_WITH_TIME)}
            </span>
            {apiKey.lastUsedAt && (
              <span className="flex items-center gap-2 text-primary">
                <Monitor className="w-4 h-4 opacity-40" />
                {formatDate(apiKey.lastUsedAt, DATE_FORMATS.SHORT)}
              </span>
            )}
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="w-12 h-12 rounded-2xl text-zinc-300 hover:bg-red-50 hover:text-red-500 transition-all duration-300 opacity-0 group-hover:opacity-100"
        onClick={handleRevoke}
      >
        <Trash2 className="w-6 h-6" />
      </Button>
    </Card>
  );
}
