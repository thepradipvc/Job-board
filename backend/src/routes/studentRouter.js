import express from 'express';
import { addStudent, applyForJob, listAvailableJobs, listStudentApplications, updateStudentProfile } from '../controllers/studentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware)

router.post('/add', addStudent);
router.put('/profile', updateStudentProfile);
router.get('/jobs', listAvailableJobs);
router.post('/apply/:jobId', applyForJob);
router.get('/applications', listStudentApplications);

export default router;