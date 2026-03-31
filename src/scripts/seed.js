import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.call.deleteMany();
  await prisma.callType.deleteMany();
  await prisma.meetingParticipant.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.user.deleteMany();

  console.log("✓ Cleared existing data");

  const callTypes = await prisma.callType.createMany({
    data: [
      {
        id: uuidv4(),
        name: "Resume Revamp",
        description: "Help with resume optimization",
        defaultTags: ["resume", "career"],
      },
      {
        id: uuidv4(),
        name: "Job Market Guidance",
        description: "Discuss current job market trends",
        defaultTags: ["job-search", "market"],
      },
      {
        id: uuidv4(),
        name: "Mock Interview Technical",
        description: "Technical interview practice",
        defaultTags: ["interview", "technical"],
      },
      {
        id: uuidv4(),
        name: "Mock Interview Behavioral",
        description: "Behavioral interview practice",
        defaultTags: ["interview", "behavioral"],
      },
    ],
  });
  console.log("✓ Created 4 call types");

  const adminHash = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.create({
    data: {
      id: uuidv4(),
      name: "Admin User",
      email: "admin@example.com",
      password: adminHash,
      role: "ADMIN",
      timezone: "UTC",
      tags: [],
      description: "System administrator",
    },
  });
  console.log("✓ Created admin:", admin.email);

  const mentors = [];
  for (let i = 1; i <= 5; i++) {
    const mentorHash = await bcrypt.hash("mentor123", 12);
    const mentor = await prisma.user.create({
      data: {
        id: uuidv4(),
        name: `Mentor ${i}`,
        email: `mentor${i}@example.com`,
        password: mentorHash,
        role: "MENTOR",
        timezone: "UTC",
        tags: ["communication", "big-tech", "senior"],
        description: `Senior mentor with ${5 + i} years of experience`,
      },
    });
    mentors.push(mentor);
  }
  console.log("✓ Created 5 mentors");

  const users = [];
  for (let i = 1; i <= 10; i++) {
    const userHash = await bcrypt.hash("user123", 12);
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        name: `User ${i}`,
        email: `user${i}@example.com`,
        password: userHash,
        role: "USER",
        timezone: "UTC",
        tags: ["javascript", "frontend"],
        description: "Looking to improve career prospects",
      },
    });
    users.push(user);
  }
  console.log("✓ Created 10 users");
  
  const now = new Date();
  for (const mentor of mentors) {
    for (let day = 0; day < 7; day++) {
      const date = new Date(now);
      date.setDate(date.getDate() + day);

      await prisma.availability.create({
        data: {
          id: uuidv4(),
          mentorId: mentor.id,
          role: "MENTOR",
          date: date,
          startTime: new Date(date.setHours(10, 0, 0, 0)),
          endTime: new Date(date.setHours(11, 0, 0, 0)),
        },
      });
    }
  }
  console.log("✓ Created mentor availability slots");

  console.log("✅ Seeding completed successfully!");
  console.log("\n📝 Login Credentials:");
  console.log("Admin:   admin@example.com / admin123");
  console.log("Mentors: mentor1-5@example.com / mentor123");
  console.log("Users:   user1-10@example.com / user123");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });