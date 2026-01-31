# Entity Relationship Diagram (ERD)
# TaskFlow - Project Management Platform

> **Version:** 1.0  
> **Date:** January 29, 2026  
> **Database:** PostgreSQL 16

---

## Overview

This document describes the database schema for TaskFlow, a multi-platform project management tool with real-time collaboration and AI integration.

---

## Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     users       │     │  workspaces     │     │ workspace_members│
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ PK id           │◄────┤ PK id           │◄────┤ PK id           │
│    email        │     │ FK owner_id     │     │ FK workspace_id │
│    password_hash│     │    name         │◄────┤ FK user_id      │
│    full_name    │     │    slug         │     │    role         │
│    avatar_url   │     │    description  │     │    joined_at    │
│    timezone     │     │    visibility   │     └─────────────────┘
│    preferences  │     │    settings     │              │
│    created_at   │     │    created_at   │              │
│    updated_at   │     │    updated_at   │              │
└─────────────────┘     └─────────────────┘              │
         │                                               │
         │                                               │
         │                                      ┌─────────────────┐
         │                                      │  invitations    │
         │                                      ├─────────────────┤
         │                                      │ PK id           │
         │                                      │ FK workspace_id │
         └─────────────────────────────────────►│    email        │
                                                │    role         │
                                                │    token        │
                                                │    expires_at   │
                                                │    created_at   │
                                                └─────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     boards      │     │     lists       │     │     cards       │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ PK id           │◄────┤ PK id           │◄────┤ PK id           │
│ FK workspace_id │     │ FK board_id     │     │ FK list_id      │
│    name         │     │    name         │     │ FK board_id     │
│    description  │     │    position     │     │    title        │
│    visibility   │     │    wip_limit    │     │    description  │
│    background   │     │    archived     │     │    position     │
│    template     │     │    created_at   │     │    cover_image  │
│    settings     │     │    updated_at   │     │    due_date     │
│    archived     │     └─────────────────┘     │    start_date   │
│    created_at   │              │              │    priority     │
│    updated_at   │              │              │    archived     │
└─────────────────┘              │              │    created_at   │
         │                       │              │    updated_at   │
         │                       │              └─────────────────┘
         │                       │                       │
         │                       │              ┌─────────────────┐
         │                       │              │  card_assignees │
         │                       │              ├─────────────────┤
         │                       │              │ PK id           │
         │                       │              │ FK card_id      │
         │                       │              │ FK user_id      │
         │                       │              └─────────────────┘
         │                       │
         │                       │              ┌─────────────────┐
         │                       │              │   card_labels   │
         │                       │              ├─────────────────┤
         │                       │              │ PK id           │
         │                       │              │ FK card_id      │
         │                       └─────────────►│ FK label_id     │
         │                                      └─────────────────┘
         │
         │                                      ┌─────────────────┐
         │                                      │  checklists     │
         │                                      ├─────────────────┤
         │                                      │ PK id           │
         │                                      │ FK card_id      │
         │                                      │    title        │
         │                                      │    position     │
         │                                      │    created_at   │
         │                                      └─────────────────┘
         │                                               │
         │                                      ┌─────────────────┐
         │                                      │ checklist_items │
         │                                      ├─────────────────┤
         │                                      │ PK id           │
         │                                      │ FK checklist_id │
         │                                      │    content      │
         │                                      │    completed    │
         │                                      │    position     │
         │                                      │    assigned_to  │
         │                                      │    due_date     │
         │                                      └─────────────────┘
         │
         │                                      ┌─────────────────┐
         │                                      │  attachments    │
         │                                      ├─────────────────┤
         │                                      │ PK id           │
         │                                      │ FK card_id      │
         │                                      │    filename     │
         │                                      │    url          │
         │                                      │    size         │
         │                                      │    mime_type    │
         │                                      │    uploaded_by  │
         │                                      │    created_at   │
         │                                      └─────────────────┘
         │
         │                                      ┌─────────────────┐
         └─────────────────────────────────────►│     labels      │
                                                ├─────────────────┤
                                                │ PK id           │
                                                │ FK board_id     │
                                                │    name         │
                                                │    color        │
                                                │    created_at   │
                                                └─────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    comments     │     │  activities     │     │  notifications  │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ PK id           │     │ PK id           │     │ PK id           │
