import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ApiKeyHeader } from "./api-key-manager/api-key-header";
import { ApiKeySuccessCard } from "./api-key-manager/api-key-success-card";
import { ApiKeyList } from "./api-key-manager/api-key-list";
import { ApiKeyInfoCards } from "./api-key-manager/api-key-info-cards";
import { ApiKey, CreateApiKeyResponse } from "@taskflow/shared";

interface APIKeyManagerProps {
  showInfo?: boolean;
  showHeader?: boolean;
  infoOnly?: boolean;
}

export function APIKeyManager({ showInfo = true, showHeader = true, infoOnly = false }: APIKeyManagerProps) {
  const queryClient = useQueryClient();
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const { data: keys, isLoading } = useQuery({
    queryKey: ["api-keys"],
    queryFn: async () => {
      const data = await apiFetch<ApiKey[]>("/api/api-keys");
      console.log("[Settings] Loaded API keys:", data);
      return data;
    },
    enabled: !infoOnly,
  });

  const createMutation = useMutation({
    mutationFn: (name: string) =>
      apiFetch<CreateApiKeyResponse>("/api/api-keys", {
        method: "POST",
        body: JSON.stringify({ name }),
      }),
    onSuccess: (data) => {
      setGeneratedKey(data.key);
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      setNewKeyName("");
      toast.success("API Key generated successfully!");
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/api-keys/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast.success("API Key revoked");
    },
  });

  const regenerateMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch<CreateApiKeyResponse>(`/api/api-keys/${id}/regenerate`, {
        method: "POST",
      }),
    onSuccess: (data) => {
      setGeneratedKey(data.key);
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast.success("API Key regenerated! Copy the new key now.");
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.info("Copied to clipboard");
  };

  const handleGenerate = () => {
    if (newKeyName) {
      createMutation.mutate(newKeyName);
    }
  };

  const handleRevoke = (id: string) => {
    revokeMutation.mutate(id);
  };

  const handleRegenerate = (id: string) => {
    regenerateMutation.mutate(id);
  };

  const handleDismissSuccess = () => {
    setGeneratedKey(null);
  };

  if (infoOnly) {
    return <ApiKeyInfoCards onCopy={copyToClipboard} generatedKey={generatedKey} />;
  }

  return (
    <div className="space-y-8">
      {showHeader && (
        <ApiKeyHeader
          newKeyName={newKeyName}
          setNewKeyName={setNewKeyName}
          isPending={createMutation.isPending}
          onGenerate={handleGenerate}
        />
      )}

      {generatedKey && (
        <ApiKeySuccessCard
          generatedKey={generatedKey}
          onDismiss={handleDismissSuccess}
          onCopy={copyToClipboard}
        />
      )}

      <div className={cn("grid gap-8", showInfo ? "lg:grid-cols-3" : "grid-cols-1")}>
        <div className={cn("space-y-4", showInfo ? "lg:col-span-2" : "col-span-1")}>
          <ApiKeyList keys={keys} isLoading={isLoading} onRevoke={handleRevoke} onRegenerate={handleRegenerate} />
        </div>

        {showInfo && <ApiKeyInfoCards onCopy={copyToClipboard} generatedKey={generatedKey} />}
      </div>
    </div>
  );
}
