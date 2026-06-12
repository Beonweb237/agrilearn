import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { badges, userBadges } from "../../db/schema";
import { eq, and, desc } from "drizzle-orm";

export const badgeRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(badges)
      .where(eq(badges.isActive, true))
      .orderBy(desc(badges.createdAt));
  }),

  getUserBadges: publicQuery
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const userBadgeList = await db
        .select()
        .from(userBadges)
        .where(eq(userBadges.userId, input.userId))
        .orderBy(desc(userBadges.earnedAt));

      const badgesWithDetails = await Promise.all(
        userBadgeList.map(async (ub) => {
          const [badge] = await db
            .select()
            .from(badges)
            .where(eq(badges.id, ub.badgeId))
            .limit(1);
          return { ...ub, badge };
        })
      );

      return badgesWithDetails;
    }),

  awardBadge: publicQuery
    .input(z.object({ userId: z.number(), badgeId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();

      const [existing] = await db
        .select()
        .from(userBadges)
        .where(
          and(
            eq(userBadges.userId, input.userId),
            eq(userBadges.badgeId, input.badgeId)
          )
        )
        .limit(1);

      if (existing) {
        return { success: true, alreadyHas: true };
      }

      await db.insert(userBadges).values({
        userId: input.userId,
        badgeId: input.badgeId,
      });

      return { success: true, alreadyHas: false };
    }),

  checkCourseCompletion: publicQuery
    .input(z.object({ userId: z.number(), courseId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();

      const courseBadges = await db
        .select()
        .from(badges)
        .where(eq(badges.courseId, input.courseId));

      const earnedBadges = await db
        .select()
        .from(userBadges)
        .where(eq(userBadges.userId, input.userId));

      const availableBadges = courseBadges.map((badge) => ({
        ...badge,
        earned: earnedBadges.some((eb) => eb.badgeId === badge.id),
      }));

      return availableBadges;
    }),
});
