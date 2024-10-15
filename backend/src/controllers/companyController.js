import { and, count, eq } from "drizzle-orm";
import asyncHandler from "express-async-handler";
import { db } from "../db/index.js";
import SCHEMA from "../db/schema.js";

// Update company profile
export const updateCompanyProfile = asyncHandler(async (req, res) => {
    const { name, description, industry, website, location } = req.body;
    const userId = req.user.id;

    if (name) {
        await db
            .update(SCHEMA.users)
            .set({ name })
            .where(eq(SCHEMA.users.id, userId));
    }

    const [updatedCompany] = await db
        .update(SCHEMA.companies)
        .set({ description, industry, website, location })
        .where(eq(SCHEMA.companies.userId, userId))
        .returning();

    updatedCompany.name = name;

    res.json(updatedCompany);
});

// Post a new job
export const postNewJob = asyncHandler(async (req, res) => {
    const { title, description, skillsRequired, salaryRangeStart, salaryRangeEnd, location, deadline } = req.body;
    const companyId = req.user.companyId;

    const [newJob] = await db
        .insert(SCHEMA.jobs)
        .values({
            companyId,
            title,
            description,
            skillsRequired,
            salaryRangeStart,
            salaryRangeEnd,
            location,
            deadline
        })
        .returning();

    res.status(201).json(newJob);
});

// List company's job postings
export const listCompanyJobs = asyncHandler(async (req, res) => {
    const companyId = req.user.companyId;

    const jobs = await db
        .select({
            id: SCHEMA.jobs.id,
            title: SCHEMA.jobs.title,
            location: SCHEMA.jobs.location,
            postedAt: SCHEMA.jobs.postedAt,
            deadline: SCHEMA.jobs.deadline,
            applicationCount: count(SCHEMA.applications.id)
        })
        .from(SCHEMA.jobs)
        .leftJoin(SCHEMA.applications, eq(SCHEMA.jobs.id, SCHEMA.applications.jobId))
        .where(eq(SCHEMA.jobs.companyId, companyId))
        .groupBy(SCHEMA.jobs.id);

    res.json(jobs);
});

// View applications for a specific job
export const viewJobApplications = asyncHandler(async (req, res) => {
    const { jobId } = req.params;
    const companyId = req.user.companyId;

    // Ensure the job belongs to the company
    const [job] = await db
        .select()
        .from(SCHEMA.jobs)
        .where(and(eq(SCHEMA.jobs.id, jobId), eq(SCHEMA.jobs.companyId, companyId)));

    if (!job) {
        res.status(404);
        throw new Error("Job not found or doesn't belong to your company");
    }

    const applications = await db
        .select({
            id: SCHEMA.applications.id,
            studentName: SCHEMA.users.name,
            studentEmail: SCHEMA.users.email,
            status: SCHEMA.applications.status,
            appliedAt: SCHEMA.applications.appliedAt
        })
        .from(SCHEMA.applications)
        .innerJoin(SCHEMA.students, eq(SCHEMA.applications.studentId, SCHEMA.students.id))
        .innerJoin(SCHEMA.users, eq(SCHEMA.students.userId, SCHEMA.users.id))
        .where(eq(SCHEMA.applications.jobId, jobId));

    res.json(applications);
});

// Update application status
export const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { applicationId } = req.params;
    const { status } = req.body;
    const companyId = req.user.companyId;

    // Ensure the application is for a job that belongs to the company
    const [application] = await db
        .select()
        .from(SCHEMA.applications)
        .innerJoin(SCHEMA.jobs, eq(SCHEMA.applications.jobId, SCHEMA.jobs.id))
        .where(and(
            eq(SCHEMA.applications.id, applicationId),
            eq(SCHEMA.jobs.companyId, companyId)
        ));

    if (!application) {
        res.status(404);
        throw new Error("Application not found or doesn't belong to your company's job");
    }

    const [updatedApplication] = await db
        .update(SCHEMA.applications)
        .set({ status })
        .where(eq(SCHEMA.applications.id, applicationId))
        .returning();

    res.json(updatedApplication);
});