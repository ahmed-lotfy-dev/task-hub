import { db } from "../db/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export class UserService {
  static async getUserById(userId: string) {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    return user;
  }

  static async getUserByEmail(email: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user;
  }
}
