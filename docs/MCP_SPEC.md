# MCP Server Specification
# TaskFlow MCP Integration

> **Version:** 1.0  
> **Date:** January 29, 2026  
> **Protocol:** Model Context Protocol (MCP) 2024-11-05

---

## Overview

This document specifies the MCP (Model Context Protocol) server implementation for TaskFlow, enabling AI agents and external systems to interact with TaskFlow boards programmatically.

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   AI Agent /    │────►│  TaskFlow MCP   │────►│  TaskFlow API   │
│   Claude / etc  │◄────│    Server       │◄────│  (Elysia/Bun)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │   PostgreSQL    │
                        │     + Redis     │
                        └─────────────────┘
```

### Transport Options
1. **stdio** - For local CLI tools and direct integration
2. **SSE (Server-Sent Events)** - For remote/cloud AI services

---

## Server Configuration

### Package Structure
```
packages/mcp-server/
├── src/
│   ├── index.ts           # Entry point
│   ├── server.ts          # MCP server setup
│   ├── tools/             # Tool implementations
│   │   ├── boards.ts
│   │   ├── cards.ts
│   │   ├── lists.ts
│   │   └── search.ts
│   ├── resources/         # Resource handlers
│   │   ├── board-resource.ts
│   │   └── card-resource.ts
│   ├── prompts/           # Prompt templates
│   │   ├── sprint-planning.ts
│   │   └── daily-standup.ts
│   └── utils/
│       ├── api-client.ts  # TaskFlow API client
│       └── auth.ts        # Authentication
├── package.json
└── tsconfig.json
```

### Environment Variables
```env
TASKFLOW_API_URL=https://api.taskflow.app
TASKFLOW_API_KEY=sk_live_xxxxxxxx
MCP_TRANSPORT=stdio  # or 'sse'
MCP_PORT=3001        # for SSE mode
```

---

## Tools

### Board Tools

#### 1. `list_workspaces`
List all workspaces the user has access to.

**Input:**
```json
{
  "limit": 10,
  "offset": 0
}
```

**Output:**
```json
{
  "workspaces": [
    {
      "id": "ws_123",
      "name": "Acme Corp",
      "slug": "acme-corp",
      "role": "admin",
      "member_count": 12
    }
  ],
  "total": 5
}
```

---

#### 2. `list_boards`
List boards in a workspace.

**Input:**
```json
{
  "workspace_id": "ws_123",
  "archived": false
}
```

**Output:**
```json
{
  "boards": [
    {
      "id": "board_456",
      "name": "Q1 Product Roadmap",
      "description": "Planning for Q1 2026",
      "visibility": "team",
      "background": "#0079bf",
      "list_count": 5,
      "card_count": 42
    }
  ]
}
```

---

#### 3. `get_board`
Get detailed board information with lists and cards.

**Input:**
```json
{
  "board_id": "board_456",
  "include_cards": true
}
```

**Output:**
```json
{
  "id": "board_456",
  "name": "Q1 Product Roadmap",
  "lists": [
    {
      "id": "list_789",
      "name": "To Do",
      "position": 1,
      "cards": [
        {
          "id": "card_abc",
          "title": "Implement user authentication",
          "description": "Add OAuth login support",
          "position": 1,
          "labels": ["backend", "high-priority"],
          "assignees": ["user_xyz"],
          "due_date": "2026-02-15T00:00:00Z"
        }
      ]
    }
  ]
}
```

---

#### 4. `create_board`
Create a new board.

**Input:**
```json
{
  "workspace_id": "ws_123",
  "name": "Bug Tracker",
  "description": "Track production bugs",
  "template": "simple",
  "visibility": "team"
}
```

**Output:**
```json
{
  "id": "board_new",
  "name": "Bug Tracker",
  "url": "https://taskflow.app/b/acme-corp/bug-tracker",
  "created_at": "2026-01-29T14:00:00Z"
}
```

---

### List Tools

#### 5. `create_list`
Create a new list on a board.

**Input:**
```json
{
  "board_id": "board_456",
  "name": "In Review",
  "position": 3
}
```

**Output:**
```json
{
  "id": "list_new",
  "name": "In Review",
  "position": 3,
  "created_at": "2026-01-29T14:00:00Z"
}
```

---

### Card Tools

#### 6. `create_card`
Create a new card.

**Input:**
```json
{
  "board_id": "board_456",
  "list_id": "list_789",
  "title": "Fix login bug",
  "description": "Users reporting 500 error on login",
  "labels": ["bug", "urgent"],
  "assignee_ids": ["user_123"],
  "due_date": "2026-02-01T17:00:00Z",
  "position": 1
}
```

**Output:**
```json
{
  "id": "card_new",
  "title": "Fix login bug",
  "board_id": "board_456",
  "list_id": "list_789",
  "url": "https://taskflow.app/c/card_new",
  "created_at": "2026-01-29T14:00:00Z"
}
```

---

#### 7. `get_card`
Get detailed card information.

**Input:**
```json
{
  "card_id": "card_abc"
}
```

**Output:**
```json
{
  "id": "card_abc",
  "title": "Implement user authentication",
  "description": "Add OAuth login support...",
  "list_id": "list_789",
  "board_id": "board_456",
  "position": 1,
  "labels": [
    {"id": "lbl_1", "name": "backend", "color": "#61bd4f"}
  ],
  "assignees": [
    {"id": "user_xyz", "name": "Ahmed Lotfy", "avatar": "..."}
  ],
  "due_date": "2026-02-15T00:00:00Z",
  "checklists": [...],
  "comments": [...],
  "attachments": [...],
  "created_at": "2026-01-20T10:00:00Z",
  "updated_at": "2026-01-28T15:30:00Z"
}
```

---

#### 8. `update_card`
Update card fields.

**Input:**
```json
{
  "card_id": "card_abc",
  "title": "Implement OAuth authentication",
  "description": "Updated description...",
  "due_date": "2026-02-20T00:00:00Z",
  "labels": ["backend", "high-priority", "oauth"]
}
```

**Output:**
```json
{
  "id": "card_abc",
  "updated_at": "2026-01-29T14:05:00Z",
  "changes": ["title", "description", "due_date", "labels"]
}
```

---

#### 9. `move_card`
Move a card to a different list or position.

**Input:**
```json
{
  "card_id": "card_abc",
  "list_id": "list_done",
  "position": 1
}
```

**Output:**
```json
{
  "id": "card_abc",
  "previous_list_id": "list_789",
  "new_list_id": "list_done",
  "position": 1,
  "moved_at": "2026-01-29T14:05:00Z"
}
```

---

#### 10. `add_comment`
Add a comment to a card.

**Input:**
```json
{
  "card_id": "card_abc",
  "content": "Working on this today. Should be done by EOD."
}
```

**Output:**
```json
{
  "id": "comment_new",
  "card_id": "card_abc",
  "content": "Working on this today...",
  "created_at": "2026-01-29T14:05:00Z"
}
```

---

#### 11. `archive_card`
Archive a card.

**Input:**
```json
{
  "card_id": "card_abc"
}
```

**Output:**
```json
{
  "id": "card_abc",
  "archived": true,
  "archived_at": "2026-01-29T14:05:00Z"
}
```

---

### Search Tools

#### 12. `search_cards`
Search for cards across boards.

**Input:**
```json
{
  "query": "authentication",
  "workspace_id": "ws_123",
  "board_id": "board_456",
  "filters": {
    "labels": ["backend"],
    "assignees": ["user_123"],
    "due_before": "2026-02-01"
  },
  "limit": 20
}
```

**Output:**
```json
{
  "cards": [
    {
      "id": "card_abc",
      "title": "Implement user authentication",
      "board_name": "Q1 Product Roadmap",
      "list_name": "In Progress",
      "matched_on": "title"
    }
  ],
  "total": 5
}
```

---

#### 13. `get_overdue_cards`
Get all overdue cards.

**Input:**
```json
{
  "workspace_id": "ws_123",
  "assignee_id": "user_123"
}
```

**Output:**
```json
{
  "cards": [
    {
      "id": "card_xyz",
      "title": "Update documentation",
      "due_date": "2026-01-25T00:00:00Z",
      "days_overdue": 4,
      "board_name": "Q1 Product Roadmap"
    }
  ],
  "total": 3
}
```

---

## Resources

### Resource URIs

Resources provide read-only access to TaskFlow data via URI scheme.

#### 1. `board://{board_id}`
Access a specific board.

