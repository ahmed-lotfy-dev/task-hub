# Task Hub - Development Guide

**Version:** 1.0.0  
**Last Updated:** 2026-01-30  
**Status:** Active Development  

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Quick Start](#2-quick-start)
3. [Project Structure](#3-project-structure)
4. [Development Workflow](#4-development-workflow)
5. [Database Management](#5-database-management)
6. [Testing](#6-testing)
7. [Code Standards](#7-code-standards)
8. [Debugging](#8-debugging)
9. [Deployment](#9-deployment)
10. [Troubleshooting](#10-troubleshooting)
11. [Contributing](#11-contributing)

---

## 1. Prerequisites

### Required Software

| Software | Version | Purpose | Installation |
|----------|---------|---------|--------------|
| **Bun** | 1.1.0+ | Runtime & package manager | [bun.sh](https://bun.sh) |
| **PostgreSQL** | 15+ | Primary database | [postgresql.org](https://postgresql.org) |
| **Git** | 2.30+ | Version control | System package manager |

### Verify Installation

```bash
# Check Bun version
bun --version
# Expected: 1.1.0 or higher

# Check PostgreSQL
psql --version
# Expected: 15.x or higher

# Check Git
git --version
```

### System Requirements

- **OS**: macOS 12+, Linux (Ubuntu 20.04+), Windows (WSL2)
- **RAM**: 4GB minimum, 8GB recommended
- **Disk**: 2GB free space
- **Network**: Internet for package installation

---

## 2. Quick Start

### 2.1 Clone & Install

```bash
# Clone the repository
git clone https://github.com/ahmed-lotfy-dev/task-hub.git
cd task-hub

# Install dependencies for all workspaces
bun install

# Verify installation
bun run typecheck
```

### 2.2 Environment Setup

```bash
# Copy environment files
cp api/.env.example api/.env

# Edit api/.env with your values
# See api/.env.example for required variables
```

### 2.3 Database Setup

```bash
# Create database
createdb taskhub

# Run migrations
cd api
bunx drizzle-kit push
```

### 2.4 Start Development

```bash
# From project root - starts all services (API + Web)
bun run dev

# Or start API only
bun run dev:api

# Or start Web frontend only
bun run dev:web
```

---

## 3. Project Structure

```
task-hub/
├── api/                       # Backend API (ElysiaJS)
│   ├── src/
│   │   ├── index.ts           # Entry point
│   │   ├── db/                # Database layer
│   │   ├── middleware/        # Auth, rate limiting
│   │   └── lib/               # Utilities
│   └── drizzle/               # Migration files
│
├── shared/                    # Shared code package
│   └── src/
│       ├── schemas/           # Zod validation schemas
│       ├── types/             # TypeScript types
│       ├── constants/         # Limits, permissions
│       └── utils/             # Helper functions
│
├── web/                       # Frontend (TanStack Start)
│   ├── src/
│   │   ├── routes/            # File-based routes
│   │   ├── components/        # React components
│   │   └── styles.css         # Global styles
│   └── package.json
│
├── docs/                      # Documentation
│   ├── PRD.md                 # Product requirements
│   ├── ARCHITECTURE.md        # System architecture
│   ├── ERD.md                 # Database schema
│   ├── MCP.md                 # AI integration
│   └── DEVELOPMENT.md         # This file
│
├── package.json               # Root workspace config
└── README.md                  # Project overview
```

---

## 4. Development Workflow

### 4.1 Branch Strategy

- `main` - Production branch
- `develop` - Integration branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches

### 4.2 Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes |
| `refactor` | Code refactoring |
| `test` | Adding tests |
| `chore` | Maintenance tasks |

### 4.3 Scripts Reference

| Script | Description |
|--------|-------------|
| `bun run dev` | Start all dev servers (API + Web) |
| `bun run dev:api` | Start API only |
| `bun run dev:web` | Start web frontend only |
| `bun run build` | Build all packages |
| `bun run typecheck` | TypeScript check |
| `bun test` | Run all tests |
| `bun run db:generate` | Generate migration |
| `bun run db:push` | Apply migrations |

---

## 5. Database Management

### 5.1 Migration Workflow

```bash
# 1. Modify schema file

# 2. Generate migration
bunx drizzle-kit generate

# 3. Apply migration
bunx drizzle-kit push

# 4. Open Drizzle Studio
bunx drizzle-kit studio
```

### 5.2 Common Queries

```typescript
// Select
const users = await db.select().from(users);

// Insert
await db.insert(users).values({ name: 'John' });

// Update
await db.update(users).set({ name: 'Jane' }).where(eq(users.id, id));

// Delete
await db.delete(users).where(eq(users.id, id));
```

---

## 6. Testing

### 6.1 Running Tests

```bash
# Run all tests
bun test

# Run with coverage
bun test --coverage

# Run specific file
bun test api/tests/unit/utils.test.ts

# Watch mode
bun test --watch
```

### 6.2 Test Structure

```
api/tests/
├── unit/                      # Unit tests
├── integration/               # API integration tests
└── setup.ts                   # Test setup
```

---

## 7. Code Standards

### 7.1 TypeScript Guidelines

- Use explicit return types for functions
- Avoid `any` type
- Use strict equality (`===`)
- Use optional chaining (`?.`)
- Use nullish coalescing (`??`)

### 7.2 Error Handling

```typescript
try {
  const result = await operation();
  return { success: true, data: result };
} catch (error) {
  console.error('Operation failed:', error);
  return { 
    success: false, 
    error: { code: 'ERROR_CODE', message: 'Description' } 
  };
}
```

---

## 8. Debugging

### 8.1 VS Code Launch Configuration

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug API",
      "type": "bun",
      "request": "launch",
      "program": "${workspaceFolder}/api/src/index.ts",
      "cwd": "${workspaceFolder}/api"
    }
  ]
}
```

### 8.2 Common Issues

**Cannot find module '@taskflow/shared'**
```bash
cd shared && bun run build
```

**Database connection failed**
```bash
# Check PostgreSQL running
pg_isready -h localhost -p 5432

# Verify migrations
bunx drizzle-kit push
```

---

## 9. Deployment

### 9.1 Environment Variables

**Production:**
```env
NODE_ENV=production
LOG_LEVEL=warn
RATE_LIMIT_ENABLED=true
SSL_ENABLED=true
```

### 9.2 Health Check

```bash
curl http://localhost:8000/health
```

---

## 10. Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | `kill -9 <PID>` or use different PORT |
| TypeScript errors | `rm -rf node_modules bun.lock && bun install` |
| Slow queries | Check indexes with `EXPLAIN ANALYZE` |

---

## 11. Contributing

1. Find or create an issue
2. Create feature branch: `git checkout -b feature/description`
3. Write code and tests
4. Submit PR with description

### PR Checklist

- [ ] Tests passing
- [ ] TypeScript compiles
- [ ] Documentation updated
- [ ] No console.logs in production code

---

*Document maintained by the Task Hub team.*
