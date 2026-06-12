import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { courseRouter } from "./routers/course-router";
import { lessonRouter } from "./routers/lesson-router";
import { quizRouter } from "./routers/quiz-router";
import { enrollmentRouter } from "./routers/enrollment-router";
import { badgeRouter } from "./routers/badge-router";
import { forumRouter } from "./routers/forum-router";
import { eventRouter } from "./routers/event-router";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  course: courseRouter,
  lesson: lessonRouter,
  quiz: quizRouter,
  enrollment: enrollmentRouter,
  badge: badgeRouter,
  forum: forumRouter,
  event: eventRouter,
});

export type AppRouter = typeof appRouter;
