import express from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const callTypes = await prisma.callType.findMany();
    res.json(callTypes);
  } catch (e) {
    next(e);
  }
});

export default router;