import { body } from 'express-validator';
import { handleValidation } from './auth.validators.js';

export const updateProfileValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 60 }).withMessage('Name must be between 2 and 60 characters'),
  body('phone').optional().trim().isLength({ max: 20 }).withMessage('Phone number is too long'),
  handleValidation,
];
