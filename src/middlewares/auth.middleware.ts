import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { JwtLib } from '../lib/jwt';

/**
 * Authenticates a request by verifying the access token
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 */
const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new AppError(401, "Unauthorized"));
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    next(new AppError(401, "Unauthorized"));
    return;
  }

  const decoded = JwtLib.verifyAccessToken(token);
  req.user = decoded;
  next();
};

export const AuthMiddleware = {
  authenticate,
};