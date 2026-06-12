import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { enrollments, courses, lessons, lessonProgress } from "../../db/schema";
import { eq, and, desc } from "drizzle-orm";

export const enrollmentRouter = createRouter({
  getUserEnrollments: publicQuery
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const userEnrollments = await db
        .select()
        .from(enrollments)
        .where(eq(enrollments.userId, input.userId))
        .orderBy(desc(enrollments.lastAccessedAt));

      const enrollmentsWithCourses = await Promise.all(
        userEnrollments.map(async (enrollment) => {
          const [course] = await db
            .select()
            .from(courses)
            .where(eq(courses.id, enrollment.courseId))
            .limit(1);
          return { ...enrollment, course };
        })
      );

      return enrollmentsWithCourses;
    }),

  getByUserAndCourse: publicQuery
    .input(z.object({ userId: z.number(), courseId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [enrollment] = await db
        .select()
        .from(enrollments)
        .where(
          and(
            eq(enrollments.userId, input.userId),
            eq(enrollments.courseId, input.courseId)
          )
        )
        .limit(1);

      return enrollment || null;
    }),

  enroll: publicQuery
    .input(
      z.object({
        userId: z.number(),
        courseId: z.number(),
        amountPaid: z.number().default(0),
        paymentMethod: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const [existing] = await db
        .select()
        .from(enrollments)
        .where(
          and(
            eq(enrollments.userId, input.userId),
            eq(enrollments.courseId, input.courseId)
          )
        )
        .limit(1);

      if (existing) {
        return { success: true, enrollment: existing, alreadyEnrolled: true };
      }

      const [course] = await db
        .select()
        .from(courses)
        .where(eq(courses.id, input.courseId))
        .limit(1);

      const [enrollment] = await db
        .insert(enrollments)
        .values({
          userId: input.userId,
          courseId: input.courseId,
          status: "active",
          progress: 0,
          amountPaid: input.amountPaid,
          paymentMethod: input.paymentMethod,
          paymentStatus: course?.isPremium ? "pending" : "free",
        })
        .$returningId();

      await db
        .update(courses)
        .set({ studentsCount: (course?.studentsCount || 0) + 1 })
        .where(eq(courses.id, input.courseId));

      return { success: true, enrollmentId: enrollment.id, alreadyEnrolled: false };
    }),

  updateProgress: publicQuery
    .input(
      z.object({
        userId: z.number(),
        courseId: z.number(),
        progress: z.number().min(0).max(100),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const allLessons = await db
        .select()
        .from(lessons)
        .where(eq(lessons.courseId, input.courseId));

      const completedLessons = await db
        .select()
        .from(lessonProgress)
        .where(
          and(
            eq(lessonProgress.userId, input.userId),
            eq(lessonProgress.courseId, input.courseId),
            eq(lessonProgress.isCompleted, true)
          )
        );

      const totalLessons = allLessons.length;
      const completedCount = completedLessons.length;
      const calculatedProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
      const isCompleted = calculatedProgress >= 100;

      await db
        .update(enrollments)
        .set({
          progress: calculatedProgress,
          totalLessonsCompleted: completedCount,
          status: isCompleted ? "completed" : "active",
          completedAt: isCompleted ? new Date() : undefined,
          lastAccessedAt: new Date(),
        })
        .where(
          and(
            eq(enrollments.userId, input.userId),
            eq(enrollments.courseId, input.courseId)
          )
        );

      return { success: true, progress: calculatedProgress, isCompleted };
    }),

  unenroll: publicQuery
    .input(z.object({ userId: z.number(), courseId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .delete(enrollments)
        .where(
          and(
            eq(enrollments.userId, input.userId),
            eq(enrollments.courseId, input.courseId)
          )
        );
      return { success: true };
    }),
});
