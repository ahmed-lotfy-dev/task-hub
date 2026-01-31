# Backend Architecture Document
# TaskFlow - Elysia + BetterAuth Stack

> **Version:** 1.0  
> **Date:** January 29, 2026  
> **Runtime:** Bun  
> **Framework:** Elysia  
> **Auth:** BetterAuth  
> **ORM:** Drizzle

---

## Architecture Philosophy

### Domain-Driven Design (DDD) Approach

Instead of organizing by technical layers (controllers, services, models), we organize by **business domains**. This makes the codebase more maintainable as it grows.

```
Domain = Business Capability
├── Auth (authentication, sessions, OAuth)
├── Workspace (teams, members, invitations)
├── Board (boards, labels, templates)
├── Card (cards, comments, attachments)
└── Realtime (WebSocket, presence, notifications)
```

---

## Recommended Folder Structure

```
packages/api/
├── src/
│   ├── index.ts                    # Application entry point
│   │
│   ├── common/                     # Shared utilities (not domain-specific)
│   │   ├── database.ts            # Drizzle connection
│   │   ├── redis.ts               # Redis connection
│   │   ├── errors.ts              # Error classes
│   │   ├── logger.ts              # Logging utility
│   │   └── types.ts               # Shared TypeScript types
│   │
│   ├── config/
│   │   ├── env.ts                 # Environment validation
│   │   ├── better-auth.ts         # BetterAuth configuration
│   │   └── swagger.ts             # API docs config
│   │
│   ├── domains/                    # BUSINESS DOMAINS
│   │   │
│   │   ├── auth/                   # Authentication Domain
│   │   │   ├── auth.plugin.ts     # Elysia plugin (routes + logic)
│   │   │   ├── auth.schemas.ts    # Zod validation schemas
│   │   │   ├── auth.types.ts      # Domain types
│   │   │   └── auth.hooks.ts      # Pre/post handlers
│   │   │
│   │   ├── users/                  # User Domain
│   │   │   ├── users.plugin.ts
│   │   │   ├── users.repository.ts # Database queries
│   │   │   ├── users.schemas.ts
│   │   │   └── users.types.ts
│   │   │
│   │   ├── workspaces/             # Workspace Domain
│   │   │   ├── workspaces.plugin.ts
│   │   │   ├── workspaces.repository.ts
│   │   │   ├── workspaces.service.ts # Business logic
│   │   │   ├── workspaces.schemas.ts
│   │   │   ├── workspaces.types.ts
│   │   │   └── workspaces.policy.ts  # Authorization rules
│   │   │
│   │   ├── boards/                 # Board Domain
│   │   │   ├── boards.plugin.ts
│   │   │   ├── boards.repository.ts
│   │   │   ├── boards.service.ts
│   │   │   ├── boards.schemas.ts
│   │   │   ├── boards.types.ts
│   │   │   └── boards.policy.ts
│   │   │
│   │   ├── lists/                  # List Domain
│   │   │   ├── lists.plugin.ts
│   │   │   ├── lists.repository.ts
│   │   │   ├── lists.service.ts
│   │   │   ├── lists.schemas.ts
│   │   │   └── lists.types.ts
│   │   │
│   │   ├── cards/                  # Card Domain
│   │   │   ├── cards.plugin.ts
│   │   │   ├── cards.repository.ts
│   │   │   ├── cards.service.ts
│   │   │   ├── cards.schemas.ts
│   │   │   ├── cards.types.ts
│   │   │   └── cards.policy.ts
│   │   │
│   │   ├── search/                 # Search Domain
│   │   │   ├── search.plugin.ts
│   │   │   ├── search.service.ts
│   │   │   └── search.types.ts
│   │   │
│   │   └── realtime/               # Realtime Domain
│   │       ├── realtime.plugin.ts  # WebSocket routes
│   │       ├── realtime.service.ts # Socket.io logic
│   │       ├── realtime.types.ts
│   │       └── events/             # Event handlers
│   │           ├── card.events.ts
│   │           ├── board.events.ts
│   │           └── presence.events.ts
│   │
│   ├── middleware/                 # Cross-cutting concerns
│   │   ├── error-handler.ts
│   │   ├── rate-limiter.ts
│   │   └── request-logger.ts
│   │
│   └── db/                         # Database
│       ├── index.ts               # Drizzle client export
│       ├── schema.ts              # All table definitions
│       ├── relations.ts           # Drizzle relations
│       └── migrations/            # Migration files
│
├── tests/
│   ├── integration/               # API integration tests
│   └── unit/                      # Unit tests per domain
│
├── drizzle.config.ts
├── package.json
└── tsconfig.json
```

