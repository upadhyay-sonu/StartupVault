import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';
import crypto from 'crypto';

const router = Router();

// Register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().notEmpty(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Validation error: ' + errors.array()[0].msg);
      }

      const { email, password, name } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new AppError(409, 'Email already registered');
      }

      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const user = new User({
        email,
        password,
        name,
        verificationToken,
        verificationTokenExpiry,
      });

      await user.save();

      // In production, send email with verification link
      // For now, return token for testing
      res.status(201).json({
        message: 'User registered successfully',
        verificationToken, // Remove in production after email setup
        email: user.email,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Invalid email or password');
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await user.comparePassword(password))) {
        throw new AppError(401, 'Invalid email or password');
      }

      const token = jwt.sign(
        {
          userId: user._id.toString(),
          email: user.email,
          isVerified: user.isVerified,
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          isVerified: user.isVerified,
          company: user.company,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Verify email token
router.post(
  '/verify-email',
  [body('verificationToken').notEmpty()],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Verification token required');
      }

      const { verificationToken } = req.body;

      const user = await User.findOne({
        verificationToken,
        verificationTokenExpiry: { $gt: new Date() },
      });

      if (!user) {
        throw new AppError(400, 'Invalid or expired verification token');
      }

      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiry = undefined;
      await user.save();

      res.json({
        message: 'Email verified successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get current user
router.get(
  '/me',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.user!.userId);
      if (!user) {
        throw new AppError(404, 'User not found');
      }

      res.json({
        id: user._id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        company: user.company,
        role: user.role,
        createdAt: user.createdAt,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update user profile
router.put(
  '/profile',
  authenticate,
  [
    body('name').optional().trim().notEmpty(),
    body('company').optional().trim(),
    body('role').optional().isIn(['founder', 'cto', 'team_member', 'investor', 'other']),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Validation error');
      }

      const user = await User.findById(req.user!.userId);
      if (!user) {
        throw new AppError(404, 'User not found');
      }

      const { name, company, role } = req.body;
      if (name) user.name = name;
      if (company) user.company = company;
      if (role) user.role = role;

      await user.save();

      res.json({
        id: user._id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        company: user.company,
        role: user.role,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
