# User Stories
# TaskFlow - Project Management Platform

> **Version:** 1.0  
> **Date:** January 29, 2026  
> **Format:** As a [user type], I want [action] so that [benefit]

---

## Epic 1: Authentication & User Management

### US-001: User Registration with Email
**As a** new user  
**I want to** create an account with my email and password  
**So that** I can start using TaskFlow

**Acceptance Criteria:**
- [ ] User can enter email, password, and full name
- [ ] System validates email format and password strength (min 8 chars, 1 uppercase, 1 number)
- [ ] System checks for duplicate email addresses
- [ ] User receives email verification link
- [ ] Account is activated upon email verification

**Priority:** High  
**Story Points:** 3

---

### US-002: OAuth Signup/Login
**As a** new user  
**I want to** sign up using my Google or GitHub account  
**So that** I can register quickly without creating a new password

**Acceptance Criteria:**
- [ ] User can click "Sign up with Google" or "Sign up with GitHub" buttons
- [ ] System fetches email, name, and avatar from OAuth provider
- [ ] Account is created automatically after OAuth consent
- [ ] User is redirected to workspace creation flow

**Priority:** High  
**Story Points:** 2

---

### US-003: User Login
**As a** registered user  
**I want to** log in with my credentials  
**So that** I can access my workspaces and boards

**Acceptance Criteria:**
- [ ] User can enter email and password
- [ ] System validates credentials
- [ ] User is redirected to their last viewed board or workspace dashboard
- [ ] Error message shown for invalid credentials
- [ ] "Remember me" option keeps session for 30 days
- [ ] "Forgot password" link initiates reset flow

**Priority:** High  
**Story Points:** 2

---

### US-004: User Profile Management
**As a** user  
**I want to** update my profile information  
**So that** my team can see my correct name and avatar

**Acceptance Criteria:**
- [ ] User can upload/change profile avatar
- [ ] User can update full name
- [ ] User can change password
- [ ] User can set timezone
- [ ] User can configure notification preferences
- [ ] Changes are saved immediately

**Priority:** Medium  
**Story Points:** 2

---

## Epic 2: Workspace Management

### US-005: Create Workspace
**As a** new user  
**I want to** create a workspace for my team  
**So that** I can organize my projects

**Acceptance Criteria:**
- [ ] User can enter workspace name
- [ ] System auto-generates URL-friendly slug
- [ ] User can add optional description
- [ ] User can set visibility (private/team)
- [ ] Workspace is created and user becomes owner
- [ ] User is redirected to new workspace

**Priority:** High  
**Story Points:** 3

---

### US-006: Invite Team Members
**As a** workspace owner  
**I want to** invite team members by email  
**So that** they can collaborate on boards

**Acceptance Criteria:**
- [ ] User can enter email addresses (multiple, comma-separated)
- [ ] User can select role for invitees (admin, member, guest)
- [ ] System sends invitation emails with unique links
- [ ] Invitations expire after 7 days
- [ ] Pending invitations are visible in member list
- [ ] Invitations can be revoked

**Priority:** High  
**Story Points:** 3

---

### US-007: Manage Workspace Members
**As a** workspace admin  
**I want to** view and manage workspace members  
**So that** I can control access and permissions

**Acceptance Criteria:**
- [ ] Member list shows all users with their roles
- [ ] Admin can change member roles
- [ ] Admin can remove members from workspace
- [ ] Owner can transfer ownership
- [ ] Member count is displayed
- [ ] Search/filter members by name or email

**Priority:** Medium  
**Story Points:** 3

---

### US-008: Switch Between Workspaces
**As a** user with multiple workspaces  
**I want to** quickly switch between my workspaces  
**So that** I can access different projects easily

**Acceptance Criteria:**
- [ ] Workspace switcher is accessible from any page
- [ ] List shows all workspaces user is member of
- [ ] Current workspace is highlighted
- [ ] Clicking workspace switches context
- [ ] Recently viewed workspaces appear at top

**Priority:** Medium  
**Story Points:** 2

---

## Epic 3: Board Management

### US-009: Create Board
**As a** workspace member  
**I want to** create a new board  
**So that** I can organize a specific project

**Acceptance Criteria:**
- [ ] User can enter board name
- [ ] User can select template (Kanban, Scrum, Simple, Blank)
- [ ] User can set visibility (private, team, public)
- [ ] User can choose background color or image
- [ ] Board is created with default lists based on template
- [ ] User is redirected to new board

**Priority:** High  
**Story Points:** 3

---

### US-010: View Board List
**As a** workspace member  
**I want to** see all boards in my workspace  
**So that** I can find the board I need to work on

**Acceptance Criteria:**
- [ ] Grid/list view of all boards
- [ ] Boards show preview/thumbnail
- [ ] Boards are sortable by name, date, or recently viewed
- [ ] Search filters boards by name
- [ ] Starred boards appear first
- [ ] Archived boards are in separate section