---

## Why This Structure?

### 1. Domain-Driven Benefits

| Traditional (Layered) | Domain-Driven |
|----------------------|---------------|
| `controllers/user.ts` | `domains/users/users.plugin.ts` |
| `services/user.ts` | `domains/users/users.service.ts` |
| `models/user.ts` | `domains/users/users.repository.ts` |
| Scattered business logic | Cohesive domain logic |
| Hard to find related code | Everything in one place |
| Tight coupling | Loose coupling between domains |

### 2. Elysia Plugin Pattern

Elysia plugins are self-contained units that can register:
- Routes
- Middleware (hooks)
- State/decorators
- Models (schemas)

```typescript
// domains/workspaces/workspaces.plugin.ts
import { Elysia } from 'elysia';
import { authMiddleware } from '@/common/auth';
import { WorkspacesService } from './workspaces.service';
import { workspaceSchemas } from './workspaces.schemas';

export const workspacesPlugin = new Elysia({ prefix: '/workspaces' })
  // Dependencies
  .use(authMiddleware)
  .decorate('workspacesService', new WorkspacesService())
  
  // Models (for Swagger)
  .model(workspaceSchemas)
  
  // Hooks
  .onBeforeHandle(({ params, workspacesService }) => {
    // Pre-handler logic
  })
  
  // Routes
  .get('/', ({ workspacesService, user }) => 
    workspacesService.list(user.id), {
    response: 'workspaces.list'
  })
  
  .post('/', ({ body, workspacesService, user }) => 
    workspacesService.create(body, user.id), {
    body: 'workspace.create',
    response: 'workspace.createResponse'
  })
  
  .get('/:id', ({ params, workspacesService, user }) => 
    workspacesService.get(params.id, user.id), {
    params: 'workspace.getParams',
    response: 'workspace.getResponse'
  });
```

### 3. Repository Pattern with Drizzle

```typescript
// domains/workspaces/workspaces.repository.ts
import { db } from '@/common/database';
import { workspaces, workspaceMembers } from '@/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import type { Workspace, CreateWorkspaceInput, UpdateWorkspaceInput } from './workspaces.types';

export class WorkspacesRepository {
  async findById(id: string): Promise<Workspace | null> {
    const result = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, id),
      with: {
        owner: true,
        members: {
          with: {
            user: true
          }
        }
      }
    });
    return result ?? null;
  }

  async findByUserId(userId: string): Promise<Workspace[]> {
    return db.query.workspaces.findMany({
      where: inArray(
        workspaces.id,
        db.select({ workspaceId: workspaceMembers.workspaceId })
          .from(workspaceMembers)
          .where(eq(workspaceMembers.userId, userId))
      )
    });
  }

  async create(data: CreateWorkspaceInput & { ownerId: string }): Promise<Workspace> {
    const [workspace] = await db.insert(workspaces)
      .values({
        ...data,
        slug: this.generateSlug(data.name)
      })
      .returning();
    
    // Add owner as member
    await db.insert(workspaceMembers).values({
      workspaceId: workspace.id,
      userId: data.ownerId,
      role: 'owner'
    });
    
    return workspace;
  }

  async update(id: string, data: UpdateWorkspaceInput): Promise<Workspace> {
    const [workspace] = await db.update(workspaces)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(workspaces.id, id))
      .returning();
    return workspace;
  }

  async delete(id: string): Promise<void> {
    await db.delete(workspaces).where(eq(workspaces.id, id));
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Date.now().toString(36);
  }
}
```

### 4. Service Layer for Business Logic

