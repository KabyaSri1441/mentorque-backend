import express from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Get all users (admin only)
router.get("/", authMiddleware, adminOnly, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: "USER" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        tags: true,
        description: true,
        timezone: true,
      },
    });
    res.json(users);
  } catch (e) {
    next(e);
  }
});

// Get user by ID
router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        tags: true,
        description: true,
        timezone: true,
        createdAt: true,
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (e) {
    next(e);
  }
});

// Update user description
router.patch("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { description } = req.body;

    if (req.userId !== req.params.id && req.userRole !== "ADMIN") {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { description },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        tags: true,
        description: true,
        timezone: true,
      },
    });

    res.json(updated);
  } catch (e) {
    next(e);
  }
});

export default router;