**Priority:** High  
**Story Points:** 2

---

### US-011: Star/Favorite Board
**As a** user  
**I want to** star my frequently used boards  
**So that** I can access them quickly

**Acceptance Criteria:**
- [ ] Star icon on each board card
- [ ] Clicking star adds board to favorites
- [ ] Starred boards appear at top of list
- [ ] Starred boards appear in sidebar quick access
- [ ] Unstarring removes from favorites

**Priority:** Low  
**Story Points:** 1

---

### US-012: Archive Board
**As a** board owner  
**I want to** archive a completed board  
**So that** it doesn't clutter my workspace

**Acceptance Criteria:**
- [ ] Archive option in board menu
- [ ] Confirmation dialog before archiving
- [ ] Archived boards are hidden from main view
- [ ] Archived boards can be viewed in archive section
- [ ] Archived boards can be restored
- [ ] Archived boards are read-only

**Priority:** Medium  
**Story Points:** 2

---

### US-013: Duplicate Board
**As a** user  
**I want to** duplicate an existing board  
**So that** I can use it as a template for similar projects

**Acceptance Criteria:**
- [ ] Duplicate option in board menu
- [ ] User can choose new name
- [ ] All lists, cards, labels are copied
- [ ] Card members and due dates are optionally copied
- [ ] Comments and attachments are not copied
- [ ] New board opens after duplication

**Priority:** Low  
**Story Points:** 3

---

## Epic 4: List Management

### US-014: Create List
**As a** board member  
**I want to** add a new list to my board  
**So that** I can organize cards into stages

**Acceptance Criteria:**
- [ ] "Add list" button at end of board
- [ ] User can enter list name
- [ ] List appears at end of board
- [ ] List is immediately editable
- [ ] Empty list shows placeholder

**Priority:** High  
**Story Points:** 2

---

### US-015: Reorder Lists
**As a** board member  
**I want to** drag and drop lists to reorder them  
**So that** I can organize my workflow

**Acceptance Criteria:**
- [ ] Lists are draggable via header
- [ ] Visual feedback during drag
- [ ] Drop target is highlighted
- [ ] New order is saved automatically
- [ ] Order persists across sessions
- [ ] Other users see reorder in real-time

**Priority:** High  
**Story Points:** 3

---

### US-016: Set WIP Limit
**As a** team using Kanban  
**I want to** set a work-in-progress limit on a list  
**So that** we don't overload the team

**Acceptance Criteria:**
- [ ] WIP limit can be set in list menu
- [ ] Limit is displayed on list header
- [ ] Visual warning when limit is exceeded
- [ ] Cards can still be added (soft limit)
- [ ] Limit can be removed or changed

**Priority:** Low  
**Story Points:** 2

---

### US-017: Archive List
**As a** board member  
**I want to** archive a list  
**So that** I can clean up completed work

**Acceptance Criteria:**
- [ ] Archive option in list menu
- [ ] All cards in list are archived
- [ ] List is hidden from board
- [ ] Archived lists can be viewed and restored
- [ ] Restoring list restores all its cards

**Priority:** Medium  
**Story Points:** 2

---

## Epic 5: Card Management

### US-018: Create Card
**As a** board member  
**I want to** quickly add a new card to a list  
**So that** I can capture tasks

**Acceptance Criteria:**
- [ ] "Add card" button at bottom of list
- [ ] Quick add: enter title, press Enter
- [ ] Card appears at bottom of list
- [ ] Another card can be added immediately
- [ ] Clicking elsewhere or Escape cancels

**Priority:** High  
**Story Points:** 2

---

### US-019: Edit Card Details
**As a** board member  
**I want to** view and edit all card details  
**So that** I can manage the task comprehensively

**Acceptance Criteria:**
- [ ] Clicking card opens detail modal
- [ ] Can edit title inline
- [ ] Rich text description editor (Markdown)
- [ ] Can add/remove labels
- [ ] Can set/change due date
- [ ] Can assign members
- [ ] Can add checklists
- [ ] Can attach files
- [ ] Can add comments

**Priority:** High  
**Story Points:** 5

---

### US-020: Move Card Between Lists
**As a** board member  
**I want to** drag cards between lists  
**So that** I can track task progress

**Acceptance Criteria:**
- [ ] Cards are draggable
- [ ] Can drag to any list on board
- [ ] Visual feedback during drag
- [ ] Position within list is maintained
- [ ] Move is saved automatically
- [ ] Other users see move in real-time
- [ ] Activity is logged

**Priority:** High  
**Story Points:** 3

---

### US-021: Reorder Cards Within List
**As a** board member  
**I want to** reorder cards within a list  
**So that** I can prioritize tasks

