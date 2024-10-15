import express from 'express';
import { addCompany, listCompanyJobs, postNewJob, updateApplicationStatus, updateCompanyProfile, viewJobApplications } from '../controllers/companyController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware)

router.post('/add', addCompany);
router.put('/profile', updateCompanyProfile);
router.post('/jobs', postNewJob);
router.get('/jobs', listCompanyJobs);
router.get('/applications/:jobId', viewJobApplications);
router.put('/applications/:applicationId', updateApplicationStatus);


export default router;