import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { lessons, lessonProgress, quizzes, quizQuestions, quizOptions } from "../../db/schema";
import { eq, and, asc } from "drizzle-orm";

export const lessonRouter = createRouter({
  getByCourse: publicQuery
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const courseLessons = await db
        .select()
        .from(lessons)
        .where(eq(lessons.courseId, input.courseId))
        .orderBy(asc(lessons.sortOrder));

      return courseLessons;
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [lesson] = await db
        .select()
        .from(lessons)
        .where(eq(lessons.id, input.id))
        .limit(1);

      if (!lesson) return null;

      let quizData = null;
      if (lesson.hasQuiz && lesson.quizId) {
        const [quiz] = await db
          .select()
          .from(quizzes)
          .where(eq(quizzes.id, lesson.quizId))
          .limit(1);

        if (quiz) {
          const questions = await db
            .select()
            .from(quizQuestions)
            .where(eq(quizQuestions.quizId, quiz.id))
            .orderBy(asc(quizQuestions.sortOrder));

          const questionsWithOptions = await Promise.all(
            questions.map(async (q) => {
              const options = await db
                .select()
                .from(quizOptions)
                .where(eq(quizOptions.questionId, q.id))
                .orderBy(asc(quizOptions.sortOrder));
              return { ...q, options };
            })
          );

          quizData = { ...quiz, questions: questionsWithOptions };
        }
      }

      return { ...lesson, quiz: quizData };
    }),

  getProgress: publicQuery
    .input(z.object({ userId: z.number(), courseId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(lessonProgress)
        .where(
          and(
            eq(lessonProgress.userId, input.userId),
            eq(lessonProgress.courseId, input.courseId)
          )
        );
    }),

  updateProgress: publicQuery
    .input(
      z.object({
        userId: z.number(),
        lessonId: z.number(),
        courseId: z.number(),
        isCompleted: z.boolean().optional(),
        watchProgress: z.number().min(0).max(100).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const [existing] = await db
        .select()
        .from(lessonProgress)
        .where(
          and(
            eq(lessonProgress.userId, input.userId),
            eq(lessonProgress.lessonId, input.lessonId)
          )
        )
        .limit(1);

      if (existing) {
        await db
          .update(lessonProgress)
          .set({
            isCompleted: input.isCompleted ?? existing.isCompleted,
            watchProgress: input.watchProgress ?? existing.watchProgress,
            completedAt: input.isCompleted ? new Date() : existing.completedAt,
          })
          .where(eq(lessonProgress.id, existing.id));
      } else {
        await db.insert(lessonProgress).values({
          userId: input.userId,
          lessonId: input.lessonId,
          courseId: input.courseId,
          isCompleted: input.isCompleted ?? false,
          watchProgress: input.watchProgress ?? 0,
          completedAt: input.isCompleted ? new Date() : null,
        });
      }

      return { success: true };
    }),

  toggleDownloaded: publicQuery
    .input(
      z.object({
        userId: z.number(),
        lessonId: z.number(),
        courseId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const [existing] = await db
        .select()
        .from(lessonProgress)
        .where(
          and(
            eq(lessonProgress.userId, input.userId),
            eq(lessonProgress.lessonId, input.lessonId)
          )
        )
        .limit(1);

      if (existing) {
        await db
          .update(lessonProgress)
          .set({ isDownloaded: !existing.isDownloaded })
          .where(eq(lessonProgress.id, existing.id));
        return { isDownloaded: !existing.isDownloaded };
      } else {
        await db.insert(lessonProgress).values({
          userId: input.userId,
          lessonId: input.lessonId,
          courseId: input.courseId,
          isDownloaded: true,
        });
        return { isDownloaded: true };
      }
    }),
});
