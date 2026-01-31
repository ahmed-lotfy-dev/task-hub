# Task Hub - API Reference

This document provides a technical overview of the Task Hub API. The API is RESTful and designed for high performance and strict type safety.

## 1. Base URL
- **Development**: `http://localhost:8000`
- **Interactive Docs**: `/docs` (Swagger/Scalar)

## 2. Authentication
The API supports two modes of authentication:

### 2.1. Session-Based (Web)
Uses Better Auth cookies. Standard for the first-party frontend application.

### 2.2. Bearer Token (Programmatic/API Keys)
For external integrations and MCP clients.
- **Header**: `Authorization: Bearer <your_api_key>`

## 3. Core Endpoints

### 3.1. System
- `GET /health`: Check API status.
- `GET /docs`: Interactive API documentation.

### 3.2. Workspaces
- `GET /workspaces`: List all workspaces the user has access to.
- `POST /workspaces`: Create a new workspace.
- `GET /workspaces/:id`: Get workspace details.
- `PATCH /workspaces/:id`: Update workspace settings.

### 3.3. Boards
- `GET /workspaces/:id/boards`: List boards in a workspace.
- `POST /workspaces/:id/boards`: Create a new board.
- `GET /boards/:id`: Get board details (including lists and card count).

### 3.4. Cards & Lists
- `GET /boards/:id/lists`: Fetch all lists and cards for a board.
- `POST /lists/:id/cards`: Add a card to a list.
- `PATCH /cards/:id`: Update card details (title, description, priority, labels).
- `DELETE /cards/:id`: Archive or delete a card.

## 4. API Keys & Rate Limiting

### 4.1. Managing API Keys
API keys are managed via the User Settings in the dashboard.
- **Scopes**: `read`, `write`, `admin`.
- **Expiration**: Keys can be set to never expire or have a fixed TTL.

### 4.2. Rate Limiting Tiers
To ensure stability, the following rate limits apply to API key usage:
| Tier | Requests / Min | Description |
| :--- | :--- | :--- |
| **Free** | 60 | Standard developer usage. |
| **Pro** | 500 | Production-grade integrations. |
| **System** | Unlimited | Internal service communication. |

### 4.3. Error Handling
- `401 Unauthorized`: Missing or invalid authentication.
- `403 Forbidden`: Insufficient permissions (scope mismatch).
- `429 Too Many Requests`: Rate limit exceeded.
