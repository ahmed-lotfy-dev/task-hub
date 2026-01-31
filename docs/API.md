# Task Hub - API Reference

**Version:** 1.0.0  
**Base URL:** `http://localhost:8000` (development)  
**OpenAPI:** Available at `/docs` when server is running  

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Authentication](#2-authentication)
3. [Rate Limiting](#3-rate-limiting)
4. [Response Format](#4-response-format)
5. [Workspaces](#5-workspaces)
6. [Boards](#6-boards)
7. [Lists](#7-lists)
8. [Cards](#8-cards)
9. [API Keys](#9-api-keys)
10. [Error Codes](#10-error-codes)

---

## 1. Introduction

The Task Hub API is a RESTful API built with ElysiaJS. All endpoints return JSON and use standard HTTP methods and status codes.

### Base URL

```
Development: http://localhost:8000
Production:  https://api.taskhub.io
```

### Content Type

All requests and responses use `application/json`.

---

## 2. Authentication

The API supports two authentication methods:

### 2.1 Session Cookie (Web)

For browser-based clients, authentication is handled via HTTP-only cookies set during login.

### 2.2 API Key (Programmatic)

For API access, include your API key in the header:

```bash
curl -H "X-API-Key: tk_your_api_key" \
  http://localhost:8000/workspaces
```

**Header:** `X-API-Key: tk_your_key`

### 2.3 Getting an API Key

1. Log in to Task Hub
2. Go to Settings → API Keys
3. Create a new key with desired scope
4. Copy the key (starts with `tk_`)

---

## 3. Rate Limiting

API requests are rate-limited based on your key tier:

| Tier | Requests/Min | Burst |
|------|--------------|-------|
| free | 60 | 10 |
| pro | 500 | 50 |
| business | 2000 | 200 |

**Headers:**
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1706611200
```

**Exceeding limits returns:** `429 Too Many Requests`

---

## 4. Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": ["Invalid email format"]
    }
  }
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Rate Limited |
| 500 | Server Error |

---

## 5. Workspaces

### List Workspaces

```http
GET /workspaces
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Engineering",
      "slug": "engineering",
      "description": "Engineering team workspace",
      "visibility": "private",
      "role": "admin",
      "createdAt": "2026-01-15T10:00:00Z"
    }
  ]
}
```

### Create Workspace

```http
POST /workspaces
Content-Type: application/json

{
  "name": "Engineering",
  "description": "Engineering team workspace",
  "visibility": "private"
}
```

**Response:** `201 Created`

### Get Workspace

```http
GET /workspaces/:id
```

### Update Workspace

```http
PUT /workspaces/:id
Content-Type: application/json

{
  "name": "Engineering Team",
  "visibility": "team"
}
```

### Delete Workspace

```http
DELETE /workspaces/:id
```

**Response:** `204 No Content`

### Invite Member

```http
POST /workspaces/:id/invite
Content-Type: application/json

{
  "email": "user@example.com",
  "role": "member"
}
```

---

## 6. Boards

### List Boards

```http
GET /boards?workspaceId=:workspaceId
```

**Query Parameters:**
- `workspaceId` (required) - Filter by workspace
- `archived` (optional) - Include archived boards

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Sprint 24",
      "description": "Q1 Sprint",
      "visibility": "team",
      "template": "scrum",
      "archived": false,
      "createdAt": "2026-01-20T10:00:00Z"
    }
  ]
}
```

### Create Board

```http
POST /boards
Content-Type: application/json

{
  "workspaceId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Sprint 24",
  "description": "Q1 Sprint",
  "visibility": "team",
  "template": "scrum"
}
```

### Get Board

```http
GET /boards/:id
```

**Response includes lists and cards:**
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Sprint 24",
    "lists": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440002",
        "name": "To Do",
        "cards": [...]
      }
    ]
  }
}
```

### Update Board

```http
PUT /boards/:id
Content-Type: application/json

{
  "name": "Sprint 24 Updated",
  "archived": false
}
```

### Delete Board

```http
DELETE /boards/:id
```

---

## 7. Lists

### Create List

```http
POST /boards/:boardId/lists
Content-Type: application/json

{
  "name": "In Progress",
  "wipLimit": 5
}
```

### Update List

```http
PUT /lists/:id
Content-Type: application/json

{
  "name": "In Review",
  "wipLimit": 3
}
```

### Move List

```http
POST /lists/:id/move
Content-Type: application/json

{
  "position": 2
}
```

### Delete List

```http
DELETE /lists/:id
```

---

## 8. Cards

### List Cards

```http
GET /lists/:listId/cards
```

### Create Card

```http
POST /cards
Content-Type: application/json

{
  "title": "Implement authentication",
  "description": "Add OAuth2 login flow",
  "listId": "770e8400-e29b-41d4-a716-446655440002",
  "priority": "high",
  "dueDate": "2026-02-15T00:00:00Z",
  "assigneeIds": ["user-id-1"],
  "labelIds": ["label-id-1"]
}
```

### Get Card

```http
GET /cards/:id
```

**Response includes:**
- Card details
- Assignees
- Labels
- Comments
- Attachments
- Checklists

### Update Card

```http
PUT /cards/:id
Content-Type: application/json

{
  "title": "Updated title",
  "priority": "medium",
  "archived": false
}
```

### Move Card

```http
POST /cards/:id/move
Content-Type: application/json

{
  "listId": "880e8400-e29b-41d4-a716-446655440003",
  "position": 0
}
```

### Delete Card

```http
DELETE /cards/:id
```

### Add Comment

```http
POST /cards/:id/comments
Content-Type: application/json

{
  "content": "This looks good!"
}
```

---

## 9. API Keys

### List API Keys

```http
GET /api-keys
```

### Create API Key

```http
POST /api-keys
Content-Type: application/json

{
  "name": "Production Integration",
  "description": "For CI/CD pipeline",
  "scope": "write",
  "tier": "pro",
  "expiresAt": "2026-12-31T23:59:59Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "api-key-id",
    "name": "Production Integration",
    "key": "tk_abc123xyz789",
    "keyMask": "tk_****_x789",
    "scope": "write",
    "createdAt": "2026-01-30T10:00:00Z"
  }
}
```

**Note:** The full key is only shown once on creation.

### Revoke API Key

```http
DELETE /api-keys/:id
Content-Type: application/json

{
  "reason": "Key compromised"
}
```

### Get API Key Logs

```http
GET /api-keys/:id/logs?page=1&limit=50
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "log-id",
      "method": "GET",
      "path": "/workspaces",
      "statusCode": 200,
      "responseTimeMs": 45,
      "createdAt": "2026-01-30T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 150
  }
}
```

---

## 10. Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing credentials |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

### Error Examples

**Validation Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": {
      "email": ["Invalid email format"],
      "password": ["Must be at least 8 characters"]
    }
  }
}
```

