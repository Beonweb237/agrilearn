import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { quizzes, quizQuestions, quizOptions } from "../../db/schema";
import { eq, asc } from "drizzle-orm";

export const quizRouter = createRouter({
  getByLesson: publicQuery
    .input(z.object({ lessonId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [quiz] = await db
        .select()
        .from(quizzes)
        .where(eq(quizzes.lessonId, input.lessonId))
        .limit(1);

      if (!quiz) return null;

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

      return { ...quiz, questions: questionsWithOptions };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [quiz] = await db
        .select()
        .from(quizzes)
        .where(eq(quizzes.id, input.id))
        .limit(1);

      if (!quiz) return null;

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

      return { ...quiz, questions: questionsWithOptions };
    }),

  submit: publicQuery
    .input(
      z.object({
        quizId: z.number(),
        answers: z.array(
          z.object({
            questionId: z.number(),
            selectedOptionIds: z.array(z.number()),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const questions = await db
        .select()
        .from(quizQuestions)
        .where(eq(quizQuestions.quizId, input.quizId));

      const allOptions = await db
        .select()
        .from(quizOptions)
        .where(eq(quizOptions.questionId, questions[0]?.id || 0));

      let correctAnswers = 0;
      let totalPoints = 0;
      let earnedPoints = 0;

      for (const question of questions) {
        totalPoints += question.points;
        const userAnswer = input.answers.find((a) => a.questionId === question.id);
        if (!userAnswer) continue;

        const questionOptions = allOptions.filter((o) => o.questionId === question.id);
        const correctOptionIds = questionOptions.filter((o) => o.isCorrect).map((o) => o.id);

        if (question.questionType === "multiple_choice" || question.questionType === "true_false") {
          if (userAnswer.selectedOptionIds.length === 1 && correctOptionIds.includes(userAnswer.selectedOptionIds[0])) {
            correctAnswers++;
            earnedPoints += question.points;
          }
        } else if (question.questionType === "multiple_answer") {
          const allCorrect = correctOptionIds.every((id) => userAnswer.selectedOptionIds.includes(id)) &&
            userAnswer.selectedOptionIds.every((id) => correctOptionIds.includes(id));
          if (allCorrect) {
            correctAnswers++;
            earnedPoints += question.points;
          }
        }
      }

      const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
      const [quiz] = await db
        .select()
        .from(quizzes)
        .where(eq(quizzes.id, input.quizId))
        .limit(1);

      const passed = score >= (quiz?.passingScore || 70);

      return {
        score,
        passed,
        correctAnswers,
        totalQuestions: questions.length,
        passingScore: quiz?.passingScore || 70,
      };
    }),
});
