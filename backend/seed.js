const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data (optional - comment out if you want to keep existing data)
  await prisma.supportGroupMessage.deleteMany();
  await prisma.supportGroupMember.deleteMany();
  await prisma.supportGroup.deleteMany();
  await prisma.breathingSession.deleteMany();
  await prisma.journalEntry.deleteMany();
  await prisma.moodEntry.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Cleared existing data");

  // Hash password for demo users
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "john@example.com",
        password: hashedPassword,
        name: "John Doe",
        avatar: "https://i.pravatar.cc/150?img=1",
        role: "user",
      },
    }),
    prisma.user.create({
      data: {
        email: "jane@example.com",
        password: hashedPassword,
        name: "Jane Smith",
        avatar: "https://i.pravatar.cc/150?img=2",
        role: "user",
      },
    }),
    prisma.user.create({
      data: {
        email: "admin@example.com",
        password: hashedPassword,
        name: "Admin User",
        avatar: "https://i.pravatar.cc/150?img=3",
        role: "admin",
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create Mood Entries
  const moodEntries = await Promise.all([
    prisma.moodEntry.create({
      data: {
        userId: users[0].id,
        mood: 4,
        notes: "Feeling great today! Had a good workout.",
        factors: { sleep: 8, stress: 2, exercise: true },
      },
    }),
    prisma.moodEntry.create({
      data: {
        userId: users[0].id,
        mood: 3,
        notes: "Normal day, a bit tired.",
        factors: { sleep: 6, stress: 5, exercise: false },
      },
    }),
    prisma.moodEntry.create({
      data: {
        userId: users[1].id,
        mood: 5,
        notes: "Amazing day! Got a promotion.",
        factors: { sleep: 9, stress: 1, exercise: true },
      },
    }),
    prisma.moodEntry.create({
      data: {
        userId: users[1].id,
        mood: 2,
        notes: "Feeling anxious about work.",
        factors: { sleep: 5, stress: 8, exercise: false },
      },
    }),
  ]);

  console.log(`✅ Created ${moodEntries.length} mood entries`);

  // Create Journal Entries
  const journalEntries = await Promise.all([
    prisma.journalEntry.create({
      data: {
        userId: users[0].id,
        title: "My First Day of Meditation",
        content:
          "Today I tried meditation for the first time. It was challenging to quiet my mind, but I felt more peaceful afterwards. I want to make this a daily habit.",
        sentiment: 0.7,
        tags: ["meditation", "self-care", "mindfulness"],
        isPublic: true,
      },
    }),
    prisma.journalEntry.create({
      data: {
        userId: users[0].id,
        title: "Dealing with Stress",
        content:
          "Work has been overwhelming lately. I need to find better ways to manage my stress levels. Maybe I should try the breathing exercises more regularly.",
        sentiment: -0.3,
        tags: ["stress", "work", "anxiety"],
        isPublic: false,
      },
    }),
    prisma.journalEntry.create({
      data: {
        userId: users[1].id,
        title: "Gratitude List",
        content:
          "Today I am grateful for: my supportive family, good health, a stable job, and the beautiful weather. Focusing on gratitude really helps shift my perspective.",
        sentiment: 0.9,
        tags: ["gratitude", "positivity", "happiness"],
        isPublic: true,
      },
    }),
  ]);

  console.log(`✅ Created ${journalEntries.length} journal entries`);

  // Create Breathing Sessions
  const breathingSessions = await Promise.all([
    prisma.breathingSession.create({
      data: {
        userId: users[0].id,
        duration: 300, // 5 minutes
        technique: "4-7-8",
        completed: true,
        calmLevel: 8,
      },
    }),
    prisma.breathingSession.create({
      data: {
        userId: users[0].id,
        duration: 240, // 4 minutes
        technique: "box",
        completed: true,
        calmLevel: 7,
      },
    }),
    prisma.breathingSession.create({
      data: {
        userId: users[1].id,
        duration: 180, // 3 minutes
        technique: "478",
        completed: true,
        calmLevel: 9,
      },
    }),
  ]);

  console.log(`✅ Created ${breathingSessions.length} breathing sessions`);

  // Create Support Groups
  const supportGroups = await Promise.all([
    prisma.supportGroup.create({
      data: {
        name: "Anxiety Support",
        description:
          "A safe space for people dealing with anxiety to share experiences and support each other.",
        isPublic: true,
        maxMembers: 50,
      },
    }),
    prisma.supportGroup.create({
      data: {
        name: "Mindfulness Meditation",
        description:
          "Join us to learn and practice mindfulness meditation techniques together.",
        isPublic: true,
        maxMembers: 30,
      },
    }),
    prisma.supportGroup.create({
      data: {
        name: "Depression Support",
        description:
          "A community for those struggling with depression. You are not alone.",
        isPublic: true,
        maxMembers: 40,
      },
    }),
  ]);

  console.log(`✅ Created ${supportGroups.length} support groups`);

  // Create Support Group Members
  const members = await Promise.all([
    prisma.supportGroupMember.create({
      data: {
        userId: users[0].id,
        supportGroupId: supportGroups[0].id,
        role: "admin",
      },
    }),
    prisma.supportGroupMember.create({
      data: {
        userId: users[1].id,
        supportGroupId: supportGroups[0].id,
        role: "member",
      },
    }),
    prisma.supportGroupMember.create({
      data: {
        userId: users[0].id,
        supportGroupId: supportGroups[1].id,
        role: "member",
      },
    }),
    prisma.supportGroupMember.create({
      data: {
        userId: users[1].id,
        supportGroupId: supportGroups[1].id,
        role: "moderator",
      },
    }),
    prisma.supportGroupMember.create({
      data: {
        userId: users[2].id,
        supportGroupId: supportGroups[2].id,
        role: "admin",
      },
    }),
  ]);

  console.log(`✅ Created ${members.length} support group members`);

  // Create Support Group Messages
  const messages = await Promise.all([
    prisma.supportGroupMessage.create({
      data: {
        content:
          "Welcome everyone! This is a safe space to share and support each other.",
        userId: users[0].id,
        supportGroupId: supportGroups[0].id,
        messageType: "text",
      },
    }),
    prisma.supportGroupMessage.create({
      data: {
        content: "Thank you for creating this group. I really needed this.",
        userId: users[1].id,
        supportGroupId: supportGroups[0].id,
        messageType: "text",
      },
    }),
    prisma.supportGroupMessage.create({
      data: {
        content: "Does anyone have tips for dealing with anxiety attacks?",
        userId: users[1].id,
        supportGroupId: supportGroups[0].id,
        messageType: "text",
      },
    }),
    prisma.supportGroupMessage.create({
      data: {
        content: "Let's start our meditation session in 5 minutes!",
        userId: users[1].id,
        supportGroupId: supportGroups[1].id,
        messageType: "text",
      },
    }),
  ]);

  console.log(`✅ Created ${messages.length} support group messages`);

  console.log("\n🎉 Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Mood Entries: ${moodEntries.length}`);
  console.log(`   - Journal Entries: ${journalEntries.length}`);
  console.log(`   - Breathing Sessions: ${breathingSessions.length}`);
  console.log(`   - Support Groups: ${supportGroups.length}`);
  console.log(`   - Group Members: ${members.length}`);
  console.log(`   - Group Messages: ${messages.length}`);
  console.log("\n👤 Demo Users:");
  console.log("   - john@example.com (password: password123)");
  console.log("   - jane@example.com (password: password123)");
  console.log("   - admin@example.com (password: password123)");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
