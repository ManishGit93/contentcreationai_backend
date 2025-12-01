import { Router } from 'express';
import {
  getProposals,
  getProposal,
  createProposal,
  updateProposal,
} from '../controllers/proposal.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// All routes are protected
router.use(authMiddleware);

router.get('/', getProposals);
router.get('/:id', getProposal);
router.post('/', createProposal);
router.put('/:id', updateProposal);

export default router;

