# Shared Package Structure
# TaskFlow Monorepo

> **Version:** 1.0  
> **Date:** January 29, 2026

---

## Purpose

The `shared` package contains code that is used across multiple applications in the monorepo:
- Web (Next.js)
- Mobile (Expo)
- Desktop (Tauri)
- API (Elysia)
- MCP Server

---

## Folder Structure

```
packages/shared/
├── src/
│   ├── index.ts                    # Main exports
│   │
│   ├── types/                      # Shared TypeScript types
│   │   ├── index.ts
│   │   ├── user.ts                 # User-related types
│   │   ├── workspace.ts            # Workspace types
│   │   ├── board.ts                # Board types
│   │   ├── card.ts                 # Card types
│   │   ├── api.ts                  # API response types
│   │   └── realtime.ts             # WebSocket event types
│   │
│   ├── schemas/                    # Zod validation schemas
│   │   ├── index.ts
│   │   ├── auth.ts                 # Auth schemas
│   │   ├── workspace.ts            # Workspace schemas
│   │   ├── board.ts                # Board schemas
│   │   ├── list.ts                 # List schemas
│   │   ├── card.ts                 # Card schemas
│   │   └── common.ts               # Shared schemas
│   │
│   ├── constants/                  # Constants
│   │   ├── index.ts
│   │   ├── limits.ts               # Plan limits
│   │   ├── permissions.ts          # Role permissions
│   │   └── config.ts               # App config
│   │
│   ├── utils/                      # Utility functions
│   │   ├── index.ts
│   │   ├── slug.ts                 # Slug generation
│   │   ├── color.ts                # Color utilities
│   │   ├── date.ts                 # Date formatting
│   │   ├── id.ts                   # ID generation
│   │   └── validation.ts           # Common validators
│   │
│   └── api-client/                 # Generated API client (optional)
│       ├── index.ts
│       ├── client.ts
│       └── types.ts
│
├── package.json
└── tsconfig.json
```

---

## Type Definitions

### User Types

```typescript
// src/types/user.ts
export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  timezone: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  dateFormat: string;
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  desktop: boolean;
  digest: 'immediate' | 'hourly' | 'daily' | 'weekly';
}
```

### Workspace Types

```typescript
// src/types/workspace.ts
export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  visibility: 'private' | 'team' | 'public';
  plan: 'free' | 'pro' | 'business' | 'enterprise';
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  joinedAt: string;
  user?: User;
}

export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  email: string;
  role: 'admin' | 'member' | 'guest';
  token: string;
  expiresAt: string;
  createdAt: string;
}
```

### Board Types

```typescript
// src/types/board.ts
export interface Board {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  visibility: 'private' | 'team' | 'public';
  backgroundType: 'color' | 'image' | 'gradient';
  backgroundValue: string;
  template: 'kanban' | 'scrum' | 'simple' | null;
  settings: BoardSettings;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BoardSettings {
  allowComments: boolean;
  allowReactions: boolean;
  cardCoverImages: boolean;
  calendarStartDay: 0 | 1; // 0 = Sunday, 1 = Monday
}

export interface Label {
  id: string;
  boardId: string;
  name: string;
  color: string;
  createdAt: string;
}
```

### Card Types

```typescript
// src/types/card.ts
export interface Card {
  id: string;
  boardId: string;
  listId: string;
  title: string;
  description: string | null;
  position: number;
  coverImage: string | null;
  dueDate: string | null;
  startDate: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  archived: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  assignees?: User[];
  labels?: Label[];
  checklists?: Checklist[];
  attachments?: Attachment[];
  comments?: Comment[];
}

export interface Checklist {
  id: string;
  cardId: string;
  title: string;
  position: number;
  items: ChecklistItem[];
  createdAt: string;
}

export interface ChecklistItem {
  id: string;
  checklistId: string;
  content: string;
  completed: boolean;
  position: number;
  assignedTo: string | null;
  dueDate: string | null;
  completedAt: string | null;
}

export interface Attachment {
  id: string;
  cardId: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedBy: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  cardId: string;
  userId: string;
  content: string;
  mentions: string[];
  editedAt: string | null;
  createdAt: string;
  user?: User;
}
```

