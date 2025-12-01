import { Router } from 'express';
import {
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from '../controllers/template.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// All routes are protected
router.use(authMiddleware);

router.get('/', getTemplates);
router.post('/', createTemplate);
router.put('/:id', updateTemplate);
router.delete('/:id', deleteTemplate);

export default router;

