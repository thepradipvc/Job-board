import bcrypt from "bcrypt";
import { and, eq } from "drizzle-orm";
import asyncHandler from "express-async-handler";
import { db } from "../db/index.js";
import SCHEMA from "../db/schema.js";

export const addStudent = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if the user making the request is an admin
    if (req.user.role !== 'admin') {
        res.status(403);
        throw new Error("Only admins can add students");
    }

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
        },
    });
});

// Update student profile details
export const updateStudentProfile = asyncHandler(async (req, res) => {
    const { name, dob, gender, courseName, graduationYear, sscMarks, hscMarks, cgpa, skills, resume } = req.body;
    const userId = req.user.id;

    if (name) {
        await db
            .update(SCHEMA.users)
            .set({ name })
            .where(eq(SCHEMA.users.id, userId));
    }

    const [updatedStudent] = await db
        .update(SCHEMA.students)
        .set({ dob, gender, courseName, graduationYear, sscMarks, hscMarks, cgpa, skills, resume })
        .where(eq(SCHEMA.students.userId, userId))
        .returning();

    updatedStudent.name = name;

    res.json(updatedStudent);
});

// List available jobs
export const listAvailableJobs = asyncHandler(async (req, res) => {
    const jobs = await db
        .select({
            id: SCHEMA.jobs.id,
            title: SCHEMA.jobs.title,
            companyName: SCHEMA.users.name,
            location: SCHEMA.jobs.location,
            postedAt: SCHEMA.jobs.postedAt,
            salaryRangeStart: SCHEMA.jobs.salaryRangeStart,
            salaryRangeEnd: SCHEMA.jobs.salaryRangeEnd
        })
        .from(SCHEMA.jobs)
        .innerJoin(SCHEMA.companies, eq(SCHEMA.jobs.companyId, SCHEMA.companies.id))
        .innerJoin(SCHEMA.users, eq(SCHEMA.companies.userId, SCHEMA.users.id));

    res.json(jobs);
});

// Apply for a job
export const applyForJob = asyncHandler(async (req, res) => {
    const { jobId, coverLetter } = req.params;
    const studentId = req.user.studentId;

    // Check if the student has already applied for this job
    const [existingApplication] = await db
        .select()
        .from(SCHEMA.applications)
        .where(and(
            eq(SCHEMA.applications.jobId, jobId),
            eq(SCHEMA.applications.studentId, studentId)
        ));

    if (existingApplication) {
        res.status(400);
        throw new Error("You have already applied for this job");
    }

    const [newApplication] = await db
        .insert(SCHEMA.applications)
        .values({
            jobId,
            studentId,
            status: "pending",
            coverLetter
        })
        .returning();

    res.status(201).json(newApplication);
});

// List student's job applications
export const listStudentApplications = asyncHandler(async (req, res) => {
    const studentId = req.user.studentId;

    const applications = await db
        .select({
            id: SCHEMA.applications.id,
            jobId: SCHEMA.applications.jobId,
            jobTitle: SCHEMA.jobs.title,
            companyName: SCHEMA.users.name,
            status: SCHEMA.applications.status,
            appliedAt: SCHEMA.applications.appliedAt
        })
        .from(SCHEMA.applications)
        .innerJoin(SCHEMA.jobs, eq(SCHEMA.applications.jobId, SCHEMA.jobs.id))
        .innerJoin(SCHEMA.companies, eq(SCHEMA.jobs.companyId, SCHEMA.companies.id))
        .innerJoin(SCHEMA.users, eq(SCHEMA.companies.userId, SCHEMA.users.id))
        .where(eq(SCHEMA.applications.studentId, studentId));

    res.json(applications);
});