import { relations } from "drizzle-orm";
import {
  date,
  decimal,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum('role', ['admin', 'student', 'company']);
export const genderEnum = pgEnum('gender', ['male', 'female', 'other']);
export const applicationStatusEnum = pgEnum('status', ['pending', 'accepted', 'rejected']);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: roleEnum("role").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const usersRelations = relations(users, ({ one }) => ({
  company: one(companies),
  student: one(students)
}));

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  description: text("description"),
  industry: varchar("industry", { length: 100 }),
  website: varchar("website", { length: 255 }),
  location: varchar("location", { length: 100 }),
});

export const companiesRelations = relations(companies, ({ one, many }) => ({
  user: one(users, {
    fields: [companies.userId],
    references: [users.id],
  }),
  jobs: many(jobs, {
    fields: [jobs.companyId],
    references: [companies.id],
  }),
}));

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  dob: date("dob"),
  gender: genderEnum("gender"),
  courseName: varchar("course_name", { length: 100 }),
  graduationYear: integer("graduation_year"),
  sscMarks: decimal("ssc_marks", { precision: 5, scale: 2 }),
  hscMarks: decimal("hsc_marks", { precision: 5, scale: 2 }),
  cgpa: decimal("cgpa", { precision: 3, scale: 2 }),
  skills: text("skills"),
  resume: text("resume"), // URL or file path to resume
});

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  applications: many(applications, {
    fields: [applications.studentId],
    references: [students.id],
  }),
}));

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").references(() => companies.id).notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description"),
  skillsRequired: text("skills_required"),
  experienceRequired: integer("experience_required"),
  salaryRangeStart: integer("salary_range_start"),
  salaryRangeEnd: integer("salary_range_end"),
  location: varchar("location", { length: 100 }),
  jobType: varchar("job_type", { length: 50 }), // e.g., "Full-time", "Internship"
  postedAt: timestamp("posted_at").defaultNow(),
  deadline: timestamp("deadline"),
});

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  company: one(companies, {
    fields: [jobs.companyId],
    references: [companies.id],
  }),
  applications: many(applications, {
    fields: [applications.jobId],
    references: [jobs.id],
  }),
}));

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  status: applicationStatusEnum("status").default("pending"),
  appliedAt: timestamp("applied_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  offeredSalary: integer("offered_salary"),
  coverLetter: text("cover_letter"),
});

export const applicationsRelations = relations(applications, ({ one }) => ({
  job: one(jobs, {
    fields: [applications.jobId],
    references: [jobs.id],
  }),
  student: one(students, {
    fields: [applications.studentId],
    references: [students.id],
  }),
}));

const SCHEMA = {
  users,
  companies,
  students,
  jobs,
  applications
}

export default SCHEMA;