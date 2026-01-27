import { Router, Request, Response, NextFunction } from 'express';
import { query, validationResult } from 'express-validator';
import { Claim } from '../models/Claim';
import { Deal } from '../models/Deal';
import { authenticate } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Get user's claims
router.get(
  '/',
  authenticate,
  [
    query('status').optional().isIn(['pending', 'approved', 'rejected', 'expired']),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('skip').optional().isInt({ min: 0 }).toInt(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Invalid query parameters');
      }

      const { status, limit = 20, skip = 0 } = req.query;

      const filter: any = {
        userId: req.user!.userId,
      };

      if (status) {
        filter.status = status;
      }

      const claims = await Claim.find(filter)
        .populate('dealId')
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(Number(skip));

      const total = await Claim.countDocuments(filter);

      const claimsWithDetails = claims.map((claim) => ({
        id: claim._id,
        dealId: (claim.dealId as any)._id,
        dealTitle: (claim.dealId as any).title,
        dealCategory: (claim.dealId as any).category,
        status: claim.status,
        code: claim.code,
        claimedAt: claim.claimedAt,
        approvedAt: claim.approvedAt,
      }));

      res.json({
        claims: claimsWithDetails,
        total,
        limit: Number(limit),
        skip: Number(skip),
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get claim by ID
router.get(
  '/:claimId',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const claim = await Claim.findById(req.params.claimId).populate('dealId');

      if (!claim) {
        throw new AppError(404, 'Claim not found');
      }

      // Verify ownership
      if (claim.userId.toString() !== req.user!.userId) {
        throw new AppError(403, 'Not authorized to view this claim');
      }

      res.json({
        id: claim._id,
        dealId: (claim.dealId as any)._id,
        dealTitle: (claim.dealId as any).title,
        status: claim.status,
        code: claim.code,
        claimedAt: claim.claimedAt,
        approvedAt: claim.approvedAt,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get claim stats for user
router.get(
  '/stats/overview',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;

      const [pending, approved, rejected, total] = await Promise.all([
        Claim.countDocuments({ userId, status: 'pending' }),
        Claim.countDocuments({ userId, status: 'approved' }),
        Claim.countDocuments({ userId, status: 'rejected' }),
        Claim.countDocuments({ userId }),
      ]);

      res.json({
        pending,
        approved,
        rejected,
        total,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