```typescript
// domains/workspaces/workspaces.service.ts
import { WorkspacesRepository } from './workspaces.repository';
import { WorkspacePolicy } from './workspaces.policy';
import { NotFoundError, ForbiddenError } from '@/common/errors';
import type { CreateWorkspaceInput, UpdateWorkspaceInput } from './workspaces.types';

export class WorkspacesService {
  private repository: WorkspacesRepository;
  private policy: WorkspacePolicy;

  constructor() {
    this.repository = new WorkspacesRepository();
    this.policy = new WorkspacePolicy();
  }

  async list(userId: string) {
    return this.repository.findByUserId(userId);
  }

  async get(id: string, userId: string) {
    const workspace = await this.repository.findById(id);
    if (!workspace) throw new NotFoundError('Workspace');
    
    if (!this.policy.canView(workspace, userId)) {
      throw new ForbiddenError();
    }
    
    return workspace;
  }

  async create(data: CreateWorkspaceInput, userId: string) {
    // Business logic: Check workspace limits for free plan
    const userWorkspaces = await this.repository.findByUserId(userId);
    if (userWorkspaces.length >= 5) {
      throw new ForbiddenError('Free plan limited to 5 workspaces');
    }

    return this.repository.create({ ...data, ownerId: userId });
  }

  async update(id: string, data: UpdateWorkspaceInput, userId: string) {
    const workspace = await this.get(id, userId);
    
    if (!this.policy.canUpdate(workspace, userId)) {
      throw new ForbiddenError();
    }

    return this.repository.update(id, data);
  }

  async delete(id: string, userId: string) {
    const workspace = await this.get(id, userId);
    
    if (!this.policy.canDelete(workspace, userId)) {
      throw new ForbiddenError();
    }

    return this.repository.delete(id);
  }
}
```

### 5. Policy-Based Authorization

```typescript
// domains/workspaces/workspaces.policy.ts
import type { Workspace } from './workspaces.types';

export class WorkspacePolicy {
  canView(workspace: Workspace, userId: string): boolean {
    if (workspace.visibility === 'public') return true;
    return workspace.members.some(m => m.userId === userId);
  }

  canUpdate(workspace: Workspace, userId: string): boolean {
    const member = workspace.members.find(m => m.userId === userId);
    if (!member) return false;
    return ['owner', 'admin'].includes(member.role);
  }

  canDelete(workspace: Workspace, userId: string): boolean {
    return workspace.ownerId === userId;
  }

  canInvite(workspace: Workspace, userId: string): boolean {
    const member = workspace.members.find(m => m.userId === userId);
    if (!member) return false;
    return ['owner', 'admin'].includes(member.role);
  }
}
```

---

## BetterAuth Integration

### Configuration

```typescript
// config/better-auth.ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/common/database';
import { env } from './env';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: 'users',
      session: 'sessions',
      account: 'accounts',
      verification: 'verifications'
    }
  }),
  
  secret: env.AUTH_SECRET,
  
  // OAuth providers
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    }
  },
  
  // Email/Password
  emailAndPassword: {
    enabled: true,
    autoSignIn: true
  },
  
  // Sessions
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24 // 1 day
  },
  
  // Callbacks
  callbacks: {
    async session(session, user) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          workspaces: await getUserWorkspaces(user.id)
        }
      };
    }
  }
});
```

### Auth Plugin

```typescript
// domains/auth/auth.plugin.ts
import { Elysia } from 'elysia';
import { auth } from '@/config/better-auth';

export const authPlugin = new Elysia({ prefix: '/auth' })
  // BetterAuth handles all auth routes
  .all('/*', async (context) => {
    return auth.handler(context.request);
  });

// Middleware to protect routes
export const requireAuth = new Elysia()
  .onBeforeHandle(async ({ request, set }) => {
    const session = await auth.api.getSession({
      headers: request.headers
    });
    
    if (!session) {
      set.status = 401;
      return { error: 'Unauthorized' };
    }
    
    // Attach user to context
    return { user: session.user };
  });
```

---

## Main Application Setup

