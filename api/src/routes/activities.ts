import { Elysia, t } from "elysia";
import { db } from "../db/db";
import { activities, users } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { betterAuth } from "../middleware/auth-middleware";
import { User } from "@taskflow/shared";

export const activityRoutes = new Elysia({ prefix: "/activities" })
  .use(betterAuth)
  .get("/", async (context: any) => {
    const user = context.user as User;

    // For now, return activities for the workspaces the user belongs to
    // Simplified: Return activities triggered by the user or in their workspaces
    const data = await db
      .select({
        id: activities.id,
        action: activities.action,
        entityType: activities.entityType,
        entityName: activities.entityName,
        createdAt: activities.createdAt,
        user: {
          id: users.id,
          name: users.name,
          image: users.image,
        }
      })
      .from(activities)
      .innerJoin(users, eq(activities.userId, users.id))
      .orderBy(desc(activities.createdAt))
      .limit(20);

    return data.map(a => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
    }));
  }, {
    auth: true
  });
