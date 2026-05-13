const { prisma } = require("../config/database");

class AdminService {
  async getDashboardStats() {
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({ where: { isActive: true } });
    const totalJournals = await prisma.journalEntry.count();
    const totalBreathingSessions = await prisma.breathingSession.count();
    const totalGroups = await prisma.supportGroup.count();

    // Get journal sentiment averages
    const journals = await prisma.journalEntry.findMany({
      where: { sentiment: { not: null } },
      select: { sentiment: true },
    });

    let positive = 0;
    let negative = 0;
    let neutral = 0;

    journals.forEach((j) => {
      if (j.sentiment > 0.1) positive++;
      else if (j.sentiment < -0.1) negative++;
      else neutral++;
    });

    return {
      users: { total: totalUsers, active: activeUsers },
      activity: { journals: totalJournals, breathing: totalBreathingSessions, groups: totalGroups },
      sentiment: { positive, negative, neutral },
    };
  }

  async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        isEmailVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async toggleUserStatus(adminId, targetUserId) {
    if (adminId === targetUserId) {
      throw new Error("Cannot modify your own status");
    }

    const user = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) throw new Error("User not found");

    if (user.role === 'admin') {
      throw new Error("Cannot block another admin");
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { isActive: !user.isActive },
      select: { id: true, email: true, isActive: true }
    });

    return updatedUser;
  }
}

module.exports = new AdminService();
