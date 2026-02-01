import { db } from "./src/db/db";
import { workspaces, boards, users, lists, cards, workspaceMembers, activities } from "./src/db/schema";
import { eq, inArray } from "drizzle-orm";
import { logActivity } from "./src/lib/activity-logger";

async function reinitializeProject() {
  console.log("🧨 WIPING ALL PROJECT DATA...");

  try {
    // 1. Identification
    const [user] = await db.select().from(users).limit(1);
    if (!user) throw new Error("No user found in DB");
    console.log(`👤 Identifying context for User: ${user.email}`);

    // 2. Wipe everything associated with the user
    await db.transaction(async (tx) => {
      const userWorkspaces = await tx.select({ id: workspaces.id }).from(workspaces).where(eq(workspaces.ownerId, user.id));
      const wsIds = userWorkspaces.map(w => w.id);

      if (wsIds.length > 0) {
        console.log(`🧹 Deleting records for ${wsIds.length} workspaces...`);
        await tx.delete(cards).where(inArray(cards.boardId, tx.select({ id: boards.id }).from(boards).where(inArray(boards.workspaceId, wsIds))));
        await tx.delete(lists).where(inArray(lists.boardId, tx.select({ id: boards.id }).from(boards).where(inArray(boards.workspaceId, wsIds))));
        await tx.delete(boards).where(inArray(boards.workspaceId, wsIds));
        await tx.delete(workspaceMembers).where(inArray(workspaceMembers.workspaceId, wsIds));
        await tx.delete(activities).where(eq(activities.userId, user.id));
        await tx.delete(workspaces).where(inArray(workspaces.id, wsIds));
      }
    });

    console.log("✨ Data wiped. Beginning re-initialization of 'TaskHub Nexus' via MCP logic...");

    // 3. Create Workspace (TaskHub Nexus)
    const wsName = "TaskHub Nexus";
    const [workspace] = await db.insert(workspaces).values({
      name: wsName,
      slug: "taskhub-nexus",
      ownerId: user.id,
      description: "The central hub for all project engineering and design workflows.",
      visibility: "private"
    }).returning();

    await db.insert(workspaceMembers).values({
      workspaceId: workspace.id,
      userId: user.id,
      role: "admin"
    });

    await logActivity({
      userId: user.id,
      workspaceId: workspace.id,
      action: 'create',
      entityType: 'workspace',
      entityId: workspace.id,
      entityName: workspace.name,
    });
    console.log(`✅ Created Workspace: ${wsName}`);

    // 4. Create Main Board
    const [board] = await db.insert(boards).values({
      name: "Engineering Core",
      workspaceId: workspace.id,
      template: "kanban",
      visibility: "private",
      description: "Main development roadmap and feature backlog."
    }).returning();

    await logActivity({
      userId: user.id,
      workspaceId: workspace.id,
      boardId: board.id,
      action: 'create',
      entityType: 'board',
      entityId: board.id,
      entityName: board.name,
    });
    console.log("✅ Created Board: Engineering Core");

    // 5. Create Standard Lists
    const listNames = ["Backlog", "In Progress", "Review", "Done"];
    const boardLists = [];
    for (const name of listNames) {
      const [list] = await db.insert(lists).values({
        boardId: board.id,
        name,
        position: listNames.indexOf(name) * 1000
      }).returning();
      boardLists.push(list);

      await logActivity({
        userId: user.id,
        workspaceId: workspace.id,
        boardId: board.id,
        action: 'create',
        entityType: 'list',
        entityId: list.id,
        entityName: list.name,
      });
    }
    console.log(`✅ Created ${boardLists.length} project lists.`);

    const backlogList = boardLists[0];

    // 6. Populate the roadmap with our actual project tasks
    const roadmap = [
      { title: "Refactor MCP to Modular Architecture", desc: "Split MCP tools into feature-based files (SOLID).", priority: "high" },
      { title: "Implement Real-time Activity Feed", desc: "Connect Drizzle activity logging to frontend feed.", priority: "medium" },
      { title: "Standardize Monorepo Types", desc: "Enforce shared Zod types across web/api and shared package.", priority: "high" },
      { title: "Better Auth Integration", desc: "Configure social logins and session middleware persistence.", priority: "medium" },
      { title: "Claymorphic Design System", desc: "Develop a premium UI language with glassmorphism and 3D shadows.", priority: "high" },
      { title: "SSE Transport for MCP", desc: "Implement stable SSE bridge for deep AI integration.", priority: "medium" },
      { title: "Task Automation via AI Bridge", desc: "Enable AI agents to perform complex CRUD via MCP tools.", priority: "high" },
      { title: "Mobile UI Optimization", desc: "Ensure dashboard is silky smooth on smaller viewports.", priority: "low" }
    ];

    console.log(`📝 Injecting ${roadmap.length} feature tasks...`);
    for (const item of roadmap) {
      const [card] = await db.insert(cards).values({
        boardId: board.id,
        listId: backlogList.id,
        title: item.title,
        description: item.desc,
        priority: item.priority as any,
        position: roadmap.indexOf(item) * 1000
      }).returning();

      await logActivity({
        userId: user.id,
        workspaceId: workspace.id,
        boardId: board.id,
        action: 'create',
        entityType: 'card',
        entityId: card.id,
        entityName: card.title,
      });
      console.log(`📌 Task Added: ${item.title}`);
    }

    console.log("\n🎊 PROJECT RE-INITIALIZATION COMPLETE!");
    console.log(`🚀 'TaskHub Nexus' is now live for user ${user.email}`);

  } catch (error) {
    console.error("❌ Re-initialization failed:", error);
  } finally {
    process.exit(0);
  }
}

reinitializeProject();
