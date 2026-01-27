import { Router, Request, Response, NextFunction } from 'express';
import { query, body, validationResult } from 'express-validator';
import { Deal } from '../models/Deal';
import { Claim } from '../models/Claim';
import { User } from '../models/User';
import { authenticate, requireVerified } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Get all deals with filtering
router.get(
  '/',
  [
    query('category').optional().trim(),
    query('search').optional().trim(),
    query('accessLevel').optional().isIn(['public', 'verified', 'all']),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('skip').optional().isInt({ min: 0 }).toInt(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Invalid query parameters');
      }

      const { category, search, accessLevel = 'all', limit = 20, skip = 0 } = req.query;
      const isVerified = req.user?.isVerified ?? false;

      // Build filter
      const filter: any = {
        expiresAt: { $gt: new Date() },
      };

      // Access level filtering
      if (accessLevel === 'public') {
        filter.accessLevel = 'public';
      } else if (accessLevel === 'verified') {
        filter.accessLevel = 'verified';
      } else {
        // Show public deals to everyone, verified deals only to verified users
        if (isVerified) {
          filter.accessLevel = { $in: ['public', 'verified'] };
        } else {
          filter.accessLevel = 'public';
        }
      }

      if (category) {
        filter.category = category;
      }

      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { 'partner.name': { $regex: search, $options: 'i' } },
        ];
      }

      const deals = await Deal.find(filter)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(Number(skip));

      const total = await Deal.countDocuments(filter);

      // Get claimed deals for current user
      let claimedDealIds: string[] = [];
      if (req.user) {
        const claims = await Claim.find({
          userId: req.user.userId,
          status: { $in: ['pending', 'approved'] },
        });
        claimedDealIds = claims.map((c) => c.dealId.toString());
      }

      const dealsWithClaimStatus = deals.map((deal) => ({
        ...deal.toObject(),
        isClaimed: claimedDealIds.includes(deal._id.toString()),
        isLocked: deal.accessLevel === 'verified' && !isVerified,
      }));

      res.json({
        deals: dealsWithClaimStatus,
        total,
        limit: Number(limit),
        skip: Number(skip),
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get single deal
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    if (!id || id === 'undefined') {
      throw new AppError(400, 'Invalid deal ID');
    }

    const deal = await Deal.findById(id);
    if (!deal) {
      throw new AppError(404, 'Deal not found');
    }

    const isVerified = req.user?.isVerified ?? false;

    // Check access
    if (deal.accessLevel === 'verified' && !isVerified) {
      throw new AppError(403, 'This deal requires email verification');
    }

    // Get claim info if user is authenticated
    let claim = null;
    if (req.user) {
      claim = await Claim.findOne({
        userId: req.user.userId,
        dealId: deal._id,
      });
    }

    res.json({
      ...deal.toObject(),
      isLocked: deal.accessLevel === 'verified' && !isVerified,
      userClaim: claim ? { status: claim.status, code: claim.code } : null,
    });
  } catch (error) {
    next(error);
  }
});

// Claim a deal
router.post(
  '/:dealId/claim',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { dealId } = req.params;
      
      if (!dealId || dealId === 'undefined') {
        throw new AppError(400, 'Invalid deal ID');
      }

      const deal = await Deal.findById(dealId);
      if (!deal) {
        throw new AppError(404, 'Deal not found');
      }

      // Check if deal is still available
      if (deal.currentClaims >= deal.maxClaims) {
        throw new AppError(400, 'This deal has reached its claim limit');
      }

      // Check expiry
      if (new Date() > deal.expiresAt) {
        throw new AppError(400, 'This deal has expired');
      }

      // Check if deal requires verification
      if (deal.accessLevel === 'verified' && !req.user!.isVerified) {
        throw new AppError(403, 'This deal requires verified email');
      }

      // Check if user already claimed this deal
      const existingClaim = await Claim.findOne({
        userId: req.user!.userId,
        dealId: deal._id,
      });

      if (existingClaim) {
        throw new AppError(400, 'You have already claimed this deal');
      }

      // Create claim
      const claim = new Claim({
        userId: req.user!.userId,
        dealId: deal._id,
        code: `${deal._id.toString().slice(-6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
      });

      await claim.save();

      // Increment claim count
      deal.currentClaims += 1;
      await deal.save();

      res.status(201).json({
        id: claim._id,
        status: claim.status,
        code: claim.code,
        claimedAt: claim.claimedAt,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