**Example:** `board://board_456`

**Content:**
```json
{
  "contents": [
    {
      "uri": "board://board_456",
      "mimeType": "application/json",
      "text": "{...board data...}"
    }
  ]
}
```

---

#### 2. `card://{card_id}`
Access a specific card.

**Example:** `card://card_abc`

---

#### 3. `workspace://{workspace_id}/boards`
List all boards in a workspace.

**Example:** `workspace://ws_123/boards`

---

#### 4. `user://me/cards`
Get cards assigned to the authenticated user.

**Query Parameters:**
- `filter=overdue` - Only overdue cards
- `filter=today` - Due today
- `filter=week` - Due this week

---

## Prompts

### 1. `sprint_planning`
Generate a sprint planning summary.

**Arguments:**
- `board_id` (required) - Board to analyze
- `sprint_duration` (optional) - Number of days (default: 14)

**Prompt Template:**
```
Analyze board {{board_id}} and provide a sprint planning summary:

1. Cards in "To Do" that should be prioritized
2. Work in progress (cards in active lists)
3. Blocked or overdue items
4. Team capacity based on assigned cards
5. Recommendations for the next {{sprint_duration}} days

Format the output as a structured report.
```

---

### 2. `daily_standup`
Generate a daily standup report for a user.

**Arguments:**
- `user_id` (optional) - Defaults to authenticated user
- `workspace_id` (optional) - Filter by workspace

