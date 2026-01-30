import express from "express";
import { analyzeSafety } from "../controllers/aiController.js";

const router = express.Router();

// POST /api/ai/analyze-safety
router.post("/analyze-safety", analyzeSafety);

export default router;