│ FK card_id      │     │ FK workspace_id │     │ FK user_id      │
│ FK user_id      │     │ FK board_id     │     │ FK workspace_id │
│    content      │     │ FK card_id      │     │ FK board_id     │
│    mentions     │     │ FK user_id      │     │ FK card_id      │
│    edited_at    │     │    action       │     │    type         │
│    created_at   │     │    entity_type  │     │    title        │
│    updated_at   │     │    entity_id    │     │    content      │
└─────────────────┘     │    metadata     │     │    read_at      │
                        │    created_at   │     │    created_at   │
                        └─────────────────┘     └─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│  custom_fields  │     │ card_field_values│
├─────────────────┤     ├─────────────────┤
│ PK id           │     │ PK id           │
│ FK board_id     │     │ FK card_id      │
│    name         │     │ FK field_id     │
│    type         │     │    value        │
│    options      │     └─────────────────┘
│    settings     │
│    created_at   │
└─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│  automations    │     │  webhooks       │
├─────────────────┤     ├─────────────────┤
│ PK id           │     │ PK id           │
│ FK board_id     │     │ FK workspace_id │
│    name         │     │    url          │
│    trigger      │     │    events       │
│    conditions   │     │    secret       │
│    actions      │     │    active       │
│    active       │     │    created_at   │
│    created_at   │     └─────────────────┘
└─────────────────┘
```

---

## Detailed Table Specifications

### 1. users

Stores user account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| password_hash | VARCHAR(255) | NULL | Bcrypt hashed password (null for OAuth) |
| full_name | VARCHAR(255) | NOT NULL | User's display name |
| avatar_url | VARCHAR(500) | NULL | Profile picture URL |
| timezone | VARCHAR(50) | DEFAULT 'UTC' | User's timezone |
| preferences | JSONB | DEFAULT '{}' | UI preferences, notifications settings |
| email_verified_at | TIMESTAMP | NULL | Email verification timestamp |
| last_login_at | TIMESTAMP | NULL | Last login time |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |
| deleted_at | TIMESTAMP | NULL | Soft delete timestamp |

**Indexes:**
- `idx_users_email` ON email
- `idx_users_created_at` ON created_at

---

### 2. workspaces

Top-level organization container.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| owner_id | UUID | FOREIGN KEY → users.id | Workspace owner |
| name | VARCHAR(255) | NOT NULL | Workspace name |
| slug | VARCHAR(100) | UNIQUE, NOT NULL | URL-friendly identifier |
| description | TEXT | NULL | Workspace description |
| visibility | ENUM | DEFAULT 'private' | private, team, public |
| settings | JSONB | DEFAULT '{}' | Workspace-wide settings |
| plan | ENUM | DEFAULT 'free' | free, pro, business, enterprise |
| plan_expires_at | TIMESTAMP | NULL | Subscription expiration |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |
| deleted_at | TIMESTAMP | NULL | Soft delete timestamp |

**Indexes:**
- `idx_workspaces_slug` ON slug
- `idx_workspaces_owner_id` ON owner_id

---

### 3. workspace_members

Many-to-many relationship between users and workspaces.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| workspace_id | UUID | FOREIGN KEY → workspaces.id | Workspace |
| user_id | UUID | FOREIGN KEY → users.id | Member user |
| role | ENUM | DEFAULT 'member' | owner, admin, member, guest |
| permissions | JSONB | DEFAULT '{}' | Custom permissions override |
| joined_at | TIMESTAMP | DEFAULT NOW() | When user joined |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation |

**Indexes:**
- `idx_workspace_members_workspace_id` ON workspace_id
- `idx_workspace_members_user_id` ON user_id
- UNIQUE(workspace_id, user_id)

---

### 4. invitations

Pending workspace invitations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| workspace_id | UUID | FOREIGN KEY → workspaces.id | Inviting workspace |
| email | VARCHAR(255) | NOT NULL | Invited email address |
| role | ENUM | DEFAULT 'member' | Role to assign |
| invited_by | UUID | FOREIGN KEY → users.id | Who sent invitation |
| token | VARCHAR(255) | UNIQUE, NOT NULL | Invitation token |
| expires_at | TIMESTAMP | NOT NULL | Expiration time |
| accepted_at | TIMESTAMP | NULL | When accepted |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |

**Indexes:**
- `idx_invitations_token` ON token
- `idx_invitations_workspace_id` ON workspace_id

---

### 5. boards

Kanban boards within workspaces.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| workspace_id | UUID | FOREIGN KEY → workspaces.id | Parent workspace |
| name | VARCHAR(255) | NOT NULL | Board name |
| description | TEXT | NULL | Board description |
| visibility | ENUM | DEFAULT 'private' | private, team, public |
| background_type | ENUM | DEFAULT 'color' | color, image, gradient |
| background_value | VARCHAR(500) | DEFAULT '#0079bf' | Color hex or image URL |
| template | VARCHAR(50) | NULL | kanban, scrum, simple, etc. |
| settings | JSONB | DEFAULT '{}' | Board-specific settings |
| archived | BOOLEAN | DEFAULT FALSE | Archived status |
| archived_at | TIMESTAMP | NULL | When archived |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes:**
- `idx_boards_workspace_id` ON workspace_id
- `idx_boards_archived` ON archived

---

### 6. lists

Columns/lists within boards.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| board_id | UUID | FOREIGN KEY → boards.id | Parent board |
| name | VARCHAR(255) | NOT NULL | List name |
| position | INTEGER | NOT NULL | Order position (for sorting) |
| wip_limit | INTEGER | NULL | Work in progress limit |
| archived | BOOLEAN | DEFAULT FALSE | Archived status |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes:**
- `idx_lists_board_id` ON board_id
- `idx_lists_position` ON position

---

### 7. cards

Individual tasks/cards within lists.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| list_id | UUID | FOREIGN KEY → lists.id | Current list |
| board_id | UUID | FOREIGN KEY → boards.id | Parent board (denormalized) |
| title | VARCHAR(500) | NOT NULL | Card title |
| description | TEXT | NULL | Card description (Markdown) |
| position | INTEGER | NOT NULL | Order within list |
| cover_image | VARCHAR(500) | NULL | Cover image URL |
| due_date | TIMESTAMP | NULL | Due date/time |
| start_date | TIMESTAMP | NULL | Start date/time |
| priority | ENUM | DEFAULT 'medium' | low, medium, high, urgent |
| archived | BOOLEAN | DEFAULT FALSE | Archived status |
| archived_at | TIMESTAMP | NULL | When archived |
| created_by | UUID | FOREIGN KEY → users.id | Creator |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes:**
- `idx_cards_list_id` ON list_id
- `idx_cards_board_id` ON board_id
- `idx_cards_position` ON position
- `idx_cards_due_date` ON due_date
- `idx_cards_archived` ON archived

---

### 8. card_assignees

Many-to-many: cards to assigned users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| card_id | UUID | FOREIGN KEY → cards.id | Card |
| user_id | UUID | FOREIGN KEY → users.id | Assigned user |
| assigned_by | UUID | FOREIGN KEY → users.id | Who assigned |
| assigned_at | TIMESTAMP | DEFAULT NOW() | Assignment time |

**Indexes:**
- `idx_card_assignees_card_id` ON card_id
- `idx_card_assignees_user_id` ON user_id
- UNIQUE(card_id, user_id)

---

### 9. labels

Color-coded labels for cards (board-specific).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| board_id | UUID | FOREIGN KEY → boards.id | Parent board |
| name | VARCHAR(100) | NOT NULL | Label name |
| color | VARCHAR(7) | NOT NULL | Hex color code |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |

**Indexes:**
- `idx_labels_board_id` ON board_id

---

### 10. card_labels

Many-to-many: cards to labels.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| card_id | UUID | FOREIGN KEY → cards.id | Card |
| label_id | UUID | FOREIGN KEY → labels.id | Label |
| created_at | TIMESTAMP | DEFAULT NOW() | When added |

**Indexes:**
- `idx_card_labels_card_id` ON card_id
- `idx_card_labels_label_id` ON label_id
- UNIQUE(card_id, label_id)

---

### 11. checklists

Checklists within cards.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| card_id | UUID | FOREIGN KEY → cards.id | Parent card |
| title | VARCHAR(255) | NOT NULL | Checklist title |
| position | INTEGER | NOT NULL | Order within card |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |

**Indexes:**
- `idx_checklists_card_id` ON card_id

---

### 12. checklist_items

Individual items within checklists.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| checklist_id | UUID | FOREIGN KEY → checklists.id | Parent checklist |
| content | TEXT | NOT NULL | Item text |
| completed | BOOLEAN | DEFAULT FALSE | Completion status |
| position | INTEGER | NOT NULL | Order within checklist |
| assigned_to | UUID | FOREIGN KEY → users.id | Assigned user (optional) |
| due_date | TIMESTAMP | NULL | Item due date |
| completed_at | TIMESTAMP | NULL | When completed |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |

**Indexes:**
- `idx_checklist_items_checklist_id` ON checklist_id
- `idx_checklist_items_assigned_to` ON assigned_to

---

### 13. attachments

File attachments on cards.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| card_id | UUID | FOREIGN KEY → cards.id | Parent card |
| filename | VARCHAR(255) | NOT NULL | Original filename |
| url | TEXT | NOT NULL | Storage URL |
| size | BIGINT | NOT NULL | File size in bytes |
| mime_type | VARCHAR(100) | NOT NULL | MIME type |
| uploaded_by | UUID | FOREIGN KEY → users.id | Uploader |
| created_at | TIMESTAMP | DEFAULT NOW() | Upload time |

**Indexes:**
- `idx_attachments_card_id` ON card_id

---

### 14. comments

Comments on cards.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| card_id | UUID | FOREIGN KEY → cards.id | Parent card |
| user_id | UUID | FOREIGN KEY → users.id | Comment author |
| content | TEXT | NOT NULL | Comment text (Markdown) |
| mentions | UUID[] | DEFAULT '{}' | Array of mentioned user IDs |
| edited_at | TIMESTAMP | NULL | Last edit time |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes:**
- `idx_comments_card_id` ON card_id
- `idx_comments_user_id` ON user_id
- `idx_comments_created_at` ON created_at

---

### 15. activities

Audit log for all board activities.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| workspace_id | UUID | FOREIGN KEY → workspaces.id | Workspace context |
| board_id | UUID | FOREIGN KEY → boards.id | Board context (optional) |
| card_id | UUID | FOREIGN KEY → cards.id | Card context (optional) |
| user_id | UUID | FOREIGN KEY → users.id | Who performed action |
| action | VARCHAR(50) | NOT NULL | created, updated, moved, deleted, etc. |
| entity_type | VARCHAR(50) | NOT NULL | board, list, card, comment, etc. |
| entity_id | UUID | NOT NULL | ID of affected entity |
| metadata | JSONB | DEFAULT '{}' | Additional context |
| created_at | TIMESTAMP | DEFAULT NOW() | Action time |

**Indexes:**
- `idx_activities_workspace_id` ON workspace_id
- `idx_activities_board_id` ON board_id
- `idx_activities_card_id` ON card_id
- `idx_activities_user_id` ON user_id
- `idx_activities_created_at` ON created_at

---

### 16. notifications

User notification inbox.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| user_id | UUID | FOREIGN KEY → users.id | Recipient |
| workspace_id | UUID | FOREIGN KEY → workspaces.id | Context workspace |
| board_id | UUID | FOREIGN KEY → boards.id | Context board (optional) |
| card_id | UUID | FOREIGN KEY → cards.id | Context card (optional) |
| type | VARCHAR(50) | NOT NULL | mention, assigned, due_soon, etc. |
| title | VARCHAR(255) | NOT NULL | Notification title |
| content | TEXT | NULL | Additional details |
| read_at | TIMESTAMP | NULL | When read |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |

**Indexes:**
- `idx_notifications_user_id` ON user_id
- `idx_notifications_read_at` ON read_at
- `idx_notifications_created_at` ON created_at

---

### 17. custom_fields

Board-specific custom fields.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| board_id | UUID | FOREIGN KEY → boards.id | Parent board |
| name | VARCHAR(255) | NOT NULL | Field name |
| type | ENUM | NOT NULL | text, number, date, dropdown, checkbox |
| options | JSONB | NULL | Options for dropdown type |
| settings | JSONB | DEFAULT '{}' | Field configuration |
| position | INTEGER | NOT NULL | Order in field list |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |

**Indexes:**
- `idx_custom_fields_board_id` ON board_id

---

### 18. card_field_values

Values for custom fields on cards.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| card_id | UUID | FOREIGN KEY → cards.id | Card |
| field_id | UUID | FOREIGN KEY → custom_fields.id | Custom field |
| value | JSONB | NOT NULL | Field value (typed) |

**Indexes:**
- `idx_card_field_values_card_id` ON card_id
- `idx_card_field_values_field_id` ON field_id
- UNIQUE(card_id, field_id)

---

### 19. automations

Board automation rules.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| board_id | UUID | FOREIGN KEY → boards.id | Parent board |
| name | VARCHAR(255) | NOT NULL | Rule name |
| trigger | JSONB | NOT NULL | Trigger configuration |
| conditions | JSONB | DEFAULT '[]' | Conditions to check |
| actions | JSONB | NOT NULL | Actions to perform |
| active | BOOLEAN | DEFAULT TRUE | Enabled status |
| last_triggered_at | TIMESTAMP | NULL | Last execution time |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes:**
- `idx_automations_board_id` ON board_id
- `idx_automations_active` ON active

---

### 20. webhooks

External webhook integrations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| workspace_id | UUID | FOREIGN KEY → workspaces.id | Owner workspace |
| url | TEXT | NOT NULL | Webhook endpoint URL |
| events | VARCHAR(50)[] | NOT NULL | Subscribed events |
| secret | VARCHAR(255) | NOT NULL | HMAC secret |
| active | BOOLEAN | DEFAULT TRUE | Enabled status |
| last_triggered_at | TIMESTAMP | NULL | Last delivery time |
| failure_count | INTEGER | DEFAULT 0 | Consecutive failures |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |

**Indexes:**
- `idx_webhooks_workspace_id` ON workspace_id
- `idx_webhooks_active` ON active

---

## Relationships Summary

| Parent | Child | Type | Foreign Key |
|--------|-------|------|-------------|
| users | workspaces | One-to-Many | workspaces.owner_id |
| users | workspace_members | One-to-Many | workspace_members.user_id |
| users | invitations | One-to-Many | invitations.invited_by |
| users | card_assignees | One-to-Many | card_assignees.user_id |
| users | comments | One-to-Many | comments.user_id |
| users | activities | One-to-Many | activities.user_id |
| users | notifications | One-to-Many | notifications.user_id |
| users | attachments | One-to-Many | attachments.uploaded_by |
| workspaces | boards | One-to-Many | boards.workspace_id |
| workspaces | workspace_members | One-to-Many | workspace_members.workspace_id |
| workspaces | invitations | One-to-Many | invitations.workspace_id |
| workspaces | activities | One-to-Many | activities.workspace_id |
| workspaces | webhooks | One-to-Many | webhooks.workspace_id |
| boards | lists | One-to-Many | lists.board_id |
| boards | cards | One-to-Many | cards.board_id |
| boards | labels | One-to-Many | labels.board_id |
| boards | activities | One-to-Many | activities.board_id |
| boards | notifications | One-to-Many | notifications.board_id |
| boards | custom_fields | One-to-Many | custom_fields.board_id |
| boards | automations | One-to-Many | automations.board_id |
| lists | cards | One-to-Many | cards.list_id |
| cards | card_assignees | One-to-Many | card_assignees.card_id |
| cards | card_labels | One-to-Many | card_labels.card_id |
| cards | checklists | One-to-Many | checklists.card_id |
| cards | attachments | One-to-Many | attachments.card_id |
| cards | comments | One-to-Many | comments.card_id |
| cards | activities | One-to-Many | activities.card_id |
| cards | notifications | One-to-Many | notifications.card_id |
| cards | card_field_values | One-to-Many | card_field_values.card_id |
| labels | card_labels | One-to-Many | card_labels.label_id |
| checklists | checklist_items | One-to-Many | checklist_items.checklist_id |
| custom_fields | card_field_values | One-to-Many | card_field_values.field_id |

---

## Constraints & Business Rules

1. **Workspace Slug Uniqueness:** Slugs must be globally unique
2. **Position Ordering:** Lists and cards use integer positions for ordering
3. **WIP Limits:** Lists can have optional work-in-progress limits
4. **Soft Deletes:** Users, workspaces, boards use soft delete (deleted_at)
5. **Cascading:** Board deletion archives all lists and cards (not hard delete)
6. **Notifications:** Unread notifications limited to 100 per user (FIFO)

---

## Future Schema Extensions

### Phase 2 Additions
- **sprints** table for agile sprint management
- **time_entries** table for time tracking
- **card_dependencies** table for card relationships
- **views** table for saved board views (Gantt, Calendar, Table)

### Phase 3 Additions
- **teams** table for sub-teams within workspaces
- **goals** table for OKR tracking
- **integrations** table for third-party app connections
- **ai_suggestions** table for AI-generated recommendations

---

**Document History:**
- v1.0 (2026-01-29): Initial schema design
