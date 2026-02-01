import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAuthTools } from "./auth";
import { registerWorkspaceTools } from "./workspaces";
import { registerBoardTools } from "./boards";
import { registerCardTools } from "./cards";

export const registerAllTools = (server: McpServer) => {
  registerAuthTools(server);
  registerWorkspaceTools(server);
  registerBoardTools(server);
  registerCardTools(server);
};
