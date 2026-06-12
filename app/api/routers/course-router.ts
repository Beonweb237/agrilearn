import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { courses, lessons } from "../../db/schema";
import { eq, and, desc, asc, like, sql } from "drizzle-orm";

export const courseRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        category: z.string().optional(),
        level: z.string().optional(),
        isPremium: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
        search: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const whereConditions = [];

      if (input?.category) {
        whereConditions.push(eq(courses.category, input.category as any));
      }
      if (input?.level) {
        whereConditions.push(eq(courses.level, input.level as any));
      }
      if (input?.isPremium !== undefined) {
        whereConditions.push(eq(courses.isPremium, input.isPremium));
      }
      if (input?.isFeatured !== undefined) {
        whereConditions.push(eq(courses.isFeatured, input.isFeatured));
      }
      if (input?.search) {
        whereConditions.push(like(courses.title, `%${input.search}%`));
      }

      const where = whereConditions.length > 0 ? and(...whereConditions) : undefined;

      const results = await db
        .select()
        .from(courses)
        .where(where)
        .orderBy(desc(courses.isFeatured), desc(courses.studentsCount))
        .limit(input?.limit || 20)
        .offset(input?.offset || 0);

      return results;
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [course] = await db
        .select()
        .from(courses)
        .where(eq(courses.slug, input.slug))
        .limit(1);

      if (!course) return null;

      const courseLessons = await db
        .select()
        .from(lessons)
        .where(eq(lessons.courseId, course.id))
        .orderBy(asc(lessons.sortOrder));

      return { ...course, lessons: courseLessons };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [course] = await db
        .select()
        .from(courses)
        .where(eq(courses.id, input.id))
        .limit(1);

      if (!course) return null;

      const courseLessons = await db
        .select()
        .from(lessons)
        .where(eq(lessons.courseId, course.id))
        .orderBy(asc(lessons.sortOrder));

      return { ...course, lessons: courseLessons };
    }),

  getFeatured: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(courses)
      .where(eq(courses.isFeatured, true))
      .orderBy(desc(courses.studentsCount))
      .limit(6);
  }),

  getCategories: publicQuery.query(async () => {
    const db = getDb();
    const results = await db
      .select({
        category: courses.category,
        count: sql<number>`count(*)`,
      })
      .from(courses)
      .groupBy(courses.category);

    return results;
  }),

  incrementStudents: publicQuery
    .input(z.object({ courseId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(courses)
        .set({ studentsCount: sql`${courses.studentsCount} + 1` })
        .where(eq(courses.id, input.courseId));
      return { success: true };
    }),
});
