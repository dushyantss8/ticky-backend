import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

/**
 * Requires the user to be an admin
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 */
const requireAdmin = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'ADMIN') {
    next(new AppError(403, "Forbidden"));
    return;
  }

  next();
};

export const AdminMiddleware = {
  requireAdmin,
};