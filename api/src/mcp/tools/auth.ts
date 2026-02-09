import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { UserService } from "../../services/user.service";

export const registerAuthTools = (server: McpServer) => {
  server.registerTool(
    "whoami",
    {
      description: "Get information about the authenticated user",
      inputSchema: z.object({})
    },
    async (_, extra: any) => {
      const userId = extra?.authInfo?.userId;
      if (!userId) {
        return {
          content: [{ type: "text", text: "Error: No authenticated user found." }],
          isError: true
        };
      }

      try {
        const user = await UserService.getUserById(userId);

        if (!user) {
          return {
            content: [{ type: "text", text: "User not found" }],
            isError: true
          };
        }

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              userId: user.id,
              name: user.name,
              email: user.email,
              message: "Use this userId in subsequent tool calls"
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `Error fetching user: ${error.message}` }],
          isError: true
        };
      }
    }
  );
};