### API Types

```typescript
// src/types/api.ts
export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    perPage?: number;
  };
  message?: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
}

export interface PaginatedQuery {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
```

### Realtime Types

```typescript
// src/types/realtime.ts
// Client -> Server events
export interface ClientEvents {
  'board:join': (boardId: string) => void;
  'board:leave': (boardId: string) => void;
  'card:move': (data: {
    cardId: string;
    listId: string;
    position: number;
  }) => void;
  'card:update': (data: {
    cardId: string;
    updates: Partial<Card>;
  }) => void;
  'cursor:move': (data: {
    boardId: string;
    x: number;
    y: number;
  }) => void;
}

// Server -> Client events
export interface ServerEvents {
  'card:moved': (data: {
    cardId: string;
    listId: string;
    position: number;
    by: string;
  }) => void;
  'card:updated': (data: {
    cardId: string;
    updates: Partial<Card>;
    by: string;
  }) => void;
  'card:created': (data: {
    card: Card;
    by: string;
  }) => void;
  'card:deleted': (data: {
    cardId: string;
    by: string;
  }) => void;
  'user:joined': (data: {
    userId: string;
    boardId: string;
  }) => void;
  'user:left': (data: {
    userId: string;
    boardId: string;
  }) => void;
  'cursor:update': (data: {
    userId: string;
    x: number;
    y: number;
  }) => void;
}
```

---

## Zod Schemas

### Auth Schemas

```typescript
// src/schemas/auth.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean().default(false)
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
  fullName: z.string().min(2).max(255)
});

export const resetPasswordSchema = z.object({
  email: z.string().email()
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
```

### Workspace Schemas

```typescript
// src/schemas/workspace.ts
import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  visibility: z.enum(['private', 'team']).default('private')
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional().nullable(),
  visibility: z.enum(['private', 'team', 'public']).optional()
});

export const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'member', 'guest']).default('member')
});

export const updateMemberSchema = z.object({
  role: z.enum(['admin', 'member', 'guest'])
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
```

### Board Schemas

```typescript
// src/schemas/board.ts
import { z } from 'zod';

export const createBoardSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  visibility: z.enum(['private', 'team', 'public']).default('private'),
  template: z.enum(['kanban', 'scrum', 'simple']).optional(),
  backgroundType: z.enum(['color', 'image', 'gradient']).default('color'),
  backgroundValue: z.string().default('#0079bf')
});

export const updateBoardSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional().nullable(),
  visibility: z.enum(['private', 'team', 'public']).optional(),
  backgroundType: z.enum(['color', 'image', 'gradient']).optional(),
  backgroundValue: z.string().optional()
});

export const createLabelSchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/)
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;
```

### Card Schemas

```typescript
// src/schemas/card.ts
import { z } from 'zod';

export const createCardSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(10000).optional(),
  listId: z.string().uuid(),
  position: z.number().int().min(0),
  dueDate: z.string().datetime().optional().nullable(),
  startDate: z.string().datetime().optional().nullable(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  labelIds: z.array(z.string().uuid()).default([]),
  assigneeIds: z.array(z.string().uuid()).default([])
});

export const updateCardSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(10000).optional().nullable(),
  listId: z.string().uuid().optional(),
  position: z.number().int().min(0).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  startDate: z.string().datetime().optional().nullable(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  coverImage: z.string().url().optional().nullable()
});

export const moveCardSchema = z.object({
  listId: z.string().uuid(),
  position: z.number().int().min(0)
});

export const createCommentSchema = z.object({
  content: z.string().min(1).max(5000)
});

export const createChecklistSchema = z.object({
  title: z.string().min(1).max(255)
});

export const createChecklistItemSchema = z.object({
  content: z.string().min(1).max(500),
  assignedTo: z.string().uuid().optional().nullable(),
  dueDate: z.string().datetime().optional().nullable()
});

export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
export type MoveCardInput = z.infer<typeof moveCardSchema>;
```