**Not Found:**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Workspace not found"
  }
}
```

---

## SDK Examples

### JavaScript/TypeScript

```typescript
const API_BASE = 'http://localhost:8000';
const API_KEY = 'tk_your_key';

async function api(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
      ...options.headers,
    },
  });
  return response.json();
}

// Usage
const workspaces = await api('/workspaces');
const newBoard = await api('/boards', {
  method: 'POST',
  body: JSON.stringify({
    workspaceId: '...',
    name: 'New Board',
  }),
});
```

### Python

```python
import requests

API_BASE = 'http://localhost:8000'
API_KEY = 'tk_your_key'

headers = {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json'
}

# List workspaces
response = requests.get(f'{API_BASE}/workspaces', headers=headers)
workspaces = response.json()

# Create card
new_card = requests.post(f'{API_BASE}/cards', 
    headers=headers,
    json={
        'title': 'New Task',
        'listId': '...'
    }
).json()
```

### cURL

```bash
# List workspaces
curl -H "X-API-Key: tk_your_key" \
  http://localhost:8000/workspaces

# Create board
curl -X POST \
  -H "X-API-Key: tk_your_key" \
  -H "Content-Type: application/json" \
  -d '{"name":"Sprint 1","workspaceId":"..."}' \
  http://localhost:8000/boards
```

---

*For more details, visit the OpenAPI documentation at `/docs` when running the server.*
