import { EventEmitter } from "events";

export interface TaskEvent {
  type: "task:created" | "task:updated" | "task:deleted" | "task:assigned" | "task:unassigned";
  task: {
    id: string;
    title: string;
    boardId: string;
    workspaceId: string;
    listId?: string;
    description?: string;
    priority?: string;
    status?: string;
    assignedUserId?: string;
  };
  userId: string;
  workspaceId: string;
  timestamp: string;
}

export interface McpEventEmitter extends EventEmitter {
  on(event: "task:event", listener: (event: TaskEvent) => void): this;
  emit(event: "task:event", data: TaskEvent): boolean;
}

class McpEvents extends EventEmitter implements McpEventEmitter {
  emitTaskEvent(event: TaskEvent) {
    this.emit("task:event", event);
  }
}

export const mcpEvents = new McpEvents();
