import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  boolean,
  bigint,
  decimal,
} from "drizzle-orm/mysql-core";

// ============================================
// USERS (extends the base users table)
// ============================================
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  phone: varchar("phone", { length: 20 }),
  region: varchar("region", { length: 100 }),
  farmType: varchar("farm_type", { length: 100 }),
  role: mysqlEnum("role", ["user", "admin", "instructor"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================
// COURSES
// ============================================
export const courses = mysqlTable("courses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  shortDescription: varchar("short_description", { length: 500 }),
  image: text("image"),
  category: mysqlEnum("category", [
    "cultures_vivrieres",
    "elevage",
    "gestion",
    "cacao",
    "cafe",
    "volailles",
    "porcs",
    "bovins",
    "marches",
    "techniques",
    "engrais",
    "finance",
  ]).notNull(),
  level: mysqlEnum("level", ["debutant", "intermediaire", "avance"]).default("debutant").notNull(),
  region: varchar("region", { length: 100 }),
  isPremium: boolean("is_premium").default(false).notNull(),
  price: int("price").default(0), // Price in FCFA
  duration: int("duration").notNull(), // Total duration in minutes
  lessonsCount: int("lessons_count").default(0).notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0.0"),
  studentsCount: int("students_count").default(0),
  instructorId: bigint("instructor_id", { mode: "number", unsigned: true }).references(() => users.id),
  instructorName: varchar("instructor_name", { length: 255 }),
  instructorAvatar: text("instructor_avatar"),
  instructorTitle: varchar("instructor_title", { length: 255 }),
  isPublished: boolean("is_published").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  requiresCertification: boolean("requires_certification").default(false).notNull(),
  certificationPrice: int("certification_price").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

// ============================================
// LESSONS / MODULES
// ============================================
export const lessons = mysqlTable("lessons", {
  id: serial("id").primaryKey(),
  courseId: bigint("course_id", { mode: "number", unsigned: true }).notNull().references(() => courses.id),
  moduleNumber: int("module_number").notNull(),
  moduleTitle: varchar("module_title", { length: 255 }).notNull(),
  lessonNumber: int("lesson_number").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  videoUrl: text("video_url"),
  videoDuration: int("video_duration").default(0), // in minutes
  isDownloadable: boolean("is_downloadable").default(true).notNull(),
  hasQuiz: boolean("has_quiz").default(false).notNull(),
  quizId: bigint("quiz_id", { mode: "number", unsigned: true }),
  sortOrder: int("sort_order").notNull(),
  isPreview: boolean("is_preview").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = typeof lessons.$inferInsert;

// ============================================
// QUIZZES
// ============================================
export const quizzes = mysqlTable("quizzes", {
  id: serial("id").primaryKey(),
  lessonId: bigint("lesson_id", { mode: "number", unsigned: true }).notNull().references(() => lessons.id),
  courseId: bigint("course_id", { mode: "number", unsigned: true }).notNull().references(() => courses.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  passingScore: int("passing_score").default(70).notNull(), // percentage
  questionsCount: int("questions_count").default(0).notNull(),
  timeLimit: int("time_limit").default(0), // in minutes, 0 = no limit
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = typeof quizzes.$inferInsert;

// ============================================
// QUIZ QUESTIONS
// ============================================
export const quizQuestions = mysqlTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: bigint("quiz_id", { mode: "number", unsigned: true }).notNull().references(() => quizzes.id),
  question: text("question").notNull(),
  questionType: mysqlEnum("question_type", ["multiple_choice", "true_false", "multiple_answer"]).default("multiple_choice").notNull(),
  explanation: text("explanation"),
  points: int("points").default(1).notNull(),
  sortOrder: int("sort_order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = typeof quizQuestions.$inferInsert;

// ============================================
// QUIZ OPTIONS
// ============================================
export const quizOptions = mysqlTable("quiz_options", {
  id: serial("id").primaryKey(),
  questionId: bigint("question_id", { mode: "number", unsigned: true }).notNull().references(() => quizQuestions.id),
  optionText: text("option_text").notNull(),
  isCorrect: boolean("is_correct").default(false).notNull(),
  sortOrder: int("sort_order").notNull(),
});

export type QuizOption = typeof quizOptions.$inferSelect;
export type InsertQuizOption = typeof quizOptions.$inferInsert;

// ============================================
// ENROLLMENTS
// ============================================
export const enrollments = mysqlTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull().references(() => users.id),
  courseId: bigint("course_id", { mode: "number", unsigned: true }).notNull().references(() => courses.id),
  status: mysqlEnum("status", ["active", "completed", "dropped"]).default("active").notNull(),
  progress: int("progress").default(0).notNull(), // percentage
  totalLessonsCompleted: int("total_lessons_completed").default(0),
  isCertified: boolean("is_certified").default(false).notNull(),
  certificationUrl: text("certification_url"),
  amountPaid: int("amount_paid").default(0),
  paymentMethod: varchar("payment_method", { length: 50 }),
  paymentStatus: mysqlEnum("payment_status", ["pending", "completed", "failed", "free"]).default("free").notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow().notNull(),
});

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = typeof enrollments.$inferInsert;

// ============================================
// LESSON PROGRESS
// ============================================
export const lessonProgress = mysqlTable("lesson_progress", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull().references(() => users.id),
  lessonId: bigint("lesson_id", { mode: "number", unsigned: true }).notNull().references(() => lessons.id),
  courseId: bigint("course_id", { mode: "number", unsigned: true }).notNull().references(() => courses.id),
  isCompleted: boolean("is_completed").default(false).notNull(),
  isDownloaded: boolean("is_downloaded").default(false).notNull(),
  watchProgress: int("watch_progress").default(0), // percentage
  completedAt: timestamp("completed_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type LessonProgress = typeof lessonProgress.$inferSelect;
export type InsertLessonProgress = typeof lessonProgress.$inferInsert;

// ============================================
// BADGES
// ============================================
export const badges = mysqlTable("badges", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 100 }).notNull(), // Lucide icon name
  color: varchar("color", { length: 20 }).default("#D4A017").notNull(),
  criteria: text("criteria"), // Description of how to earn
  courseId: bigint("course_id", { mode: "number", unsigned: true }).references(() => courses.id),
  category: mysqlEnum("category", ["completion", "achievement", "streak", "community", "premium"]).default("completion").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = typeof badges.$inferInsert;

// ============================================
// USER BADGES
// ============================================
export const userBadges = mysqlTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull().references(() => users.id),
  badgeId: bigint("badge_id", { mode: "number", unsigned: true }).notNull().references(() => badges.id),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = typeof userBadges.$inferInsert;

// ============================================
// FORUM CATEGORIES
// ============================================
export const forumCategories = mysqlTable("forum_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 100 }).default("MessageCircle"),
  color: varchar("color", { length: 20 }).default("#4A7C2E"),
  topicCount: int("topic_count").default(0),
  replyCount: int("reply_count").default(0),
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ForumCategory = typeof forumCategories.$inferSelect;
export type InsertForumCategory = typeof forumCategories.$inferInsert;

// ============================================
// FORUM TOPICS
// ============================================
export const forumTopics = mysqlTable("forum_topics", {
  id: serial("id").primaryKey(),
  categoryId: bigint("category_id", { mode: "number", unsigned: true }).notNull().references(() => forumCategories.id),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  isPinned: boolean("is_pinned").default(false).notNull(),
  isLocked: boolean("is_locked").default(false).notNull(),
  viewCount: int("view_count").default(0),
  replyCount: int("reply_count").default(0),
  lastReplyAt: timestamp("last_reply_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ForumTopic = typeof forumTopics.$inferSelect;
export type InsertForumTopic = typeof forumTopics.$inferInsert;

// ============================================
// FORUM REPLIES
// ============================================
export const forumReplies = mysqlTable("forum_replies", {
  id: serial("id").primaryKey(),
  topicId: bigint("topic_id", { mode: "number", unsigned: true }).notNull().references(() => forumTopics.id),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull().references(() => users.id),
  content: text("content").notNull(),
  isAccepted: boolean("is_accepted").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ForumReply = typeof forumReplies.$inferSelect;
export type InsertForumReply = typeof forumReplies.$inferInsert;

// ============================================
// EVENTS
// ============================================
export const events = mysqlTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  location: varchar("location", { length: 255 }).notNull(),
  region: varchar("region", { length: 100 }),
  eventDate: timestamp("event_date").notNull(),
  endDate: timestamp("end_date"),
  duration: int("duration").default(1), // in days
  maxParticipants: int("max_participants").default(50),
  registeredCount: int("registered_count").default(0),
  isFree: boolean("is_free").default(true).notNull(),
  price: int("price").default(0),
  instructorName: varchar("instructor_name", { length: 255 }),
  instructorAvatar: text("instructor_avatar"),
  image: text("image"),
  status: mysqlEnum("status", ["upcoming", "ongoing", "completed", "cancelled"]).default("upcoming").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

// ============================================
// EVENT REGISTRATIONS
// ============================================
export const eventRegistrations = mysqlTable("event_registrations", {
  id: serial("id").primaryKey(),
  eventId: bigint("event_id", { mode: "number", unsigned: true }).notNull().references(() => events.id),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull().references(() => users.id),
  status: mysqlEnum("status", ["registered", "attended", "cancelled", "no_show"]).default("registered").notNull(),
  paymentStatus: mysqlEnum("payment_status", ["pending", "completed", "free"]).default("free").notNull(),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
});

export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type InsertEventRegistration = typeof eventRegistrations.$inferInsert;