**Prompt Template:**
```
Generate a daily standup report for {{user_id}}:

YESTERDAY:
- Cards moved to "Done"
- Comments made
- Updates to assigned cards

TODAY:
- Cards in progress
- Planned work (cards assigned, not started)

BLOCKERS:
- Overdue cards
- Cards with "blocked" label
- Cards with recent comments indicating issues

Keep it concise and actionable.
```

---

### 3. `card_summary`
Summarize a card's current state.

**Arguments:**
- `card_id` (required)

**Prompt Template:**
```
Provide a summary of card {{card_id}}:

- Current status and location
- Time in current list
- Activity history (comments, moves)
- Blockers or concerns
- Next steps based on description and comments
```

---

## Authentication

### API Key Authentication
```typescript
// Headers sent with every API request
{
  "Authorization": "Bearer sk_live_xxxxxxxx",
  "X-Workspace-ID": "ws_123"  // Optional default workspace
}
```

### Permission Checking
The MCP server validates permissions before executing tools:
- **Read operations** - Requires board/workspace read access
- **Write operations** - Requires board/workspace write access
- **Admin operations** - Requires workspace admin role

### Error Responses
```json
{
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "User does not have write access to this board",
    "required_permission": "board:write",
    "resource": "board_456"
  }
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_REQUEST` | Missing or invalid parameters |
| `RESOURCE_NOT_FOUND` | Board/card/list not found |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions |
| `RATE_LIMITED` | Too many requests |
| `API_ERROR` | Internal TaskFlow API error |
| `AUTHENTICATION_ERROR` | Invalid or expired API key |

---

## Usage Examples

### Example 1: Create a Bug Report from CLI
```bash
# Using MCP CLI client
echo '{
  "tool": "create_card",
  "arguments": {
    "board_id": "board_bugs",
    "list_id": "list_todo",
    "title": "API returns 500 on login",
    "description": "Steps to reproduce:\n1. Go to login page\n2. Enter credentials\n3. Click submit",
    "labels": ["bug", "critical"],
    "due_date": "2026-01-30T17:00:00Z"
  }
}' | mcp-client taskflow-mcp
```

### Example 2: Get Daily Standup via Claude
```
User: Give me my daily standup report

Claude: [Uses daily_standup prompt]

YESTERDAY:
- Completed "Update API documentation" (moved to Done)
- Added comment to "Fix auth bug"

TODAY:
- Working on "Implement OAuth" (In Progress)
- Plan to start "Write tests"

BLOCKERS:
- "Fix auth bug" is overdue by 2 days
```

### Example 3: GitHub Integration
```typescript
// GitHub Action using MCP
const result = await mcpClient.callTool('create_card', {
  board_id: process.env.TASKFLOW_BOARD_ID,
  list_id: process.env.TASKFLOW_TODO_LIST_ID,
  title: `PR: ${github.context.payload.pull_request.title}`,
  description: `Author: ${github.context.payload.pull_request.user.login}\nURL: ${github.context.payload.pull_request.html_url}`,
  labels: ['github-pr', 'needs-review']
});
```

---

## Implementation Notes

### Rate Limiting
- 100 requests per minute per API key
- Burst allowance: 20 requests
- WebSocket connections: 5 per API key

### Caching
- Board/list data cached for 30 seconds
- Card data cached for 10 seconds
- Search results cached for 60 seconds

### Webhooks (Future)
```json
{
  "event": "card.moved",
  "data": {
    "card_id": "card_abc",
    "from_list_id": "list_todo",
    "to_list_id": "list_done",
    "moved_by": "user_xyz",
    "timestamp": "2026-01-29T14:00:00Z"
  }
}
```

---

**Document History:**
- v1.0 (2026-01-29): Initial MCP specification
