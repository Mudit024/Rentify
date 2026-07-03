import Car from "../models/car.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// ======================================================
// @desc    Get All Cars
// @route   GET /api/cars
// @access  Public
// ======================================================

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
    sort = "newest",
    page = 1,
    limit = 12,
  } = req.query;

  const filter = {
    isAvailable: true,

    isBlocked: false,

    isDeleted: false,
  };

  // Search

  if (q) {
    filter.$text = {
      $search: q,
    };
  }

  // Filters

  if (brand) {
    filter.brand = new RegExp(`^${brand}$`, "i");
  }

  if (location) {
    filter.location = new RegExp(location, "i");
  }

  if (transmission) {
    filter.transmission = transmission;
  }

  if (fuelType) {
    filter.fuelType = fuelType;
  }

  if (seats) {
    filter.seats = {
      $gte: Number(seats),
    };
  }

  if (minPrice || maxPrice) {
    filter.pricePerDay = {};

    if (minPrice) {
      filter.pricePerDay.$gte = Number(minPrice);
    }

    if (maxPrice) {
      filter.pricePerDay.$lte = Number(maxPrice);
    }
  }

  // Sorting

  const sortOptions = {
    newest: "-createdAt",

    oldest: "createdAt",

    priceLow: "pricePerDay",

    priceHigh: "-pricePerDay",

    rating: "-ratingAvg",
  };

  const sortBy = sortOptions[sort] || "-createdAt";

  // Pagination

  const pageNumber = Math.max(Number(page), 1);

  const limitNumber = Math.min(Math.max(Number(limit), 1), 50);

  const skip = (pageNumber - 1) * limitNumber;

  const [cars, total] = await Promise.all([
    Car.find(filter)

      .populate("owner", "name avatar phone")

      .sort(sortBy)

      .skip(skip)

      .limit(limitNumber),

    Car.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,

      {
        cars,

        pagination: {
          total,

          page: pageNumber,

          limit: limitNumber,

          totalPages: Math.ceil(total / limitNumber),

          hasNext: pageNumber < Math.ceil(total / limitNumber),

          hasPrev: pageNumber > 1,
        },
      },

      "Cars fetched successfully.",
    ),
  );
});

// ======================================================
// @desc    Get Single Car
// @route   GET /api/cars/:id
// @access  Public
// ======================================================

export const getCarById = asyncHandler(async (req, res) => {
  const car = await Car.findOne({
    _id: req.params.id,

    isAvailable: true,

    isBlocked: false,

    isDeleted: false,
  }).populate(
    "owner",

    "name avatar phone",
  );

  if (!car) {
    throw new ApiError(
      404,

      "Car not found.",
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,

      car,

      "Car fetched successfully.",
    ),
  );
});

// ======================================================
// @desc    Get Similar Cars
// @route   GET /api/cars/:id/similar
// @access  Public
// ======================================================

export const getSimilarCars = asyncHandler(async (req, res) => {
  const car = await Car.findOne({
    _id: req.params.id,

    isAvailable: true,

    isBlocked: false,

    isDeleted: false,
  });

  if (!car) {
    throw new ApiError(404, "Car not found.");
  }

  const similarCars = await Car.find({
    _id: {
      $ne: car._id,
    },

    isAvailable: true,

    isBlocked: false,

    isDeleted: false,

    $or: [
      {
        brand: car.brand,
      },

      {
        fuelType: car.fuelType,
      },

      {
        transmission: car.transmission,
      },

      {
        location: car.location,
      },
    ],
  })

    .limit(8)

    .sort({
      ratingAvg: -1,

      createdAt: -1,
    })

    .populate(
      "owner",

      "name avatar",
    );

  return res.status(200).json(
    new ApiResponse(
      200,

      similarCars,

      "Similar cars fetched successfully.",
    ),
  );
});

// ======================================================
// @desc    Homepage Cars
// @route   GET /api/cars/home
// @access  Public
// ======================================================

export const getHomeCars = asyncHandler(async (req, res) => {
  const baseFilter = {
    isAvailable: true,

    isBlocked: false,

    isDeleted: false,
  };

  const [latestCars, topRatedCars, featuredCars] = await Promise.all([
    Car.find(baseFilter)

      .sort({
        createdAt: -1,
      })

      .limit(8)

      .populate(
        "owner",

        "name avatar",
      ),

    Car.find(baseFilter)

      .sort({
        ratingAvg: -1,
      })

      .limit(8)

      .populate(
        "owner",

        "name avatar",
      ),

    Car.find(baseFilter)

      .sort({
        numReviews: -1,

        ratingAvg: -1,
      })

      .limit(8)

      .populate(
        "owner",

        "name avatar",
      ),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,

      {
        latestCars,

        topRatedCars,

        featuredCars,
      },

      "Homepage cars fetched successfully.",
    ),
  );
});
