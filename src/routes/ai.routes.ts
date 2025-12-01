import { Router } from 'express';
import { generateProposalAI } from '../controllers/ai.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// All routes are protected
router.use(authMiddleware);

router.post('/generate-proposal', generateProposalAI);

export default router;

