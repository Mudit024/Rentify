import { body } from 'express-validator';
import { handleValidation } from './auth.validators.js';

export const createBookingValidator = [
  body('car').notEmpty().withMessage('Car is required').isMongoId().withMessage('Invalid car id'),
  body('pickupDate').notEmpty().withMessage('Pickup date is required').isISO8601().withMessage('Invalid pickup date'),
  body('returnDate').notEmpty().withMessage('Return date is required').isISO8601().withMessage('Invalid return date'),
  body('pickupLocation').trim().notEmpty().withMessage('Pickup location is required'),
  handleValidation,
];
