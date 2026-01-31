import { pgTable, uuid, varchar, text, timestamp, boolean, index, pgEnum, integer } from 'drizzle-orm/pg-core';
import { users } from './users';

// API Key permission scopes
export const apiKeyScopeEnum = pgEnum('api_key_scope', ['read', 'write', 'admin']);

// API Keys table for programmatic access
export const apiKeys = pgTable(
  'api_keys',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    keyHash: varchar('key_hash', { length: 255 }).notNull().unique(),
    keyMask: varchar('key_mask', { length: 50 }).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    scope: apiKeyScopeEnum('scope').notNull().default('read'),
    workspaceId: uuid('workspace_id'),
    tier: varchar('tier', { length: 20 }).notNull().default('free'),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    revokedReason: text('revoked_reason'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('api_keys_user_id_idx').on(table.userId),
    keyHashIdx: index('api_keys_key_hash_idx').on(table.keyHash),
    workspaceIdIdx: index('api_keys_workspace_id_idx').on(table.workspaceId),
  })
);

// API Key usage logs for audit trail
export const apiKeyLogs = pgTable(
  'api_key_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    apiKeyId: uuid('api_key_id')
      .notNull()
      .references(() => apiKeys.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    method: varchar('method', { length: 10 }).notNull(),
    path: text('path').notNull(),
    statusCode: integer('status_code'),
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: text('user_agent'),
    responseTimeMs: integer('response_time_ms'),
    errorMessage: text('error_message'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    apiKeyIdIdx: index('api_key_logs_api_key_id_idx').on(table.apiKeyId),
    userIdIdx: index('api_key_logs_user_id_idx').on(table.userId),
    createdAtIdx: index('api_key_logs_created_at_idx').on(table.createdAt),
  })
);

export type ApiKey = typeof apiKeys.$inferSelect;
export type NewApiKey = typeof apiKeys.$inferInsert;
export type ApiKeyLog = typeof apiKeyLogs.$inferSelect;
export type NewApiKeyLog = typeof apiKeyLogs.$inferInsert;
