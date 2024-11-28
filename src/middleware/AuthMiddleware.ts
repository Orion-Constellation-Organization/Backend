import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../service/AuthService';
import { EnumErrorMessages } from '../enum/EnumErrorMessages';

interface DecodedToken {
  id: number;
  email: string;
  role: string;
}

export const authMiddleware = (requiredRole?: string, validateUser?: boolean) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: EnumErrorMessages.MISSING_TOKEN });
    }

    try {
      const decoded = AuthService.verifyToken(token) as DecodedToken;

      (req as unknown as { decoded: DecodedToken }).decoded = decoded;
      if (validateUser) {
        const userId = Number(req.params.id || req.body.id || req.query.id);

        if (!userId || userId !== decoded.id) {
          return res.status(403).json({ message: EnumErrorMessages.INSUFFICIENT_PERMISSION });
        }
      }
      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ message: EnumErrorMessages.INSUFFICIENT_PERMISSION });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: EnumErrorMessages.INVALID_TOKEN });
    }
  };
};
