import Car from '../models/car.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

// @route   GET /api/cars
// @access  Public
// Supports: search (q), brand, location, transmission, fuelType, seats,
//           minPrice, maxPrice, sort, page, limit
export const getCars = asyncHandler(async (req, res) => {
  const {
    q,
    brand,
    location,
    transmission,
    fuelType,
    seats,
    minPrice,
    maxPrice,
    sort = '-createdAt',
    page = 1,
    limit = 12,
  } = req.query;

  const filter = { approvalStatus: 'approved', isAvailable: true };

  if (q) filter.$text = { $search: q };
  if (brand) filter.brand = new RegExp(`^${brand}$`, 'i');
  if (location) filter.location = new RegExp(location, 'i');
  if (transmission) filter.transmission = transmission;
  if (fuelType) filter.fuelType = fuelType;
  if (seats) filter.seats = { $gte: Number(seats) };
  if (minPrice || maxPrice) {
    filter.pricePerDay = {};
    if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
    if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
  }

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Math.max(Number(limit), 1), 50);
  const skip = (pageNum - 1) * limitNum;

  const [cars, total] = await Promise.all([
    Car.find(filter).sort(sort).skip(skip).limit(limitNum).populate('owner', 'name avatar'),
    Car.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        cars,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Cars fetched'
    )
  );
});

// @route   GET /api/cars/:id
// @access  Public
export const getCarById = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id).populate('owner', 'name avatar phone email');

  if (!car || car.approvalStatus !== 'approved') {
    throw new ApiError(404, 'Car not found');
  }

  return res.status(200).json(new ApiResponse(200, car, 'Car fetched'));
});
