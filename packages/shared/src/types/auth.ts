export type ApiKey = {
  id: string;
  name: string;
  preview: string;
  createdAt: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
};

export type CreateApiKeyResponse = ApiKey & {
  key: string;
};
