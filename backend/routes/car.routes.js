import express from "express";

import {
  getCars,
  getCarById,
  getSimilarCars,
  getHomeCars,
} from "../controllers/car.controller.js";

const router = express.Router();

// Homepage
router.get("/home", getHomeCars);

// All Cars
router.get("/", getCars);

// Similar Cars
router.get("/:id/similar", getSimilarCars);

// Single Car
router.get("/:id", getCarById);

export default router;