**Acceptance Criteria:**
- [ ] Cards are draggable within list
- [ ] Drop position determines new order
- [ ] Order is saved automatically
- [ ] Other users see reorder in real-time

**Priority:** High  
**Story Points:** 2

---

### US-022: Assign Members to Card
**As a** board member  
**I want to** assign team members to a card  
**So that** everyone knows who's responsible

**Acceptance Criteria:**
- [ ] Member picker in card details
- [ ] Shows workspace members
- [ ] Multiple members can be assigned
- [ ] Assigned members see avatar on card
- [ ] Assigned members receive notification
- [ ] Can remove assignment

**Priority:** High  
**Story Points:** 2

---

### US-023: Set Due Date
**As a** board member  
**I want to** set a due date on a card  
**So that** deadlines are tracked

**Acceptance Criteria:**
- [ ] Date picker in card details
- [ ] Can select date and optional time
- [ ] Due date appears on card mini-view
- [ ] Color changes as due date approaches
- [ ] Overdue cards are highlighted
- [ ] Reminder notifications sent

**Priority:** High  
**Story Points:** 3

---

### US-024: Add Labels
**As a** board member  
**I want to** add color-coded labels to cards  
**So that** I can categorize and filter tasks

**Acceptance Criteria:**
- [ ] Label picker in card details
- [ ] Board-specific labels
- [ ] Multiple labels per card
- [ ] Labels show on card mini-view
- [ ] Can filter board by labels
- [ ] Can create new labels

**Priority:** Medium  
**Story Points:** 3

---

### US-025: Add Checklist
**As a** board member  
**I want to** add checklists to cards  
**So that** I can break down tasks into subtasks

**Acceptance Criteria:**
- [ ] Can add multiple checklists per card
- [ ] Each checklist has a title
- [ ] Can add items to checklist
- [ ] Can check/uncheck items
- [ ] Progress bar shows completion %
- [ ] Can assign checklist items to users
- [ ] Can set due dates on items

**Priority:** Medium  
**Story Points:** 3

---

### US-026: Attach Files
**As a** board member  
**I want to** attach files to cards  
**So that** relevant documents are accessible

**Acceptance Criteria:**
- [ ] Can upload files via drag-and-drop
- [ ] Can upload via file picker
- [ ] Multiple files per card
- [ ] Image previews shown
- [ ] Can download attached files
- [ ] Can delete attachments
- [ ] File size limit: 50MB

**Priority:** Medium  
**Story Points:** 3

---

### US-027: Copy/Move Card
**As a** board member  
**I want to** copy or move a card to another board  
**So that** I can reorganize work across projects

**Acceptance Criteria:**
- [ ] Copy/Move option in card menu
- [ ] Can select destination board
- [ ] Can select destination list
- [ ] Can select position within list
- [ ] Copy keeps original, creates duplicate
- [ ] Move removes from original location
- [ ] Comments optionally copied

**Priority:** Low  
**Story Points:** 3

---

### US-028: Archive Card
**As a** board member  
**I want to** archive completed cards  
**So that** my board stays clean

**Acceptance Criteria:**
- [ ] Archive option in card menu
- [ ] Card is removed from list
- [ ] Card is moved to archive
- [ ] Can view archived cards
- [ ] Can restore archived cards
- [ ] Can permanently delete archived cards

**Priority:** Medium  
**Story Points:** 2

---

## Epic 6: Collaboration & Communication

### US-029: Add Comments
**As a** board member  
**I want to** comment on cards  
**So that** I can discuss tasks with my team

**Acceptance Criteria:**
- [ ] Comment input in card details
- [ ] Supports Markdown formatting
- [ ] @mentions notify users
- [ ] Comments show author and timestamp
- [ ] Comments are ordered newest first
- [ ] Can edit own comments
- [ ] Can delete own comments

**Priority:** High  
**Story Points:** 3

---

### US-030: Real-time Updates
**As a** user  
**I want to** see changes made by others in real-time  
**So that** I'm always working with current data

**Acceptance Criteria:**
- [ ] Card moves appear instantly
- [ ] New cards appear without refresh
- [ ] Edits sync immediately
- [ ] Visual indicator when someone is editing
- [ ] Cursor positions visible (optional)
- [ ] Reconnection handled gracefully

**Priority:** High  
**Story Points:** 5

---

### US-031: Activity Feed
**As a** user  
**I want to** see recent activity on a board  
**So that** I can track what changed

**Acceptance Criteria:**
- [ ] Activity feed in board menu
- [ ] Shows card moves, edits, comments
- [ ] Shows who made each change
- [ ] Timestamp for each activity
- [ ] Filter by activity type
- [ ] Infinite scroll for history

**Priority:** Medium  
**Story Points:** 3

---

### US-032: Notifications
**As a** user  
**I want to** receive notifications for relevant activities  
**So that** I don't miss important updates

