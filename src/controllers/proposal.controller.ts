import { Response, NextFunction } from 'express';
import Proposal from '../models/Proposal';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getProposals = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const proposals = await Proposal.find({ userId: req.user._id })
      .select('clientName clientCompany projectTitle status createdAt updatedAt')
      .sort({ createdAt: -1 });

    res.json({ proposals });
  } catch (error) {
    next(error);
  }
};

export const getProposal = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const proposal = await Proposal.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!proposal) {
      res.status(404).json({ message: 'Proposal not found' });
      return;
    }

    res.json({ proposal });
  } catch (error) {
    next(error);
  }
};

export const createProposal = async (
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
      sections,
      status,
    } = req.body;

    // Validation
    if (!clientName || !projectTitle || !projectDescription) {
      res.status(400).json({
        message: 'Client name, project title, and description are required',
      });
      return;
    }

    const proposal = await Proposal.create({
      userId: req.user._id,
      clientName,
      clientCompany,
      projectTitle,
      projectDescription,
      budgetRange,
      timelinePreference,
      services: services || [],
      tone: tone || 'Professional',
      sections: sections || {
        scopeOfWork: '',
        deliverables: '',
        timeline: '',
        pricing: '',
        terms: '',
      },
      status: status || 'draft',
    });

    res.status(201).json({ proposal });
  } catch (error) {
    next(error);
  }
};

export const updateProposal = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const proposal = await Proposal.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!proposal) {
      res.status(404).json({ message: 'Proposal not found' });
      return;
    }

    const { sections, status, ...otherFields } = req.body;

    // Update allowed fields
    if (sections) {
      proposal.sections = { ...proposal.sections, ...sections };
    }

    if (status && ['draft', 'sent'].includes(status)) {
      proposal.status = status;
    }

    // Allow updating other fields
    Object.keys(otherFields).forEach((key) => {
      if (key !== 'userId' && key !== '_id' && key !== 'createdAt' && key !== 'updatedAt') {
        (proposal as any)[key] = otherFields[key];
      }
    });

    await proposal.save();

    res.json({ proposal });
  } catch (error) {
    next(error);
  }
};

