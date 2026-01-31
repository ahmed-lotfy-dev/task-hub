# Task Hub - System Architecture

**Version:** 1.0.0  
**Last Updated:** 2026-01-30  
**Status:** Active Development  

---

## Table of Contents

1. [Overview](#1-overview)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Monorepo Structure](#3-monorepo-structure)
4. [Technology Stack](#4-technology-stack)
5. [Data Flow](#5-data-flow)
6. [Security Architecture](#6-security-architecture)
7. [API Design](#7-api-design)
8. [Database Architecture](#8-database-architecture)
9. [MCP Integration](#9-mcp-integration)
10. [Scalability & Performance](#10-scalability--performance)
11. [Deployment Architecture](#11-deployment-architecture)
12. [Monitoring & Observability](#12-monitoring--observability)

---

## 1. Overview

Task Hub is built as a high-performance, monorepo-based platform using modern technologies optimized for speed and developer experience. The architecture emphasizes:

- **Type Safety**: End-to-end TypeScript with shared schemas
- **Performance**: Bun runtime with sub-50ms response targets
- **Extensibility**: Plugin-ready design with MCP support
- **Security**: Multi-layered authentication and authorization
- **Scalability**: Horizontal scaling ready with stateless design

### Architecture Principles

1. **API-First**: All functionality exposed via REST API
2. **Schema Sharing**: Single source of truth in `shared` package
3. ** Stateless Services**: No session state in application servers
4. **Defense in Depth**: Multiple security layers
5. **Observability**: Built-in logging and metrics

---

## 2. High-Level Architecture

### System Diagram

```mermaid
flowchart TB
    subgraph Clients["Client Layer"]
        Web["Web App\n(React/Vue - Future)"]
        Mobile["Mobile App\n(React Native - Future)"]
        CLI["CLI Tool\n(Future)"]
        MCPClient["MCP Client\n(Claude Desktop, etc.)"]
    end

    subgraph API["API Layer (ElysiaJS)"]
        APIServer["API Server\nPort 8000"]
        Auth["Auth Middleware\n(Better Auth)"]
        RateLimit["Rate Limiter\n(Redis)"]
        Validation["Validation\n(TypeBox/Zod)"]
    end

    subgraph Services["Service Layer"]
        WorkspaceSvc["Workspace Service"]
        BoardSvc["Board Service"]
        CardSvc["Card Service"]
        AuthSvc["Auth Service"]
        ApiKeySvc["API Key Service"]
        MCPSvc["MCP Service"]
    end

    subgraph Data["Data Layer"]
        PostgreSQL[("PostgreSQL\nPrimary Data")]
        Redis[("Redis\nSessions/Rate Limit")]
        S3[("Object Storage\nFiles/Attachments")]
    end

    Web --> APIServer
    Mobile --> APIServer
    CLI --> APIServer
    MCPClient --> MCPSvc

    APIServer --> Auth
    APIServer --> RateLimit
    APIServer --> Validation

    Auth --> AuthSvc
    APIServer --> WorkspaceSvc
    APIServer --> BoardSvc
    APIServer --> CardSvc
    APIServer --> ApiKeySvc

    WorkspaceSvc --> PostgreSQL
    BoardSvc --> PostgreSQL
    CardSvc --> PostgreSQL
    AuthSvc --> PostgreSQL
    AuthSvc --> Redis
    ApiKeySvc --> PostgreSQL
    ApiKeySvc --> Redis
    MCPSvc --> APIServer

    CardSvc -.-> S3
```

### Component Interaction

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API Gateway
    participant Auth as Auth Middleware
    participant R as Rate Limiter
    participant S as Service
    participant D as Database

    C->>A: HTTP Request
    A->>Auth: Validate Session/API Key
    Auth->>D: Fetch User/Key
    D-->>Auth: User Data
    Auth-->>A: User Context
    
    A->>R: Check Rate Limit
    R->>R: Redis INCR
    R-->>A: Allowed/Denied
    
    alt Rate Limited
        A-->>C: 429 Too Many Requests
    else Allowed
        A->>S: Process Request
        S->>D: Query/Update
        D-->>S: Results
        S-->>A: Response
        A-->>C: JSON Response
    end
```

---

## 3. Monorepo Structure

### Workspace Organization

```
task-hub/
├── api/                           # Backend API (ElysiaJS)
│   ├── src/
│   │   ├── index.ts               # Entry point
│   │   ├── db/                    # Database layer
│   │   │   ├── db.ts              # Connection
│   │   │   └── schema/            # Table definitions
│   │   ├── middleware/            # Express/Elysia middleware
│   │   ├── lib/                   # Utilities
│   │   └── services/              # Business logic (future)
│   └── package.json
├── shared/                        # Shared package
│   └── src/
│       ├── schemas/               # Zod validation schemas
│       ├── types/                 # TypeScript types
│       ├── constants/             # Limits, permissions
│       └── utils/                 # Helper functions
├── web/                           # Frontend (TanStack Start)
│   ├── src/
│   │   ├── routes/                # File-based routes
│   │   ├── components/            # React components
│   │   └── styles.css             # Global styles
│   └── package.json
├── docs/                          # Documentation
├── package.json                   # Root workspace config
└── bun.lock                       # Bun lockfile
```

### Package Dependencies

```mermaid
graph BT
    API[@taskflow/api]
    SHARED[@taskflow/shared]
    WEB[web - future]
    CLI[cli - future]
    
    API --> SHARED
    WEB --> SHARED
    CLI --> SHARED
```

### Shared Package Contents

The `shared` package provides the single source of truth for:

| Category | Contents | Used By |
|----------|----------|---------|
| **Schemas** | Zod validation schemas | API, Frontend, MCP |
| **Types** | TypeScript interfaces | All packages |
| **Constants** | Limits, permissions | API, Frontend |
| **Utils** | ID generation, dates | All packages |

---

## 4. Technology Stack

### Core Technologies

| Layer | Technology | Purpose | Rationale |
|-------|------------|---------|-----------|
| **Runtime** | Bun 1.1+ | JavaScript runtime | 3x faster than Node, built-in bundler |
| **Backend Framework** | ElysiaJS | Web framework | Type-safe, OpenAPI auto-gen, fast |
| **Frontend Framework** | TanStack Start | Full-stack React | File-based routing, SSR, type-safe |
| **Database** | PostgreSQL 15+ | Primary data store | Reliable, ACID, JSON support |
| **ORM** | Drizzle ORM | Database access | Type-safe SQL, minimal overhead |
| **Auth** | Better Auth | Authentication | Session + OAuth, DB adapter |
| **Validation** | Zod + TypeBox | Schema validation | Type inference, runtime checks |
| **Cache** | Redis | Sessions, rate limits | In-memory speed, pub/sub |

### Supporting Libraries

| Purpose | Library | Version |
|---------|---------|---------|
| CORS | @elysiajs/cors | ^1.4.1 |
| OpenAPI | @elysiajs/openapi | ^1.4.14 |
| Database Migrations | drizzle-kit | ^0.31.8 |
| Date Utilities | date-fns | ^3.0.0 |

### Technology Comparison

**Why Bun over Node.js?**
- Built-in TypeScript support (no ts-node)
- Native ESM handling
- Faster package installation
- Built-in test runner
- Bundler included

**Why Elysia over Express/Fastify?**
- End-to-end type safety
- Automatic OpenAPI generation
- Performance (faster than Fastify)
- Built-in validation
- Modern Bun-first design

**Why Drizzle over Prisma?**
- SQL-like query syntax
- Smaller bundle size
- Better performance
- No schema generation step
- Type-safe migrations

---

## 5. Data Flow

### Request Lifecycle

```mermaid
flowchart LR
    A[Request] --> B[Parse Body]
    B --> C[CORS Check]
    C --> D[Auth Check]
    D --> E{Authenticated?}
    E -->|No| F[Return 401]
    E -->|Yes| G[Rate Limit Check]
    G --> H{Allowed?}
    H -->|No| I[Return 429]
    H -->|Yes| J[Validate Input]
    J --> K{Valid?}
    K -->|No| L[Return 400]
    K -->|Yes| M[Execute Handler]
    M --> N[Serialize Response]
    N --> O[Return JSON]
```

### Authentication Flow

**Session-Based (Web):**
```mermaid
sequenceDiagram
    participant U as User
    participant A as API
    participant Auth as Better Auth
    participant DB as PostgreSQL
    participant Redis as Redis

    U->>A: POST /auth/sign-in
    A->>Auth: Authenticate
    Auth->>DB: Verify Credentials
    DB-->>Auth: User Match
    Auth->>Redis: Store Session
    Auth-->>A: Session Token
    A-->>U: Set-Cookie: session=xxx

    Note over U,A: Subsequent Requests

    U->>A: GET /api/user (with cookie)
    A->>Auth: Validate Session
    Auth->>Redis: Lookup Session
    Redis-->>Auth: Session Valid
    Auth-->>A: User Context
    A-->>U: User Data
```

**API Key-Based (Programmatic):**
```mermaid
sequenceDiagram
    participant C as Client
    participant A as API
    participant M as Auth Middleware
    participant DB as PostgreSQL

    C->>A: GET /api/boards
    Note right of C: Header: X-API-Key: tk_xxx
    
    A->>M: Extract API Key
    M->>DB: Lookup Key Hash
    DB-->>M: Key Details + User
    M->>M: Verify Not Revoked
    M->>M: Check Expiration
    M->>M: Check Workspace Scope
    M-->>A: User Context + Scope
    A->>DB: Fetch Boards
    DB-->>A: Board Data
    A->>DB: Log API Usage
    A-->>C: Boards JSON
```

---

## 6. Security Architecture

### Defense Layers

```mermaid
flowchart TB
    subgraph Perimeter["Perimeter Security"]
        HTTPS[TLS 1.3]
        CORS[CORS Policy]
        WAF[Web Application Firewall - Future]
    end

    subgraph Application["Application Security"]
        Auth[Authentication]
        RBAC[Role-Based Access]
        Validation[Input Validation]
        RateLimit[Rate Limiting]
    end

    subgraph Data["Data Security"]
        Encryption[Field Encryption]
        Hashing[Password Hashing Argon2]
        Masking[API Key Masking]
        Audit[Audit Logging]
    end

    HTTPS --> Auth
    CORS --> Auth
    Auth --> RBAC
    RBAC --> Validation
    Validation --> RateLimit
    RateLimit --> Encryption
    RateLimit --> Hashing
    RateLimit --> Masking
    Masking --> Audit
```

### Authentication Mechanisms

| Mechanism | Use Case | Storage |
|-----------|----------|---------|
| **Session Cookie** | Web application users | Redis (expires 7 days) |
| **API Key** | Programmatic access | PostgreSQL (hashed) |
| **OAuth (Google)** | Social login | PostgreSQL (via Better Auth) |

### Authorization Model

**Permission Hierarchy:**
```
┌─────────────────────────────────────────────────────────────┐
│                        OWNER                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                      ADMIN                          │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │                   MEMBER                    │   │   │
│  │  │  ┌─────────────────────────────────────┐   │   │   │
│  │  │  │                 GUEST               │   │   │   │
│  │  │  └─────────────────────────────────────┘   │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Permission Evaluation Flow:**
```mermaid
flowchart TD
    A[Request] --> B{Auth Type}
    B -->|Session| C[Get User Role]
    B -->|API Key| D[Get Key Scope + User Role]
    
    C --> E{Check Permission}
    D --> E
    
    E -->|Admin/Write| F{Read or Write?}
    E -->|Read Only| G{Read Operation?}
    E -->|No Permission| H[Return 403]
    
    F -->|Write| I[Check Write Scope]
    F -->|Read| J[Allow]
    
    I -->|Has Scope| K[Allow]
    I -->|No Scope| H
    
    G -->|Read| J
    G -->|Write| H
    
    J --> L[Execute]
    K --> L
```

### Rate Limiting Strategy

```mermaid
flowchart LR
    A[Request] --> B{Identify Client}
    B -->|API Key| C[Key Tier: free/pro/business]
    B -->|Session| D[User Tier]
    
    C --> E[Redis Key: rate_limit:{tier}:{id}]
    D --> E
    
    E --> F[INCR counter]
    F --> G{Count > Limit?}
    
    G -->|Yes| H[Return 429]
    G -->|No| I[Allow Request]
    
    H --> J[Set Retry-After Header]
    I --> K[Process]
```

**Rate Limit Headers:**
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1706611200
X-RateLimit-Retry-After: 30
```

---

## 7. API Design

### RESTful Principles

| Principle | Implementation |
|-----------|----------------|
| **Resource Naming** | Plural nouns: `/workspaces`, `/boards` |
| **HTTP Methods** | GET, POST, PUT, DELETE, PATCH |
| **Status Codes** | Standard HTTP semantics |
| **Content Type** | JSON (`application/json`) |
| **Versioning** | URL path: `/v1/...` (future) |

### Endpoint Patterns

| Operation | Pattern | Example |
|-----------|---------|---------|
| List | `GET /resources` | `GET /workspaces` |
| Get One | `GET /resources/:id` | `GET /workspaces/123` |
| Create | `POST /resources` | `POST /workspaces` |
| Update | `PUT /resources/:id` | `PUT /workspaces/123` |
| Delete | `DELETE /resources/:id` | `DELETE /workspaces/123` |
| Nested | `GET /parents/:id/children` | `GET /boards/123/lists` |
| Actions | `POST /resources/:id/action` | `POST /cards/123/move` |

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Engineering",
    "slug": "engineering"
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": ["Invalid email format"],
      "password": ["Must be at least 8 characters"]
    }
  }
}
```

### OpenAPI Integration

Elysia automatically generates OpenAPI 3.0 spec:

```typescript
// Accessible at /docs (Swagger UI) and /swagger.json
app.use(openapi({
  documentation: {
    info: {
      title: "Task Hub API",
      version: "1.0.0",
      description: "Developer-centric task management API"
    },
    tags: [
      { name: "Workspaces", description: "Workspace management" },
      { name: "Boards", description: "Kanban boards" },
      { name: "Cards", description: "Task cards" }
    ]
  },
  scalar: true,  // Enable Scalar UI
  path: "/docs"
}));
```

---

## 8. Database Architecture

### Connection Management

```typescript
// api/src/db/db.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production',
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = drizzle(pool, { schema });
```

### Schema Organization

```mermaid
graph TB
    subgraph Core["Core Entities"]
        Users[users]
        Workspaces[workspaces]
        Boards[boards]
        Lists[lists]
        Cards[cards]
    end

    subgraph Auth["Auth Tables"]
        Sessions[sessions]
        Accounts[accounts]
        Verifications[verifications]
    end

    subgraph Membership["Membership"]
        WorkspaceMembers[workspace_members]
        CardAssignees[card_assignees]
    end

    subgraph Metadata["Card Metadata"]
        Comments[card_comments]
        Attachments[card_attachments]
        Checklists[checklists]
        ChecklistItems[checklist_items]
        Labels[board_labels]
        CardLabels[card_labels]
    end

    subgraph Security["Security"]
        APIKeys[api_keys]
        APIKeyLogs[api_key_logs]
    end

    Users --> Workspaces
    Users --> WorkspaceMembers
    Users --> CardAssignees
    Users --> Comments
    Users --> Attachments
    Users --> APIKeys
    
    Workspaces --> Boards
    Workspaces --> WorkspaceMembers
    Workspaces -.-> APIKeys
    
    Boards --> Lists
    Boards --> Cards
    Boards --> Labels
    
    Lists --> Cards
    
    Cards --> CardAssignees
    Cards --> CardLabels
    Cards --> Comments
    Cards --> Attachments
    Cards --> Checklists
    
    Checklists --> ChecklistItems
    Labels --> CardLabels
    APIKeys --> APIKeyLogs
    
    Users --> Sessions
    Users --> Accounts
    Users --> Verifications
```

### Indexing Strategy

| Table | Index | Purpose |
|-------|-------|---------|
| `users` | `email` | Unique lookup, auth |
| `workspaces` | `slug` | URL lookup |
| `workspaces` | `owner_id` | Owner's workspaces |
| `boards` | `workspace_id` | Workspace boards |
| `boards` | `archived` | Filter active |
| `lists` | `board_id, position` | Board ordering |
| `cards` | `list_id, position` | List ordering |
| `cards` | `board_id` | Board queries |
| `cards` | `due_date` | Due date filtering |
| `api_keys` | `key_hash` | Key validation |
| `api_keys` | `user_id` | User's keys |
| `api_key_logs` | `api_key_id` | Usage queries |
| `api_key_logs` | `created_at` | Time-series queries |

### Query Patterns

**Board with Lists and Cards:**
```sql
-- Drizzle ORM query
const boardWithData = await db.query.boards.findFirst({
  where: eq(boards.id, boardId),
  with: {
    lists: {
      where: eq(lists.archived, false),
      orderBy: asc(lists.position),
      with: {
        cards: {
          where: eq(cards.archived, false),
          orderBy: asc(cards.position),
          with: {
            assignees: true,
            labels: true
          }
        }
      }
    }
  }
});
```

---

## 9. MCP Integration

### Architecture Overview

```mermaid
flowchart TB
    subgraph MCPClient["MCP Client"]
        Claude[Claude Desktop]
        Cursor[Cursor IDE]
        Custom[Custom Client]
    end

    subgraph MCPServer["MCP Server"]
        Transport[Stdio/SSE Transport]
        Tools[Tool Registry]
        Handlers[Tool Handlers]
    end

    subgraph API["Task Hub API"]
        Validation[Input Validation]
        Auth[API Key Auth]
        Services[Internal Services]
    end

    subgraph Data["Data Layer"]
        DB[(PostgreSQL)]
    end

    Claude --> Transport
    Cursor --> Transport
    Custom --> Transport
    
    Transport --> Tools
    Tools --> Handlers
    Handlers --> Validation
    Validation --> Auth
    Auth --> Services
    Services --> DB
```

### MCP Tools Implementation

```typescript
// Conceptual MCP tool definition
interface MCPTool {
  name: string;
  description: string;
  parameters: z.ZodSchema;
  handler: (params: any, context: MCPContext) => Promise<any>;
}

// Example: get_board_state tool
const getBoardStateTool: MCPTool = {
  name: "get_board_state",
  description: "Fetch all lists and cards for a board",
  parameters: z.object({
    boardId: z.string().uuid()
  }),
  handler: async ({ boardId }, { apiKey, user }) => {
    // Validate board access
    // Fetch board with lists and cards
    // Return structured data
  }
};
```

### Security Model

```mermaid
flowchart LR
    A[MCP Request] --> B{API Key Valid?}
    B -->|No| C[Return Error]
    B -->|Yes| D{Check Scope}
    
    D -->|Read Only| E{Read Operation?}
    D -->|Write| F[Allow Write]
    D -->|Admin| G[Full Access]
    
    E -->|Yes| H[Allow Read]
    E -->|No| I[Permission Denied]
    
    F --> J[Log Usage]
    G --> J
    H --> J
    J --> K[Execute]
```

---

## 10. Scalability & Performance

### Horizontal Scaling

```mermaid
flowchart TB
    subgraph CDN["CDN Layer"]
        Cloudflare[Cloudflare]
    end

    subgraph LB["Load Balancing"]
        ALB[AWS ALB / Nginx]
    end

    subgraph API["API Tier"]
        API1[API Instance 1]
        API2[API Instance 2]
        API3[API Instance N...]
    end

    subgraph Cache["Cache Layer"]
        Redis1[Redis Cluster]
    end

    subgraph DB["Database Tier"]
        PGPrimary[PostgreSQL Primary]
        PGReplica[PostgreSQL Replica]
    end

    Cloudflare --> ALB
    ALB --> API1
    ALB --> API2
    ALB --> API3
    
    API1 --> Redis1
    API2 --> Redis1
    API3 --> Redis1
    
    API1 --> PGPrimary
    API2 --> PGPrimary
    API3 --> PGPrimary
    
    PGPrimary --> PGReplica
```

### Caching Strategy

| Cache Level | Technology | TTL | Use Case |
|-------------|------------|-----|----------|
| **Edge** | Cloudflare | 1 hour | Static assets |
| **Application** | Redis | 5 min | Board state |
| **Session** | Redis | 7 days | User sessions |
| **Rate Limit** | Redis | 60s | Request counters |

### Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| API p50 latency | < 50ms | ~30ms |
| API p99 latency | < 200ms | ~150ms |
| Database queries | < 10ms | ~5ms |
| Auth validation | < 5ms | ~3ms |
| Concurrent users | 10,000 | 100 (MVP) |

### Optimization Techniques

1. **Connection Pooling**: Reuse DB connections
2. **Query Optimization**: Proper indexing, selective fields
3. **Response Caching**: Cache expensive aggregations
4. **Lazy Loading**: Don't fetch relationships until needed
5. **Compression**: gzip for API responses > 1KB

---

## 11. Deployment Architecture

### Development Environment

```mermaid
flowchart TB
    subgraph Dev["Developer Machine"]
        Code[Source Code]
        BunDev[Bun Runtime]
        LocalPG[Local PostgreSQL]
        LocalRedis[Local Redis]
    end

    subgraph Git["Version Control"]
        GitHub[GitHub Repository]
    end

    Code --> BunDev
    BunDev --> LocalPG
    BunDev --> LocalRedis
    Code --> GitHub
```

### CI/CD Pipeline

```mermaid
flowchart LR
    A[Push to GitHub] --> B[Run Tests]
    B --> C{Tests Pass?}
    C -->|No| D[Notify Failure]
    C -->|Yes| E[Build Image]
    E --> F[Push to Registry]
    F --> G[Deploy to Staging]
    G --> H[Run E2E Tests]
    H --> I{E2E Pass?}
    I -->|Yes| J[Deploy to Production]
    I -->|No| D
```

### Production Architecture (Future)

```mermaid
flowchart TB
    subgraph Edge["Edge Layer"]
        CF[Cloudflare DNS + WAF]
    end

    subgraph K8s["Kubernetes Cluster"]
        Ingress[Nginx Ingress]
        
        subgraph APIPool["API Pods"]
            Pod1[Pod 1]
            Pod2[Pod 2]
            PodN[Pod N]
        end
        
        subgraph MCPPool["MCP Pods"]
            MCPPod1[MCP 1]
            MCPPod2[MCP 2]
        end
    end

    subgraph Data["Data Layer"]
        RDS[AWS RDS PostgreSQL]
        ElastiCache[AWS ElastiCache Redis]
        S3[AWS S3 Storage]
    end

    subgraph Monitoring["Observability"]
        Datadog[Datadog/Granfana]
        Sentry[Sentry Error Tracking]
    end

    CF --> Ingress
    Ingress --> Pod1
    Ingress --> Pod2
    Ingress --> MCPPod1
    
    Pod1 --> RDS
    Pod1 --> ElastiCache
    Pod1 --> S3
    
    Pod1 --> Datadog
    Pod1 --> Sentry
```

---

## 12. Monitoring & Observability

### Logging Strategy

| Level | Destination | Retention |
|-------|-------------|-----------|
| **Error** | Sentry + File | 90 days |
| **Warn** | File + STDOUT | 30 days |
| **Info** | STDOUT | 7 days |
| **Debug** | Local only | Session |

### Key Metrics

**Application Metrics:**
- Request rate (req/sec)
- Response time percentiles (p50, p95, p99)
- Error rate (%)
- Active connections

**Business Metrics:**
- User signups/day
- Workspaces created/day
- Cards created/day
- API key usage

**Infrastructure Metrics:**
- CPU utilization
- Memory usage
- Database connections
- Cache hit rate

### Health Checks

```typescript
// Health check endpoint
app.get('/health', async () => {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    disk: checkDiskSpace(),
  };
  
  const healthy = Object.values(checks).every(c => c.status === 'ok');
  
  return {
    status: healthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION,
    checks
  };
});
```

---

## Appendix A: Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `AUTH_SECRET` | Better Auth encryption key | `super-secret-random-string` |
| `PORT` | API server port | `8000` |
| `NODE_ENV` | Environment mode | `development`, `production` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | - |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `RATE_LIMIT_FREE` | Free tier requests/min | `60` |
| `RATE_LIMIT_PRO` | Pro tier requests/min | `500` |
| `RATE_LIMIT_BUSINESS` | Business tier requests/min | `2000` |
| `LOG_LEVEL` | Logging verbosity | `info` |

---

*Document maintained by the Task Hub Engineering Team. For technical questions, refer to the DEVELOPMENT.md guide.*
