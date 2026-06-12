import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { forumCategories, forumTopics, forumReplies, users } from "../../db/schema";
import { eq, desc, asc, sql } from "drizzle-orm";

export const forumRouter = createRouter({
  getCategories: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(forumCategories)
      .orderBy(asc(forumCategories.sortOrder));
  }),

  getTopics: publicQuery
    .input(
      z.object({
        categoryId: z.number().optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const where = input?.categoryId
        ? eq(forumTopics.categoryId, input.categoryId)
        : undefined;

      const topics = await db
        .select()
        .from(forumTopics)
        .where(where)
        .orderBy(desc(forumTopics.isPinned), desc(forumTopics.lastReplyAt))
        .limit(input?.limit || 20)
        .offset(input?.offset || 0);

      const topicsWithUsers = await Promise.all(
        topics.map(async (topic) => {
          const [user] = await db
            .select({ name: users.name, avatar: users.avatar })
            .from(users)
            .where(eq(users.id, topic.userId))
            .limit(1);
          return { ...topic, user };
        })
      );

      return topicsWithUsers;
    }),

  getTopic: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [topic] = await db
        .select()
        .from(forumTopics)
        .where(eq(forumTopics.id, input.id))
        .limit(1);

      if (!topic) return null;

      const [user] = await db
        .select({ name: users.name, avatar: users.avatar })
        .from(users)
        .where(eq(users.id, topic.userId))
        .limit(1);

      const replies = await db
        .select()
        .from(forumReplies)
        .where(eq(forumReplies.topicId, input.id))
        .orderBy(asc(forumReplies.createdAt));

      const repliesWithUsers = await Promise.all(
        replies.map(async (reply) => {
          const [replyUser] = await db
            .select({ name: users.name, avatar: users.avatar })
            .from(users)
            .where(eq(users.id, reply.userId))
            .limit(1);
          return { ...reply, user: replyUser };
        })
      );

      await db
        .update(forumTopics)
        .set({ viewCount: (topic.viewCount || 0) + 1 })
        .where(eq(forumTopics.id, input.id));

      return { ...topic, user, replies: repliesWithUsers };
    }),

  createTopic: publicQuery
    .input(
      z.object({
        categoryId: z.number(),
        userId: z.number(),
        title: z.string().min(3).max(255),
        content: z.string().min(10),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db
        .insert(forumTopics)
        .values({
          categoryId: input.categoryId,
          userId: input.userId,
          title: input.title,
          content: input.content,
        })
        .$returningId();

      await db
        .update(forumCategories)
        .set({
          topicCount: sql`${forumCategories.topicCount} + 1`,
        })
        .where(eq(forumCategories.id, input.categoryId));

      return { success: true, topicId: result.id };
    }),

  createReply: publicQuery
    .input(
      z.object({
        topicId: z.number(),
        userId: z.number(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db
        .insert(forumReplies)
        .values({
          topicId: input.topicId,
          userId: input.userId,
          content: input.content,
        })
        .$returningId();

      const [topic] = await db
        .select()
        .from(forumTopics)
        .where(eq(forumTopics.id, input.topicId))
        .limit(1);

      if (topic) {
        await db
          .update(forumTopics)
          .set({
            replyCount: (topic.replyCount || 0) + 1,
            lastReplyAt: new Date(),
          })
          .where(eq(forumTopics.id, input.topicId));

        await db
          .update(forumCategories)
          .set({
            replyCount: sql`${forumCategories.replyCount} + 1`,
          })
          .where(eq(forumCategories.id, topic.categoryId));
      }

      return { success: true, replyId: result.id };
    }),
});
