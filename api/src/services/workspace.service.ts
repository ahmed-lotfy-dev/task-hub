import { db } from "../db/db";
import { workspaces, workspaceMembers, users } from "../db/schema";
import { eq, and, sql } from "drizzle-orm";
import { logActivity } from "../lib/activity-logger";

export class WorkspaceService {
  static async listWorkspaces(userId: string) {
    return await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        slug: workspaces.slug,
        description: workspaces.description,
        visibility: workspaces.visibility,
        ownerId: workspaces.ownerId,
        role: workspaceMembers.role,
        createdAt: workspaces.createdAt,
        updatedAt: workspaces.updatedAt,
        settings: workspaces.settings,
      })
      .from(workspaces)
      .innerJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
      .where(eq(workspaceMembers.userId, userId));
  }

  static async getWorkspaceById(workspaceId: string) {
    const [workspace] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId as any))
      .limit(1);
    return workspace;
  }

  static async getWorkspaceBySlug(slug: string) {
    const [workspace] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.slug, slug))
      .limit(1);
    return workspace;
  }

  static async getMemberCount(workspaceId: string) {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.workspaceId, workspaceId as any));
    return Number(result.count) || 1;
  }

  static async createWorkspace(data: {
    name: string;
    userId: string;
    description?: string;
    visibility?: "private" | "team" | "public";
  }) {
    const slug = data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    return await db.transaction(async (tx) => {
      const [workspace] = await tx.insert(workspaces).values({
        name: data.name,
        description: data.description ?? null,
        visibility: data.visibility ?? "private",
        slug,
        ownerId: data.userId,
      }).returning();

      await tx.insert(workspaceMembers).values({
        workspaceId: workspace.id,
        userId: data.userId,
        role: "owner",
      });

      await logActivity({
        userId: data.userId,
        workspaceId: workspace.id,
        action: 'create',
        entityType: 'workspace',
        entityId: workspace.id,
        entityName: workspace.name,
        metadata: { via: 'service' }
      });

      return workspace;
    });
  }

  static async updateWorkspace(workspaceId: string, userId: string, updates: {
    name?: string;
    description?: string;
    visibility?: "private" | "team" | "public";
  }) {
    const updateData: any = { ...updates, updatedAt: new Date() };
    if (updates.name) {
      updateData.slug = updates.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    }

    const [updated] = await db
      .update(workspaces)
      .set(updateData)
      .where(eq(workspaces.id, workspaceId as any))
      .returning();

    if (!updated) return null;

    await logActivity({
      userId,
      workspaceId: updated.id,
      action: 'update',
      entityType: 'workspace',
      entityId: updated.id,
      entityName: updated.name,
      metadata: { via: 'service', updates }
    });

    return updated;
  }

  static async deleteWorkspace(workspaceId: string, userId: string) {
    const workspace = await this.getWorkspaceById(workspaceId);
    if (!workspace) return null;

    if (workspace.ownerId !== userId) {
      throw new Error("Only the owner can delete the workspace");
    }

    const [deleted] = await db
      .delete(workspaces)
      .where(eq(workspaces.id, workspaceId as any))
      .returning();

    await logActivity({
      userId,
      workspaceId: deleted.id,
      action: 'delete',
      entityType: 'workspace',
      entityId: deleted.id,
      entityName: deleted.name,
      metadata: { via: 'service' }
    });

    return deleted;
  }

  static async getWorkspaceMembers(workspaceId: string) {
    return await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        role: workspaceMembers.role,
        joinedAt: workspaceMembers.joinedAt,
      })
      .from(workspaceMembers)
      .innerJoin(users, eq(workspaceMembers.userId, users.id))
      .where(eq(workspaceMembers.workspaceId, workspaceId as any));
  }

  static async getMemberRole(workspaceId: string, userId: string) {
    const [membership] = await db
      .select()
      .from(workspaceMembers)
      .where(and(
        eq(workspaceMembers.workspaceId, workspaceId as any),
        eq(workspaceMembers.userId, userId)
      ));
    return membership?.role || null;
  }

  static async removeMember(workspaceId: string, targetUserId: string, actorId: string) {
    const actorRole = await this.getMemberRole(workspaceId, actorId);
    if (actorRole !== "owner" && actorRole !== "admin") {
      throw new Error("Only owners and admins can remove members");
    }

    const workspace = await this.getWorkspaceById(workspaceId);
    if (!workspace) throw new Error("Workspace not found");

    if (targetUserId === workspace.ownerId) {
      throw new Error("Cannot remove the workspace owner");
    }

    if (targetUserId === actorId) {
      throw new Error("Use leave workspace instead");
    }

    return await db
      .delete(workspaceMembers)
      .where(and(
        eq(workspaceMembers.workspaceId, workspaceId as any),
        eq(workspaceMembers.userId, targetUserId)
      ))
      .returning();
  }
}
