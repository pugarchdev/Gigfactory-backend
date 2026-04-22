import { Router } from 'express';
import projectsRoutes from './projectsRoutes.js';
import caseStudiesRoutes from './caseStudiesRoutes.js';
import expertiseRoutes from './expertiseRoutes.js';
import youtubeVideosRoutes from './youtubeVideosRoutes.js';
import agencyRecruitmentRoutes from './agencyRecruitmentRoutes.js';
import freelancerRecruitmentRoutes from './freelancerRecruitmentRoutes.js';
import gigExpertFeedbackRoutes from './gigExpertFeedbackRoutes.js';
import adminsRoutes from './adminsRoutes.js';
import enquiryRoutes from './enquiryRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ ok: true, service: 'gigfactory-backend' });
});

router.use('/projects', projectsRoutes);
router.use('/case-studies', caseStudiesRoutes);
router.use('/expertise', expertiseRoutes);
router.use('/youtube-videos', youtubeVideosRoutes);
router.use('/recruitment/agency', agencyRecruitmentRoutes);
router.use('/recruitment/freelancer', freelancerRecruitmentRoutes);
router.use('/app/gigexpert', gigExpertFeedbackRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/admins', adminsRoutes);


router.use('/upload', uploadRoutes);


export default router;
