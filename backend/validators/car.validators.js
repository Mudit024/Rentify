import { body } from 'express-validator';
import { handleValidation } from './auth.validators.js';

export const carValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 100 }),
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('year')
    .notEmpty()
    .withMessage('Year is required')
    .isInt({ min: 1990, max: new Date().getFullYear() + 1 })
    .withMessage('Invalid year'),
  body('fuelType').isIn(['Petrol', 'Diesel', 'Electric', 'Hybrid']).withMessage('Invalid fuel type'),
  body('transmission').isIn(['Manual', 'Automatic']).withMessage('Invalid transmission'),
  body('seats').isInt({ min: 1, max: 12 }).withMessage('Seats must be between 1 and 12'),
  body('mileage').isFloat({ min: 0 }).withMessage('Mileage cannot be negative'),
  body('color').trim().notEmpty().withMessage('Color is required'),
  body('pricePerDay').isFloat({ min: 1 }).withMessage('Price per day must be greater than 0'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 2000 }),
  handleValidation,
];
