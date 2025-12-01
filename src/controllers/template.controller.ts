import { Response, NextFunction } from 'express';
import Template from '../models/Template';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getTemplates = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const templates = await Template.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({ templates });
  } catch (error) {
    next(error);
  }
};

export const createTemplate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { title, content } = req.body;

    if (!title || !content) {
      res.status(400).json({ message: 'Title and content are required' });
      return;
    }

    const template = await Template.create({
      userId: req.user._id,
      title,
      content,
    });

    res.status(201).json({ template });
  } catch (error) {
    next(error);
  }
};

export const updateTemplate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const template = await Template.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!template) {
      res.status(404).json({ message: 'Template not found' });
      return;
    }

    const { title, content } = req.body;

    if (title) template.title = title;
    if (content) template.content = content;

    await template.save();

    res.json({ template });
  } catch (error) {
    next(error);
  }
};

export const deleteTemplate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const template = await Template.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!template) {
      res.status(404).json({ message: 'Template not found' });
      return;
    }

    await Template.deleteOne({ _id: req.params.id });

    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    next(error);
  }
};

