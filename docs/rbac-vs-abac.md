# RBAC vs ABAC: A Senior Full-Stack Engineer's Guide

## Executive Summary

When designing authorization systems, two dominant patterns emerge: **Role-Based Access Control (RBAC)** and **Attribute-Based Access Control (ABAC)**. The choice between them isn't about which is "better"—it's about which fits your domain complexity, team size, and scalability requirements. This guide breaks down both approaches from a practical, implementation-focused perspective.

---

## Role-Based Access Control (RBAC)

### Core Concept

RBAC assigns permissions to roles, and roles to users. It's the "need-to-know" model: you get access based on your job function.

```
User → Role → Permission → Resource
```

### When RBAC Shines

| Scenario | Why RBAC Works |
|----------|----------------|
| Small to medium teams (< 100 users) | Roles map cleanly to org chart |
| Clear hierarchical structures | Admin, Editor, Viewer maps to real responsibilities |
| Compliance requirements (SOX, HIPAA) | Audit trails are straightforward |
| Rapid prototyping | Simple to implement and reason about |

### Implementation Example

```typescript
// shared/src/constants/permissions.ts
export const Permissions = {
  WORKSPACE: {
    CREATE: 'workspace:create',
    DELETE: 'workspace:delete',
    UPDATE: 'workspace:update',
    READ: 'workspace:read',
  },
  BOARD: {
    CREATE: 'board:create',
    DELETE: 'board:delete',
    UPDATE: 'board:update',
    READ: 'board:read',
  },
  CARD: {
    CREATE: 'card:create',
    DELETE: 'card:delete',
    UPDATE: 'card:update',
    READ: 'card:read',
  },
} as const;

// Role definitions
export const ROLES = {
  OWNER: {
    name: 'owner',
    permissions: [
      Permissions.WORKSPACE.CREATE,
      Permissions.WORKSPACE.DELETE,
      Permissions.WORKSPACE.UPDATE,
      Permissions.WORKSPACE.READ,
      Permissions.BOARD.CREATE,
      Permissions.BOARD.DELETE,
      Permissions.BOARD.UPDATE,
      Permissions.BOARD.READ,
      Permissions.CARD.CREATE,
      Permissions.CARD.DELETE,
      Permissions.CARD.UPDATE,
      Permissions.CARD.READ,
    ],
  },
  ADMIN: {
    name: 'admin',
    permissions: [
      Permissions.WORKSPACE.UPDATE,
      Permissions.WORKSPACE.READ,
      Permissions.BOARD.CREATE,
      Permissions.BOARD.DELETE,
      Permissions.BOARD.UPDATE,
      Permissions.BOARD.READ,
      Permissions.CARD.CREATE,
      Permissions.CARD.DELETE,
      Permissions.CARD.UPDATE,
      Permissions.CARD.READ,
    ],
  },
  MEMBER: {
    name: 'member',
    permissions: [
      Permissions.WORKSPACE.READ,
      Permissions.BOARD.READ,
      Permissions.CARD.CREATE,
      Permissions.CARD.UPDATE,
      Permissions.CARD.READ,
    ],
  },
  VIEWER: {
    name: 'viewer',
    permissions: [
      Permissions.WORKSPACE.READ,
      Permissions.BOARD.READ,
      Permissions.CARD.READ,
    ],
  },
} as const;
```

```typescript
// api/src/middleware/authMiddleware.ts
import type { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { verifyToken } from '../lib/auth';

interface UserWithRole {
  id: string;
  email: string;
  role: keyof typeof ROLES;
  workspaceId: string;
}

export const requirePermission = (permission: string) => {
  return async (c: Context, next: Next) => {
    const user = c.get('user') as UserWithRole;
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userRole = ROLES[user.role];
    
    if (!userRole.permissions.includes(permission)) {
      return c.json({ 
        error: 'Forbidden',
        message: `Required permission: ${permission}` 
      }, 403);
    }

    await next();
  };
};

// Usage in routes
app.post('/api/boards', 
  authenticateUser,
  requirePermission(Permissions.BOARD.CREATE),
  createBoardHandler
);
```

### RBAC Pros and Cons

**Pros:**
- **Simplicity**: Easy to understand, audit, and implement
- **Performance**: O(1) permission checks (array lookup)
- **Maintainability**: Changes are centralized in role definitions
- **Compliance**: Clear audit trails for security reviews

**Cons:**
- **Role Explosion**: As requirements get granular, you end up with `SeniorAdminInFinance` roles
- **Context Blindness**: Can't handle "user can edit their own posts but not others"
- **Rigidity**: Adding new dimensions (time, location) requires schema changes

---

## Attribute-Based Access Control (ABAC)

### Core Concept

ABAC evaluates policies based on attributes of the **subject** (user), **resource**, **action**, and **environment**. It's the "context-aware" model.

