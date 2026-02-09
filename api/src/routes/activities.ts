import { Elysia } from "elysia";
import { ActivityService } from "../services/activity.service";
import { betterAuth } from "../middleware/auth-middleware";
import { User } from "@taskflow/shared";

export const activityRoutes = new Elysia({ prefix: "/activities" })
  .use(betterAuth)
  .get("/", async (context: any) => {
    const user = context.user as User;

    const data = await ActivityService.getWorkspaceActivities(user.id);

    return data.map(a => ({
      ...a,
      createdAt: a.createdAt instanceof Date ? a.createdAt.toISOString() : a.createdAt,
    }));
  }, {
    auth: true
  });

