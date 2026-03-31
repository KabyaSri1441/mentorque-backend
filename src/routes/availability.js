import express from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware } from "../middleware/auth.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const { userId, mentorId } = req.query;

    const where = {};
    if (userId) where.userId = userId;
    if (mentorId) where.mentorId = mentorId;

    const availability = await prisma.availability.findMany({
      where,
      orderBy: { date: "asc" },
    });

    res.json(availability);
  } catch (e) {
    next(e);
  }
});

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { startTime, endTime, timezone, date } = req.body;
    const userId = req.userId;
    const userRole = req.userRole;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({ error: "Date, startTime, endTime required" });
    }

    const data = {
      id: uuidv4(),
      date: new Date(date),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      role: userRole,
      timezone: timezone || "UTC",
    };

    if (userRole === "USER") {
      data.userId = userId;
    } else if (userRole === "MENTOR") {
      data.mentorId = userId;
    }

    const availability = await prisma.availability.create({ data });
    res.status(201).json(availability);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const availability = await prisma.availability.findUnique({
      where: { id: req.params.id },
    });

    if (!availability) {
      return res.status(404).json({ error: "Availability not found" });
    }

    if (availability.userId !== req.userId && availability.mentorId !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await prisma.availability.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

export default router;