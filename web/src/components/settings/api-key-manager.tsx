import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { ApiKeyHeader } from "./api-key-manager/api-key-header";
import { ApiKeySuccessCard } from "./api-key-manager/api-key-success-card";
import { ApiKeyList } from "./api-key-manager/api-key-list";
import { ApiKeyInfoCards } from "./api-key-manager/api-key-info-cards";
import { ApiKey, CreateApiKeyResponse } from "@taskflow/shared";

export function APIKeyManager() {
  const queryClient = useQueryClient();
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const { data: keys, isLoading } = useQuery({
    queryKey: ["api-keys"],
    queryFn: () => apiFetch<ApiKey[]>("/api/api-keys"),
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

  const handleDismissSuccess = () => {
    setGeneratedKey(null);
  };

  return (
    <div className="space-y-8">
      <ApiKeyHeader
        newKeyName={newKeyName}
        setNewKeyName={setNewKeyName}
        isPending={createMutation.isPending}
        onGenerate={handleGenerate}
      />

      {generatedKey && (
        <ApiKeySuccessCard
          generatedKey={generatedKey}
          onDismiss={handleDismissSuccess}
          onCopy={copyToClipboard}
        />
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <ApiKeyList keys={keys} isLoading={isLoading} onRevoke={handleRevoke} />
        </div>

        <ApiKeyInfoCards onCopy={copyToClipboard} generatedKey={generatedKey} />
      </div>
    </div>
  );
}
