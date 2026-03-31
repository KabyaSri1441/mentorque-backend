import express from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const mentors = await prisma.user.findMany({
      where: { role: "MENTOR" },
      select: {
        id: true,
        name: true,
        email: true,
        tags: true,
        description: true,
        timezone: true,
      },
    });
    res.json(mentors);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const mentor = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        tags: true,
        description: true,
        timezone: true,
      },
    });
    if (!mentor) return res.status(404).json({ error: "Mentor not found" });
    res.json(mentor);
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", authMiddleware, adminOnly, async (req, res, next) => {
  try {
    const { tags, description } = req.body;

    const mentor = await prisma.user.findUnique({
      where: { id: req.params.id },
    });
    if (!mentor || mentor.role !== "MENTOR") {
      return res.status(404).json({ error: "Mentor not found" });
    }

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        tags: tags !== undefined ? tags : mentor.tags,
        description: description !== undefined ? description : mentor.description,
      },
      select: {
        id: true,
        name: true,
        email: true,
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

router.get("/:userId/recommend", authMiddleware, adminOnly, async (req, res, next) => {
  try {
    const { callTypeId } = req.query;
    
    const user = await prisma.user.findUnique({
      where: { id: req.params.userId },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    const callType = await prisma.callType.findUnique({
      where: { id: callTypeId },
    });
    if (!callType) return res.status(404).json({ error: "Call type not found" });

    const mentors = await prisma.user.findMany({
      where: { role: "MENTOR" },
      include: {
        availabilityAsMentor: {
          where: { date: { gte: new Date() } },
        },
      },
    });

    const scored = mentors.map((mentor) => {
      let score = 0;

      const userTags = user.tags || [];
      const mentorTags = mentor.tags || [];
      const commonTags = userTags.filter((t) => mentorTags.includes(t));
      score += commonTags.length * 10;

      const callTypeTags = callType.defaultTags || [];
      const typeMatches = mentorTags.filter((t) => callTypeTags.includes(t));
      score += typeMatches.length * 15;

      const userDesc = (user.description || "").toLowerCase();
      const mentorDesc = (mentor.description || "").toLowerCase();
      const userWords = userDesc.split(" ");
      const matchedWords = userWords.filter((word) => mentorDesc.includes(word));
      score += Math.min(matchedWords.length * 5, 20);

      if (mentor.availabilityAsMentor.length > 0) {
        score += 20;
      }

      return {
        ...mentor,
        score,
        availabilityCount: mentor.availabilityAsMentor.length,
      };
    });

    const recommended = scored
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(({ availabilityAsMentor, ...m }) => ({
        ...m,
        availabilityCount: availabilityAsMentor.length,
      }));

    res.json(recommended);
  } catch (e) {
    next(e);
  }
});

export default router;