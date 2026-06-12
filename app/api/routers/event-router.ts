import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { events, eventRegistrations } from "../../db/schema";
import { eq, and, desc } from "drizzle-orm";

export const eventRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        status: z.string().optional(),
        region: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const whereConditions = [];

      if (input?.status) {
        whereConditions.push(eq(events.status, input.status as any));
      } else {
        whereConditions.push(eq(events.status, "upcoming"));
      }

      if (input?.region) {
        whereConditions.push(eq(events.region, input.region));
      }

      const where = whereConditions.length > 0 ? and(...whereConditions) : undefined;

      return db
        .select()
        .from(events)
        .where(where)
        .orderBy(desc(events.eventDate))
        .limit(input?.limit || 20)
        .offset(input?.offset || 0);
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [event] = await db
        .select()
        .from(events)
        .where(eq(events.id, input.id))
        .limit(1);
      return event || null;
    }),

  register: publicQuery
    .input(
      z.object({
        eventId: z.number(),
        userId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const [existing] = await db
        .select()
        .from(eventRegistrations)
        .where(
          and(
            eq(eventRegistrations.eventId, input.eventId),
            eq(eventRegistrations.userId, input.userId)
          )
        )
        .limit(1);

      if (existing) {
        return { success: true, alreadyRegistered: true };
      }

      const [event] = await db
        .select()
        .from(events)
        .where(eq(events.id, input.eventId))
        .limit(1);

      if (event && (event.registeredCount || 0) >= (event.maxParticipants || 0)) {
        return { success: false, message: "Cet événement est complet" };
      }

      const [result] = await db
        .insert(eventRegistrations)
        .values({
          eventId: input.eventId,
          userId: input.userId,
          status: "registered",
        })
        .$returningId();

      if (event) {
        await db
          .update(events)
          .set({ registeredCount: (event.registeredCount || 0) + 1 })
          .where(eq(events.id, input.eventId));
      }

      return { success: true, registrationId: result.id, alreadyRegistered: false };
    }),

  getUserRegistrations: publicQuery
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const registrations = await db
        .select()
        .from(eventRegistrations)
        .where(eq(eventRegistrations.userId, input.userId))
        .orderBy(desc(eventRegistrations.registeredAt));

      const withEvents = await Promise.all(
        registrations.map(async (reg) => {
          const [event] = await db
            .select()
            .from(events)
            .where(eq(events.id, reg.eventId))
            .limit(1);
          return { ...reg, event };
        })
      );

      return withEvents;
    }),

  unregister: publicQuery
    .input(
      z.object({
        eventId: z.number(),
        userId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .delete(eventRegistrations)
        .where(
          and(
            eq(eventRegistrations.eventId, input.eventId),
            eq(eventRegistrations.userId, input.userId)
          )
        );

      const [event] = await db
        .select()
        .from(events)
        .where(eq(events.id, input.eventId))
        .limit(1);

      if (event && (event.registeredCount || 0) > 0) {
        await db
          .update(events)
          .set({ registeredCount: (event.registeredCount || 0) - 1 })
          .where(eq(events.id, input.eventId));
      }

      return { success: true };
    }),
});
