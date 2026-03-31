import express from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware, adminOnly } from "../middleware/auth.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const calls = await prisma.call.findMany({
      include: {
        user: { select: { name: true, email: true } },
        mentor: { select: { name: true, email: true } },
        callType: { select: { name: true } },
      },
      orderBy: { scheduledTime: "asc" },
    });
    res.json(calls);
  } catch (e) {
    next(e);
  }
});

router.post("/", authMiddleware, adminOnly, async (req, res, next) => {
  try {
    const { userId, mentorId, callTypeId, scheduledTime, notes } = req.body;

    if (!userId || !mentorId || !callTypeId || !scheduledTime) {
      return res.status(400).json({ error: "All fields required" });
    }

    const call = await prisma.call.create({
      data: {
        id: uuidv4(),
        userId,
        mentorId,
        callTypeId,
        scheduledTime: new Date(scheduledTime),
        notes: notes || null,
        status: "scheduled",
      },
      include: {
        user: { select: { name: true, email: true } },
        mentor: { select: { name: true, email: true } },
        callType: { select: { name: true } },
      },
    });

    res.status(201).json(call);
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", authMiddleware, adminOnly, async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    const call = await prisma.call.update({
      where: { id: req.params.id },
      data: {
        status: status || undefined,
        notes: notes !== undefined ? notes : undefined,
      },
      include: {
        user: { select: { name: true, email: true } },
        mentor: { select: { name: true, email: true } },
        callType: { select: { name: true } },
      },
    });

    res.json(call);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", authMiddleware, adminOnly, async (req, res, next) => {
  try {
    await prisma.call.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

export default router;