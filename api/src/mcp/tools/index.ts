import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerWorkspaceTools } from "./workspaces";
import { registerBoardTools } from "./boards";
import { registerCardTools } from "./cards";

export const registerAllTools = (server: McpServer) => {
  registerWorkspaceTools(server);
  registerBoardTools(server);
  registerCardTools(server);
};
