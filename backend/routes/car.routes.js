import express from "express";

import {
  getCars,
  getCarById,
} from "../controllers/car.controller.js";

const router = express.Router();

// All Cars
router.get("/", getCars);

// Single Car
router.get("/:id", getCarById);

export default router;
