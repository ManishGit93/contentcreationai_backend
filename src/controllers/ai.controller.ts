import { Response, NextFunction } from 'express';
import { generateProposal } from '../services/ai.service';
import { AuthRequest } from '../middlewares/authMiddleware';

export const generateProposalAI = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const {
      clientName,
      clientCompany,
      projectTitle,
      projectDescription,
      budgetRange,
      timelinePreference,
      services,
      tone,
    } = req.body;

    // Validation
    if (!clientName || !projectTitle || !projectDescription) {
      res.status(400).json({
        message: 'Client name, project title, and description are required',
      });
      return;
    }

    if (!services || !Array.isArray(services) || services.length === 0) {
      res.status(400).json({ message: 'At least one service is required' });
      return;
    }

    // Generate proposal using AI
    const sections = await generateProposal({
      clientName,
      clientCompany,
      projectTitle,
      projectDescription,
      budgetRange,
      timelinePreference,
      services,
      tone: tone || 'Professional',
    });

    res.json({
      success: true,
      sections,
    });
  } catch (error) {
    console.error('AI Controller Error:', error);
    next(error);
  }
};

