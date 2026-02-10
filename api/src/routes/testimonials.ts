import { Elysia, t } from "elysia";
import { betterAuth } from "../middleware/auth-middleware";
import { TestimonialService } from "../services/testimonial.service";
import { User } from "@taskflow/shared";

export const testimonialRoutes = new Elysia({ prefix: "/testimonials" })
  // Public: testimonials only if any exist
  .get("/", async () => {
    const results = await TestimonialService.listPublished();
    return results.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));
  }, {
    detail: { summary: "List testimonials" }
  })
  // Authenticated: manage a single testimonial per user
  .use(betterAuth)
  .get("/me", async (context: any) => {
    const user = context.user as User;
    const item = await TestimonialService.getByUser(user.id);

    if (!item) return null;

    return {
      ...item,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }, {
    auth: true,
    detail: { summary: "Get my testimonial" }
  })
  .put("/me", async (context: any) => {
    const user = context.user as User;
    const created = await TestimonialService.upsertByUser(user.id, {
      ...context.body,
    });
    return {
      ...created,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };
  }, {
    auth: true,
    body: t.Object({
      name: t.String(),
      quote: t.String(),
      role: t.Optional(t.String()),
      company: t.Optional(t.String()),
      avatarUrl: t.Optional(t.String()),
    }),
    detail: { summary: "Create or update my testimonial" }
  })
  .delete("/me", async (context: any) => {
    const user = context.user as User;
    const deleted = await TestimonialService.removeByUser(user.id);

    if (!deleted) {
      context.set.status = 404;
      return { message: "Testimonial not found" };
    }

    return { message: "Testimonial deleted" };
  }, {
    auth: true,
    detail: { summary: "Delete my testimonial" }
  });