```
IF user.department == resource.department 
   AND user.level >= resource.sensitivity 
   AND time.hour BETWEEN 9 AND 17
THEN ALLOW
```

### When ABAC Shines

| Scenario | Why ABAC Works |
|----------|----------------|
| Complex multi-tenant SaaS | Tenants have custom rules |
| Dynamic permissions | "Managers can approve requests up to their limit" |
| Time/location-based access | Trading floor access only during market hours |
| Data sensitivity levels | Classification-based access (Public, Internal, Confidential) |
| Large enterprises | 10,000+ users with matrixed reporting |

### Implementation Example

```typescript
// Policy engine core
interface Subject {
  id: string;
  role: string;
  department: string;
  clearanceLevel: number;
  isManager: boolean;
  managerId?: string;
}

interface Resource {
  id: string;
  type: 'board' | 'card' | 'workspace';
  ownerId: string;
  department: string;
  sensitivityLevel: number;
  status: 'draft' | 'active' | 'archived';
}

interface Environment {
  timestamp: Date;
  ipAddress: string;
  isWorkHours: boolean;
  location: string;
}

interface PolicyContext {
  subject: Subject;
  resource: Resource;
  action: string;
  environment: Environment;
}

type Policy = (ctx: PolicyContext) => boolean | Promise<boolean>;

// Policy definitions
const policies: Policy[] = [
  // Policy 1: Owners can do anything
  ({ subject, action }) => {
    if (subject.role === 'owner') return true;
    return 'continue' as const;
  },
  
  // Policy 2: Users can edit their own resources
  ({ subject, resource, action }) => {
    if (action.includes('update') && resource.ownerId === subject.id) {
      return true;
    }
    return 'continue' as const;
  },
  
  // Policy 3: Department-level access during work hours
  ({ subject, resource, environment, action }) => {
    if (subject.department === resource.department && 
        environment.isWorkHours &&
        action.includes('read')) {
      return true;
    }
    return 'continue' as const;
  },
  
  // Policy 4: Clearance level check for sensitive data
  ({ subject, resource, action }) => {
    if (resource.sensitivityLevel > 3 && 
        subject.clearanceLevel < resource.sensitivityLevel) {
      return false; // Explicit deny
    }
    return 'continue' as const;
  },
  
  // Policy 5: Managers can approve up to their limit
  ({ subject, resource, action }) => {
    if (action === 'approve' && subject.isManager) {
      // Additional business logic here
      return true;
    }
    return 'continue' as const;
  },
];

// Policy engine
export class PolicyEngine {
  async evaluate(ctx: PolicyContext): Promise<boolean> {
    for (const policy of policies) {
      const result = await policy(ctx);
      
      if (result === true) return true;
      if (result === false) return false;
      // 'continue' falls through to next policy
    }
    
    // Default deny
    return false;
  }
}

// Middleware integration
export const requireAccess = (action: string) => {
  return async (c: Context, next: Next) => {
    const user = c.get('user') as Subject;
    const resource = await getResource(c.req.param('id'));
    
    const engine = new PolicyEngine();
    const allowed = await engine.evaluate({
      subject: user,
      resource,
      action,
      environment: {
        timestamp: new Date(),
        ipAddress: c.req.header('x-forwarded-for') || c.req.ip,
        isWorkHours: isWorkHours(),
        location: c.req.header('x-geo-location') || 'unknown',
      },
    });
    
    if (!allowed) {
      return c.json({ error: 'Access denied by policy' }, 403);
    }
    
    await next();
  };
};
```

### Advanced ABAC: Using Open Policy Agent (OPA)

For production systems, consider OPA/Rego:

```rego
# policy/board_access.rego
package taskdeck.board

import future.keywords.if
import future.keywords.in

default allow := false

# Owners can do anything
allow if {
    input.user.role == "owner"
}

# Users can edit their own boards
allow if {
    input.action == "update"
    input.resource.owner_id == input.user.id
}

# Department access during work hours
allow if {
    input.user.department == input.resource.department
    input.environment.is_work_hours
    input.action == "read"
}

# Managers can approve in their scope
allow if {
    input.action == "approve"
    input.user.is_manager
    input.resource.amount <= input.user.approval_limit
}
```

```typescript
// OPA client integration
import { OPAClient } from '@styra/opa';

const opa = new OPAClient('http://localhost:8181');

export const checkAccess = async (ctx: PolicyContext) => {
  const result = await opa.evaluate('taskdeck/board/allow', {
    user: ctx.subject,
    resource: ctx.resource,
    action: ctx.action,
    environment: ctx.environment,
  });
  
  return result === true;
};
```

### ABAC Pros and Cons

**Pros:**
- **Fine-grained control**: Context-aware decisions
- **Scalability**: No role explosion; policies scale with attributes
- **Flexibility**: New rules without schema changes
- **Real-world alignment**: Matches how businesses actually work

