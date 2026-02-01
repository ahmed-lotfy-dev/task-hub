import { db } from "../../db/db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export const registerAuthTools = (server: McpServer) => {
  server.tool(
    "whoami",
    {
      userId: z.string().describe("The authenticated user ID from the API key")
    },
    async ({ userId }) => {
      const [user] = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) {
        return {
          content: [{
            type: "text",
            text: "User not found"
          }]
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
    }
  );
};
