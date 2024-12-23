import express from 'express';
import {
    listStudents,
    listCompanies,
    listJobs,
    listApplications,
    getStats,
    addStudent,
    addCompany
} from '../controllers/adminController.js';
import authMiddleware, { adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply protect and adminOnly middleware to all routes
router.use(authMiddleware, adminOnly);

router.post('/add-student', addStudent);
router.post('/add-company', addCompany);
router.get('/students', listStudents);
router.get('/companies', listCompanies);
router.get('/jobs', listJobs);
router.get('/applications', listApplications);
router.get('/stats', getStats);

export default router;