**Cons:**
- **Complexity**: Harder to reason about and debug
- **Performance**: Policy evaluation can be expensive
- **Testing**: Need comprehensive test matrices
- **Audit difficulty**: "Why was this denied?" requires tracing policy chain

---

## Hybrid Approach: The Production Reality

Most mature systems use both. Here's a practical architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    Request Comes In                      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 1: RBAC (Fast Rejection)                         │
│  - Check if user has required role                      │
│  - O(1) lookup, rejects 80% of unauthorized requests    │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 2: ABAC (Contextual Evaluation)                  │
│  - Evaluate fine-grained policies                       │
│  - Resource ownership, time, location, etc.             │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 3: Business Logic (Domain-Specific)              │
│  - Quota checks, spending limits, etc.                  │
│  - "User has reached their board limit"                 │
└─────────────────────────────────────────────────────────┘
```

### Implementation

```typescript
// Multi-layer authorization
export const authorize = async (req: RequestContext): Promise<AuthResult> => {
  // Layer 1: RBAC - Quick reject
  const hasBaseRole = checkRole(req.user, req.requiredRole);
  if (!hasBaseRole) {
    return { allowed: false, reason: 'Insufficient role' };
  }

  // Layer 2: ABAC - Contextual
  const policyResult = await policyEngine.evaluate({
    subject: req.user,
    resource: req.resource,
    action: req.action,
    environment: req.environment,
  });
  
  if (!policyResult) {
    return { allowed: false, reason: 'Policy denied' };
  }

  // Layer 3: Business Logic
  const businessRules = await checkBusinessRules(req);
  if (!businessRules.allowed) {
    return { allowed: false, reason: businessRules.reason };
  }

  return { allowed: true };
};
```

---

## Decision Matrix

| Factor | Choose RBAC | Choose ABAC |
|--------|-------------|-------------|
| **Team Size** | < 100 users | > 1000 users |
| **Permission Complexity** | Simple CRUD | Context-dependent |
| **Change Frequency** | Roles stable | Rules change often |
| **Audit Requirements** | Simple compliance | Detailed forensics |
| **Performance Budget** | < 1ms checks | Can afford 10-50ms |
| **Dev Team Size** | Small (1-5) | Large (10+) |
| **Multi-tenancy** | Single tenant | Multi-tenant SaaS |

---

## Migration Strategy: RBAC → ABAC

Don't rewrite everything at once. Here's a phased approach:

### Phase 1: Attribute-Enriched RBAC (Months 1-2)
```typescript
// Add attributes to existing roles
const canEdit = (
  user: User, 
  resource: Resource
) => {
  // RBAC check
  if (!user.permissions.includes('edit')) return false;
  
  // Add simple ABAC
  if (resource.status === 'archived') return false;
  
  return true;
};
```

### Phase 2: Policy Extraction (Months 3-4)
- Extract permission logic into policy functions
- Keep RBAC as coarse filter
- Add policy evaluation for edge cases

### Phase 3: Full ABAC (Months 5-6)
- Introduce policy engine (OPA or custom)
- RBAC becomes one policy among many
- Comprehensive testing and monitoring

---

## Monitoring and Observability

Whatever you choose, instrument heavily:

```typescript
// Authorization metrics
interface AuthMetrics {
  // Performance
  evaluationDuration: Histogram;
  
  // Outcomes
  decisionsTotal: Counter<{
    result: 'allow' | 'deny';
    layer: 'rbac' | 'abac' | 'business';
  }>;
  
  // Debugging
  policyTraces: Trace[];
  
  // Alerts
  denyRate: Gauge; // Alert if > 5%
  evaluationP99: Gauge; // Alert if > 100ms
}
```

---

## Conclusion

**Start with RBAC.** It's sufficient for 80% of applications and will teach you where your permission model breaks down.

**Add ABAC when:**
- You find yourself creating roles like `AdminExceptForFinanceOnTuesdays`
- Users need different permissions based on resource ownership
- You're building multi-tenant SaaS with customer-defined rules
- Compliance requires context-aware access (time, location, device)

**The real answer:** Use RBAC for coarse-grained access and ABAC for fine-grained, context-sensitive decisions. The hybrid approach gives you the simplicity of roles with the flexibility of policies.

---

## Further Reading

1. **NIST RBAC Standard** - ANSI/INCITS 359-2004
2. **XACML 3.0** - OASIS standard for ABAC
3. **Open Policy Agent** - [openpolicyagent.org](https://www.openpolicyagent.org)
4. **Google Zanzibar** - Google's consistent, global authorization system
5. **AWS IAM** - Real-world hybrid RBAC/ABAC implementation

---

*Written from the trenches of production systems. Your mileage may vary—measure everything.*