---

## Constants

```typescript
// src/constants/limits.ts
export const PLAN_LIMITS = {
  free: {
    workspaces: 3,
    boardsPerWorkspace: 10,
    membersPerWorkspace: 5,
    cardsPerBoard: 100,
    storageMB: 100,
    automations: 0
  },
  pro: {
    workspaces: 10,
    boardsPerWorkspace: 100,
    membersPerWorkspace: 50,
    cardsPerBoard: 10000,
    storageMB: 10000,
    automations: 100
  },
  business: {
    workspaces: -1, // unlimited
    boardsPerWorkspace: -1,
    membersPerWorkspace: -1,
    cardsPerBoard: -1,
    storageMB: 100000,
    automations: -1
  }
} as const;

// src/constants/permissions.ts
export const ROLE_PERMISSIONS = {
  owner: [
    'workspace:read', 'workspace:update', 'workspace:delete',
    'member:invite', 'member:remove', 'member:update-role',
    'board:create', 'board:read', 'board:update', 'board:delete',
    'card:create', 'card:read', 'card:update', 'card:delete'
  ],
  admin: [
    'workspace:read', 'workspace:update',
    'member:invite', 'member:remove',
    'board:create', 'board:read', 'board:update', 'board:delete',
    'card:create', 'card:read', 'card:update', 'card:delete'
  ],
  member: [
    'workspace:read',
    'board:create', 'board:read', 'board:update',
    'card:create', 'card:read', 'card:update', 'card:delete'
  ],
  guest: [
    'workspace:read',
    'board:read',
    'card:read', 'card:update'
  ]
} as const;

// src/constants/config.ts
export const APP_CONFIG = {
  name: 'TaskFlow',
  version: '1.0.0',
  defaultTimezone: 'UTC',
  defaultLanguage: 'en',
  maxUploadSize: 50 * 1024 * 1024, // 50MB
  supportedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  cardPriorities: ['low', 'medium', 'high', 'urgent'] as const,
  boardTemplates: ['kanban', 'scrum', 'simple'] as const
} as const;
```

---

## Utilities

```typescript
// src/utils/slug.ts
export function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  const uniqueSuffix = Date.now().toString(36).slice(-4);
  return `${base}-${uniqueSuffix}`;
}

// src/utils/color.ts
export const LABEL_COLORS = [
  '#61bd4f', // Green
  '#f2d600', // Yellow
  '#ff9f1a', // Orange
  '#eb5a46', // Red
  '#c377e0', // Purple
  '#0079bf', // Blue
  '#00c2e0', // Sky
  '#51e898', // Lime
  '#ff78cb', // Pink
  '#344563'  // Dark
] as const;

export function getRandomLabelColor(): string {
  return LABEL_COLORS[Math.floor(Math.random() * LABEL_COLORS.length)];
}

// src/utils/date.ts
export function formatRelativeDate(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diff = now.getTime() - target.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return target.toLocaleDateString();
}

export function isOverdue(date: string | Date): boolean {
  return new Date(date) < new Date();
}

// src/utils/id.ts
export function generateId(): string {
  return crypto.randomUUID();
}

// src/utils/validation.ts
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}
```

---

## Package.json

```json
{
  "name": "@taskflow/shared",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./types": {
      "import": "./dist/types/index.js",
      "types": "./dist/types/index.d.ts"
    },
    "./schemas": {
      "import": "./dist/schemas/index.js",
      "types": "./dist/schemas/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "lint": "eslint src/**/*.ts",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

---

## Usage in Other Packages

```typescript
// In apps/web or apps/mobile
import { 
  type User, 
  type Workspace,
  createWorkspaceSchema,
  generateSlug,
  PLAN_LIMITS 
} from '@taskflow/shared';

// Validate form input
const result = createWorkspaceSchema.safeParse(formData);

// Use utilities
const slug = generateSlug(workspaceName);

// Check limits
const limit = PLAN_LIMITS[workspace.plan].boardsPerWorkspace;
```

---

**Document History:**
- v1.0 (2026-01-29): Initial shared package structure