**Acceptance Criteria:**
- [ ] Notification center accessible from header
- [ ] Notifications for: mentions, assignments, due dates
- [ ] Unread count badge
- [ ] Can mark all as read
- [ ] Can configure notification preferences
- [ ] Email notifications for important events
- [ ] Push notifications on mobile

**Priority:** High  
**Story Points:** 5

---

## Epic 7: Search & Filtering

### US-033: Global Search
**As a** user  
**I want to** search across all my boards and cards  
**So that** I can quickly find what I need

**Acceptance Criteria:**
- [ ] Search bar accessible from any page
- [ ] Searches card titles and descriptions
- [ ] Searches board names
- [ ] Results grouped by type
- [ ] Clicking result navigates to item
- [ ] Keyboard shortcut (Cmd/Ctrl+K)

**Priority:** High  
**Story Points:** 3

---

### US-034: Filter Board View
**As a** board member  
**I want to** filter cards by various criteria  
**So that** I can focus on specific work

**Acceptance Criteria:**
- [ ] Filter by member (assigned to)
- [ ] Filter by label
- [ ] Filter by due date (overdue, today, this week)
- [ ] Multiple filters can be combined
- [ ] Filter indicator shows active filters
- [ ] Clear all filters option
- [ ] Filter persists during session

**Priority:** Medium  
**Story Points:** 3

---

## Epic 8: AI & Automation (Phase 2)

### US-035: AI Task Description Generation
**As a** user  
**I want to** AI to generate task descriptions from titles  
**So that** I can create detailed cards faster

**Acceptance Criteria:**
- [ ] "Generate description" button in card editor
- [ ] AI analyzes card title and context
- [ ] Generates relevant description
- [ ] User can edit before saving
- [ ] Can regenerate if not satisfied

**Priority:** Medium (Phase 2)  
**Story Points:** 5

---

### US-036: Smart Card Categorization
**As a** user  
**I want to** AI to suggest labels for my cards  
**So that** I can organize consistently

**Acceptance Criteria:**
- [ ] AI analyzes card title and description
- [ ] Suggests relevant labels from board
- [ ] User can accept or ignore suggestions
- [ ] Learns from user choices over time

**Priority:** Low (Phase 2)  
**Story Points:** 5

---

### US-037: Create Automation Rule
**As a** power user  
**I want to** create automation rules  
**So that** repetitive tasks are handled automatically

**Acceptance Criteria:**
- [ ] Visual rule builder
- [ ] Select trigger (card moved, due date approaching)
- [ ] Select action (add label, assign member, send notification)
- [ ] Can add conditions
- [ ] Rules can be enabled/disabled
- [ ] Activity log shows rule executions

**Priority:** Medium (Phase 2)  
**Story Points:** 8

---

## Epic 9: MCP Integration (Phase 2)

### US-038: Query Board via MCP
**As an** AI agent  
**I want to** query board state via MCP  
**So that** I can provide intelligent assistance

**Acceptance Criteria:**
- [ ] MCP server exposes board list
- [ ] Can query cards in a board
- [ ] Can filter cards by criteria
- [ ] Returns structured data
- [ ] Authentication required

**Priority:** High (Phase 2)  
**Story Points:** 5

---

### US-039: Create Card via MCP
**As an** AI agent  
**I want to** create cards programmatically  
**So that** I can integrate with external systems

**Acceptance Criteria:**
- [ ] MCP tool to create card
- [ ] Specify board, list, title, description
- [ ] Can assign members
- [ ] Can set labels and due date
- [ ] Returns created card ID

**Priority:** High (Phase 2)  
**Story Points:** 3

---

### US-040: Update Card via MCP
**As an** AI agent  
**I want to** update card status via MCP  
**So that** I can automate workflows

**Acceptance Criteria:**
- [ ] MCP tool to update card
- [ ] Can move card between lists
- [ ] Can update any card field
- [ ] Can add comments
- [ ] Changes trigger notifications

**Priority:** High (Phase 2)  
**Story Points:** 3

---

## Story Summary

| Epic | Stories | Points |
|------|---------|--------|
| Epic 1: Authentication | 4 | 9 |
| Epic 2: Workspace Management | 4 | 11 |
| Epic 3: Board Management | 5 | 11 |
| Epic 4: List Management | 4 | 9 |
| Epic 5: Card Management | 11 | 31 |
| Epic 6: Collaboration | 4 | 16 |
| Epic 7: Search & Filtering | 2 | 6 |
| Epic 8: AI & Automation | 3 | 18 |
| Epic 9: MCP Integration | 3 | 11 |
| **Total** | **40** | **122** |

**MVP Scope (Must Have):**  
Epics 1-7 = ~93 points

---

**Document History:**
- v1.0 (2026-01-29): Initial user stories