```typescript
// src/index.ts
import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { compression } from '@elysiajs/compression';

import { env } from '@/config/env';
import { errorHandler } from '@/middleware/error-handler';
import { rateLimiter } from '@/middleware/rate-limiter';

// Domain plugins
import { authPlugin } from '@/domains/auth/auth.plugin';
import { workspacesPlugin } from '@/domains/workspaces/workspaces.plugin';
import { boardsPlugin } from '@/domains/boards/boards.plugin';
import { listsPlugin } from '@/domains/lists/lists.plugin';
import { cardsPlugin } from '@/domains/cards/cards.plugin';
import { realtimePlugin } from '@/domains/realtime/realtime.plugin';

const app = new Elysia()
  // Global middleware
  .use(errorHandler)
  .use(cors({
    origin: env.CORS_ORIGINS.split(','),
    credentials: true
  }))
  .use(compression())
  .use(rateLimiter({
    max: 100,
    window: 60000
  }))
  
  // Documentation
  .use(swagger({
    documentation: {
      info: {
        title: 'TaskFlow API',
        version: '1.0.0'
      }
    }
  }))
  
  // Health check
  .get('/health', () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  }))
  
  // API Routes
  .use(authPlugin)
  .use(workspacesPlugin)
  .use(boardsPlugin)
  .use(listsPlugin)
  .use(cardsPlugin)
  .use(realtimePlugin)
  
  // Start server
  .listen(env.PORT);

console.log(`🚀 TaskFlow API running at ${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
```

---

## Real-time with Socket.io

```typescript
// domains/realtime/realtime.plugin.ts
import { Elysia } from 'elysia';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { auth } from '@/config/better-auth';

export const realtimePlugin = new Elysia()
  .get('/socket', () => {
    return { message: 'Socket.io endpoint available at /socket.io/' };
  });

// Socket.io setup (separate from Elysia routes)
export function setupRealtime(server: ReturnType<typeof createServer>) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGINS?.split(',') || '*',
      credentials: true
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const session = await auth.api.getSession({
        headers: new Headers({ cookie: socket.handshake.headers.cookie || '' })
      });
      
      if (!session) {
        return next(new Error('Authentication required'));
      }
      
      socket.data.user = session.user;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.data.user.id}`);

    // Join board room
    socket.on('board:join', (boardId: string) => {
      socket.join(`board:${boardId}`);
      socket.to(`board:${boardId}`).emit('user:joined', {
        userId: socket.data.user.id,
        boardId
      });
    });

    // Leave board room
    socket.on('board:leave', (boardId: string) => {
      socket.leave(`board:${boardId}`);
      socket.to(`board:${boardId}`).emit('user:left', {
        userId: socket.data.user.id,
        boardId
      });
    });

    // Card moved
    socket.on('card:move', async (data) => {
      const { cardId, listId, position } = data;
      
      // Update database
      // ...
      
      // Broadcast to all users in board
      socket.to(`board:${data.boardId}`).emit('card:moved', {
        cardId,
        listId,
        position,
        by: socket.data.user.id
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.data.user.id}`);
    });
  });

  return io;
}
```

---

## Key Benefits of This Architecture

| Aspect | Benefit |
|--------|---------|
| **Scalability** | Each domain can be extracted to microservice later |
| **Testability** | Services are pure functions, easy to unit test |
| **Type Safety** | Full TypeScript with Drizzle type inference |
| **Performance** | Bun runtime + Elysia = extremely fast |
| **Developer Experience** | Everything related to a feature is in one place |
| **Authorization** | Policy classes make permissions explicit and testable |

---

## Package.json

```json
{
  "name": "@taskflow/api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "bun --watch src/index.ts",
    "build": "bun build src/index.ts --outdir dist --target bun",
    "start": "bun dist/index.js",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "test": "bun test",
    "lint": "eslint src/**/*.ts",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "elysia": "^1.0.0",
    "@elysiajs/cors": "^1.0.0",
    "@elysiajs/swagger": "^1.0.0",
    "@elysiajs/compression": "^1.0.0",
    "better-auth": "^0.5.0",
    "drizzle-orm": "^0.30.0",
    "postgres": "^3.4.0",
    "zod": "^3.22.0",
    "socket.io": "^4.7.0",
    "ioredis": "^5.3.0",
    "bullmq": "^5.0.0"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "drizzle-kit": "^0.20.0",
    "typescript": "^5.3.0"
  }
}
```

---

**Document History:**
- v1.0 (2026-01-29): Initial architecture with Elysia + BetterAuth
