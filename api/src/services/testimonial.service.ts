import { db } from "../db/db";
import { testimonials } from "../db/schema";
import { desc, eq } from "drizzle-orm";

export class TestimonialService {
  static async listPublished() {
    return db
      .select()
      .from(testimonials)
      .orderBy(desc(testimonials.createdAt));
  }

  static async create(input: {
    name: string;
    quote: string;
    role?: string | null;
    company?: string | null;
    avatarUrl?: string | null;
    createdBy?: string | null;
  }) {
    const [created] = await db
      .insert(testimonials)
      .values({
        name: input.name,
        quote: input.quote,
        role: input.role ?? null,
        company: input.company ?? null,
        avatarUrl: input.avatarUrl ?? null,
        createdBy: input.createdBy ?? null,
      })
      .returning();

    return created;
  }

  static async getByUser(userId: string) {
    const [item] = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.createdBy, userId))
      .limit(1);
    return item;
  }

  static async upsertByUser(
    userId: string,
    input: {
      name: string;
      quote: string;
      role?: string | null;
      company?: string | null;
      avatarUrl?: string | null;
    }
  ) {
    const existing = await this.getByUser(userId);

    if (!existing) {
      return this.create({
        ...input,
        createdBy: userId,
      });
    }

    const [updated] = await db
      .update(testimonials)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(testimonials.id, existing.id))
      .returning();

    return updated;
  }

  static async removeByUser(userId: string) {
    const [deleted] = await db
      .delete(testimonials)
      .where(eq(testimonials.createdBy, userId))
      .returning();
    return deleted;
  }
}
