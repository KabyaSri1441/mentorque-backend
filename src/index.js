import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

import { authRoutes } from "./routes/auth.js";
import { meetingRoutes } from "./routes/meeting.js";
import { adminRoutes } from "./routes/admin.js";
import { errorHandler } from "./middleware/errorHandler.js";

import usersRouter from "./routes/users.js";
import mentorsRouter from "./routes/mentors.js";
import availabilityRouter from "./routes/availability.js";
import callsRouter from "./routes/calls.js";
import callTypesRouter from "./routes/callTypes.js";

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = [
  "https://mentorque-frontend-z7tmsm21b-kabyasri1441s-projects.vercel.app",
  "https://availabilitytrackerfrontend.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Mentorque API is running",
    status: "ok",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth/login",
      users: "/api/users",
      mentors: "/api/mentors",
      availability: "/api/availability",
      calls: "/api/calls",
      callTypes: "/api/call-types",
    }
  });
});

app.use("/api/auth", (req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/admin", adminRoutes);

app.get("/health", (_, res) => res.json({ ok: true }));

app.post("/debug-token", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.json({ error: "no token" });

  const JWT_SECRET = process.env.JWT_SECRET;
  const MAIN_SITE_JWT_SECRET = process.env.MAIN_SITE_JWT_SECRET || "your-secret-key-change-in-production";

  let decoded1 = null, err1 = null;
  let decoded2 = null, err2 = null;

  try { decoded1 = jwt.verify(token, JWT_SECRET); } catch(e) { err1 = e.message; }
  try { decoded2 = jwt.verify(token, MAIN_SITE_JWT_SECRET); } catch(e) { err2 = e.message; }

  res.json({
    raw_payload: jwt.decode(token),
    verify_with_JWT_SECRET: decoded1 || err1,
    verify_with_MAIN_SITE_JWT_SECRET: decoded2 || err2,
    JWT_SECRET_set: !!JWT_SECRET,
    MAIN_SITE_JWT_SECRET_set: !!process.env.MAIN_SITE_JWT_SECRET,
  });
});

app.use("/api/users", usersRouter);
app.use("/api/mentors", mentorsRouter);
app.use("/api/availability", availabilityRouter);
app.use("/api/calls", callsRouter);
app.use("/api/call-types", callTypesRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});