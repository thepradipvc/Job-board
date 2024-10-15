import asyncHandler from "express-async-handler";
import { db } from "../db/index.js";
import SCHEMA from "../db/schema.js";
import { count, eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export const addStudent = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if student already exists
    const [studentExists] = await db
        .select()
        .from(SCHEMA.users)
        .where(eq(SCHEMA.users.email, email));

    if (studentExists) {
        res.status(400);
        throw new Error("Student already exists with this email.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    const [user] = await db
        .insert(SCHEMA.users)
        .values({
            name,
            email,
            password: hashedPassword,
            role: "student",
        })
        .returning();

    // Create basic student profile
    const [student] = await db
        .insert(SCHEMA.students)
        .values({
            userId: user.id,
        })
        .returning();

    res.status(201).json({
        message: "Student added successfully",
        student: {
            id: student.id,
            name: user.name,
            email: user.email,
            password
        },
    });
});

export const addCompany = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if company already exists
    const [companyExists] = await db
        .select()
        .from(SCHEMA.users)
        .where(eq(SCHEMA.users.email, email));

    if (companyExists) {
        res.status(400);
        throw new Error("Company already exists with this email.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    const [user] = await db
        .insert(SCHEMA.users)
        .values({
            name,
            email,
            password: hashedPassword,
            role: "company",
        })
        .returning();

    // Create basic company profile
    const [company] = await db
        .insert(SCHEMA.companies)
        .values({
            userId: user.id,
        })
        .returning();

    res.status(201).json({
        message: "Company added successfully",
        company: {
            id: company.id,
            name: user.name,
            email: user.email,
            password
        },
    });
});

// List all students
export const listStudents = asyncHandler(async (req, res) => {
    const students = await db
        .select({
            id: SCHEMA.students.id,
            name: SCHEMA.users.name,
            email: SCHEMA.users.email,
            graduationYear: SCHEMA.students.graduationYear,
        })
        .from(SCHEMA.students)
        .innerJoin(SCHEMA.users, eq(SCHEMA.students.userId, SCHEMA.users.id));

    res.json(students);
});

// List all companies
export const listCompanies = asyncHandler(async (req, res) => {
    const companies = await db
        .select({
            id: SCHEMA.companies.id,
            name: SCHEMA.users.name,
            email: SCHEMA.users.email,
        })
        .from(SCHEMA.companies)
        .innerJoin(SCHEMA.users, eq(SCHEMA.companies.userId, SCHEMA.users.id));

    res.json(companies);
});

// List all jobs
export const listJobs = asyncHandler(async (req, res) => {
    const jobs = await db
        .select({
            id: SCHEMA.jobs.id,
            title: SCHEMA.jobs.title,
            companyName: SCHEMA.users.name,
            postedAt: SCHEMA.jobs.postedAt,
        })
        .from(SCHEMA.jobs)
        .innerJoin(SCHEMA.companies, eq(SCHEMA.jobs.companyId, SCHEMA.companies.id))
        .innerJoin(SCHEMA.users, eq(SCHEMA.companies.userId, SCHEMA.users.id));

    res.json(jobs);
});

// List all applications
export const listApplications = asyncHandler(async (req, res) => {
    const applications = await db
        .select({
            id: SCHEMA.applications.id,
            jobTitle: SCHEMA.jobs.title,
            studentName: SCHEMA.users.name,
            status: SCHEMA.applications.status,
            appliedAt: SCHEMA.applications.appliedAt,
        })
        .from(SCHEMA.applications)
        .innerJoin(SCHEMA.jobs, eq(SCHEMA.applications.jobId, SCHEMA.jobs.id))
        .innerJoin(SCHEMA.students, eq(SCHEMA.applications.studentId, SCHEMA.students.id))
        .innerJoin(SCHEMA.users, eq(SCHEMA.students.userId, SCHEMA.users.id));

    res.json(applications);
});

// Get placement statistics
export const getStats = asyncHandler(async (req, res) => {
    const [studentCount] = await db
        .select({ count: count() })
        .from(SCHEMA.students);

    const [companyCount] = await db
        .select({ count: count() })
        .from(SCHEMA.companies);

    const [jobCount] = await db
        .select({ count: count() })
        .from(SCHEMA.jobs);

    const [applicationCount] = await db
        .select({ count: count() })
        .from(SCHEMA.applications);

    const [placedCount] = await db
        .select({ count: count() })
        .from(SCHEMA.applications)
        .where(eq(SCHEMA.applications.status, "accepted"));

    res.json({
        studentCount: studentCount.count,
        companyCount: companyCount.count,
        jobCount: jobCount.count,
        applicationCount: applicationCount.count,
        placedCount: placedCount.count,
        placementRate: (placedCount.count / studentCount.count * 100).toFixed(2) + "%"
    });
});