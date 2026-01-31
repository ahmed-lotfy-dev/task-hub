# Model Context Protocol (MCP) Server Implementation Guide

The **Model Context Protocol (MCP)** is an open standard that enables developers to build secure, two-way connections between their data/tools and AI models (like Claude, ChatGPT, or local LLMs).

This guide explains how to implement an MCP server across three popular Node.js frameworks: **Express.js**, **NestJS**, and **Elysia**.

---

## 🏗️ Core Concepts
An MCP server exposes three primary capabilities to an AI:
1.  **Tools**: Executable functions the AI can call (e.g., `calculate_tax`, `search_database`).
2.  **Resources**: Read-only data sources (e.g., `logs`, `customer_profile`).
3.  **Prompts**: Templates that guide the AI's behavior (e.g., `analyze_code_style`).

---

## ⚡ 1. Elysia (Bun)
Elysia is the fastest way to build MCP servers, especially when running on Bun.

### Installation
```bash
bun add elysia elysia-mcp @modelcontextprotocol/sdk
```

### Implementation Pattern
Elysia uses a plugin-based approach. The `elysia-mcp` plugin handles the complex protocol handshakes for you.

```typescript
import { Elysia } from 'elysia'
import { mcp } from 'elysia-mcp'

const app = new Elysia()
  .use(
    mcp({
      info: {
        name: 'My Task Hub Server',
        version: '1.0.0'
      },
      tools: {
        get_task_status: {
          description: 'Get the status of a specific task',
          handler: async ({ taskId }) => {
            // Your logic here
            return { status: 'in-progress' }
          }
        }
      }
    })
  )
  .listen(8000)
```

> [!TIP]
> **Why Elysia?** It leverages Bun's native performance and offers the cleanest syntax for defining tools with full TypeBox/TypeScript support.

---

## 🚀 2. Express.js
Express requires a more manual setup using the official SDK and SSE (Server-Sent Events) for real-time communication.

### Installation
```bash
npm install express @modelcontextprotocol/sdk zod
```

### Implementation Pattern
You need to set up a `McpServer` instance and connect it to an Express route via an SSE transport.

```javascript
import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

const server = new McpServer({
  name: "Express MCP",
  version: "1.0.0",
});

// Register a Tool
server.tool("echo", { message: z.string() }, async ({ message }) => ({
  content: [{ type: "text", text: `Echo: ${message}` }],
}));

const app = express();

app.get("/sse", async (req, res) => {
  const transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);
});

app.post("/messages", async (req, res) => {
  // Handle incoming JSON-RPC messages from the AI
});

app.listen(3000);
```

---

## 🦅 3. NestJS
NestJS provides a senior-level, modular approach using decorators and dependency injection.

### Installation
```bash
npm install nestjs-mcp-server @modelcontextprotocol/sdk
```

### Implementation Pattern
You define "Controllers" or "Providers" that are decorated to expose tools.

```typescript
import { McpTool, McpResource } from 'nestjs-mcp-server';

@Injectable()
export class TaskMcpService {
  constructor(private readonly taskService: TaskService) {}

  @McpTool({
    name: 'create_task',
    description: 'Creates a new task in the hub',
  })
  async createTask(title: string) {
    return this.taskService.create({ title });
  }
  
  @McpResource({
    uri: 'res://tasks/list',
    name: 'Active Tasks',
  })
  async getActiveTasks() {
    return this.taskService.findAll();
  }
}
```

> [!IMPORTANT]
> **Modular Architecture**: In NestJS, you should create an `McpModule` that imports your business logic modules and exports the MCP capabilities. This keeps your AI tools decoupled from your main REST/GraphQL API.

---

## 🛠️ Summary Table

| Feature | Elysia | Express | NestJS |
| :--- | :--- | :--- | :--- |
| **Complexity** | Low (Plugin-based) | Medium (Manual SDK) | High (Modular/Decorators) |
| **Performance** | Ultra-high (Bun) | High | High |
| **Type Safety** | Native (TypeBox) | Manual (Zod) | Strong (TS Decorators) |
| **Ideal For** | High-performance tools | Legacy integrations | Large enterprise systems |

---

## 🌐 Latest Trends (2025)
- **JSON-RPC Over SSE**: Most servers are moving away from pure StdIn transport to SSE/HTTP to allow remote AI agents to connect over the web.
- **MCP Hubs**: Tools like `Claude Desktop` act as the primary client, but new "MCP Gateways" are emerging to aggregate multiple servers into one AI interface.
- **Security**: Always use `trustedOrigins` and API keys when exposing MCP servers over public URLs.
